import dbConnect from "@/lib/dbConnect";
import UserModel from "@/models/User";

export async function POST(req: Request) {
  await dbConnect();

  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verificationCode === code;
    const isCodeExpired = user.verificationCodeExpiry < new Date();

    if (isCodeValid && !isCodeExpired) {
      user.isVerified = true;
      await user.save();

      return Response.json(
        {
          success: true,
          message: "Code verified.",
        },
        { status: 200 }
      );
    } else if (isCodeExpired) {
      return Response.json(
        {
          success: false,
          message: "Verification code expired, please try again.",
        },
        { status: 500 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "Verification code is invalid.",
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}
