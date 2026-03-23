export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    // TODO: wire to Resend audience
    console.log("[subscribe] new email:", email);
    return Response.json({ success: true });
  } catch {
    return Response.json({ success: false }, { status: 400 });
  }
}
