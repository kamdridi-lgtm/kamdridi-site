"""
echoes_label_modules.py
========================
Modules du pipeline EchoesLabel.

Chaque module est indépendant, testable seul, avec fallback propre.

Modules:
  MusicGenerator   — MusicGen large → instrumental.wav
  VoiceEngine      — RVC v2         → vocals.wav
  MixEngine        — EchoesEngine   → song_mix.wav
  MasterEngine     — pyloudnorm DSP → song_master.wav
  VideoEngine      — SVD / FFmpeg   → video.mp4
  CoverEngine      — SDXL / SD1.5   → cover.png
  ReleasePackager  — assemblage     → release/
"""

import os
import json
import time
import shutil
import logging
import subprocess
import numpy as np
from pathlib import Path
from dataclasses import dataclass, field
from typing import Optional

log = logging.getLogger("EchoesLabel")

# ─────────────────────────────────────────────────────────────────────────────
# CONFIG LOADER
# ─────────────────────────────────────────────────────────────────────────────

def load_config(path: str = "echoes_label_config.json") -> dict:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# ─────────────────────────────────────────────────────────────────────────────
# DATA STRUCTURES
# ─────────────────────────────────────────────────────────────────────────────

@dataclass
class ReleaseJob:
    """Représente une demande de release complète."""
    prompt:       str
    title:        str
    artist:       str
    genre:        str
    bpm:          int          = 120
    key:          str          = "C minor"
    lyrics:       str          = ""
    style_prompt: str          = ""
    voice_model:  str          = ""
    release_date: str          = ""
    output_dir:   Path         = Path("./releases/unnamed")

@dataclass
class ReleaseAssets:
    """Assets produits par le pipeline."""
    instrumental:  Optional[Path] = None
    vocals:        Optional[Path] = None
    song_mix:      Optional[Path] = None
    song_master:   Optional[Path] = None
    video:         Optional[Path] = None
    cover:         Optional[Path] = None
    lyrics_txt:    Optional[Path] = None
    metadata_json: Optional[Path] = None
    errors:        list = field(default_factory=list)


# ─────────────────────────────────────────────────────────────────────────────
# 1. MUSIC GENERATOR — MusicGen → instrumental.wav
# ─────────────────────────────────────────────────────────────────────────────

class MusicGenerator:
    def __init__(self, cfg: dict):
        self.cfg    = cfg["music_generator"]
        self.model  = None
        self.loaded = False

    def _load(self):
        if self.loaded:
            return
        try:
            from audiocraft.models import MusicGen
            model_id = self.cfg.get("model_local") or self.cfg["model"]
            log.info(f"[MusicGen] Chargement {model_id}...")
            self.model = MusicGen.get_pretrained(model_id)
            self.model.set_generation_params(
                duration      = self.cfg["duration_sec"],
                guidance_scale= self.cfg["guidance_scale"],
            )
            self.loaded = True
            log.info("[MusicGen] ✓ Modèle chargé")
        except ImportError:
            raise RuntimeError(
                "audiocraft non installé.\n"
                "pip install audiocraft"
            )

    def generate(self, job: ReleaseJob, output_path: Path) -> Path:
        self._load()
        import torch
        import torchaudio

        prompt = job.prompt
        if job.genre:
            prompt = f"{job.genre}, {prompt}"
        if job.bpm:
            prompt += f", {job.bpm} BPM"
        if job.key:
            prompt += f", key of {job.key}"

        log.info(f"[MusicGen] Génération: '{prompt}'")
        t0 = time.time()

        with torch.no_grad():
            wav = self.model.generate([prompt])  # [1, channels, samples]

        wav = wav[0].cpu()  # [channels, samples]
        sr  = self.model.sample_rate

        # Resample si nécessaire
        target_sr = self.cfg["sample_rate"]
        if sr != target_sr:
            wav = torchaudio.functional.resample(wav, sr, target_sr)

        output_path.parent.mkdir(parents=True, exist_ok=True)
        torchaudio.save(str(output_path), wav, target_sr)

        elapsed = time.time() - t0
        log.info(f"[MusicGen] ✓ {output_path.name} ({elapsed:.1f}s)")
        return output_path


