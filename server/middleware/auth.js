import passport from "passport";

export const authenticateToken = passport.authenticate("jwt", {
  session: false,
});
