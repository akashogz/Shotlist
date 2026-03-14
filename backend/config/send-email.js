import { Resend } from "resend";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `https://shotlist.onrender.com/api/auth/verify/${token}`;

  const templatePath = path.join(process.cwd(), "lib", "verifyEmail.html");

  let html = fs.readFileSync(templatePath, "utf8");
  html = html.replace("{{verification_url}}", verifyUrl);

  await resend.emails.send({
    from: "Shotlist <no-reply@shotlist.uk>",
    to: email,
    subject: "Verify your Shotlist account",
    html: html,
  });
};