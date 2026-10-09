fetch('https://generativelanguage.googleapis.com/v1beta/models?key=' + process.env.GEMINI_API_KEY).then(r=>r.json()).then(j=>console.log('MODEL_LIST_DUMP:', JSON.stringify(j)))