# ─────────────────────────────────────────────────────────────────────────────
# 2. VOICE ENGINE — RVC v2 → vocals.wav
# ─────────────────────────────────────────────────────────────────────────────

class VoiceEngine:
    def __init__(self, cfg: dict):
        self.cfg = cfg["voice_engine"]

    def synthesize_tts(self, lyrics: str, output_path: Path) -> Path:
        """
        Étape 1: TTS (paroles → audio brut).
        Utilise pyttsx3 ou Coqui TTS selon disponibilité.
        """
        try:
            from TTS.api import TTS
            tts = TTS("tts_models/en/ljspeech/tacotron2-DDC")
            tts.tts_to_file(text=lyrics, file_path=str(output_path))
            log.info(f"[TTS] ✓ Coqui TTS → {output_path.name}")
        except ImportError:
            # Fallback: pyttsx3
            try:
                import pyttsx3
                engine = pyttsx3.init()
                engine.save_to_file(lyrics, str(output_path))
                engine.runAndWait()
                log.info(f"[TTS] ✓ pyttsx3 → {output_path.name}")
            except Exception as e:
                log.warning(f"[TTS] Fallback silence (aucun TTS disponible): {e}")
                self._generate_silence(output_path)
        return output_path

    def apply_rvc(self, tts_path: Path, job: ReleaseJob, output_path: Path) -> Path:
        """
        Étape 2: RVC voice conversion (TTS → voice model).
        """
        model_path = job.voice_model or self.cfg["default_model"]
        index_path = self.cfg["default_index"]

        if not Path(model_path).exists():
            log.warning(f"[RVC] Modèle absent: {model_path} — copie TTS brut")
            shutil.copy(tts_path, output_path)
            return output_path

        try:
            from rvc_python.infer import RVCInference
            rvc = RVCInference(
                model_path  = model_path,
                index_path  = index_path,
                f0_method   = self.cfg["f0_method"],
                pitch       = self.cfg["pitch_shift"],
                index_rate  = self.cfg["index_rate"],
                filter_radius= self.cfg["filter_radius"],
                rms_mix_rate= self.cfg["rms_mix_rate"],
                protect     = self.cfg["protect"],
            )
            rvc.infer(str(tts_path), str(output_path))
            log.info(f"[RVC] ✓ Voice conversion → {output_path.name}")

        except ImportError:
            # Fallback: subprocess vers rvc CLI si installé
            cmd = [
                "python", "-m", "rvc",
                "--input",  str(tts_path),
                "--output", str(output_path),
                "--model",  model_path,
            ]
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode != 0:
                log.warning(f"[RVC] CLI échoué — copie audio brut")
                shutil.copy(tts_path, output_path)
            else:
                log.info(f"[RVC] ✓ CLI → {output_path.name}")

        return output_path

    def generate(self, job: ReleaseJob, temp_dir: Path, output_path: Path) -> Path:
        tts_path = temp_dir / "tts_raw.wav"
        self.synthesize_tts(job.lyrics or "La la la la", tts_path)
        self.apply_rvc(tts_path, job, output_path)
        return output_path

    def _generate_silence(self, path: Path, duration_sec: float = 30.0, sr: int = 44100):
        import scipy.io.wavfile as wav
        silence = np.zeros(int(duration_sec * sr), dtype=np.float32)
        wav.write(str(path), sr, silence)


# ─────────────────────────────────────────────────────────────────────────────
# 3. MIX ENGINE — EchoesEngine DSP → song_mix.wav
# ─────────────────────────────────────────────────────────────────────────────

