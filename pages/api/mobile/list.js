import { connectDB } from "@/util/connectDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = (await connectDB).db("todo");

  if (req.method === "GET") {
    const result = await db
      .collection("data")
      .findOne({ user: "rudals782@nate.com" });
    return res.status(200).json(result);
  } else {
    const collection = db.collection("data");
    const query = {
      user: "rudals782@nate.com",
    };
    if (req.body.api === "title") {
      const update = {
        $set: {
          [`category.${req.body.idx}.title`]: req.body.title,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
    if (req.body.api === "subTitle") {
      const update = {
        $set: {
          [`category.${req.body.parent}.sub.${req.body.clickIex}.subContent`]:
            req.body.subContent,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
    if (req.body.api === "mode") {
      const update = {
        $set: {
          [`category.${req.body.parent}.sub.${req.body.clickIex}.mode`]:
            req.body.mode,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
    const update = {
      $push: {
        [`category`]: {
          _id: new ObjectId().toHexString(),
          title: req.body.title,
          sub: [],
        },
      },
    };
    const result = await collection.updateOne(query, update);
    return res.status(200).json(result);
  }
}
