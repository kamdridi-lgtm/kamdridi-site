import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(req: Request) {
  try {
    const { item, sessionId } = await req.json();
    
    // If no Stripe secret key, use the static payment link to prevent crashing
    if (!process.env.STRIPE_SECRET_KEY) {
      const fallbackUrl = process.env.NEXT_PUBLIC_STRIPE_LINK_COLLECTOR || "https://buy.stripe.com/test_...";
      return NextResponse.json({ url: fallbackUrl });
    }

    let itemName = "Collector Artifact";
    let amount = 9900;

    if (item.includes("Salieri's Hands")) {
       itemName = "Salieri's Hands Collector Edition";
       amount = 25000;
    } else if (item.includes("UNlive in Brasil")) {
       itemName = "UNlive in Brasil Collector";
       amount = 15000;
    } else if (item === 'VIP_PASS') {
       itemName = "Myriam VIP Vault Pass";
       amount = 9900;
    } else {
       itemName = item;
       amount = 9900;
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://kamdridi.com';
    const successUrl = `${baseUrl}/myriam?success=true`;
    const cancelUrl = `${baseUrl}/myriam?canceled=true`;

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
    });

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      line_items: [{ 
        price_data: {
          currency: 'usd',
          product_data: { name: itemName },
          unit_amount: amount
        },
        quantity: 1 
      }],
      metadata: { 
        type: 'MYRIAM_STORE',
        item: itemName,
        sessionId: sessionId || ''
      }
    };

    const session = await stripe.checkout.sessions.create(sessionParams);
    
    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('Stripe Checkout Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
