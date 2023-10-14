import { connectDB } from "@/util/connectDB";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  const db = (await connectDB).db("todo");
  if (req.method === "GET") {
    const result = await db
      .collection("data")
      .findOne({ user: "rudals782@nate.com" });
    return res.status(200).json(result);
  }
  console.log(req.body, "페이로드22");

  const collection = db.collection("data");
  const filter = { user: "rudals782@nate.com" };

  const update = {
    $push: {
      [`category.${req.body.idx}.sub`]: {
        _id: new ObjectId().toHexString(),
        subContent: req.body.subContent,
        star: req.body.star || false,
        label: [],
        labelList: [],
        mode: req.body.mode || false,
      },
    },
  };
  const result = await collection.updateOne(filter, update);
  return res.status(200).json(result);
}
