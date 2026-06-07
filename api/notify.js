/**
 * POST /api/notify  — sends Yasir a realtime email when a learner submits the
 * Skill-Fit quiz or sends a message. Runs as a Vercel Serverless Function
 * (Node), so the email provider key never touches the browser.
 *
 * Required Vercel env vars (Project → Settings → Environment Variables):
 *   RESEND_API_KEY  — your Resend API key (https://resend.com, free tier)
 *   NOTIFY_EMAIL    — where alerts go (e.g. yasirbashirai@gmail.com)
 * Optional:
 *   NOTIFY_FROM     — verified sender (default: "LearnwithYasir <onboarding@resend.dev>")
 *
 * Until you verify your own domain in Resend, keep the default NOTIFY_FROM —
 * Resend lets you send from onboarding@resend.dev to your own account email.
 */

const escapeHtml = (s = "") =>
  String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.NOTIFY_FROM || "LearnwithYasir <onboarding@resend.dev>";

  if (!apiKey || !to) {
    // Misconfigured on the server — don't break the user's flow, just report it.
    return res.status(200).json({ ok: false, skipped: "email-not-configured" });
  }

  // Body may arrive parsed (Vercel) or as a raw string — handle both.
  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  const type = body.type === "message" ? "message" : "quiz";
  const name = String(body.name || "Someone").slice(0, 120);
  const email = String(body.email || "").slice(0, 200);
  const phone = String(body.phone || "").slice(0, 60);
  const message = String(body.message || "").slice(0, 2000);
  const summaryLines = Array.isArray(body.summary) ? body.summary.slice(0, 40) : [];
  // Optional PDF attachment ({ filename, contentBase64 }).
  const att = body.attachment;
  const attachments =
    att && typeof att.contentBase64 === "string" && att.contentBase64.length < 8_000_000
      ? [{ filename: String(att.filename || "report.pdf").slice(0, 120), content: att.contentBase64 }]
      : undefined;

  const subject =
    type === "message"
      ? `📩 New message from ${name} — LearnwithYasir`
      : `🎯 New Skill-Fit quiz lead: ${name}`;

  const rows = [
    ["Name", name],
    ["Email", email],
    phone ? ["Phone", phone] : null,
  ].filter(Boolean);

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#0F2E27;max-width:560px">
      <div style="border-bottom:3px solid #288672;padding-bottom:8px;margin-bottom:14px">
        <div style="font-size:12px;color:#A67B30;font-weight:700;letter-spacing:.5px">
          ${type === "message" ? "NEW MESSAGE" : "NEW SKILL-FIT LEAD"}
        </div>
        <div style="font-size:20px;font-weight:800">LearnwithYasir</div>
      </div>
      <table style="font-size:14px;border-collapse:collapse">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:3px 12px 3px 0;color:#64748B">${k}</td><td style="padding:3px 0"><b>${escapeHtml(
                v
              )}</b></td></tr>`
          )
          .join("")}
      </table>
      ${
        message
          ? `<p style="margin-top:14px;font-size:14px"><b>Message:</b><br/>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>`
          : ""
      }
      ${
        summaryLines.length
          ? `<div style="margin-top:14px"><div style="font-size:13px;color:#165A4C;font-weight:700;margin-bottom:4px">Their result</div>
             <ul style="font-size:13px;margin:4px 0;padding-left:18px">${summaryLines
               .map((l) => `<li>${escapeHtml(l)}</li>`)
               .join("")}</ul></div>`
          : ""
      }
      <p style="margin-top:18px;font-size:12px;color:#64748B">Sent automatically from learnwith.yasirbashir.com</p>
    </div>`;

  try {
    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email || undefined,
        subject,
        html,
        attachments,
      }),
    });

    if (!r.ok) {
      const detail = await r.text();
      return res.status(200).json({ ok: false, error: detail.slice(0, 300) });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(200).json({ ok: false, error: String(e).slice(0, 300) });
  }
}
