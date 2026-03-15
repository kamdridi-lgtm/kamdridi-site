const ADMIN_HEADERS = () => {
  const url = process.env.SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }

  return {
    url,
    headers: {
      "Content-Type": "application/json",
      apikey: serviceKey,
      Authorization: `Bearer ${serviceKey}`,
      Prefer: "return=representation"
    }
  };
};

async function request(path, options = {}) {
  const { url, headers } = ADMIN_HEADERS();
  const response = await fetch(`${url}/rest/v1/${path}`, {
    ...options,
    headers: {
      ...headers,
      ...(options.headers || {})
    }
  });

  const text = await response.text();
  if (!response.ok) {
    throw new Error(text || `Supabase request failed (${response.status})`);
  }

  return text ? JSON.parse(text) : [];
}

function encodeFilter(key, op, value) {
  return `${key}=${op}.${encodeURIComponent(value)}`;
}

async function select(table, query = "") {
  const suffix = query ? `?${query}` : "";
  return request(`${table}${suffix}`, { method: "GET" });
}

async function insert(table, payload) {
  return request(table, {
    method: "POST",
    body: JSON.stringify(Array.isArray(payload) ? payload : [payload])
  });
}

async function update(table, filters, payload) {
  const query = filters.join("&");
  return request(`${table}?${query}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

module.exports = {
  select,
  insert,
  update,
  encodeFilter
};
