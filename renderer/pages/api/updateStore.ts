import type { NextApiHandler } from "next";
import { getSession } from "next-auth/react";
import fs from "fs";

const StoreUpdateHandler: NextApiHandler = async (req, res) => {
  // const session = await getServerSession(req, res, authOptions);
  const session = await getSession({ req });

  console.log('==== Update Store ====');
  console.log("req", req);
  console.log("session", session);
  const data = {
    session
  }

  fs.writeFile("store.json", JSON.stringify(data), (err) => {
    if (err) console.log(err);
    else {
      console.log("File written successfully\n");
      console.log("The written has the following contents:");
      console.log(fs.readFileSync("store.json", "utf8"));
    }
  });

  res.status(200).json({ status: "update succeeded" });
};

export default StoreUpdateHandler;
