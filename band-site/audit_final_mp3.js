const { execSync } = require('child_process');
const path = require('path');
const ffmpeg = require('C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\f11e9f97-0741-4c9c-96d5-8524e022b0f5\\audio-audit\\node_modules\\ffmpeg-static');
const ffprobe = require('C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\f11e9f97-0741-4c9c-96d5-8524e022b0f5\\audio-audit\\node_modules\\ffprobe-static');

const fullPath = 'C:\\Users\\Administrator\\kamdridi-site\\band-site\\public\\the-lost-requiem\\audio\\the-lost-requiem-complete.mp3';

try {
  const probe = execSync(`"${ffprobe.path}" -v error -show_entries format=duration,bit_rate -show_streams -of json "${fullPath}"`).toString();
  const probeData = JSON.parse(probe);
  const stream = probeData.streams[0];
  const format = probeData.format;
  console.log(`Duration: ${format.duration} s`);
  console.log(`Codec: ${stream.codec_name}`);
  console.log(`Bitrate: ${format.bit_rate} bps`);
  console.log(`Sample Rate: ${stream.sample_rate} Hz`);
  console.log(`Channels: ${stream.channels}`);
} catch(e) { console.error('ffprobe failed', e.message); }

try {
  const ebur = execSync(`"${ffmpeg}" -nostats -i "${fullPath}" -filter_complex ebur128=peak=true -f null - 2>&1`).toString();
  const summaryIdx = ebur.lastIndexOf('Summary:');
  if (summaryIdx !== -1) {
    const summary = ebur.substring(summaryIdx);
    const lufsMatch = summary.match(/I:\s+([\-\d\.]+)\s+LUFS/);
    const peakMatch = summary.match(/Peak:\s+([\-\d\.]+)\s+dBFS/);
    if(lufsMatch) console.log(`Integrated LUFS: ${lufsMatch[1]}`);
    if(peakMatch) console.log(`True Peak: ${peakMatch[1]} dBFS`);
  }
} catch(e) { console.error('ebur128 failed', e.message); }
