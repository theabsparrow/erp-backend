import type { CookieOptions } from "express";
import jwt from "jsonwebtoken";
import config from "../../config/index.js";

export const createToken = (
  payload: object,
  secret: string,
  expiresIn: string,
) => {
  return jwt.sign(payload, secret, { expiresIn } as jwt.SignOptions);
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const cookieOptions: CookieOptions = {
  secure: config.node_env === "production",
  httpOnly: true,
  sameSite: config.node_env === "production" ? "none" : "lax",
} as const;
