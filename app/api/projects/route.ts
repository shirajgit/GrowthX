import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Project from "@/models/Project";

// GET all projects
export async function GET() {
  await connectDB();
  const projects = await Project.find().sort({ createdAt: -1 });
  return NextResponse.json(projects);
}

// CREATE project
export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();

  const project = await Project.create(body);

  return NextResponse.json(project);
}