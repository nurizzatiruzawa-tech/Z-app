import { pgTable, serial, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

export const subscriptions = pgTable("subscriptions", {
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
  paymentMethod: text("payment_method").default("Visa •••• 4242"),
  cardColor: text("card_color").default("#F7D267"),
  iconColor: text("icon_color").default("#6366f1"),
  logoType: text("logo_type").default("generic"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const feedbacks = pgTable("feedbacks", {
  id: serial("id").primaryKey(),
  userId: text("user_id"),
  userEmail: text("user_email"),
  rating: integer("rating"),
  category: text("category").default("general"),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
export type Feedback = typeof feedbacks.$inferSelect;
export type NewFeedback = typeof feedbacks.$inferInsert;
