import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default function ProtectedLayout({ children }: any) {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return children;
}