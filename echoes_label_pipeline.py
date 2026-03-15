"""
echoes_label_pipeline.py
=========================
EchoesLabel — Pipeline de production musicale niveau label.

Un seul prompt → chanson complète + mastering + clip + cover + package.

Usage:
  python echoes_label_pipeline.py --prompt "epic cinematic rock anthem"
  python echoes_label_pipeline.py --config custom_config.json
  python echoes_label_pipeline.py --check        # vérifier les dépendances
  python echoes_label_pipeline.py --demo         # run avec assets synthétiques

Flags:
  --prompt      Prompt musical principal
  --title       Titre de la chanson
  --artist      Nom de l'artiste
  --genre       Genre musical
  --bpm         BPM (défaut: 120)
  --key         Tonalité (défaut: C minor)
  --lyrics      Paroles (optionnel)
  --voice       Chemin vers le voice model RVC (.pth)
  --config      Fichier de configuration (défaut: echoes_label_config.json)
  --skip        Modules à ignorer: music,voice,mix,master,video,cover
  --output      Dossier de sortie
  --check       Vérifier les dépendances seulement
  --demo        Mode démo (génère tout avec assets synthétiques)
"""

import os
import sys
import json
import time
import logging
import argparse
import datetime
import numpy as np
from pathlib import Path

from echoes_label_modules import (
    load_config,
    ReleaseJob, ReleaseAssets,
    MusicGenerator, VoiceEngine, MixEngine,
    MasterEngine, VideoEngine, CoverEngine,
    ReleasePackager, print_dependency_report,
)

# ─────────────────────────────────────────────────────────────────────────────
# LOGGING
# ─────────────────────────────────────────────────────────────────────────────

logging.basicConfig(
    level   = logging.INFO,
    format  = "%(asctime)s  %(name)-14s  %(levelname)s  %(message)s",
    datefmt = "%H:%M:%S",
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler("echoes_label.log", encoding="utf-8"),
    ]
)
log = logging.getLogger("EchoesLabel")


# ─────────────────────────────────────────────────────────────────────────────
# PIPELINE PRINCIPAL
# ─────────────────────────────────────────────────────────────────────────────

