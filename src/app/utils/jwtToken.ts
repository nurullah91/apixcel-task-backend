import jwt, { JwtPayload } from "jsonwebtoken";

import AppError from "../errors/AppError";

export type TJwtPayload = {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  phone: string;
  address: string;
  profilePhoto?: string;
  coverPhoto?: string;
  status?: "active" | "blocked";
  passwordChangedAt?: Date;
};

export const createToken = (
  jwtPayload: TJwtPayload,
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(jwtPayload, secret, {
    expiresIn,
  });
};

export const verifyToken = (
  token: string,
  secret: string
): JwtPayload | Error => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch {
    throw new AppError(401, "You are not authorized!");
  }
};
