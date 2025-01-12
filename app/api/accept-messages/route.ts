import { auth } from "@/auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export const POST = auth(async function POST(req) {
  await dbConnect();

  const user = req.auth?.user;

  if (!user) {
    return Response.json(
      {
        success: false,
        message: "Not Authentication",
      },
      { status: 401 }
    );
  }

  const userId = user?._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      {
        isAcceptingMessage: acceptMessages,
      },
      {
        new: true,
      }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: "Failed to update user status to accept messages.",
        },
        { status: 401 }
      );
    } else {
      return Response.json(
        {
          success: true,
          message: "Messages acceptance status updated successfully.",
          updatedUser,
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.log("An unexpected error:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to update user status to accept messages.",
      },
      { status: 500 }
    );
  }
}) as any;

export const GET = auth(async function GET(req) {
  await dbConnect();

  const user = req.auth?.user;

  if (!user) {
    return Response.json(
      {
        success: false,
        message: "Not Authentication",
      },
      { status: 401 }
    );
  }

  const userId = user?._id;
  try {
    const foundUser = await UserModel.findById(userId);

    if (!foundUser) {
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
        isAcceptingMessages: foundUser.isAcceptingMessage,
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("Cannot get user's message acceptance status.", error);
    return Response.json(
      {
        success: false,
        message: "Cannot get user's message acceptance status.",
      },
      { status: 500 }
    );
  }
}) as any;
