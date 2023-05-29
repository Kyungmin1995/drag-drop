import { connectDB } from "@/util/connectDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = (await connectDB).db("todo");
  console.log(req.body, "삭제 입력값");

  if (req.body.api === "sub") {
    const result = await db.collection("data").updateOne(
      // { _id: new ObjectId("646a518c17c99e113e86ff48") },
      { user: "rudals782@nate.com" },
      {
        $pull: { [`category.${req.body.parent}.sub`]: { _id: req.body._id } },
      }
    );
    return res.status(200).json(result);
  }

  const result = await db.collection("data").updateOne(
    // { _id: new ObjectId("646a518c17c99e113e86ff48") },
    { user: "rudals782@nate.com" },
    {
      $pull: { [`category`]: { _id: req.body._id } },
    }
  );
  return res.status(200).json(result);
}
