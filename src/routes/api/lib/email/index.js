"use server"
/**
 * Outbound email.
 *
 * One entry point, two transports, chosen by EMAIL_PROVIDER:
 *
 *   resend  (default)  the Resend API - what production uses
 *   smtp               a plain SMTP server - what the local and E2E test
 *                      environments use, pointed at Mailpit so a test can read
 *                      what was actually delivered
 *
 * The application code does not know which is active: send_verification_code
 * and send_verification_link call send_email and get the same {status} shape
 * back either way.
 *
 * No credential is read anywhere but here, and none has a default.
 */
import { Resend } from "resend"
import nodemailer from "nodemailer"

const PROVIDER = (process.env.EMAIL_PROVIDER || "resend").toLowerCase()

/**
 * The From address.
 *
 * Resend will only accept a sender on a domain verified in the Resend account,
 * so this cannot be an arbitrary mailbox - see docs/EMAIL.md in the artra-e2e
 * repository for the one-time setup. Replies are steered separately, which is
 * how a support address on a domain you do not control still receives answers.
 */
const FROM = process.env.EMAIL_FROM || "Artra <onboarding@resend.dev>"
const REPLY_TO = process.env.EMAIL_REPLY_TO || undefined

let resendClient
let smtpTransport

const resend = () => {
  if (!resendClient) {
    if (!process.env.RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not set - required when EMAIL_PROVIDER=resend")
    }
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

/**
 * SMTP transport, created once and reused.
 *
 * Deliberately unauthenticated by default: the only SMTP server this is ever
 * pointed at is the disposable one inside the test stack. If SMTP_USER is set
 * it is used, so the same path also works against a real relay - including
 * Resend's own SMTP endpoint - without a code change.
 */
const smtp = () => {
  if (!smtpTransport) {
    smtpTransport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "127.0.0.1",
      port: Number(process.env.SMTP_PORT || 1025),
      secure: process.env.SMTP_SECURE === "true",
      ignoreTLS: process.env.SMTP_SECURE !== "true",
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    })
  }
  return smtpTransport
}

export const send_email = async (to, subject, html, text) => {
  try {
    if (PROVIDER === "smtp") {
      await smtp().sendMail({ from: FROM, replyTo: REPLY_TO, to, subject, html, text })
      return { status: 200 }
    }

    const { error } = await resend().emails.send({
      from: FROM,
      replyTo: REPLY_TO,
      to: [to],
      subject,
      html,
      text,
    })

    // The Resend SDK reports delivery failures in the response rather than by
    // throwing, so this branch is the one that actually catches a rejected
    // sender domain or an exhausted quota.
    if (error) throw new Error(`${error.name}: ${error.message}`)

    return { status: 200 }
  } catch (err) {
    console.error(`ERROR_WHILE_SENDING_EMAIL (provider=${PROVIDER}):`, err)
    return { status: 500, message: 'მეილის გაგზავნა ვერ მოხერხდა, ხელახლა სცადეთ.' }
  }
}
