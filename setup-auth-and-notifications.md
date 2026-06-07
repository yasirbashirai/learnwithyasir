# Setup: verification emails, Google branding & lead alerts

This covers the parts that live in **dashboards** (Resend, Supabase, Google,
Vercel), not in the code. Do these once and everything the code now expects will
work. One free **Resend** account powers both your signup verification emails
*and* the realtime "new lead" alerts to your inbox.

---

## 0) Resend account (do this first — needed by #1 and #3)

1. Sign up at <https://resend.com> (free tier: 3,000 emails/month, 100/day).
2. **Domains → Add Domain → `yasirbashir.com`.** Resend shows a few DNS records
   (SPF, DKIM, and usually a return-path CNAME). Add them in your domain's DNS
   (Hostinger). Wait for status to turn **Verified** (usually minutes).
   - Verifying the domain is required so your emails come from
     `noreply@yasirbashir.com` and actually land in inboxes (not spam).
3. **API Keys → Create API Key** → copy it (starts with `re_…`). Keep it secret.

---

## 1) Signup verification emails that actually deliver  (Supabase SMTP)

Your signup *code* is correct — Supabase's built-in email is just rate-limited to
a few messages/hour and often silently drops them. Point Supabase at Resend:

1. Supabase Dashboard → your project → **Authentication → Emails → SMTP Settings**
   → **Enable Custom SMTP** and fill in:
   - **Host:** `smtp.resend.com`
   - **Port:** `465`
   - **Username:** `resend`
   - **Password:** *your Resend API key* (`re_…`)
   - **Sender email:** `noreply@yasirbashir.com`  (must be on the verified domain)
   - **Sender name:** `Learn With Yasir`
2. **Authentication → Providers → Email** → make sure **Confirm email** is **ON**.
3. **Authentication → URL Configuration:**
   - **Site URL:** `https://learnwith.yasirbashir.com`
   - **Redirect URLs:** add `https://learnwith.yasirbashir.com/**`
     (and `http://localhost:5173/**` for local dev).
4. (Optional) **Authentication → Rate Limits** → raise the email limit now that a
   real provider is sending.

Test: open the live site → Create account → check the inbox. The verification
email should arrive within seconds from `noreply@yasirbashir.com`.

---

## 2) Google login showing your name instead of `…supabase.co`

On the "Choose an account to continue to **X**" screen, **X** is the host of the
OAuth callback. Two layers:

**A. Free — branding (App name + logo).** Google Cloud Console → **APIs &
Services → OAuth consent screen**:
- **App name:** `Learn With Yasir`
- **User support email**, **App logo**
- **App domain / Homepage:** `https://learnwith.yasirbashir.com`
- **Authorized domains:** `yasirbashir.com`

Make sure Supabase uses **your own** Google OAuth client (not a shared one):
Google Cloud → **Credentials → OAuth client ID (Web)** → copy Client ID/Secret
into Supabase → **Authentication → Providers → Google**. In that Google client's
**Authorized redirect URIs**, add the callback Supabase shows you
(`https://ardqeqtyxfymmikkjudx.supabase.co/auth/v1/callback`).

> After this, the screen reads **"Learn With Yasir wants to continue to
> ardqeqtyxfymmikkjudx.supabase.co"** — your brand + logo show, but the host is
> still the Supabase one.

**B. To replace `…supabase.co` entirely — Supabase Custom Domain (paid).**
Supabase → **Settings → Custom Domains** (~$10/mo add-on). Set e.g.
`auth.yasirbashir.com`, then update the Google redirect URI to
`https://auth.yasirbashir.com/auth/v1/callback`. Now the screen reads
**"…to continue to auth.yasirbashir.com"**. This is the only way to remove the
supabase.co text; the branding in step A is free and usually enough.

---

## 3) Realtime "new lead" alerts to your inbox  (Vercel env vars)

The site now calls a serverless function (`/api/notify.js`) that emails you via
Resend whenever someone finishes the quiz and taps **Submit to Yasir**.

Vercel → project **learnwithyasir-vl8h** → **Settings → Environment Variables**
(add for Production + Preview):

| Name | Value |
|------|-------|
| `RESEND_API_KEY` | your Resend key (`re_…`) |
| `NOTIFY_EMAIL`   | `yasirbashirai@gmail.com` (where alerts go) |
| `NOTIFY_FROM`    | `Learn With Yasir <noreply@yasirbashir.com>` *(optional; needs the verified domain)* |

Then redeploy: `vercel --prod` (your sites don't auto-deploy on push).

Test: take the quiz on the live site → **Submit to Yasir** → you get an email
with their name, contact details and a summary of their result.

> Before the Resend domain is verified you can leave `NOTIFY_FROM` unset — it
> falls back to `onboarding@resend.dev`, which Resend allows to send only to your
> own account email (fine for testing).

---

## What changed in the code (already done)

- **Quiz now requires login** (`/quiz` is gated) and **auto-saves each result**
  to Supabase `quiz_leads`, tied to the signed-in user's name & email.
- **Submit to Yasir** prefills name/email from the account, adds an optional
  message box, and triggers the realtime email via `/api/notify`.
- **Smarter evaluation:** every result now includes a **personalised next-steps
  plan** that adapts to the person's time, budget, tech comfort and goal — shown
  on screen and in the downloadable PDF.