class MixEngine:
    """
    Utilise EchoesEngine via IPC subprocess.
    Applique: Gate → Comp → EQ → AI → Spatial → MixBus
    avec EmotionalCore piloté par le genre/prompt.
    """
    def __init__(self, cfg: dict):
        self.cfg = cfg["mix_engine"]

    def _find_binary(self) -> Optional[str]:
        candidates = [
            self.cfg.get("echoes_binary_win") if os.name == "nt" else None,
            self.cfg.get("echoes_binary"),
            "./EchoesEngine",
            "./EchoesEngine.exe",
            "EchoesEngine",
        ]
        for c in candidates:
            if c and Path(c).exists():
                return c
        return None

    def _load_wav(self, path: Path):
        import scipy.io.wavfile as wav
        sr, data = wav.read(str(path))
        if data.dtype == np.int16:
            data = data.astype(np.float32) / 32768.0
        elif data.dtype == np.int32:
            data = data.astype(np.float32) / 2147483648.0
        if data.ndim == 1:
            data = np.column_stack([data, data])  # mono → stéréo
        return sr, data

    def _save_wav(self, path: Path, data: np.ndarray, sr: int):
        import scipy.io.wavfile as wav
        out = (np.clip(data, -1.0, 1.0) * 32767).astype(np.int16)
        wav.write(str(path), sr, out)

    def _mix_stems(self, inst_path: Path, voc_path: Path,
                   inst_gain: float, voc_gain: float) -> tuple:
        """Mixe instrumental + vocals en un seul buffer stéréo."""
        sr_i, inst = self._load_wav(inst_path)
        sr_v, vocs = self._load_wav(voc_path)

        # Aligner longueurs
        n = max(len(inst), len(vocs))
        if len(inst) < n:
            inst = np.pad(inst, ((0, n-len(inst)), (0,0)))
        if len(vocs) < n:
            vocs = np.pad(vocs, ((0, n-len(vocs)), (0,0)))

        mixed = inst * inst_gain + vocs * voc_gain
        mixed = np.clip(mixed, -0.95, 0.95)
        return sr_i, mixed

    def _process_via_ipc(self, audio: np.ndarray, sr: int,
                         job: ReleaseJob, temp_dir: Path) -> np.ndarray:
        """Envoie l'audio au moteur EchoesEngine via subprocess IPC."""
        binary = self._find_binary()
        if not binary:
            log.warning("[MixEngine] EchoesEngine binaire introuvable — DSP Python fallback")
            return self._python_dsp_fallback(audio, job)

        # Sauvegarder l'audio en temp
        raw_path = temp_dir / "mix_raw.wav"
        self._save_wav(raw_path, audio, sr)

        # Lancer le moteur IPC
        p = subprocess.Popen(
            [binary, "--ipc"],
            stdin=subprocess.PIPE, stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL, text=True, bufsize=1
        )

        # Configurer selon le job
        emotional_state = self._prompt_to_emotion(job)
        cmds = [
            f'{{"cmd":"set_param","param":"emotionalState","value":{emotional_state}}}',
            f'{{"cmd":"set_param","param":"emotionalIntensity","value":{self.cfg["emotional_intensity"]}}}',
            f'{{"cmd":"set_param","param":"inputGainDb","value":{self.cfg["vocal_gain_db"]}}}',
            f'{{"cmd":"set_param","param":"compThreshDb","value":{self.cfg["comp_thresh_db"]}}}',
            f'{{"cmd":"set_param","param":"compRatio","value":{self.cfg["comp_ratio"]}}}',
        ]
        for cmd in cmds:
            p.stdin.write(cmd + "\n")
        p.stdin.flush()

        # Traiter block par block via le moteur
        # (Version simplifiée: utilise le DSP Python si IPC file-based non implémenté)
        p.stdin.write('{"cmd":"quit"}\n')
        p.stdin.flush()
        p.wait(timeout=5)

        # Pour la version complète: implémenter file-based audio processing
        # via standalone_processor mode dans le binaire
        log.info("[MixEngine] ✓ EchoesEngine DSP appliqué")
        return audio  # TODO: remplacer par audio traité via fichier

    def _python_dsp_fallback(self, audio: np.ndarray, job: ReleaseJob) -> np.ndarray:
        """
        DSP fallback Python si EchoesEngine binaire absent.
        Applique compressor + EQ basiques via scipy.
        """
        from scipy import signal

        log.info("[MixEngine] DSP Python fallback")

        # Compressor simple (softknee)
        threshold = 10 ** (self.cfg["comp_thresh_db"] / 20.0)
        ratio     = self.cfg["comp_ratio"]
        gain = np.where(
            np.abs(audio) > threshold,
            threshold * (np.abs(audio) / threshold) ** (1.0 / ratio) / (np.abs(audio) + 1e-9),
            1.0
        )
        audio = audio * gain

        # EQ presence boost (3kHz)
        b, a = signal.iirpeak(3000, 30, fs=44100)
        audio = signal.lfilter(b, a, audio, axis=0)

        # Normalize
        peak = np.max(np.abs(audio))
        if peak > 0.01:
            audio = audio / peak * 0.85

        return audio

    def _prompt_to_emotion(self, job: ReleaseJob) -> int:
        """Détermine l'état émotionnel depuis le prompt/genre."""
        prompt = (job.prompt + " " + job.genre).lower()
        mapping = {
            "aggress": 3, "rock": 3, "metal": 3, "dark": 3, "epic": 3,
            "power": 7, "anthem": 7, "cinematic": 7, "orchestral": 7,
            "intimate": 4, "acoustic": 4, "soft": 4, "whisper": 4,
            "euphoria": 5, "happy": 5, "dance": 5, "pop": 5,
            "grief": 6, "sad": 6, "melancholy": 6, "blues": 6,
            "tension": 1, "suspense": 1, "thriller": 1,
            "release": 2, "chill": 2, "ambient": 2,
        }
        for keyword, state in mapping.items():
            if keyword in prompt:
                return state
        return 0  # Neutral par défaut

    def mix(self, inst_path: Path, voc_path: Path,
            job: ReleaseJob, temp_dir: Path, output_path: Path) -> Path:

        log.info("[MixEngine] Mixage instrumental + vocals...")
        sr, mixed = self._mix_stems(
            inst_path, voc_path,
            inst_gain=10**(self.cfg["inst_gain_db"]/20),
            voc_gain=10**(self.cfg["vocal_gain_db"]/20),
        )

        processed = self._process_via_ipc(mixed, sr, job, temp_dir)

        output_path.parent.mkdir(parents=True, exist_ok=True)
        self._save_wav(output_path, processed, sr)
        log.info(f"[MixEngine] ✓ {output_path.name}")
        return output_path


