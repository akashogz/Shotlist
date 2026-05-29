import { Resend } from "resend";
import fs from "fs";
import path from "path";

const resend = new Resend(process.env.RESEND_API_KEY);

const BACKEND_URL =
  process.env.NODE_ENV === "production"
    ? "https://www.shotlist.uk"
    : "http://localhost:3000";

export const sendVerificationEmail = async (email, token) => {
  const verifyUrl = `${BACKEND_URL}/api/auth/verify/${token}`;

  const templatePath = path.join(process.cwd(), "src", "lib", "verifyEmail.html");
  let html = fs.readFileSync(templatePath, "utf8");
  html = html.replace("{{verification_url}}", verifyUrl);

  await resend.emails.send({
    from: "Shotlist <no-reply@shotlist.uk>",
    to: email,
    subject: "Verify your Shotlist account",
    html,
  });
};
