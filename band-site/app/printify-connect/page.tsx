export const dynamic = "force-dynamic";

export default function PrintifyConnectPage() {
  const action = "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/printify-token-setup?setup=a8f19a0badea6d6d8a0b2a9f77a512a4b1a03af77402f546";

  return (
    <main style={{ minHeight: "100vh", background: "#0b0b0b", color: "#fff", padding: "48px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <h1 style={{ fontSize: 32, marginBottom: 18 }}>Connect Printify to KAM DRIDI</h1>
        <p style={{ fontSize: 18, lineHeight: 1.5 }}>
          Paste the Printify Personal Access Token below. It will be validated directly against Printify and stored only in the private server secrets table.
        </p>
        <form method="POST" action={action} style={{ marginTop: 24 }}>
          <input type="hidden" name="setup" value="a8f19a0badea6d6d8a0b2a9f77a512a4b1a03af77402f546" />
          <label htmlFor="token" style={{ display: "block", marginBottom: 8, fontWeight: 700 }}>Printify token</label>
          <input
            id="token"
            name="token"
            type="password"
            autoComplete="off"
            required
            style={{ width: "100%", boxSizing: "border-box", padding: 15, borderRadius: 8, border: "1px solid #555", background: "#171717", color: "#fff", fontSize: 17 }}
          />
          <button
            type="submit"
            style={{ width: "100%", marginTop: 14, padding: 15, border: 0, borderRadius: 8, background: "#16a34a", color: "#fff", fontSize: 18, fontWeight: 700, cursor: "pointer" }}
          >
            Connect Printify
          </button>
        </form>
        <p style={{ color: "#aaa", marginTop: 20 }}>Required scopes: shops.read, products.read, orders.read, orders.write, webhooks.read, webhooks.write.</p>
      </div>
    </main>
  );
}
