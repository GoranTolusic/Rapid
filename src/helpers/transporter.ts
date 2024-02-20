import nodemailer from "nodemailer"

// create reusable transporter object using the default SMTP transport
export const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP_HOST ?? "smtp.ethereal.email", //this should be real email address
  port: parseInt(process.env.EMAIL_SMTP_PORT ?? "587", 10),
  secure: true,
  auth: {
    user: process.env.EMAIL_SMTP_USER ?? "",
    pass: process.env.EMAIL_SMTP_PASSWORD ?? "",
  },
})
