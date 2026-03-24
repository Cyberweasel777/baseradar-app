import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ ok: false, error: 'missing email' });

    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      console.error('[subscribe] RESEND_API_KEY not set');
      return NextResponse.json({ ok: true }); // silent fail so UI still shows success
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'BaseRadar <intelligence@baseradar.app>',
        to: [email],
        subject: "You're in — BaseRadar daily intelligence",
        text: "You're subscribed to BaseRadar daily ecosystem intelligence. Top movers, signal events, and momentum shifts — every morning. Visit baseradar.app for today's rankings.",
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error('[subscribe] Resend error:', err);
      return NextResponse.json({ ok: false, error: 'resend_failed' });
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[subscribe] unexpected error:', e);
    return NextResponse.json({ ok: false, error: 'unexpected' });
  }
}
