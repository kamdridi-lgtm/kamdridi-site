const fs = require('fs');

async function run() {
  const lines = fs.readFileSync('.env.local', 'utf8').split('\n');
  const keyLine = lines.find(l => l.startsWith('GEMINI_API_KEY='));
  if (!keyLine) {
    console.error('No key');
    return;
  }
  const key = keyLine.split('=')[1].trim().replace(/['"]/g, '');
  
  const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + key);
  const data = await res.json();
  if (data.models) {
    console.log(data.models.map(m => m.name));
  } else {
    console.log(data);
  }
}
run();
