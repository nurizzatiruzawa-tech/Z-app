require("dotenv").config();
const { neon } = require("@neondatabase/serverless");
const { drizzle } = require("drizzle-orm/neon-http");
const { pgTable, serial, text, integer, boolean, timestamp } = require("drizzle-orm/pg-core");

const subscriptions = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  name: text("name").notNull(),
  price: text("price").notNull(),
  currency: text("currency").notNull().default("USD"),
  category: text("category").notNull().default("Entertainment"),
  billingCycle: text("billing_cycle").notNull().default("monthly"),
  renewalDate: text("renewal_date").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  remindDaysBefore: integer("remind_days_before").default(3),
  cardColor: text("card_color").default("#F7D267"),
  iconColor: text("icon_color").default("#6366f1"),
  logoType: text("logo_type").default("generic"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

const DEMO_SUBSCRIPTIONS = [
  {
    userId: "demo_user",
    name: "Adobe Creative Cloud",
    price: "77.49",
    currency: "USD",
    category: "Design",
    billingCycle: "monthly",
    renewalDate: "2026-06-25",
    remindDaysBefore: 3,
    cardColor: "#F7D267",
    iconColor: "#000000",
    logoType: "adobe",
    notes: "All Apps photography & design suite",
    isActive: true,
  },
  {
    userId: "demo_user",
    name: "Open AI",
    price: "42.25",
    currency: "USD",
    category: "Productivity",
    billingCycle: "monthly",
    renewalDate: "2026-06-05",
    remindDaysBefore: 3,
    cardColor: "#BFDCF6",
    iconColor: "#0f172a",
    logoType: "openai",
    notes: "ChatGPT Plus & API usage credits",
    isActive: true,
  },
  {
    userId: "demo_user",
    name: "Medium",
    price: "13.08",
    currency: "USD",
    category: "Productivity",
    billingCycle: "monthly",
    renewalDate: "2026-06-12",
    remindDaysBefore: 2,
    cardColor: "#C4E4D8",
    iconColor: "#000000",
    logoType: "medium",
    notes: "Unlimited membership reading",
    isActive: true,
  },
  {
    userId: "demo_user",
    name: "Spotify",
    price: "5.99",
    currency: "USD",
    category: "Music",
    billingCycle: "monthly",
    renewalDate: "2026-11-18",
    remindDaysBefore: 2,
    cardColor: "#D7F0DC",
    iconColor: "#1DB954",
    logoType: "spotify",
    notes: "Student Premium subscription",
    isActive: true,
  },
  {
    userId: "demo_user",
    name: "Notion",
    price: "12.00",
    currency: "USD",
    category: "Productivity",
    billingCycle: "monthly",
    renewalDate: "2026-11-20",
    remindDaysBefore: 2,
    cardColor: "#EFE8DE",
    iconColor: "#000000",
    logoType: "notion",
    notes: "Workspace Plus plan",
    isActive: true,
  },
  {
    userId: "demo_user",
    name: "Dropbox",
    price: "10.00",
    currency: "USD",
    category: "Cloud",
    billingCycle: "monthly",
    renewalDate: "2026-12-18",
    remindDaysBefore: 5,
    cardColor: "#D8E8F8",
    iconColor: "#0061FF",
    logoType: "dropbox",
    notes: "Cloud backup storage",
    isActive: true,
  },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.log("No DATABASE_URL found in .env, skipping database seed (local mock active).");
    return;
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Seeding subscriptions into Neon Database...");
  for (const item of DEMO_SUBSCRIPTIONS) {
    await db.insert(subscriptions).values(item);
  }
  console.log("Seeding completed successfully!");
}

seed().catch((err) => {
  console.error("Seed failed:", err.message);
  process.exit(1);
});
