import { connectDB } from "@/util/connectDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = (await connectDB).db("todo");
  const collection = db.collection("data");
  // const filter = { _id: new ObjectId("646a518c17c99e113e86ff48") };
  const filter = { user: "rudals782@nate.com" };

  const update = {
    $set: {
      [`category`]: req.body,
    },
  };
  const result = await collection.updateOne(filter, update);

  return res.status(200).json(result);
}
