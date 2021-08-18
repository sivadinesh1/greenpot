import Local from "passport-local";
import { validatePassword } from "./user";
 import {getUserByEmail} from '../service/auth/auth.service'

export const localStrategy = new Local.Strategy(async function (
  username,
  password,
  done,
) {
    const user= await  getUserByEmail(username)
    if (user && validatePassword(user, password)) {
        done(null, user);
      } else {
        if(user)
             done(new Error("Invalid username and password combination"));
        else
            done(new Error("User Not Found"));
      }

});
