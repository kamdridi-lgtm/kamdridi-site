const { execSync } = require('child_process');
const path = require('path');
const ffmpeg = require('C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\f11e9f97-0741-4c9c-96d5-8524e022b0f5\\audio-audit\\node_modules\\ffmpeg-static');
const ffprobe = require('C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\f11e9f97-0741-4c9c-96d5-8524e022b0f5\\audio-audit\\node_modules\\ffprobe-static');

const wavPath = 'C:\\Users\\Administrator\\.gemini\\antigravity\\brain\\f11e9f97-0741-4c9c-96d5-8524e022b0f5\\audio-audit\\the-lost-requiem-complete-master.wav';
const destMp3 = 'C:\\Users\\Administrator\\kamdridi-site\\band-site\\public\\the-lost-requiem\\audio\\the-lost-requiem-complete.mp3';

console.log('Re-encoding MP3 with True Peak limiting (-1.5 dBFS limit to absorb MP3 encoding peaks)...');
try {
  // Using alimiter at -1.5 dBFS (0.841395)
  execSync(`"${ffmpeg}" -y -i "${wavPath}" -filter_complex "alimiter=level_in=1:level_out=1:limit=0.841395" -c:a libmp3lame -b:a 320k "${destMp3}"`);
} catch(e) { console.error('Encoding failed', e.message); }

console.log('Probing new MP3...');
try {
  const probe = execSync(`"${ffprobe.path}" -v error -show_entries format=duration,size,bit_rate -show_streams -of json "${destMp3}"`).toString();
  const probeData = JSON.parse(probe);
  const stream = probeData.streams[0];
  const format = probeData.format;
  console.log(`Duration: ${format.duration} s`);
  console.log(`Codec: ${stream.codec_name}`);
  console.log(`Bitrate: ${format.bit_rate} bps`);
  console.log(`Sample Rate: ${stream.sample_rate} Hz`);
  console.log(`Channels: ${stream.channels}`);
  console.log(`Size: ${format.size} bytes`);
} catch(e) { console.error('ffprobe failed', e.message); }

try {
  const ebur = execSync(`"${ffmpeg}" -nostats -i "${destMp3}" -filter_complex ebur128=peak=true -f null - 2>&1`).toString();
  const summaryIdx = ebur.lastIndexOf('Summary:');
  if (summaryIdx !== -1) {
    const summary = ebur.substring(summaryIdx);
    const lufsMatch = summary.match(/I:\s+([\-\d\.]+)\s+LUFS/);
    const peakMatch = summary.match(/Peak:\s+([\-\d\.]+)\s+dBFS/);
    if(lufsMatch) console.log(`Integrated LUFS: ${lufsMatch[1]}`);
    if(peakMatch) console.log(`True Peak: ${peakMatch[1]} dBFS`);
  }
} catch(e) { console.error('ebur128 failed', e.message); }

try {
  const astat = execSync(`"${ffmpeg}" -nostats -i "${destMp3}" -filter_complex astats=measure_overall=1:measure_perchannel=0 -f null - 2>&1`).toString();
  const peakLevelMatch = astat.match(/Peak level dB:\s*([\-\d\.]+)/);
  if(peakLevelMatch) console.log(`Peak Sample: ${peakLevelMatch[1]} dB`);
} catch(e) { console.error('astats failed', e.message); }
