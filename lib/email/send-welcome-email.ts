import { logger } from "@/lib/logging/logger"

interface WelcomeEmailParams {
  toEmail: string
  fullName: string
  temporaryPassword: string
}

export async function sendLearnerWelcomeEmail({
  toEmail,
  fullName,
  temporaryPassword,
}: WelcomeEmailParams): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.EMAIL_FROM || "Advantcore Academy <onboarding@advantcore.co>"
  const appBaseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://advantcore-academy.vercel.app"
  const loginUrl = `${appBaseUrl}${process.env.NEXT_PUBLIC_BASE_PATH || "/academy"}`

  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Advantcore Academy</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f2; margin: 0; padding: 24px; color: #15231f; }
    .container { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #dce2dc; box-shadow: 0 4px 12px rgba(0,0,0,0.04); }
    .header { background: #183f35; padding: 32px 24px; text-align: center; color: #ffffff; }
    .logo { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
    .badge { display: inline-block; background: #c5efd9; color: #153e33; font-size: 10px; font-weight: 700; padding: 3px 8px; border-radius: 9999px; margin-left: 6px; letter-spacing: 1px; }
    .content { padding: 32px 28px; line-height: 1.6; }
    h1 { font-size: 22px; font-weight: 700; color: #15231f; margin-top: 0; margin-bottom: 16px; }
    p { font-size: 14px; color: #4a5550; margin: 0 0 16px; }
    .credentials-box { background: #f7f9f6; border: 1px solid #dce2dc; border-radius: 12px; padding: 20px; margin: 24px 0; }
    .cred-row { font-size: 13px; margin-bottom: 8px; }
    .cred-row:last-child { margin-bottom: 0; }
    .cred-label { font-weight: 600; color: #68736e; display: inline-block; width: 140px; }
    .cred-value { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-weight: 700; color: #15231f; background: #eef2ed; padding: 2px 6px; border-radius: 4px; }
    .btn { display: inline-block; background: #183f35; color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; margin: 8px 0 20px; }
    .footer { background: #fafbfa; border-top: 1px solid #eef2ed; padding: 20px 24px; font-size: 12px; color: #8ba49b; text-align: center; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">Advantcore <span class="badge">ACADEMY</span></div>
      <div style="font-size: 12px; color: #c5efd9; margin-top: 6px;">Professional Career Learning & Virtual Workplace</div>
    </div>

    <div class="content">
      <h1>Welcome, ${fullName}</h1>
      <p>Your workspace on Advantcore Academy has been provisioned. You can now access your structured curriculum, BCS Business Analysis pathway, project deliverables, and team meetings.</p>
      
      <div class="credentials-box">
        <div class="cred-row">
          <span class="cred-label">Email Address:</span>
          <span class="cred-value">${toEmail}</span>
        </div>
        <div class="cred-row">
          <span class="cred-label">Temporary Password:</span>
          <span class="cred-value">${temporaryPassword}</span>
        </div>
      </div>

      <div style="text-align: center;">
        <a href="${loginUrl}" class="btn">Sign In to Your Workspace &rarr;</a>
      </div>

      <p style="font-size: 12px; color: #68736e; text-align: center;">
        <em>For security, you will be prompted to set your own personal password upon initial sign-in.</em>
      </p>
    </div>

    <div class="footer">
      &copy; 2026 Advantcore Ltd &middot; Registered in England &amp; Wales<br>
      Manchester Digital Studio &middot; UK GDPR Compliant
    </div>
  </div>
</body>
</html>
`

  if (!apiKey) {
    logger.warn("RESEND_API_KEY not configured. Welcome email logged to console.", {
      toEmail,
      fullName,
      loginUrl,
    })
    return { success: true }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject: "Welcome to Advantcore Academy - Your Account Credentials",
        html: htmlContent,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      logger.error("Failed to send welcome email via Resend", { error: errorData })
      return { success: false, error: "Failed to dispatch email via Resend" }
    }

    logger.info("Welcome email successfully dispatched to learner", { toEmail })
    return { success: true }
  } catch (error) {
    logger.error("Exception sending welcome email", {
      error: error instanceof Error ? error.message : "Unknown error",
    })
    return { success: false, error: "Exception while sending email" }
  }
}