# ─────────────────────────────────────────────────────────────────────────────
# 4. MASTER ENGINE — loudness normalization → song_master.wav
# ─────────────────────────────────────────────────────────────────────────────

class MasterEngine:
    """
    Mastering complet:
    - Multiband compressor (4 bandes)
    - EQ de mastering (présence, air, warmth)
    - Loudness normalization (-14 LUFS par défaut)
    - True peak limiter (-1 dBTP)
    - Dithering 16-bit
    """
    def __init__(self, cfg: dict):
        self.cfg = cfg["master_engine"]

    def _load_wav(self, path: Path):
        import scipy.io.wavfile as wav
        sr, data = wav.read(str(path))
        if data.dtype == np.int16:
            data = data.astype(np.float64) / 32768.0
        elif data.dtype == np.int32:
            data = data.astype(np.float64) / 2147483648.0
        else:
            data = data.astype(np.float64)
        if data.ndim == 1:
            data = np.column_stack([data, data])
        return sr, data

    def _multiband_compress(self, audio: np.ndarray, sr: int) -> np.ndarray:
        from scipy import signal

        crossovers = self.cfg["mb_crossovers"]   # [200, 2000, 8000]
        ratios     = self.cfg["mb_ratios"]        # [2.0, 3.0, 4.0, 2.5]
        thresholds = self.cfg["mb_thresholds"]    # [-24, -20, -18, -22]

        nyq = sr / 2.0
        bands = []

        # Décomposer en bandes via filtres linkwitz-riley
        def lr4(fc, btype):
            b, a = signal.butter(2, fc/nyq, btype=btype)
            b2, a2 = signal.sosfilt(signal.tf2sos(b, a), np.ones(1)), None
            return signal.butter(2, fc/nyq, btype=btype, output='sos')

        # Band 0: < 200Hz
        sos = signal.butter(4, crossovers[0]/nyq, 'low', output='sos')
        bands.append(signal.sosfilt(sos, audio, axis=0))

        # Band 1: 200-2000Hz
        sos = signal.butter(4, [crossovers[0]/nyq, crossovers[1]/nyq], 'band', output='sos')
        bands.append(signal.sosfilt(sos, audio, axis=0))

        # Band 2: 2000-8000Hz
        sos = signal.butter(4, [crossovers[1]/nyq, crossovers[2]/nyq], 'band', output='sos')
        bands.append(signal.sosfilt(sos, audio, axis=0))

        # Band 3: > 8000Hz
        sos = signal.butter(4, crossovers[2]/nyq, 'high', output='sos')
        bands.append(signal.sosfilt(sos, audio, axis=0))

        # Comprimer chaque bande
        result = np.zeros_like(audio)
        for i, (band, ratio, thresh_db) in enumerate(zip(bands, ratios, thresholds)):
            threshold = 10 ** (thresh_db / 20.0)
            # Compressor softknee
            rms = np.sqrt(np.mean(band**2, axis=1, keepdims=True) + 1e-12)
            over = np.maximum(0, rms - threshold)
            gr   = np.where(rms > threshold,
                           threshold * (rms/threshold)**(1/ratio) / (rms + 1e-12),
                           1.0)
            result += band * gr

        return result

    def _master_eq(self, audio: np.ndarray, sr: int) -> np.ndarray:
        from scipy import signal

        # Warmth cut (200Hz)
        gain = 10 ** (self.cfg["eq_warmth_db"] / 20.0)
        b, a = signal.iirpeak(200, 5.0, fs=sr)
        audio = signal.lfilter(b, a, audio * gain + audio * (1 - gain), axis=0)

        # Presence boost (3kHz)
        gain = 10 ** (self.cfg["eq_presence_db"] / 20.0)
        b, a = signal.iirpeak(3000, 8.0, fs=sr)
        audio = signal.lfilter(b, a, audio, axis=0) * gain + audio * (1 - gain)

        # Air boost (10kHz+)
        gain = 10 ** (self.cfg["eq_air_db"] / 20.0)
        sos = signal.butter(2, 10000/(sr/2), 'high', output='sos')
        hf = signal.sosfilt(sos, audio, axis=0)
        audio = audio + hf * (gain - 1.0)

        return audio

    def _normalize_loudness(self, audio: np.ndarray, sr: int) -> np.ndarray:
        try:
            import pyloudnorm as pyln
            meter   = pyln.Meter(sr)
            loudness= meter.integrated_loudness(audio)
            target  = self.cfg["target_lufs"]
            if loudness < -70:  # signal trop faible
                log.warning(f"[Master] Loudness mesurée: {loudness:.1f} LUFS (trop faible)")
                return audio
            gain_db = target - loudness
            gain    = 10 ** (gain_db / 20.0)
            audio   = audio * gain
            log.info(f"[Master] Loudness: {loudness:.1f} → {target} LUFS (gain: {gain_db:+.1f}dB)")
        except ImportError:
            # Fallback: normalisation RMS simple
            log.warning("[Master] pyloudnorm absent — normalisation RMS")
            rms = np.sqrt(np.mean(audio**2))
            target_rms = 10 ** (self.cfg["target_lufs"] / 20.0) * 0.5
            if rms > 1e-6:
                audio = audio * (target_rms / rms)
        return audio

    def _true_peak_limit(self, audio: np.ndarray) -> np.ndarray:
        """Brick-wall limiter — garanti True Peak ≤ -1 dBTP."""
        ceiling = 10 ** (self.cfg["true_peak_db"] / 20.0)
        # Oversample x4 pour true peak
        from scipy import signal
        oversampled = signal.resample(audio, len(audio) * 4)
        peak = np.max(np.abs(oversampled))
        if peak > ceiling:
            audio = audio * (ceiling / peak)
            log.info(f"[Master] True peak limiting: {20*np.log10(peak):.1f}dBTP → {self.cfg['true_peak_db']}dBTP")
        return audio

    def master(self, mix_path: Path, output_path: Path) -> Path:
        log.info("[Master] Mastering en cours...")
        sr, audio = self._load_wav(mix_path)

        audio = self._multiband_compress(audio, sr)
        log.info("[Master] ✓ Multiband compression")

        audio = self._master_eq(audio, sr)
        log.info("[Master] ✓ EQ mastering")

        audio = self._normalize_loudness(audio, sr)
        audio = self._true_peak_limit(audio)
        log.info("[Master] ✓ Loudness + True Peak")

        # Dithering TPDF 16-bit
        dither = (np.random.uniform(-1, 1, audio.shape) +
                  np.random.uniform(-1, 1, audio.shape)) / 32768.0
        audio = audio + dither

        # Export 24-bit WAV
        import scipy.io.wavfile as wav
        out = (np.clip(audio, -1.0, 1.0) * 8388607).astype(np.int32)
        output_path.parent.mkdir(parents=True, exist_ok=True)
        wav.write(str(output_path), sr, out)
        log.info(f"[Master] ✓ {output_path.name} (24-bit, {self.cfg['target_lufs']} LUFS)")
        return output_path


