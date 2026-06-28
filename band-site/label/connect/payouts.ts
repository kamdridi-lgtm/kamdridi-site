import { getStripeServer } from "@/lib/stripe";
import { getLabelApplication, updateLabelApplication } from "@/lib/label-storage";

export async function createArtistConnectAccount(artistId: string, origin: string) {
  const app = await getLabelApplication(artistId);
  if (!app) throw new Error("Artist not found.");
  const stripe = getStripeServer();

  if (!stripe) {
    const simulatedAccountId = `acct_sim_${artistId.slice(-8)}`;
    await updateLabelApplication(artistId, { stripeAccountId: simulatedAccountId });
    return {
      mode: "simulated",
      accountId: simulatedAccountId,
      url: `${origin}/label/artist?connect=simulated`
    };
  }

  const account = await stripe.accounts.create({
    type: "express",
    email: app.email,
    business_type: "individual",
    metadata: {
      labelArtistId: app.id,
      artistName: app.artistName
    }
  });

  await updateLabelApplication(artistId, { stripeAccountId: account.id });

  const link = await stripe.accountLinks.create({
    account: account.id,
    refresh_url: `${origin}/label/artist?connect=refresh`,
    return_url: `${origin}/label/artist?connect=complete`,
    type: "account_onboarding"
  });

  return { mode: "stripe", accountId: account.id, url: link.url };
}

export async function payArtistRoyalties(artistId: string) {
  const app = await getLabelApplication(artistId);
  if (!app) throw new Error("Artist not found.");
  if (app.status !== "signed") throw new Error("Artist must be signed before payout.");
  if (app.payableRoyaltiesCents <= 0) throw new Error("No payable royalties available.");

  const stripe = getStripeServer();
  if (!stripe || !app.stripeAccountId || app.stripeAccountId.startsWith("acct_sim_")) {
    await updateLabelApplication(artistId, { payableRoyaltiesCents: 0 });
    return {
      mode: "simulated",
      amount: app.payableRoyaltiesCents,
      transferId: `tr_sim_${Date.now()}`
    };
  }

  const transfer = await stripe.transfers.create({
    amount: app.payableRoyaltiesCents,
    currency: "cad",
    destination: app.stripeAccountId,
    metadata: {
      labelArtistId: app.id,
      artistName: app.artistName
    }
  });

  await updateLabelApplication(artistId, { payableRoyaltiesCents: 0 });
  return { mode: "stripe", amount: app.payableRoyaltiesCents, transferId: transfer.id };
}
