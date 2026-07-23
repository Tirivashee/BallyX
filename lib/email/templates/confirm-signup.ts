// Plain template-literal functions rather than external .html files read
// via fs — a runtime fs.readFileSync isn't traced by Vercel's serverless
// bundler and is a known "works locally, ENOENTs in prod" trap. Mirrors
// how lib/actions/contact.ts already inlines its email body as a string.
export function confirmSignupEmail({
  confirmUrl,
  email,
}: {
  confirmUrl: string;
  email: string;
}): { html: string; text: string } {
  const text = [
    `Confirm your BallyX account (${email})`,
    "",
    "Click the link below to confirm your email address:",
    confirmUrl,
    "",
    "If you didn't create this account, you can ignore this email.",
  ].join("\n");

  const html = `
    <p>Confirm your BallyX account (${email}).</p>
    <p><a href="${confirmUrl}">Confirm your email address</a></p>
    <p>If you didn't create this account, you can ignore this email.</p>
  `.trim();

  return { html, text };
}

export function existingAccountNoticeEmail({ signinUrl }: { signinUrl: string }): {
  html: string;
  text: string;
} {
  const text = [
    "Someone just tried to sign up for a BallyX account using this email address.",
    "",
    "If that was you, you already have an account — sign in here:",
    signinUrl,
    "",
    "If it wasn't you, no action is needed and no account was created.",
  ].join("\n");

  const html = `
    <p>Someone just tried to sign up for a BallyX account using this email address.</p>
    <p>If that was you, you already have an account — <a href="${signinUrl}">sign in here</a>.</p>
    <p>If it wasn't you, no action is needed and no account was created.</p>
  `.trim();

  return { html, text };
}
