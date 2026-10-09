import { NextResponse } from 'next/server';
import { getDemographics } from '@/lib/tracker';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getDemographics();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to fetch demographics' }, { status: 500 });
  }
}
