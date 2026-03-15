(function () {
  const state = {
    url: "",
    anonKey: "",
    ready: false,
    loading: null
  };

  async function loadConfig() {
    if (state.ready) return state;
    if (state.loading) return state.loading;

    state.loading = fetch("/.netlify/functions/get-supabase-config")
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Config request failed (${response.status})`);
        }
        return response.json();
      })
      .then((config) => {
        state.url = config.SUPABASE_URL || "";
        state.anonKey = config.SUPABASE_ANON_KEY || "";
        state.ready = Boolean(state.url && state.anonKey);
        if (!state.ready) {
          throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
        }
        console.log("[Supabase] Client initialized");
        return state;
      })
      .catch((error) => {
        console.error("[Supabase] Initialization error:", error.message);
        throw error;
      });

    return state.loading;
  }

  async function insertRow(table, payload) {
    const config = await loadConfig();
    const response = await fetch(`${config.url}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: config.anonKey,
        Authorization: `Bearer ${config.anonKey}`,
        Prefer: "return=representation"
      },
      body: JSON.stringify(payload)
    });

    const text = await response.text();
    if (!response.ok) {
      console.error(`[Supabase] Insert error in ${table}:`, text);
      throw new Error(text || `Insert failed for ${table}`);
    }

    console.log(`[Supabase] Inserted into ${table}`);
    return text ? JSON.parse(text) : [];
  }

  async function saveFan(email, name, country) {
    return insertRow("fans", {
      email,
      name,
      country
    });
  }

  async function savePressContact(email, media_name, country) {
    return insertRow("press_contact", {
      email,
      media_name,
      country,
      sent: false
    });
  }

  function normalizeDate(value) {
    const trimmed = String(value || "").trim();
    if (!trimmed) return null;
    return /^\d{4}-\d{2}-\d{2}$/.test(trimmed) ? trimmed : null;
  }

  async function saveFestival(festival_name, email, country, submission_deadline) {
    return insertRow("festivals", {
      festival_name,
      email,
      country,
      submission_deadline: normalizeDate(submission_deadline),
      sent: false
    });
  }

  function textValue(formData, key) {
    return String(formData.get(key) || "").trim();
  }

  function findCountry(formData) {
    return textValue(formData, "country") || textValue(formData, "location") || "Unknown";
  }

  async function handleFormSubmit(form, event) {
    event.preventDefault();

    const status = form.querySelector("[data-form-status]");
    const button = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    const category = textValue(formData, "category");
    const email = textValue(formData, "email");
    const name = textValue(formData, "name");
    const subject = textValue(formData, "subject");
    const country = findCountry(formData);
    const timeline = textValue(formData, "timeline");
    const mediaName = textValue(formData, "media_name") || name || subject;
    const festivalName = textValue(formData, "festival_name") || subject || name;
    const mode = form.dataset.supabaseMode || "";

    if (status) {
      status.textContent = "Sending...";
    }

    if (button) {
      button.disabled = true;
    }

    try {
      if (mode === "press") {
        await savePressContact(email, mediaName, country);
      } else if (mode === "festival") {
        await saveFestival(festivalName, email, country, timeline || textValue(formData, "submission_deadline"));
      } else if (category === "Press") {
        await savePressContact(email, mediaName, country);
      } else if (category === "Booking") {
        await saveFestival(festivalName, email, country, timeline);
      } else {
        await saveFan(email, name || mediaName, country);
      }

      const params = new URLSearchParams();
      params.set("type", "contact");
      params.set("sent", "supabase");
      window.location.href = `/success.html?${params.toString()}`;
      return;
    } catch (error) {
      console.error("[Supabase] Form handling error:", error.message);
      if (status) {
        status.textContent = "Supabase save failed. Using backup submission flow.";
      }
    } finally {
      if (button) {
        button.disabled = false;
      }
    }

    form.submit();
  }

  function wireForms() {
    const forms = Array.from(document.querySelectorAll("form[data-supabase-form='1']"));
    forms.forEach((form) => {
      form.addEventListener("submit", (event) => handleFormSubmit(form, event));
    });
  }

  window.KamDridiSupabase = {
    init: loadConfig,
    saveFan,
    savePressContact,
    saveFestival
  };

  window.addEventListener("DOMContentLoaded", wireForms);
})();
