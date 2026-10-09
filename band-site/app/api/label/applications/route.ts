import { NextResponse } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { createLabelApplication, listLabelApplications, updateLabelApplication } from "@/lib/label-storage";
import { requireLabelAdmin } from "@/lib/label-auth";
import { sendLabelEmail } from "@/label/notifications/email_system";
import { checkRateLimit, verifyRecaptchaSimulation } from "@/label/security/backup";
import { storeLabelFile } from "@/lib/label-file-storage";
import type { LabelDemoFile } from "@/lib/label-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireLabelAdmin();
    return NextResponse.json({ applications: await listLabelApplications() });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unauthorized." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    const rate = await checkRateLimit(`label-apply:${ip}`, 20, 60 * 60 * 1000);
    if (!rate.allowed) return NextResponse.json({ error: "Too many submissions. Try again later." }, { status: 429 });

    const form = await request.formData();
    if (!verifyRecaptchaSimulation(String(form.get("recaptchaToken") || ""))) {
      return NextResponse.json({ error: "Spam protection failed." }, { status: 400 });
    }
    const demos = (await Promise.all([
      storeLabelFile(form.get("demo1") as File | null, "demos"),
      storeLabelFile(form.get("demo2") as File | null, "demos")
    ])).filter(Boolean) as LabelDemoFile[];

    if (demos.length < 2) {
      return NextResponse.json({ error: "Two demo audio files are required." }, { status: 400 });
    }

    const artistName = String(form.get("artistName") || "").trim();
    const legalName = String(form.get("legalName") || "").trim();
    const email = String(form.get("email") || "").trim().toLowerCase();
    const bio = String(form.get("bio") || "").trim();
    const links = String(form.get("links") || "").trim();
    const contractAccepted = String(form.get("contractAccepted")) === "true";

    if (!artistName || !legalName || !email || !bio || !links || !contractAccepted) {
      return NextResponse.json({ error: "Complete artist info and contract acceptance are required." }, { status: 400 });
    }

    const stripe = getStripeServer();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const app = await createLabelApplication({
      artistName,
      legalName,
      email,
      bio,
      links,
      demos,
      contractAccepted,
      paymentStatus: stripe ? "unpaid" : "simulated",
      status: stripe ? "awaiting_payment" : "pending_review"
    });

    if (!stripe) {
      await sendLabelEmail({ event: "application_received", to: process.env.LABEL_ADMIN_EMAILS?.split(",")[0] || "contact@kamdridi.com" });
      return NextResponse.json({
        mode: "simulated",
        application: app,
        message: "Application submitted in simulation mode. Status is Pending Review."
      });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      success_url: `${siteUrl}/label/apply?submitted=paid&application=${app.id}`,
      cancel_url: `${siteUrl}/label/apply?submitted=cancelled&application=${app.id}`,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "cad",
            unit_amount: Number(process.env.LABEL_APPLICATION_FEE_CENTS || 2000),
            product_data: {
              name: "KAMDRIDI RECORDS Label Submission Fee",
              metadata: { labelApplicationId: app.id }
            }
          }
        }
      ],
      metadata: {
        type: "label_application",
        labelApplicationId: app.id,
        artistName: app.artistName,
        artistEmail: app.email
      }
    });

    await updateLabelApplication(app.id, { stripeSessionId: session.id });
    await sendLabelEmail({ event: "application_received", to: process.env.LABEL_ADMIN_EMAILS?.split(",")[0] || "contact@kamdridi.com" });
    return NextResponse.json({ mode: "stripe", application: app, url: session.url });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Application failed." }, { status: 500 });
  }
}
