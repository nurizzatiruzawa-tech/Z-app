import { db } from "@/lib/server/db";
import { subscriptions } from "@/lib/server/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET(request: Request) {
  try {
    if (!db) {
      return Response.json([]);
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId") || "demo_user";

    const allSubs = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .orderBy(desc(subscriptions.createdAt));

    return Response.json(allSubs);
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!db) {
      return Response.json(
        { error: "Database not connected" },
        { status: 503 }
      );
    }

    const body = await request.json();
    const {
      userId = "demo_user",
      name,
      price,
      currency = "USD",
      category = "Entertainment",
      billingCycle = "monthly",
      renewalDate,
      remindDaysBefore = 3,
      paymentMethod = "Visa •••• 4242",
      cardColor = "#F7D267",
      iconColor = "#6366f1",
      logoType = "generic",
      notes,
    } = body;

    if (!name || price === undefined || !renewalDate) {
      return Response.json(
        { error: "Name, price, and renewalDate are required" },
        { status: 400 }
      );
    }

    const inserted = await db
      .insert(subscriptions)
      .values({
        userId,
        name,
        price: String(price),
        currency,
        category,
        billingCycle,
        renewalDate,
        remindDaysBefore: Number(remindDaysBefore),
        paymentMethod,
        cardColor,
        iconColor,
        logoType,
        notes: notes || null,
        isActive: true,
      })
      .returning();

    return Response.json(inserted[0], { status: 201 });
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 });
  }
}
