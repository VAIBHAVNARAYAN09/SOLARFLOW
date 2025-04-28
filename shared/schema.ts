import { pgTable, text, serial, integer, boolean, timestamp, date, real, time } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  role: text("role").notNull().default("user"), // user, admin, agent
  avatar: text("avatar"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  fullName: true,
  email: true,
  role: true,
  avatar: true,
});

// Ticket schema
export const tickets = pgTable("tickets", {
  id: serial("id").primaryKey(),
  subject: text("subject").notNull(),
  description: text("description").notNull(),
  status: text("status").notNull().default("open"), // open, in progress, resolved, closed
  priority: text("priority").notNull().default("medium"), // low, medium, high, critical
  category: text("category").notNull(),
  createdBy: integer("created_by").notNull(), // user ID
  assignedTo: integer("assigned_to"), // user ID, nullable
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertTicketSchema = createInsertSchema(tickets).pick({
  subject: true,
  description: true,
  status: true,
  priority: true,
  category: true,
  createdBy: true,
  assignedTo: true,
});

// Message schema for AI chat
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // user ID
  content: text("content").notNull(),
  isBot: boolean("is_bot").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMessageSchema = createInsertSchema(messages).pick({
  userId: true,
  content: true,
  isBot: true,
});

// Activity log schema
export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  ticketId: integer("ticket_id"), // can be null for non-ticket activities
  userId: integer("user_id").notNull(),
  action: text("action").notNull(), // created, updated, resolved, commented, etc.
  details: text("details"), // additional details about the activity
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertActivitySchema = createInsertSchema(activities).pick({
  ticketId: true,
  userId: true,
  action: true,
  details: true,
});

// Solar System schema - for storing user's solar installation details
export const solarSystems = pgTable("solar_systems", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // owner of the system
  name: text("name").notNull(), // e.g., "Home System", "Vacation Home"
  installationDate: date("installation_date").notNull(),
  capacity: real("capacity").notNull(), // in kilowatts (kW)
  panelType: text("panel_type").notNull(), // e.g., "Monocrystalline", "Polycrystalline"
  panelCount: integer("panel_count").notNull(),
  inverterType: text("inverter_type").notNull(),
  location: text("location").notNull(), // address or coordinates
  lastServiced: date("last_serviced"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertSolarSystemSchema = createInsertSchema(solarSystems).pick({
  userId: true,
  name: true,
  installationDate: true,
  capacity: true,
  panelType: true,
  panelCount: true,
  inverterType: true,
  location: true,
  lastServiced: true,
  notes: true,
});

// Maintenance Booking schema
export const maintenanceBookings = pgTable("maintenance_bookings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(), // user who booked the maintenance
  systemId: integer("system_id").notNull(), // reference to solar_systems.id
  serviceType: text("service_type").notNull(), // e.g., "Cleaning", "Inspection", "Repair"
  description: text("description").notNull(),
  preferredDate: date("preferred_date").notNull(),
  preferredTimeSlot: text("preferred_time_slot").notNull(), // e.g., "Morning", "Afternoon", "Evening"
  status: text("status").notNull().default("pending"), // pending, confirmed, completed, cancelled
  technicianId: integer("technician_id"), // assigned technician (user ID), nullable
  confirmedDate: date("confirmed_date"), // nullable
  confirmedTime: time("confirmed_time"), // nullable
  completionNotes: text("completion_notes"), // nullable
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertMaintenanceBookingSchema = createInsertSchema(maintenanceBookings).pick({
  userId: true,
  systemId: true,
  serviceType: true,
  description: true,
  preferredDate: true,
  preferredTimeSlot: true,
  status: true,
  technicianId: true,
  confirmedDate: true,
  confirmedTime: true,
  completionNotes: true,
});

// Maintenance Report schema
export const maintenanceReports = pgTable("maintenance_reports", {
  id: serial("id").primaryKey(),
  bookingId: integer("booking_id").notNull(), // reference to maintenance_bookings.id
  technicianId: integer("technician_id").notNull(), // user ID of technician
  date: date("date").notNull(),
  servicePerformed: text("service_performed").notNull(),
  findings: text("findings").notNull(),
  recommendations: text("recommendations"),
  partsReplaced: text("parts_replaced"),
  systemPerformance: text("system_performance").notNull(), // e.g., "Excellent", "Good", "Fair", "Poor"
  nextServiceDue: date("next_service_due"),
  photosUrls: text("photos_urls"), // JSON string array of URLs
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertMaintenanceReportSchema = createInsertSchema(maintenanceReports).pick({
  bookingId: true,
  technicianId: true,
  date: true,
  servicePerformed: true,
  findings: true,
  recommendations: true,
  partsReplaced: true,
  systemPerformance: true,
  nextServiceDue: true,
  photosUrls: true,
});

// Performance Data schema - for storing solar system performance data
export const performanceData = pgTable("performance_data", {
  id: serial("id").primaryKey(),
  systemId: integer("system_id").notNull(), // reference to solar_systems.id
  date: date("date").notNull(),
  energyGenerated: real("energy_generated").notNull(), // in kWh
  peakPower: real("peak_power"), // in kW
  sunHours: real("sun_hours"), // in hours
  efficiency: real("efficiency"), // percentage
  weather: text("weather"), // e.g., "Sunny", "Cloudy", "Rainy"
  temperature: real("temperature"), // in Celsius
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertPerformanceDataSchema = createInsertSchema(performanceData).pick({
  systemId: true,
  date: true,
  energyGenerated: true,
  peakPower: true,
  sunHours: true,
  efficiency: true,
  weather: true,
  temperature: true,
  notes: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Ticket = typeof tickets.$inferSelect;
export type InsertTicket = z.infer<typeof insertTicketSchema>;

export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type SolarSystem = typeof solarSystems.$inferSelect;
export type InsertSolarSystem = z.infer<typeof insertSolarSystemSchema>;

export type MaintenanceBooking = typeof maintenanceBookings.$inferSelect;
export type InsertMaintenanceBooking = z.infer<typeof insertMaintenanceBookingSchema>;

export type MaintenanceReport = typeof maintenanceReports.$inferSelect;
export type InsertMaintenanceReport = z.infer<typeof insertMaintenanceReportSchema>;

export type PerformanceData = typeof performanceData.$inferSelect;
export type InsertPerformanceData = z.infer<typeof insertPerformanceDataSchema>;
