import Local from "passport-local";
import { validatePassword } from "./user";
import {getUserByEmail} from '../../src/pages/api/auth/common'

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

//   findUser({ email })
//     .then((user) => {
//       if (user && validatePassword(user, password)) {
//         done(null, user);
//       } else {
//         done(new Error("Invalid username and password combination"));
//       }
//     })
//     .catch((error) => {
//       done(error);
//     });
});
