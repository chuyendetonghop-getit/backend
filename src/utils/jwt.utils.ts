import config from "config";
import jwt from "jsonwebtoken";

const theSecret = config.get<string>("theSecret");

export function signJwt(object: Object, options?: jwt.SignOptions | undefined) {
  return jwt.sign(object, theSecret, {
    ...(options && options),
    algorithm: "HS256",
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, theSecret);
    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (e: any) {
    console.error(e);
    return {
      valid: false,
      expired: e.message === "jwt expired",
      decoded: null,
    };
  }
}
