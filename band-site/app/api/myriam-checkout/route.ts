import { NextResponse } from 'next/server';
import type Stripe from 'stripe';
import { getStripeServer } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const { item, sessionId, gender, sleeves, printSides, imageUrl, logos } = payload;
    const requestedItem = typeof item === "string" ? item : "";
    
    // Never simulate or redirect to a generic payment link: the requested item and
    // amount must remain bound to a server-created Stripe Checkout Session.
    const stripe = getStripeServer();
    if (!stripe) {
      return NextResponse.json(
        { error: "Secure checkout is not configured yet." },
        { status: 503 }
      );
    }

    let itemName = "Collector Artifact";
    let amount = 9900;
    let orderType = 'MYRIAM_STORE';

    if (requestedItem === 'Echoes Forge Custom Merch') {
       orderType = 'kamdridi-custom-merch';
       itemName = `Echoes Forge Custom T-Shirt (${gender || 'men'}, ${sleeves || 'short'} sleeve)`;
       let basePrice = 45;
       if (sleeves === 'long') basePrice += 10;
       if (printSides === 'both') basePrice += 15;
       amount = basePrice * 100; // in cents
    } else if (requestedItem.includes("Salieri's Hands")) {
       itemName = "Salieri's Hands Collector Edition";
       amount = 25000;
    } else if (requestedItem.includes("UNlive in Brasil")) {
       itemName = "UNlive in Brasil Collector";
       amount = 15000;
    } else if (requestedItem === 'VIP_PASS') {
       itemName = "Myriam VIP Vault Pass";
       amount = 9900;
    } else {
       itemName = requestedItem || "Collector Artifact";
       amount = 9900;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kamdridi.com';
    const successUrl = `${baseUrl}/myriam?success=true`;
    const cancelUrl = `${baseUrl}/myriam?canceled=true`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      integration_identifier: "kamdridi_myriam_jpnqveta",
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      shipping_address_collection: orderType === 'kamdridi-custom-merch' ? {
        allowed_countries: ["US", "CA", "GB", "FR", "DE", "AU"]
      } : undefined,
      line_items: [{ 
        price_data: {
          currency: 'usd',
          product_data: { 
            name: itemName,
            images: imageUrl ? [imageUrl] : undefined
          },
          unit_amount: amount
        },
        quantity: 1 
      }],
      metadata: { 
        type: orderType,
        orderType: orderType, // for the webhook to intercept
        item: itemName,
        sessionId: sessionId || '',
        ...(orderType === 'kamdridi-custom-merch' ? {
          gender: gender || 'men',
          sleeves: sleeves || 'short',
          printSides: printSides || 'front',
          imageUrl: imageUrl || '',
          logos: logos || '0'
        } : {})
      }
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: "Unable to start secure checkout. Please try again." }, { status: 500 });
  }
}
