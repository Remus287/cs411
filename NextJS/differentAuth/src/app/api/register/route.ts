import User from "@/models/User";
import connect from "@/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export const POST = async (request: any) => {
  const { email, password } = await request.json();

  await connect();

  const existingUser = await User.findOne({ email });


  // fix this to not just return different status codes but another parameter
  if (existingUser) {
    if (existingUser.GoogleAccount == true){
      return new NextResponse("You have a Google account", {status: 400 + 1 });
    }
    else{
      return new NextResponse("Email is already in use", { status: 400 + 0 });
    }
  }


  const hashedPassword = await bcrypt.hash(password, 5);
  const newUser = new User({
    email,
    password: hashedPassword,
    GoogleAccount: false,
  });

  try {
    await newUser.save();
    return new NextResponse("user is registered", { status: 200 });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