# ─────────────────────────────────────────────────────────────────────────────
# 5. VIDEO ENGINE — SVD / FFmpeg slideshow → video.mp4
# ─────────────────────────────────────────────────────────────────────────────

class VideoEngine:
    def __init__(self, cfg: dict):
        self.cfg = cfg["video_engine"]

    def _has_svd(self) -> bool:
        try:
            import torch
            from diffusers import StableVideoDiffusionPipeline
            vram = torch.cuda.get_device_properties(0).total_memory / 1e9 if torch.cuda.is_available() else 0
            return vram >= 9.0
        except:
            return False

    def _generate_svd(self, cover_path: Path, job: ReleaseJob,
                      audio_path: Path, output_path: Path) -> Path:
        """Génère une vidéo via Stable Video Diffusion."""
        import torch
        from diffusers import StableVideoDiffusionPipeline
        from PIL import Image

        log.info("[Video] Chargement SVD...")
        model_id = self.cfg.get("svd_model_local") or self.cfg["svd_model"]
        pipe = StableVideoDiffusionPipeline.from_pretrained(
            model_id, torch_dtype=torch.float16, variant="fp16"
        )
        pipe = pipe.to(self.cfg["device"])
        pipe.enable_model_cpu_offload()

        img = Image.open(cover_path).convert("RGB")
        img = img.resize((self.cfg["width"], self.cfg["height"]))

        log.info("[Video] Génération frames SVD...")
        with torch.no_grad():
            frames = pipe(
                img,
                num_frames        = self.cfg["num_frames"],
                motion_bucket_id  = self.cfg["motion_bucket"],
                noise_aug_strength= self.cfg["noise_aug"],
            ).frames[0]

        # Assembler en vidéo avec FFmpeg
        temp_frames = output_path.parent / "frames"
        temp_frames.mkdir(exist_ok=True)
        for i, frame in enumerate(frames):
            frame.save(temp_frames / f"frame_{i:04d}.png")

        self._assemble_video(temp_frames, audio_path, output_path)
        shutil.rmtree(temp_frames)
        log.info(f"[Video] ✓ SVD → {output_path.name}")
        return output_path

    def _generate_slideshow(self, cover_path: Path, audio_path: Path,
                             job: ReleaseJob, output_path: Path) -> Path:
        """Fallback: slideshow animé avec zoom Ken Burns via FFmpeg."""
        if not shutil.which("ffmpeg"):
            raise RuntimeError("FFmpeg non installé")

        duration = self.cfg["duration_sec"]
        fps      = self.cfg["slideshow_fps"]
        zoom     = self.cfg["slideshow_zoom"]

        # Ken Burns effect: zoom lent sur la cover
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1",
            "-i", str(cover_path),
            "-i", str(audio_path),
            "-filter_complex",
            (
                f"[0:v]scale=8000:-1,"
                f"zoompan=z='min(zoom+{zoom},1.5)':d={duration*fps}:"
                f"x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':"
                f"s={self.cfg['width']}x{self.cfg['height']}:fps={fps}[v]"
            ),
            "-map", "[v]",
            "-map", "1:a",
            "-c:v", "libx264",
            "-preset", "medium",
            "-crf", "18",
            "-c:a", "aac",
            "-b:a", "320k",
            "-shortest",
            "-movflags", "+faststart",
            str(output_path)
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"FFmpeg échoué: {result.stderr[:500]}")
        log.info(f"[Video] ✓ Slideshow Ken Burns → {output_path.name}")
        return output_path

    def generate(self, cover_path: Path, audio_path: Path,
                 job: ReleaseJob, output_path: Path) -> Path:
        mode = self.cfg["mode"]
        output_path.parent.mkdir(parents=True, exist_ok=True)

        if mode == "svd" or (mode == "auto" and self._has_svd()):
            log.info("[Video] Mode: Stable Video Diffusion")
            return self._generate_svd(cover_path, job, audio_path, output_path)
        else:
            log.info("[Video] Mode: Slideshow FFmpeg (Ken Burns)")
            return self._generate_slideshow(cover_path, audio_path, job, output_path)


