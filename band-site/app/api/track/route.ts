import { NextResponse } from 'next/server';
import { logVisit } from '@/lib/tracker';

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for') || 'Unknown';
    const country = req.headers.get('x-vercel-ip-country') || 'Unknown';
    const city = req.headers.get('x-vercel-ip-city') || 'Unknown';
    const body = await req.json().catch(() => ({ path: '/' }));
    const path = body.path || '/';

    await logVisit(ip, country, city, path);
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ ok: false });
  }
}
