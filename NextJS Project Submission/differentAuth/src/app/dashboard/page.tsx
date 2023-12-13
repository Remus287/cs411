import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import User from "@/models/User";
import connect from "@/utils/db";

const Dashboard = async () => {
  const session = await getServerSession();
  if (!session) {
    redirect("/");
  }
  await connect();
  const sessionData = await User.findOne({ email: session.user?.email });
  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">
      Dashboard
      Hello, {sessionData.email}
    </div>
  );
};

export default Dashboard;