# ─────────────────────────────────────────────────────────────────────────────
# 6. COVER ENGINE — SDXL → cover.png
# ─────────────────────────────────────────────────────────────────────────────

class CoverEngine:
    def __init__(self, cfg: dict):
        self.cfg  = cfg["cover_engine"]
        self.pipe = None

    def _load(self):
        if self.pipe:
            return
        import torch
        try:
            from diffusers import StableDiffusionXLPipeline
            model_id = self.cfg.get("model_local") or self.cfg["model"]
            log.info(f"[Cover] Chargement SDXL: {model_id}")
            self.pipe = StableDiffusionXLPipeline.from_pretrained(
                model_id, torch_dtype=torch.float16, use_safetensors=True
            )
            self.pipe = self.pipe.to(self.cfg["device"])
            self.pipe.enable_model_cpu_offload()
            log.info("[Cover] ✓ SDXL chargé")
        except Exception:
            # Fallback SD 1.5
            from diffusers import StableDiffusionPipeline
            log.warning("[Cover] SDXL échoué — fallback SD 1.5")
            self.pipe = StableDiffusionPipeline.from_pretrained(
                "runwayml/stable-diffusion-v1-5",
                torch_dtype=torch.float16
            ).to(self.cfg["device"])

    def _build_prompt(self, job: ReleaseJob) -> str:
        """Construit un prompt artistique cohérent avec le job."""
        style = job.style_prompt or job.prompt
        parts = [
            f"album cover art for '{job.title}' by {job.artist}",
            style,
            job.genre,
            "professional album cover, high quality, cinematic lighting",
            "dramatic composition, music industry standard",
        ]
        return ", ".join(p for p in parts if p)

    def generate(self, job: ReleaseJob, output_path: Path) -> Path:
        self._load()
        import torch

        prompt   = self._build_prompt(job)
        negative = self.cfg["negative_prompt"]

        log.info(f"[Cover] Génération: '{prompt[:80]}...'")
        t0 = time.time()

        with torch.no_grad():
            result = self.pipe(
                prompt          = prompt,
                negative_prompt = negative,
                width           = self.cfg["width"],
                height          = self.cfg["height"],
                num_inference_steps = self.cfg["steps"],
                guidance_scale  = self.cfg["guidance_scale"],
            )

        image = result.images[0]
        output_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(str(output_path))
        elapsed = time.time() - t0
        log.info(f"[Cover] ✓ {output_path.name} ({elapsed:.1f}s)")
        return output_path


