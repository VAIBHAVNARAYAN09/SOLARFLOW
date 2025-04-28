import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertTicketSchema, 
  insertMessageSchema,
  insertActivitySchema,
  insertSolarSystemSchema,
  insertMaintenanceBookingSchema,
  insertMaintenanceReportSchema,
  insertPerformanceDataSchema
} from "@shared/schema";
import { handleAIMessage } from "./openai";
import { getWeatherForecast } from "./weather";
import { setupAuth } from "./auth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Set up authentication routes
  setupAuth(app);
  // Ticket routes
  app.get("/api/tickets", async (req: Request, res: Response) => {
    try {
      const tickets = await storage.getAllTickets();
      res.json(tickets);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tickets" });
    }
  });

  app.get("/api/tickets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicket(id);
      
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      res.json(ticket);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket" });
    }
  });

  app.post("/api/tickets", async (req: Request, res: Response) => {
    try {
      const validation = insertTicketSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      
      const newTicket = await storage.createTicket(validation.data);
      res.status(201).json(newTicket);
    } catch (error) {
      res.status(500).json({ error: "Failed to create ticket" });
    }
  });

  app.patch("/api/tickets/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const ticket = await storage.getTicket(id);
      
      if (!ticket) {
        return res.status(404).json({ error: "Ticket not found" });
      }
      
      const updatedTicket = await storage.updateTicket(id, req.body);
      res.json(updatedTicket);
    } catch (error) {
      res.status(500).json({ error: "Failed to update ticket" });
    }
  });

  // Activity routes
  app.get("/api/activities", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const activities = await storage.getRecentActivities(limit);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activities" });
    }
  });

  app.get("/api/activities/ticket/:ticketId", async (req: Request, res: Response) => {
    try {
      const ticketId = parseInt(req.params.ticketId);
      const activities = await storage.getActivitiesByTicket(ticketId);
      res.json(activities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch ticket activities" });
    }
  });

  app.post("/api/activities", async (req: Request, res: Response) => {
    try {
      const validation = insertActivitySchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      
      const newActivity = await storage.createActivity(validation.data);
      res.status(201).json(newActivity);
    } catch (error) {
      res.status(500).json({ error: "Failed to create activity" });
    }
  });

  // AI Chat routes
  app.get("/api/messages/:userId", async (req: Request, res: Response) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getMessagesByUser(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch messages" });
    }
  });

  app.post("/api/messages", async (req: Request, res: Response) => {
    try {
      const validation = insertMessageSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      
      // Save user message
      const userMessage = await storage.createMessage(validation.data);
      
      // Generate AI response
      const aiResponse = await handleAIMessage(validation.data.content);
      
      // Save AI message
      const botMessage = await storage.createMessage({
        userId: validation.data.userId,
        content: aiResponse,
        isBot: true
      });
      
      res.status(201).json({
        userMessage,
        botMessage
      });
    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // Stats routes
  app.get("/api/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getTicketStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  // Solar System routes
  app.get("/api/solar-systems", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      
      const systems = userId 
        ? await storage.getSolarSystemsByUser(userId)
        : await storage.getAllSolarSystems();
        
      res.json(systems);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch solar systems" });
    }
  });

  app.get("/api/solar-systems/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const system = await storage.getSolarSystem(id);
      
      if (!system) {
        return res.status(404).json({ error: "Solar system not found" });
      }
      
      res.json(system);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch solar system" });
    }
  });

  app.post("/api/solar-systems", async (req: Request, res: Response) => {
    try {
      const validation = insertSolarSystemSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      
      const newSystem = await storage.createSolarSystem(validation.data);
      res.status(201).json(newSystem);
    } catch (error) {
      res.status(500).json({ error: "Failed to create solar system" });
    }
  });

  app.patch("/api/solar-systems/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const system = await storage.getSolarSystem(id);
      
      if (!system) {
        return res.status(404).json({ error: "Solar system not found" });
      }
      
      const updatedSystem = await storage.updateSolarSystem(id, req.body);
      res.json(updatedSystem);
    } catch (error) {
      res.status(500).json({ error: "Failed to update solar system" });
    }
  });

  // Maintenance Booking routes
  app.get("/api/maintenance/bookings", async (req: Request, res: Response) => {
    try {
      const userId = req.query.userId ? parseInt(req.query.userId as string) : undefined;
      const systemId = req.query.systemId ? parseInt(req.query.systemId as string) : undefined;
      const status = req.query.status as string;
      
      let bookings;
      
      if (userId) {
        bookings = await storage.getMaintenanceBookingsByUser(userId);
      } else if (systemId) {
        bookings = await storage.getMaintenanceBookingsBySystem(systemId);
      } else if (status) {
        bookings = await storage.getMaintenanceBookingsByStatus(status);
      } else {
        bookings = await storage.getAllMaintenanceBookings();
      }
      
      res.json(bookings);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance bookings" });
    }
  });

  app.get("/api/maintenance/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getMaintenanceBooking(id);
      
      if (!booking) {
        return res.status(404).json({ error: "Maintenance booking not found" });
      }
      
      res.json(booking);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance booking" });
    }
  });

  app.post("/api/maintenance/bookings", async (req: Request, res: Response) => {
    try {
      const validation = insertMaintenanceBookingSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      
      const newBooking = await storage.createMaintenanceBooking(validation.data);
      res.status(201).json(newBooking);
    } catch (error) {
      res.status(500).json({ error: "Failed to create maintenance booking" });
    }
  });

  app.patch("/api/maintenance/bookings/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const booking = await storage.getMaintenanceBooking(id);
      
      if (!booking) {
        return res.status(404).json({ error: "Maintenance booking not found" });
      }
      
      const updatedBooking = await storage.updateMaintenanceBooking(id, req.body);
      res.json(updatedBooking);
    } catch (error) {
      res.status(500).json({ error: "Failed to update maintenance booking" });
    }
  });

  // Maintenance Report routes
  app.get("/api/maintenance/reports", async (req: Request, res: Response) => {
    try {
      const bookingId = req.query.bookingId ? parseInt(req.query.bookingId as string) : undefined;
      const technicianId = req.query.technicianId ? parseInt(req.query.technicianId as string) : undefined;
      
      let reports;
      
      if (bookingId) {
        reports = await storage.getMaintenanceReportsByBooking(bookingId);
      } else if (technicianId) {
        reports = await storage.getMaintenanceReportsByTechnician(technicianId);
      } else {
        reports = await storage.getAllMaintenanceReports();
      }
      
      res.json(reports);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance reports" });
    }
  });

  app.get("/api/maintenance/reports/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const report = await storage.getMaintenanceReport(id);
      
      if (!report) {
        return res.status(404).json({ error: "Maintenance report not found" });
      }
      
      res.json(report);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance report" });
    }
  });

  app.post("/api/maintenance/reports", async (req: Request, res: Response) => {
    try {
      const validation = insertMaintenanceReportSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      
      const newReport = await storage.createMaintenanceReport(validation.data);
      res.status(201).json(newReport);
    } catch (error) {
      res.status(500).json({ error: "Failed to create maintenance report" });
    }
  });

  // Performance Data routes
  app.get("/api/performance", async (req: Request, res: Response) => {
    try {
      const systemId = parseInt(req.query.systemId as string);
      
      if (!systemId) {
        return res.status(400).json({ error: "System ID is required" });
      }
      
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;
      
      let performanceData;
      
      if (startDate && endDate) {
        performanceData = await storage.getPerformanceDataByDateRange(systemId, startDate, endDate);
      } else {
        performanceData = await storage.getPerformanceDataBySystem(systemId);
      }
      
      res.json(performanceData);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch performance data" });
    }
  });

  app.post("/api/performance", async (req: Request, res: Response) => {
    try {
      const validation = insertPerformanceDataSchema.safeParse(req.body);
      
      if (!validation.success) {
        return res.status(400).json({ error: validation.error.errors });
      }
      
      const newData = await storage.createPerformanceData(validation.data);
      res.status(201).json(newData);
    } catch (error) {
      res.status(500).json({ error: "Failed to create performance data" });
    }
  });

  // System Performance Stats route
  app.get("/api/performance/stats/:systemId", async (req: Request, res: Response) => {
    try {
      const systemId = parseInt(req.params.systemId);
      const stats = await storage.getSystemPerformanceStats(systemId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch system performance stats" });
    }
  });

  // Maintenance Stats route
  app.get("/api/maintenance/stats", async (req: Request, res: Response) => {
    try {
      const stats = await storage.getMaintenanceStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch maintenance stats" });
    }
  });

  // Weather forecast route
  app.get("/api/weather", async (req: Request, res: Response) => {
    try {
      const location = req.query.location as string || "Delhi,India";
      const forecast = await getWeatherForecast(location);
      res.json(forecast);
    } catch (error) {
      console.error("Weather API error:", error);
      res.status(500).json({ error: "Failed to fetch weather forecast" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