class EchoesLabelPipeline:
    """
    Orchestrateur complet.

    Flux:
      prompt → MusicGenerator → VoiceEngine → MixEngine
             → MasterEngine  → VideoEngine  → CoverEngine
             → ReleasePackager → release/
    """

    def __init__(self, config_path: str = "echoes_label_config.json"):
        self.cfg = load_config(config_path)
        self._init_modules()

    def _init_modules(self):
        """Initialise tous les modules (lazy — chargement modèles à la demande)."""
        self.music   = MusicGenerator(self.cfg)
        self.voice   = VoiceEngine(self.cfg)
        self.mix     = MixEngine(self.cfg)
        self.master  = MasterEngine(self.cfg)
        self.video   = VideoEngine(self.cfg)
        self.cover   = CoverEngine(self.cfg)
        self.packager= ReleasePackager(self.cfg)

    def _make_dirs(self, job: ReleaseJob) -> tuple[Path, Path]:
        """Crée les dossiers de travail."""
        job.output_dir.mkdir(parents=True, exist_ok=True)
        temp = Path(self.cfg["paths"]["temp_dir"]) / job.title.replace(" ", "_")
        temp.mkdir(parents=True, exist_ok=True)
        return job.output_dir, temp

    def run(self, job: ReleaseJob, skip: list = None) -> ReleaseAssets:
        """
        Lance le pipeline complet.

        Args:
            job:  Définition de la release
            skip: Liste de modules à ignorer ['music','voice','mix','master','video','cover']

        Returns:
            ReleaseAssets avec tous les chemins produits
        """
        skip   = skip or []
        assets = ReleaseAssets()
        output_dir, temp = self._make_dirs(job)

        log.info("=" * 60)
        log.info(f"  ECHOES LABEL — PIPELINE START")
        log.info(f"  Title  : {job.title}")
        log.info(f"  Artist : {job.artist}")
        log.info(f"  Genre  : {job.genre}")
        log.info(f"  Prompt : {job.prompt[:60]}...")
        log.info("=" * 60)
        t_start = time.time()

        # ── ÉTAPE 1: MUSIC GENERATOR ─────────────────────────────────────────
        inst_path = output_dir / "stems" / "instrumental.wav"
        if "music" not in skip:
            try:
                log.info("\n[1/6] MUSIC GENERATOR")
                assets.instrumental = self.music.generate(job, inst_path)
            except Exception as e:
                log.error(f"[Music] ERREUR: {e}")
                assets.errors.append(f"music: {e}")
                log.info("[Music] Génération d'un instrumental synthétique...")
                assets.instrumental = self._generate_synthetic_audio(
                    inst_path, duration=30, kind="instrumental"
                )
        else:
            log.info("[1/6] MUSIC GENERATOR — ignoré")
            assets.instrumental = inst_path if inst_path.exists() else \
                self._generate_synthetic_audio(inst_path, 30, "instrumental")

        # ── ÉTAPE 2: VOICE ENGINE ─────────────────────────────────────────────
        voc_path = output_dir / "stems" / "vocals.wav"
        if "voice" not in skip and job.lyrics:
            try:
                log.info("\n[2/6] VOICE ENGINE")
                assets.vocals = self.voice.generate(job, temp, voc_path)
            except Exception as e:
                log.error(f"[Voice] ERREUR: {e}")
                assets.errors.append(f"voice: {e}")
                assets.vocals = self._generate_synthetic_audio(
                    voc_path, duration=30, kind="vocals"
                )
        else:
            log.info("[2/6] VOICE ENGINE — ignoré (pas de paroles)")
            assets.vocals = self._generate_synthetic_audio(
                voc_path, duration=30, kind="silence"
            )

        # ── ÉTAPE 3: MIX ENGINE ───────────────────────────────────────────────
        mix_path = temp / "song_mix.wav"
        if "mix" not in skip:
            try:
                log.info("\n[3/6] MIX ENGINE (EchoesEngine DSP)")
                assets.song_mix = self.mix.mix(
                    assets.instrumental, assets.vocals, job, temp, mix_path
                )
            except Exception as e:
                log.error(f"[Mix] ERREUR: {e}")
                assets.errors.append(f"mix: {e}")
                assets.song_mix = assets.instrumental  # fallback
        else:
            log.info("[3/6] MIX ENGINE — ignoré")
            assets.song_mix = assets.instrumental

        # ── ÉTAPE 4: MASTER ENGINE ────────────────────────────────────────────
        master_path = output_dir / "song_master.wav"
        if "master" not in skip:
            try:
                log.info("\n[4/6] MASTER ENGINE")
                assets.song_master = self.master.master(assets.song_mix, master_path)
            except Exception as e:
                log.error(f"[Master] ERREUR: {e}")
                assets.errors.append(f"master: {e}")
                import shutil
                shutil.copy(assets.song_mix, master_path)
                assets.song_master = master_path
        else:
            log.info("[4/6] MASTER ENGINE — ignoré")
            assets.song_master = assets.song_mix

        # ── ÉTAPE 5: COVER ENGINE ─────────────────────────────────────────────
        cover_path = output_dir / "cover.png"
        if "cover" not in skip:
            try:
                log.info("\n[5/6] COVER ENGINE (Stable Diffusion)")
                assets.cover = self.cover.generate(job, cover_path)
            except Exception as e:
                log.error(f"[Cover] ERREUR: {e}")
                assets.errors.append(f"cover: {e}")
                assets.cover = self._generate_placeholder_cover(cover_path, job)
        else:
            log.info("[5/6] COVER ENGINE — ignoré")
            assets.cover = cover_path if cover_path.exists() else \
                self._generate_placeholder_cover(cover_path, job)

        # ── ÉTAPE 6: VIDEO ENGINE ─────────────────────────────────────────────
        video_path = output_dir / "video.mp4"
        if "video" not in skip:
            try:
                log.info("\n[6/6] VIDEO ENGINE")
                assets.video = self.video.generate(
                    assets.cover, assets.song_master, job, video_path
                )
            except Exception as e:
                log.error(f"[Video] ERREUR: {e}")
                assets.errors.append(f"video: {e}")
                log.warning("[Video] Clip vidéo non généré (FFmpeg manquant?)")
        else:
            log.info("[6/6] VIDEO ENGINE — ignoré")

        # ── RELEASE PACKAGE ───────────────────────────────────────────────────
        log.info("\n[7/7] RELEASE PACKAGER")
        release_dir = self.packager.package(job, assets)

        # ── RAPPORT FINAL ─────────────────────────────────────────────────────
        elapsed = time.time() - t_start
        self._print_report(job, assets, release_dir, elapsed)

        return assets

    def _generate_synthetic_audio(self, path: Path, duration: float,
                                   kind: str = "silence") -> Path:
        """Génère un audio synthétique pour les tests / fallbacks."""
        import scipy.io.wavfile as wav
        sr = 44100
        n  = int(duration * sr)
        path.parent.mkdir(parents=True, exist_ok=True)

        if kind == "instrumental":
            # Accord de guitare synthétique
            t = np.linspace(0, duration, n)
            freqs = [82.4, 110, 146.8, 196, 246.9]  # E2 A2 D3 G3 B3
            audio = sum(0.1 * np.sin(2*np.pi*f*t) * np.exp(-0.5*t) for f in freqs)
            audio = np.column_stack([audio, audio]).astype(np.float32)
        elif kind == "vocals":
            # Sinus modulé (proxy voix)
            t = np.linspace(0, duration, n)
            audio = 0.15 * np.sin(2*np.pi*220*t) * (0.5 + 0.5*np.sin(2*np.pi*3*t))
            audio = np.column_stack([audio, audio]).astype(np.float32)
        else:
            audio = np.zeros((n, 2), dtype=np.float32)

        out = (np.clip(audio, -1, 1) * 32767).astype(np.int16)
        wav.write(str(path), sr, out)
        return path

    def _generate_placeholder_cover(self, path: Path, job: ReleaseJob) -> Path:
        """Génère une cover placeholder si SDXL non disponible."""
        path.parent.mkdir(parents=True, exist_ok=True)
        try:
            from PIL import Image, ImageDraw, ImageFont
            img  = Image.new("RGB", (1024, 1024), color=(15, 10, 20))
            draw = ImageDraw.Draw(img)

            # Gradient simple
            for y in range(1024):
                alpha = y / 1024
                r = int(15 + 100 * alpha)
                g = int(10 + 20  * alpha)
                b = int(20 + 60  * alpha)
                draw.line([(0,y),(1024,y)], fill=(r,g,b))

            # Texte
            draw.text((512, 420), job.title,  fill=(255,200,100), anchor="mm")
            draw.text((512, 520), job.artist, fill=(180,180,180), anchor="mm")
            draw.text((512, 600), job.genre,  fill=(120,120,120), anchor="mm")

            img.save(str(path))
            log.info(f"[Cover] ✓ Placeholder généré → {path.name}")
        except ImportError:
            # Créer un PNG minimal valide sans Pillow
            import struct, zlib
            def png_chunk(name, data):
                c = struct.pack(">I", len(data)) + name + data
                return c + struct.pack(">I", zlib.crc32(c[4:]) & 0xffffffff)
            w = h = 64
            raw = b''
            for y in range(h):
                raw += b'\x00' + bytes([int(y/h*200), 10, int(y/h*100)] * w)
            png = b'\x89PNG\r\n\x1a\n'
            png += png_chunk(b'IHDR', struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
            png += png_chunk(b'IDAT', zlib.compress(raw))
            png += png_chunk(b'IEND', b'')
            path.write_bytes(png)

        return path

    def _print_report(self, job: ReleaseJob, assets: ReleaseAssets,
                       release_dir: Path, elapsed: float):
        lines = [
            "",
            "╔══════════════════════════════════════════════════════════════╗",
            "║  ECHOES LABEL — RELEASE COMPLÈTE                            ║",
            "╠══════════════════════════════════════════════════════════════╣",
            f"║  Titre  : {job.title:<50}║",
            f"║  Artiste: {job.artist:<50}║",
            f"║  Genre  : {job.genre:<50}║",
            f"║  Durée  : {elapsed:.0f}s pipeline                                     ║",
            "╠══════════════════════════════════════════════════════════════╣",
        ]
        check = lambda p: "✓" if p and Path(p).exists() else "✗"
        files = [
            (assets.song_master,  "song_master.wav  (24-bit, -14 LUFS)"),
            (assets.video,        "video.mp4         (clip vidéo)      "),
            (assets.cover,        "cover.png         (artwork 1024x1024)"),
            (assets.instrumental, "stems/instrumental.wav              "),
            (assets.vocals,       "stems/vocals.wav                    "),
        ]
        for path, label in files:
            lines.append(f"║  {check(path)} {label:<58}║")

        if assets.errors:
            lines.append("╠══════════════════════════════════════════════════════════════╣")
            lines.append("║  ⚠ ERREURS NON FATALES:                                     ║")
            for err in assets.errors:
                lines.append(f"║    - {err[:58]:<58}║")

        lines += [
            "╠══════════════════════════════════════════════════════════════╣",
            f"║  → {str(release_dir):<58}║",
            "╚══════════════════════════════════════════════════════════════╝",
            "",
        ]
        for l in lines:
            log.info(l)


# ─────────────────────────────────────────────────────────────────────────────
# DEMO MODE
# ─────────────────────────────────────────────────────────────────────────────

def run_demo(cfg_path: str):
    """Mode démo — pipeline complet avec assets synthétiques."""
    log.info("MODE DÉMO — pipeline complet avec audio synthétique")

    pipeline = EchoesLabelPipeline(cfg_path)

    job = ReleaseJob(
        prompt   = "epic cinematic rock anthem, electric guitars, orchestral choir, dark knight atmosphere",
        title    = "Dark Knight Rising",
        artist   = "Echoes",
        genre    = "Cinematic Rock",
        bpm      = 140,
        key      = "D minor",
        lyrics   = (
            "Rise from the ashes of the night\n"
            "Through the darkness find your light\n"
            "The dark knight rises, never falls\n"
            "Echoes answer, destiny calls\n"
        ),
        style_prompt = "dark cinematic, dramatic lighting, knight armor, gothic architecture",
        output_dir   = Path("./releases/dark_knight_rising"),
    )

    # En mode démo: skip music et voice (génère audio synthétique)
    assets = pipeline.run(job, skip=["music", "voice"])
    return assets


# ─────────────────────────────────────────────────────────────────────────────
# CLI
# ─────────────────────────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(
        description="EchoesLabel — Pipeline de production musicale niveau label",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog=__doc__
    )
    parser.add_argument("--prompt",  default="", help="Prompt musical")
    parser.add_argument("--title",   default="Untitled", help="Titre")
    parser.add_argument("--artist",  default="Echoes Artist", help="Artiste")
    parser.add_argument("--genre",   default="Rock", help="Genre")
    parser.add_argument("--bpm",     type=int, default=120)
    parser.add_argument("--key",     default="C minor")
    parser.add_argument("--lyrics",  default="")
    parser.add_argument("--voice",   default="", help="Voice model .pth")
    parser.add_argument("--config",  default="echoes_label_config.json")
    parser.add_argument("--skip",    default="", help="Modules à ignorer: music,voice,mix,master,video,cover")
    parser.add_argument("--output",  default="")
    parser.add_argument("--check",   action="store_true", help="Vérifier dépendances")
    parser.add_argument("--demo",    action="store_true", help="Mode démo")

    args = parser.parse_args()

    # Vérification des dépendances
    if args.check:
        print_dependency_report()
        return

    # Mode démo
    if args.demo:
        run_demo(args.config)
        return

    # Prompt obligatoire en mode normal
    if not args.prompt:
        parser.print_help()
        print("\n⚠ --prompt requis. Exemple:")
        print('  python echoes_label_pipeline.py --prompt "epic cinematic rock anthem" --title "Dark Knight" --artist "Echoes"')
        print('  python echoes_label_pipeline.py --demo')
        sys.exit(1)

    # Construction du job
    slug = args.title.lower().replace(" ", "_")
    cfg  = load_config(args.config)
    output_dir = Path(args.output) if args.output else \
                 Path(cfg["paths"]["output_root"]) / slug

    job = ReleaseJob(
        prompt       = args.prompt,
        title        = args.title,
        artist       = args.artist,
        genre        = args.genre,
        bpm          = args.bpm,
        key          = args.key,
        lyrics       = args.lyrics,
        voice_model  = args.voice,
        release_date = datetime.date.today().isoformat(),
        output_dir   = output_dir,
    )

    skip = [s.strip() for s in args.skip.split(",") if s.strip()] if args.skip else []

    # Lancer le pipeline
    pipeline = EchoesLabelPipeline(args.config)
    assets   = pipeline.run(job, skip=skip)

    if assets.errors:
        log.warning(f"{len(assets.errors)} erreur(s) non fatale(s) — release partielle")
    else:
        log.info("✓ Release complète sans erreur")

    sys.exit(0 if not assets.errors else 1)


if __name__ == "__main__":
    main()