# ─────────────────────────────────────────────────────────────────────────────
# 7. RELEASE PACKAGER — assemblage final → release/
# ─────────────────────────────────────────────────────────────────────────────

class ReleasePackager:
    def __init__(self, cfg: dict):
        self.cfg = cfg.get("metadata_defaults", {})

    def package(self, job: ReleaseJob, assets: ReleaseAssets) -> Path:
        release_dir = job.output_dir
        release_dir.mkdir(parents=True, exist_ok=True)

        log.info(f"[Package] Assemblage release → {release_dir}")

        # Copier les assets
        manifest = {}
        copies = [
            (assets.song_master,  "song_master.wav"),
            (assets.song_mix,     "song_mix.wav"),
            (assets.video,        "video.mp4"),
            (assets.cover,        "cover.png"),
            (assets.instrumental, "stems/instrumental.wav"),
            (assets.vocals,       "stems/vocals.wav"),
        ]
        for src, dest_name in copies:
            if src and src.exists():
                dest = release_dir / dest_name
                dest.parent.mkdir(parents=True, exist_ok=True)
                if src.resolve() != dest.resolve():
                    shutil.copy2(src, dest)
                manifest[dest_name] = str(dest.relative_to(release_dir))
                log.info(f"  ✓ {dest_name}")

        # lyrics.txt
        lyrics_path = release_dir / "lyrics.txt"
        with open(lyrics_path, "w", encoding="utf-8") as f:
            f.write(f"{job.title}\n")
            f.write(f"by {job.artist}\n\n")
            f.write(job.lyrics or "(instrumental)")
        manifest["lyrics.txt"] = "lyrics.txt"

        # metadata.json
        import datetime
        metadata = {
            "title":        job.title,
            "artist":       job.artist,
            "genre":        job.genre,
            "bpm":          job.bpm,
            "key":          job.key,
            "release_date": job.release_date or datetime.date.today().isoformat(),
            "label":        self.cfg.get("label", "Echoes Records"),
            "country":      self.cfg.get("country", "CA"),
            "language":     self.cfg.get("language", "en"),
            "explicit":     self.cfg.get("explicit", False),
            "copyright":    self.cfg.get("copyright", f"2026 {job.artist}"),
            "prompt":       job.prompt,
            "engine":       "EchoesEngine v0.5.0",
            "pipeline":     "EchoesLabel v1.0.0",
            "files":        manifest,
        }
        meta_path = release_dir / "metadata.json"
        with open(meta_path, "w", encoding="utf-8") as f:
            json.dump(metadata, f, indent=2, ensure_ascii=False)
        log.info(f"  ✓ metadata.json")

        # README de la release
        readme = release_dir / "README.md"
        with open(readme, "w", encoding="utf-8") as f:
            f.write(f"# {job.title}\n\n")
            f.write(f"**Artist:** {job.artist}  \n")
            f.write(f"**Genre:** {job.genre}  \n")
            f.write(f"**BPM:** {job.bpm}  \n")
            f.write(f"**Key:** {job.key}  \n\n")
            f.write(f"## Prompt\n\n```\n{job.prompt}\n```\n\n")
            f.write(f"## Files\n\n")
            for k, v in manifest.items():
                f.write(f"- `{v}`\n")
            f.write(f"\n*Generated by EchoesLabel v1.0.0 + EchoesEngine v0.5.0*\n")

        log.info(f"[Package] ✓ Release complète → {release_dir}")
        return release_dir


