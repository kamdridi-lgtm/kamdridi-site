const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const dir = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\f11e9f97-0741-4c9c-96d5-8524e022b0f5\\audio-audit';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mp3'));

for (const file of files) {
  const fullPath = path.join(dir, file);
  console.log(`\n=== Analyzing: ${file} ===`);
  
  // Basic stats
  const stat = fs.statSync(fullPath);
  console.log(`Size: ${stat.size} bytes`);
  
  const hash = crypto.createHash('sha256').update(fs.readFileSync(fullPath)).digest('hex');
  console.log(`SHA-256: ${hash.toUpperCase()}`);

  // ffprobe format
  try {
    const probe = execSync(`ffprobe -v error -show_entries format=duration,bit_rate -show_streams -of json "${fullPath}"`).toString();
    const probeData = JSON.parse(probe);
    const stream = probeData.streams[0];
    const format = probeData.format;
    console.log(`Duration: ${format.duration} s`);
    console.log(`Codec: ${stream.codec_name}`);
    console.log(`Bitrate: ${format.bit_rate} bps`);
    console.log(`Sample Rate: ${stream.sample_rate} Hz`);
    console.log(`Channels: ${stream.channels}`);
  } catch(e) { console.error('ffprobe failed', e.message); }

  // LUFS and True Peak
  try {
    const ebur = execSync(`ffmpeg -v warning -i "${fullPath}" -filter_complex ebur128=peak=true -f null - 2>&1`).toString();
    const lufsMatch = ebur.match(/I:\s+([\-\d\.]+)\s+LUFS/);
    const peakMatch = ebur.match(/Peak:\s+([\-\d\.]+)\s+dBFS/);
    if(lufsMatch) console.log(`Integrated LUFS: ${lufsMatch[1]}`);
    if(peakMatch) console.log(`True Peak: ${peakMatch[1]} dBFS`);
  } catch(e) { console.error('ebur128 failed', e.message); }

  // Silence detect
  try {
    const silence = execSync(`ffmpeg -v warning -i "${fullPath}" -af silencedetect=noise=-50dB:d=0.5 -f null - 2>&1`).toString();
    const silenceStarts = [...silence.matchAll(/silence_start: ([\d\.]+)/g)].map(m => m[1]);
    const silenceEnds = [...silence.matchAll(/silence_end: ([\d\.]+)/g)].map(m => m[1]);
    console.log(`Silences detected: starts at [${silenceStarts.join(', ')}], ends at [${silenceEnds.join(', ')}]`);
  } catch(e) { console.error('silencedetect failed', e.message); }
}
