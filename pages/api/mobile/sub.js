import { connectDB } from "@/util/connectDB";

export default async function handler(req, res) {
  const db = (await connectDB).db("todo");

  if (req.method === "GET") {
    const result = await db
      .collection("data")
      .findOne({ user: "rudals782@nate.com" });
    return res
      .status(200)
      .json(result.category[req.query.parent].sub[req.query.clickIex]);
  } else {
    console.log(req.body, "바디");
    const collection = db.collection("data");
    const query = {
      user: "rudals782@nate.com",
      [`category.${req.body.parent}.sub`]: {
        $elemMatch: { _id: req.body.sub_id },
      },
    };
    if (req.body.api === "description") {
      const update = {
        $set: {
          [`category.${req.body.parent}.sub.${req.body.clickIex}.description`]:
            req.body.description,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
    if (req.body.api === "title") {
      const update = {
        $set: {
          [`category.${req.body.parent}.sub.${req.body.clickIex}.subContent`]:
            req.body.subContent,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
  }
}
