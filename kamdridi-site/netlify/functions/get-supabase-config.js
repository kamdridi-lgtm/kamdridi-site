exports.handler = async () => {
  const url = process.env.SUPABASE_URL || "";
  const anonKey = process.env.SUPABASE_ANON_KEY || "";

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      SUPABASE_URL: url,
      SUPABASE_ANON_KEY: anonKey
    })
  };
};
