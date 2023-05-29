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
  } else {
    if (req.body.api === "title") {
      console.log(req.body);
      const collection = db.collection("data");
      const query = {
        // _id: new ObjectId("646a518c17c99e113e86ff48"),
        user: "rudals782@nate.com",
      };
      const update = {
        $set: {
          [`category.${req.body.idx}.title`]: req.body.title,
        },
      };

      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
    const collection = db.collection("data");
    // const filter = { _id: new ObjectId("646a518c17c99e113e86ff48") };
    const filter = { user: "rudals782@nate.com" };
    const update = {
      $push: {
        [`category`]: {
          _id: new ObjectId().toHexString(),
          title: req.body.title,
          sub: [],
        },
      },
    };
    const result = await collection.updateOne(filter, update);
    return res.status(200).json(result);
  }
}
