import { connectDB } from "@/util/connectDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = (await connectDB).db("todo");

  if (req.method === "POST") {
    if (req.body.comment === "") return res.status(500).json("에러발생");
    const result = await db.collection("comment").insertOne(req.body);
    return res.status(200).json(result);
  }
  const result = await db
    .collection("comment")
    .find({
      parentId: req.query.parentId,
    })
    .toArray();

  return res.status(200).json(result);
}
