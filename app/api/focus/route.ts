import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

import Task from "@/models/Task";
import Project from "@/models/Project";
import Job from "@/models/Job";

import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET() {
  try {
    await connectDB();

    const tasks = await Task.find({ status: "todo" }).limit(5);
    const projects = await Project.find().limit(3);
    const jobs = await Job.find().limit(3);

    // 🧠 Build prompt
    const prompt = `
You are a smart productivity assistant.

User data:
- Tasks: ${tasks.map((t) => t.title).join(", ") || "None"}
- Projects: ${projects.map((p) => p.name).join(", ") || "None"}
- Jobs applied: ${jobs.length}

Give:
1. Top 3 focus actions for today
2. One short motivational message

Respond ONLY in JSON like:
{
  "focus": ["task1", "task2", "task3"],
  "message": "short message"
}
`;

    // 🔥 OpenAI Call
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a helpful productivity assistant." },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
    });

    const text = response.choices[0].message?.content || "{}";

    // 🛡️ Safe JSON Parse
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        focus: ["Start your most important task"],
        message: "Stay consistent 🚀",
      };
    }

    return NextResponse.json(data);

  } catch (error) {
    console.error("AI Focus Error:", error);

    return NextResponse.json({
      focus: ["Plan your day", "Work on tasks", "Stay consistent"],
      message: "AI temporarily unavailable ⚠️",
    });
  }
}