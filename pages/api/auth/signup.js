import { connectDB } from "@/util/connectDB";
import bcrypt from "bcrypt";

export default async function handler(req, res) {
  const hash = await bcrypt.hash(req.body.password, 10);
  req.body.password = hash;
  const db = (await connectDB).db("todo");
  const filter = await db
    .collection("user_cred")
    .findOne({ email: req.body.email });

  if (filter) {
    return res.status(200).json({ message: "이미존재하는 이메일입니다" });
  }
  await db.collection("user_cred").insertOne(req.body);

  return res.status(302).redirect("/api/auth/signin");
}
