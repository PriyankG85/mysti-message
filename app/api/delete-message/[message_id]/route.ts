import { auth } from "@/auth";
import UserModel from "@/models/User";

export const DELETE = auth(async function DELETE(req, { params }: any) {
  const { message_id } = await params;
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

  try {
    const updatedUser = await UserModel.updateOne(
      {
        _id: user._id,
      },
      {
        $pull: {
          messages: {
            _id: message_id,
          },
        },
      }
    );

    if (updatedUser.modifiedCount === 0) {
      return Response.json(
        { success: false, message: "Message not found." },
        { status: 404 }
      );
    } else if (updatedUser.modifiedCount > 0) {
      return Response.json(
        { success: true, message: "Message deleted." },
        {
          status: 200,
        }
      );
    }
  } catch (error) {
    return Response.json(
      { success: false, message: "Something went wrong." },
      { status: 500 }
    );
  }
}) as any;
