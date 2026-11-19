import { db } from "@/lib/server/db";
import { subscriptions } from "@/lib/server/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!db) {
      return Response.json({ error: "Database not connected" }, { status: 503 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid subscription ID" }, { status: 400 });
    }

    const body = await request.json();
    const updated = await db
      .update(subscriptions)
      .set({
        ...body,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, id))
      .returning();

    if (updated.length === 0) {
      return Response.json({ error: "Subscription not found" }, { status: 404 });
    }

    return Response.json(updated[0]);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!db) {
      return Response.json({ error: "Database not connected" }, { status: 503 });
    }

    const id = parseInt(params.id, 10);
    if (isNaN(id)) {
      return Response.json({ error: "Invalid subscription ID" }, { status: 400 });
    }

    await db.delete(subscriptions).where(eq(subscriptions.id, id));

    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
