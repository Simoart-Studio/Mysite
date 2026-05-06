'use server';

import nodemailer from 'nodemailer';

export interface SendEmailPayload {
  name:        string;
  email:       string;
  projectType: string;
  message:     string;
}

export async function sendEmail(data: SendEmailPayload): Promise<{ ok: boolean }> {
  const transporter = nodemailer.createTransport({
    host:   'smtp.gmail.com',
    port:   587,
    secure: false,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
    tls: { rejectUnauthorized: false },
  });

  await transporter.sendMail({
    from:    `"Portfolio" <${process.env.GMAIL_USER}>`,
    to:      process.env.GMAIL_USER,
    replyTo: `"${data.name}" <${data.email}>`,
    subject: `Nowe zapytanie od ${data.name}`,
    text: [
      `Od: ${data.name} <${data.email}>`,
      `Projekt: ${data.projectType || '—'}`,
      '',
      data.message,
    ].join('\n'),
    html: `
      <p><strong>Od:</strong> ${data.name} &lt;${data.email}&gt;</p>
      <p><strong>Projekt:</strong> ${data.projectType || '—'}</p>
      <hr/>
      <p>${data.message.replace(/\n/g, '<br/>')}</p>
    `,
  });

  return { ok: true };
}