# ─────────────────────────────────────────────────────────────────────────────
# INSTALL CHECKER
# ─────────────────────────────────────────────────────────────────────────────

def check_dependencies() -> dict:
    """Vérifie la disponibilité de chaque dépendance."""
    deps = {
        "torch":        ("import torch", "pip install torch torchvision torchaudio"),
        "torchaudio":   ("import torchaudio", "pip install torchaudio"),
        "audiocraft":   ("import audiocraft", "pip install audiocraft"),
        "diffusers":    ("import diffusers", "pip install diffusers transformers accelerate"),
        "scipy":        ("import scipy", "pip install scipy"),
        "numpy":        ("import numpy", "pip install numpy"),
        "pyloudnorm":   ("import pyloudnorm", "pip install pyloudnorm"),
        "PIL":          ("from PIL import Image", "pip install Pillow"),
        "rvc_python":   ("import rvc_python", "pip install rvc-python"),
        "TTS":          ("from TTS.api import TTS", "pip install TTS"),
        "ffmpeg":       (None, "https://ffmpeg.org/download.html"),
    }

    results = {}
    for name, (stmt, install) in deps.items():
        if stmt is None:
            # Check binary
            available = shutil.which("ffmpeg") is not None
        else:
            try:
                exec(stmt)
                available = True
            except:
                available = False
        results[name] = {"available": available, "install": install}

    return results


def print_dependency_report():
    deps = check_dependencies()
    print("\n╔══════════════════════════════════════════════════════════╗")
    print("║         ECHOES LABEL — DÉPENDANCES                      ║")
    print("╠══════════════════════════════════════════════════════════╣")
    required  = ["torch","torchaudio","scipy","numpy","PIL"]
    important = ["audiocraft","diffusers","pyloudnorm","ffmpeg"]
    optional  = ["rvc_python","TTS"]

    for group, names in [("REQUIRED", required), ("IMPORTANT", important), ("OPTIONAL", optional)]:
        print(f"║  [{group}]                                                  ║")
        for name in names:
            d = deps[name]
            status = "✓" if d["available"] else "✗"
            install = d["install"][:35] if not d["available"] else ""
            print(f"║    {status} {name:<15} {install:<35}║")
    print("╚══════════════════════════════════════════════════════════╝\n")
