import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { ObjectId } from "mongodb";
import { getCollection } from "../db/connection.js";

const configurePassport = (passport) => {
  const options = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  passport.use(
    new JwtStrategy(options, async (payload, done) => {
      try {
        const users = getCollection("users");
        const user = await users.findOne({ _id: new ObjectId(payload.userId) });

        if (user) {
          return done(null, { userId: user._id, username: user.username });
        }
        return done(null, false);
      } catch (error) {
        return done(error, false);
      }
    })
  );
};

export default configurePassport;
