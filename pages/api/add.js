import { connectDB } from "@/util/connectDB";
import { ObjectId } from "mongodb";
export default async function handler(req, res) {
  const db = (await connectDB).db("todo");
  if (req.method === "GET") {
    const result = await db
      .collection("data")
      // .findOne({ _id: new ObjectId("646a518c17c99e113e86ff48") });
      .findOne({ user: "rudals782@nate.com" });
    return res.status(200).json(result);
  }
  //   console.log(req.body, "페이로드");
  const collection = db.collection("data");
  // const filter = { _id: new ObjectId("646a518c17c99e113e86ff48") };
  const filter = { user: "rudals782@nate.com" };

  const update = {
    $push: {
      [`category.${req.body.idx}.sub`]: {
        _id: new ObjectId().toHexString(),
        star: req.body.star || false,
        subContent: req.body.subContent,
        label: [],
        labelList: [],
      },
    },
  };
  const result = await collection.updateOne(filter, update);
  return res.status(200).json(result);
  return res.status(200).json(req.body);
}
