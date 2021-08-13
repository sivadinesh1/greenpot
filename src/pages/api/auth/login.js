import passport from "passport";
import nextConnect from "next-connect";
import { localStrategy } from "../../../lib/passport-local";
import { setLoginSession } from "../../../lib/auth";

const authenticate = (method, req, res) =>
  new Promise((resolve, reject) => {
    // {startegymethod, AuthenticateOptions, callback}
    passport.authenticate(method, { session: false }, (error, token) => {
      if (error) {
        resolve({login:false,error:error});
      } else {
        resolve({login:true,user:token});
      }
    })(req, res);
  });

passport.use(localStrategy);

export default nextConnect()
  .use(passport.initialize())
  .post(async (req, res) => {
    try {
      const {login,user,error} = await authenticate("local", req, res);
      // session is the payload to save in the token, it may contain basic info about the user
      if(login){
          const session = { ...user };
          await setLoginSession(res, session);
          res.status(200).send({ done: true });
      }else{
        res.status(200).send({ done: login,
        error:error?.message });
      }
    } catch (error) {
      console.error(error);
      res.status(401).send(error.message);
    }
  });
