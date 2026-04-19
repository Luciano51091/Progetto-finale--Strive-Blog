import express from "express";
import { login, getMe } from "../controllers/auth.js";
import { authentication } from "../middleware/authentication.js";
import passport from "passport";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.get("/me", authentication, getMe);
authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
authRouter.get("/google/callback", passport.authenticate("google", { session: false }), (req, res) => {
  const { token } = req.user;
  res.redirect(`${process.env.FRONTEND_HOST}/login?token=${token}`);
});

export default authRouter;
