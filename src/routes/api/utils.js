"use server"
import { UAParser } from "ua-parser-js";
import nodemailer from "nodemailer"
import {createHmac} from "node:crypto"

export const getCookie = (name, cookieHeader) => {
  if (!cookieHeader) return null;

  return cookieHeader
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(name + "="))
    ?.split("=")[1] ?? null;
}

export const exctract_client_info = (request, clientAddress) => {
  const salt = process.env.IP_SECRET
  const user_agent = request.headers.get('user-agent');

  const hashed_ip = createHmac('sha256', salt).update(clientAddress).digest('hex')
  const parser = new UAParser(user_agent);
  const uaResult = parser.getResult();

  return {
    ip_address: hashed_ip,
    user_agent,
    browser: `${uaResult.browser.name || 'unknown'}`,
    browser_version: uaResult.browser.version || 'unknown',
    os: `${uaResult.os.name || 'unknown'}`,
    os_version: uaResult.os.version || 'unknown',
    device_type: uaResult.device.type || 'desktop',
    device_vendor: uaResult.device.vendor || 'unknown',
    device_model: uaResult.device.model || 'unknown',
  };
}

const send_email = async (to, subject, html, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: process.env.EMAIL_FROM,
        pass: process.env.EMAIL_SECRET
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: `"Artra" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
      text
    };

    await transporter.sendMail(mailOptions);
    return { status: 200 };
  } catch (err) {
    console.error(err);
    return { status: 500, message: 'მეილის გაგზავნა ვერ მოხერხდა, ხელახლა სცადეთ.' };
  }
};


export const send_verification_code = async (target, code) => {
  const html = `
  <div style="max-width:500px;margin:0 auto;font-family:Arial,sans-serif;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <div style="text-align:center;background:#C05A50;color:white;padding:25px;">
      <h1 style="margin:0;font-size:28px;">Artra</h1>
      <p style="opacity:0.9;margin-top:5px;">ელფოსტის ვერიფიკაცია</p>
    </div>
    <div style="padding:30px;background:#f9f9f9;text-align:center;">
      <p style="color:#333;margin-bottom:20px;">გთხოვთ შეიყვანოთ ეს კოდი ვერიფიკაციის გვერდზე:</p>

      <div style="display:inline-block;background:white;border:2px dashed #E98074;padding:25px;border-radius:8px;">
        <span style="font-size:32px;font-weight:bold;letter-spacing:8px;color:#E85A4F;font-family:monospace;">
          ${code}
        </span>
      </div>

      <p style="margin-top:20px;font-size:14px;color:#856404;background:#fff3cd;border:1px solid #ffeaa7;padding:12px;border-radius:5px;">
        <strong>კოდი მოქმედებს 30 წუთის განმავლობაში.</strong>
      </p>
    </div>
  </div>
  `;

  const text = `თქვენი ვერიფიკაციის კოდია: ${code}\nკოდი მოქმედებს 30 წუთის განმავლობაში.`;

  return await send_email(target, "ვერიფიკაციის კოდი - Artra", html, text);
};

export const send_verification_link = async (target, link) => {
  const html = `
  <div style="max-width:500px;margin:0 auto;font-family:Arial,sans-serif;border:1px solid #eee;border-radius:8px;overflow:hidden;">
    <div style="text-align:center;background:#C05A50;color:white;padding:25px;">
      <h1 style="margin:0;font-size:28px;">Artra</h1>
      <p style="opacity:0.9;margin-top:5px;">ელფოსტის დადასტურება</p>
    </div>
    <div style="padding:30px;background:#f9f9f9;text-align:center;">
      <p style="color:#333;margin-bottom:20px;">გთხოვთ დაადასტუროთ თქვენი ელ.ფოსტა ამ ბმულზე:</p>

      <a href="${link}" style="display:inline-block;padding:15px 25px;background:#E98074;color:white;text-decoration:none;font-weight:bold;border-radius:5px;">
        დაადასტურე ელფოსტა
      </a>

      <p style="margin-top:20px;font-size:14px;color:#856404;">
        ბმული მოქმედებს 30 წუთის განმავლობაში.
      </p>
    </div>
  </div>
  `;

  const text = `გთხოვთ დაადასტუროთ თქვენი ელ.ფოსტა ამ ბმულზე: ${link}\nბმული მოქმედებს 30 წუთის განმავლობაში.`;

  return await send_email(target, "ელფოსტის დადასტურება - Artra", html, text);
};
