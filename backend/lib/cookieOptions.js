export const cookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  credentials: true,
  maxAge: 7 * 24 * 60 * 60 * 1000,
};