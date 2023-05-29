import { connectDB } from "@/util/connectDB";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const db = (await connectDB).db("todo");

  if (req.method === "GET") {
    // console.log(req.query, "쿼리");
    const result = await db
      .collection("data")
      // .findOne({ _id: new ObjectId("646a518c17c99e113e86ff48") });
      .findOne({ user: "rudals782@nate.com" });
    return res
      .status(200)
      .json(result.category[req.query.parent].sub[req.query.click]);
  } else {
    console.log(req.body, "바디");
    const collection = db.collection("data");
    const query = {
      // _id: new ObjectId("646a518c17c99e113e86ff48"),
      user: "rudals782@nate.com",
      [`category.${req.body.parent}.sub`]: {
        $elemMatch: { _id: req.body.sub_id },
      },
    };
    if (req.body.api === "description") {
      const update = {
        $set: {
          [`category.${req.body.parent}.sub.${req.body.click}.description`]:
            req.body.description,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
    if (req.body.api === "title") {
      const update = {
        $set: {
          [`category.${req.body.parent}.sub.${req.body.click}.subContent`]:
            req.body.subContent,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
    if (req.body.api === "color") {
      const existingData = await collection.findOne({
        [`category.${req.body.parent}.sub.${req.body.click}.label.idx`]:
          req.body.colorData.idx,
      });
      console.log(existingData, "dddddddd");
      if (existingData) {
        console.log("중복된 데이터가 이미 존재합니다.");
        return;
      }
      const update = {
        $push: {
          [`category.${req.body.parent}.sub.${req.body.click}.label`]:
            req.body.colorData,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
    if (req.body.api === "upDatecolor") {
      const update = {
        $set: {
          [`category.${req.body.parent}.sub.${req.body.click}.label.${req.body.colorData.index}`]:
            req.body.colorData,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }

    const result = await db.collection("data").updateOne(
      // { _id: new ObjectId("646a518c17c99e113e86ff48") },
      { user: "rudals782@nate.com" },
      {
        $pull: { [`category`]: { _id: req.body._id } },
      }
    );

    if (req.body.api === "delete") {
      const update = {
        $pull: {
          [`category.${req.body.parent}.sub.${req.body.click}.label`]: {
            idx: req.body.colorData.idx,
          },
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
    if (req.body.api === "addlabel") {
      const update = {
        $set: {
          [`category.${req.body.parent}.sub.${req.body.click}.labelList`]:
            req.body.labelList,
        },
      };
      const result = await collection.updateOne(query, update);
      return res.status(200).json(result);
    }
  }
}
