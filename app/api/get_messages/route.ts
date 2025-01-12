import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import mongoose from "mongoose";

export const GET = auth(async function GET(req) {
  await dbConnect();

  const user = req.auth?.user;

  if (!req.auth || !user) {
    return Response.json(
      {
        success: false,
        message: "Not Authentication",
      },
      { status: 401 }
    );
  }

  const userId = new mongoose.Types.ObjectId(user?._id);

  try {
    const foundUser = await UserModel.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $unwind: {
          path: "$messages",
          includeArrayIndex: "string",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $sort: {
          "messages.createdAt": -1,
        },
      },
      {
        $group: {
          _id: "$_id",
          messages: {
            $push: "$messages",
          },
        },
      },
    ]);

    if (!foundUser || foundUser.length === 0) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: foundUser[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Failed to get user's messages.", error);
    return Response.json(
      {
        success: false,
        message: "Failed to user's messages.",
      },
      { status: 500 }
    );
  }
}) as any;
