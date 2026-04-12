import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import Author from "../models/Author.js";
import { generateJWT } from "../utils/jwt.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { email, given_name, family_name, sub, picture } = profile._json;

        let author = await Author.findOne({ email });

        if (!author) {
          author = await Author.create({
            name: given_name,
            surname: family_name,
            email: email,
            googleId: sub,
            avatar: picture,
          });
          await author.save();
        }

        const token = await generateJWT({ id: author.id });
        return done(null, { token });
      } catch (error) {
        return done(error, null);
      }
    },
  ),
);
