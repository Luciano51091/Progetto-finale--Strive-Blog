import jwt from "jsonwebtoken";

export const generateJWT = (payload) => {
  return new Promise((resolve, reject) =>
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1d" }, (err, token) => {
      if (err) reject(err);
      else resolve(token);
    }),
  );
};
