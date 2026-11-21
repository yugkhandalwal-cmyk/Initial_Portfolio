import nodemailer from "nodemailer";
import { links, profile, stats } from "../src/data.js";

const CONTACT_EMAIL = profile.email;
const esc = (value) => String(value).replace(/[&<>"']/g, (character) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[character]));
const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const deliveryError = (error) => {
  if (error.code === "EAUTH" || error.responseCode === 535)
    return "Gmail rejected the SMTP sign-in. Create a fresh Google App Password and make sure SMTP_USER is that same Gmail account.";
  if (["ECONNECTION", "ESOCKET", "ETIMEDOUT"].includes(error.code))
    return "Could not connect to Gmail SMTP. Check the server's internet access and try again.";
  return "Could not deliver your message. Please try again or email me directly.";
};
const safeLine = (value) => value.replace(/[\r\n]+/g, " ").trim();
const messageHtml = (message) => esc(message).replace(/\r\n?|\n/g, "<br>");
const messageText = (message) => message.replace(/\r\n?/g, "\n");

function emailFrame(preheader, content) {
  return `<!doctype html>
<html lang="en">
  <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="margin:0;padding:0;background:#f1f3ed;color:#24271f;font-family:Arial,Helvetica,sans-serif">
    <div style="display:none;max-height:0;overflow:hidden;opacity:0">${esc(preheader)}&nbsp;&zwnj;&nbsp;&zwnj;&nbsp;&zwnj;</div>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f1f3ed">
      <tr><td align="center" style="padding:34px 14px">
        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="width:100%;max-width:600px">
          <tr><td style="padding:0 0 16px">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td style="font-size:19px;font-weight:800;letter-spacing:-1px;color:#171a14">YK<span style="color:#78a52d">.</span></td>
                <td align="right" style="font-size:10px;letter-spacing:1.6px;text-transform:uppercase;color:#7c8174">${esc(profile.name)} · Portfolio</td>
              </tr>
            </table>
          </td></tr>
          <tr><td style="padding:34px 36px;background:#171a16;border-radius:12px 12px 0 0">
            ${content}
          </td></tr>
          <tr><td style="padding:17px 24px;background:#e6e9df;border-radius:0 0 12px 12px;color:#777c70;font-size:11px;line-height:1.6">
            Sent from <a href="mailto:${CONTACT_EMAIL}" style="color:#536b2d;text-decoration:none">${CONTACT_EMAIL}</a>
            <span style="float:right">Built with care&nbsp; · &nbsp;YK.</span>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

function ownerEmail({ name, email, message }) {
  const replyUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(`Re: Your portfolio message`)}`;
  const html = emailFrame(
    `New portfolio message from ${name}`,
    `<p style="margin:0 0 12px;color:#c4f06a;font-size:10px;font-weight:bold;letter-spacing:1.7px;text-transform:uppercase">New message</p>
     <h1 style="margin:0 0 24px;color:#f1f0eb;font-size:29px;line-height:1.2;letter-spacing:-1px">Someone reached out.</h1>
     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 18px;background:#22261f;border:1px solid #383d32;border-radius:8px">
       <tr><td style="padding:17px 18px 8px;color:#959b8b;font-size:10px;letter-spacing:1px;text-transform:uppercase">From</td></tr>
       <tr><td style="padding:0 18px 4px;color:#f1f0eb;font-size:16px;font-weight:bold">${esc(name)}</td></tr>
       <tr><td style="padding:0 18px 18px"><a href="mailto:${esc(email)}" style="color:#c4f06a;font-size:13px;text-decoration:none">${esc(email)}</a></td></tr>
     </table>
     <p style="margin:0 0 9px;color:#959b8b;font-size:10px;letter-spacing:1px;text-transform:uppercase">Their message</p>
     <div style="padding:18px;border-left:3px solid #c4f06a;border-radius:0 7px 7px 0;background:#22261f;color:#e3e5dc;font-size:14px;line-height:1.8;overflow-wrap:anywhere">${messageHtml(message)}</div>
     <table role="presentation" cellspacing="0" cellpadding="0" border="0" style="margin-top:24px">
       <tr><td style="border-radius:6px;background:#c4f06a">
         <a href="${esc(replyUrl)}" style="display:inline-block;padding:13px 20px;color:#171a14;font-size:12px;font-weight:bold;text-decoration:none">Reply to ${esc(name)} &nbsp;→</a>
       </td></tr>
     </table>`,
  );
  const text = [
    `New portfolio message from ${name}`,
    `From: ${name} <${email}>`,
    "",
    messageText(message),
    "",
    `Reply to ${email}`,
  ].join("\n");
  return { html, text };
}

function visitorEmail({ name, message }) {
  const replyUrl = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Re: Your message to ${profile.name}`)}`;
  const highlights = stats.map((stat) =>
    `<td width="33%" align="center" style="padding:12px 5px">
      <strong style="display:block;color:#c4f06a;font-size:17px">${esc(stat.value)}</strong>
      <span style="color:#a7ac9f;font-size:10px">${esc(stat.label)}</span>
    </td>`,
  ).join("");
  const socialLinks = links.slice(0, 2).map((link) =>
    `<a href="${esc(link.url)}" style="margin-right:16px;color:#c4f06a;font-size:11px;text-decoration:none">${esc(link.label)} ↗</a>`,
  ).join("");
  const html = emailFrame(
    `Thanks for getting in touch. Your message is on its way to ${profile.name}.`,
    `<p style="margin:0 0 12px;color:#c4f06a;font-size:10px;font-weight:bold;letter-spacing:1.7px;text-transform:uppercase">Message received</p>
     <h1 style="margin:0 0 16px;color:#f1f0eb;font-size:29px;line-height:1.2;letter-spacing:-1px">Thanks for reaching out, ${esc(name)}.</h1>
     <p style="margin:0 0 24px;color:#bdc1b6;font-size:14px;line-height:1.8">Your note has made it to my inbox. I appreciate you taking the time to write, and I’ll get back to you as soon as I can.</p>
     <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="margin:0 0 24px;background:#22261f;border:1px solid #383d32;border-radius:8px">
       <tr><td style="padding:18px 18px 8px;color:#c4f06a;font-size:10px;font-weight:bold;letter-spacing:1.3px;text-transform:uppercase">A little about me</td></tr>
       <tr><td style="padding:0 18px 15px;color:#d4d7cc;font-size:12px;line-height:1.8">${esc(profile.about)}</td></tr>
       <tr><td style="padding:0 10px 12px">
         <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="border-top:1px solid #383d32"><tr>${highlights}</tr></table>
       </td></tr>
       <tr><td style="padding:0 18px 17px">${socialLinks}</td></tr>
     </table>
     <p style="margin:0 0 9px;color:#959b8b;font-size:10px;letter-spacing:1px;text-transform:uppercase">A copy of your message</p>
     <div style="padding:18px;border-left:3px solid #c4f06a;border-radius:0 7px 7px 0;background:#22261f;color:#e3e5dc;font-size:13px;line-height:1.8;overflow-wrap:anywhere">${messageHtml(message)}</div>
     <p style="margin:24px 0 0;color:#bdc1b6;font-size:13px;line-height:1.8">Talk soon,<br><strong style="color:#f1f0eb">${esc(profile.name)}</strong></p>
     <p style="margin:20px 0 0"><a href="${esc(replyUrl)}" style="color:#c4f06a;font-size:12px;text-decoration:none">Need to add something? Reply to this email →</a></p>`,
  );
  const text = [
    `Thanks for reaching out, ${name}.`,
    `Your note has made it to ${profile.name}'s inbox. I appreciate you taking the time to write, and I'll get back to you as soon as I can.`,
    "",
    `A little about ${profile.name}:`,
    profile.about,
    "",
    `Highlights: ${stats.map((stat) => `${stat.value} ${stat.label}`).join(" · ")}`,
    ...links.slice(0, 2).map((link) => `${link.label}: ${link.url}`),
    "",
    "A copy of your message:",
    messageText(message),
    "",
    "Talk soon,",
    profile.name,
    `Reply to: ${CONTACT_EMAIL}`,
  ].join("\n");
  return { html, text };
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const body = req.body || {};
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";
  const website = typeof body.website === "string" ? body.website.trim() : "";

  if (website) return res.status(200).json({ ok: true });
  if (name.length < 2 || name.length > 120 || !emailOk(email) || email.length > 254 || message.length < 10 || message.length > 3000)
    return res.status(400).json({ error: "Please fill all fields correctly." });

  const { SMTP_USER, SMTP_PASS, OWNER_EMAIL } = process.env;
  if (!SMTP_USER || !SMTP_PASS) return res.status(503).json({ error: "Server email is not configured." });
  const recipient = OWNER_EMAIL || SMTP_USER;
  if (!emailOk(recipient))
    return res.status(503).json({ error: "The portfolio owner email address is not configured correctly." });

  const cleanName = safeLine(name);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: SMTP_USER, pass: SMTP_PASS },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
  });

  try {
    const notification = ownerEmail({ name: cleanName, email, message });
    await transporter.sendMail({
      from: `"${profile.name} | Portfolio" <${SMTP_USER}>`,
      to: recipient,
      replyTo: { name: cleanName, address: email },
      subject: `New portfolio message from ${cleanName}`,
      ...notification,
    });
  } catch (error) {
    console.error("Could not deliver portfolio notification:", error);
    return res.status(502).json({ error: deliveryError(error) });
  }

  try {
    const confirmation = visitorEmail({ name: cleanName, message });
    await transporter.sendMail({
      from: `"${profile.name}" <${SMTP_USER}>`,
      to: { name: cleanName, address: email },
      replyTo: CONTACT_EMAIL,
      subject: `Thanks for reaching out to ${profile.name}`,
      ...confirmation,
    });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Portfolio notification delivered, but visitor confirmation failed:", error);
    return res.status(200).json({
      ok: true,
      warning: `Your message reached Yug, but the confirmation email could not be sent. ${deliveryError(error)}`,
    });
  }
}
