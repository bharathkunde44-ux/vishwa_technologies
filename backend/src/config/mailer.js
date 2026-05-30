const nodemailer = require("nodemailer");

function createTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD.replace(/\s/g, ""),
    },
  });
}

function formatDetails(details) {
  return Object.entries(details)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(([key, value]) => `${key}: ${value}`)
    .join("\n");
}

function formatHtml(details) {
  const rows = Object.entries(details)
    .filter(([, value]) => value !== undefined && value !== null && value !== "")
    .map(
      ([key, value]) => `
        <tr>
          <td style="padding:10px 12px;border:1px solid #dbe3ea;font-weight:700;background:#f4f7fb">${key}</td>
          <td style="padding:10px 12px;border:1px solid #dbe3ea">${String(value)}</td>
        </tr>`
    )
    .join("");

  return `
    <div style="font-family:Arial,sans-serif;color:#172026">
      <h2 style="margin:0 0 16px;color:#0c43a2">THRINAINA Electronic Security System</h2>
      <table style="border-collapse:collapse;width:100%;max-width:720px">${rows}</table>
    </div>`;
}

async function sendOwnerEmail(subject, details, attachments = []) {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD || !process.env.OWNER_EMAIL) {
    console.warn("Email skipped. Configure GMAIL_USER, GMAIL_APP_PASSWORD, and OWNER_EMAIL.");
    return;
  }

  const transporter = createTransporter();
  const text = formatDetails(details);

  await transporter.sendMail({
    from: `"CCTV Service Website" <${process.env.GMAIL_USER}>`,
    to: process.env.OWNER_EMAIL,
    subject,
    replyTo: details.Email || process.env.GMAIL_USER,
    text,
    html: formatHtml(details),
    attachments,
  });
}

module.exports = {
  sendOwnerEmail,
};
