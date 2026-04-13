import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Task from "@/models/Task";
import Project from "@/models/Project";


export async function GET() {
  try {
    await connectDB();

    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Count completed tasks
    const tasksDone = await Task.countDocuments({
      userId,
      status: "completed",
    });

    // Count projects
    const projects = await Project.countDocuments({
      userId,
    });

    // Example streak (you can improve logic later)
    const streak = 7;

    return NextResponse.json({
      tasksDone,
      projects,
      streak,
    });
  } catch (error) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


 
 

   

   