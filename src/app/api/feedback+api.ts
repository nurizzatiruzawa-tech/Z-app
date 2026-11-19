import { db } from "@/lib/server/db";
import { feedbacks } from "@/lib/server/db/schema";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, userEmail, rating, category, message } = body;

    if (!message) {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    if (db) {
      const [inserted] = await db.insert(feedbacks).values({
        userId: userId ?? "anonymous",
        userEmail: userEmail ?? null,
        rating: rating ?? null,
        category: category ?? "general",
        message,
      }).returning();
      return Response.json({ feedback: inserted }, { status: 201 });
    }

    return Response.json({ success: true, message: "Feedback received!" }, { status: 201 });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
