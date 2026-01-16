"use server"
import { UAParser } from "ua-parser-js";
import nodemailer from "nodemailer"
import { createHmac } from "node:crypto"
import { redisHGetAll } from "./lib/redis/hash";
import { redis } from "./redis";
import { redisDel } from "./lib/redis/basic";
import { publish_to_device } from "../../server/utils"
import { pool } from "./db";

export const getCookie = (name, cookieHeader) => {
  if (!cookieHeader) return null;

  return cookieHeader
    .split(";")
    .map(c => c.trim())
    .find(c => c.startsWith(name + "="))
    ?.split("=")[1] ?? null;
}

export const exctract_client_info = (request, clientAddress) => {
  const ip_salt = process.env.IP_SECRET
  const user_agent = request.headers.get('user-agent');

  const hashed_ip = createHmac('sha256', ip_salt).update(clientAddress).digest('hex')
  const parser = new UAParser(user_agent);
  const result = parser.getResult()

  const signature = [
    result.device.type || 'უცნობი',
    result.device.vendor || 'უცნობი',
    result.device.model || 'უცნობი',
    result.browser.name || 'უცნობი',
    result.cpu.architecture || 'უცნობი'
  ].join("|");

  const signature_salt = process.env.SIGNATURE_SECRET
  const device_fingerprint = createHmac('sha256', signature_salt).update(signature).digest('hex')

  return {
    ip_address: hashed_ip,
    user_agent,
    browser: result.browser.name || 'უცნობი',
    browser_version: result.browser.version || 'უცნობი',
    os: result.os.name || 'უცნობი',
    os_version: result.os.version || 'უცნობი',
    device_type: result.device.type || 'უცნობი',
    device_vendor: result.device.vendor || 'უცნობი',
    device_model: result.device.model || 'უცნობი',
    device_fingerprint
  };
}

const send_email = async (to, subject, html, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE,
      auth: {
        user: import.meta.env.VITE_EMAIL,
        pass: process.env.EMAIL_SECRET
      },
    });

    await transporter.verify();

    const mailOptions = {
      from: `"Artra" <${import.meta.env.VITE_EMAIL}>`,
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
      <p style="opacity:0.9;margin-top:5px;">პაროლის აღდგენა</p>
    </div>
    <div style="padding:30px;background:#f9f9f9;text-align:center;">
      <p style="color:#333;margin-bottom:20px;">გთხოვთ გადახვიდეთ ბმულზე პაროლის აღსადგენად</p>

      <a href="${link}" style="display:inline-block;padding:15px 25px;background:#E98074;color:white;text-decoration:none;font-weight:bold;border-radius:5px;">
        ბმულზე გადასვლა
      </a>

      <p style="margin-top:20px;font-size:14px;color:#856404;">
        ბმული მოქმედებს 30 წუთის განმავლობაში.
      </p>
    </div>
  </div>
  `;

  const text = `გთხოვთ გადახვიდეთ ბმულზე პაროლის აღსადგენად: ${link}\nბმული მოქმედებს 30 წუთის განმავლობაში.`;

  return await send_email(target, "პაროლის აღდგენა - Artra", html, text);
};

export const get_client_ip = (request) => {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();

  const real = request.headers.get("x-real-ip");
  if (real) return real;

  return request.socket?.remoteAddress || "0.0.0.0";
}

export const get_temporary_device = async (id) => {
  try {
    const { status, remember_me, type, user_id, device_id, email, name, ...rest } = await redisHGetAll(`pending:verification:${id}`)
    if (!status || status !== 'pending') new Response(JSON.stringify({ message: 'დაფიქსირდა შეცდომა.' }), {
      status: 500,
      headers: {
        "Content-Type": 'application/json'
      }
    })
    return new Response(JSON.stringify({ ...rest }), {
      status: 200,
      headers: {
        "Content-Type": 'application/json'
      }
    })
  } catch (error) {
    console.log(error)
  }
}

export const format_to_time = (date) => {
  const lastUsedDate = new Date(date);
  const now = new Date();
  const diffMs = now - lastUsedDate;

  const diffMinutes = Math.floor(diffMs / 1000 / 60);
  const diffHours = Math.floor(diffMs / 1000 / 60 / 60);
  const diffDays = Math.floor(diffMs / 1000 / 60 / 60 / 24);

  if (diffMinutes < 1) return "ახლანდელი";
  if (diffMinutes < 60) return `${diffMinutes} წუთის წინ`;
  if (diffHours < 24) return `${diffHours} საათის წინ`;
  return `${diffDays} დღის წინ`;
}

export const logout_all_devices = async (user_id) => {
  try {
    const sessions = await redis.sMembers(`user:sessions:${user_id}`)
    
    for (const sid of sessions) {
      await pool.query(`
        UPDATE user_devices
          SET session_id=null
        WHERE user_id=$1 
      `, [user_id])
      await redisDel(`user:session:${sid}`) 
    }

    await redisDel(`user:sessions:${user_id}`)
    await publish_to_device(user_id)
    return true
  } catch (error) {
    console.log(error)
    return false
  }
}

export const logout_other_devices = async (user_id, current_session, device_id) => {
  try {
    const sessions = await redis.sMembers(`user:sessions:${user_id}`)
    
    for (const sid of sessions.filter((sess) => sess !== current_session)) {
      await redisDel(`user:session:${sid}`) 
      await pool.query(`
        UPDATE user_devices
          SET session_id=null
        WHERE user_id=$1 AND id!=$2 
      `, [user_id, device_id])
      await redis.sRem(`user:sessions:${user_id}`, sid)
    }

    redis.expire(`user:sessions:${user_id}`, 14 * 86400)
    await publish_to_device(user_id, device_id)
    return true
  } catch (error) {
    return false
  } 
}

export const get_course_level = (level = 'beginner') => {
  return level === 'advanced' ? 'რთული' : level === 'intermediate' ? 'საშუალო' : 'დამწყები'
}