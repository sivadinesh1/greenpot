import { getLoginSession } from "../../../lib/auth";
import { getUser } from "../../../service/auth/auth.service";

export default async function user(req, res) {
  try {
    const session = await getLoginSession(req);
    // const user = (session && (await getUser(session))) ?? null;

    res.status(200).json({ session });
  } catch (error) {
    console.error(error);
    res.status(500).end("Authentication token is invalid, please log in");
  }
}