import { 
  users, 
  tickets, 
  messages, 
  activities,
  solarSystems,
  maintenanceBookings,
  maintenanceReports,
  performanceData,
  type User, 
  type InsertUser,
  type Ticket,
  type InsertTicket,
  type Message,
  type InsertMessage,
  type Activity,
  type InsertActivity,
  type SolarSystem,
  type InsertSolarSystem,
  type MaintenanceBooking,
  type InsertMaintenanceBooking,
  type MaintenanceReport,
  type InsertMaintenanceReport,
  type PerformanceData,
  type InsertPerformanceData
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Ticket operations
  getTicket(id: number): Promise<Ticket | undefined>;
  getAllTickets(): Promise<Ticket[]>;
  getTicketsByUser(userId: number): Promise<Ticket[]>;
  getTicketsByStatus(status: string): Promise<Ticket[]>;
  getTicketsByPriority(priority: string): Promise<Ticket[]>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  updateTicket(id: number, ticket: Partial<InsertTicket>): Promise<Ticket | undefined>;
  
  // Message operations
  getMessagesByUser(userId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Activity operations
  createActivity(activity: InsertActivity): Promise<Activity>;
  getRecentActivities(limit?: number): Promise<Activity[]>;
  getActivitiesByTicket(ticketId: number): Promise<Activity[]>;
  
  // Solar System operations
  getSolarSystem(id: number): Promise<SolarSystem | undefined>;
  getSolarSystemsByUser(userId: number): Promise<SolarSystem[]>;
  getAllSolarSystems(): Promise<SolarSystem[]>;
  createSolarSystem(system: InsertSolarSystem): Promise<SolarSystem>;
  updateSolarSystem(id: number, system: Partial<InsertSolarSystem>): Promise<SolarSystem | undefined>;
  
  // Maintenance Booking operations
  getMaintenanceBooking(id: number): Promise<MaintenanceBooking | undefined>;
  getMaintenanceBookingsByUser(userId: number): Promise<MaintenanceBooking[]>;
  getMaintenanceBookingsBySystem(systemId: number): Promise<MaintenanceBooking[]>;
  getMaintenanceBookingsByStatus(status: string): Promise<MaintenanceBooking[]>;
  getAllMaintenanceBookings(): Promise<MaintenanceBooking[]>;
  createMaintenanceBooking(booking: InsertMaintenanceBooking): Promise<MaintenanceBooking>;
  updateMaintenanceBooking(id: number, booking: Partial<InsertMaintenanceBooking>): Promise<MaintenanceBooking | undefined>;
  
  // Maintenance Report operations
  getMaintenanceReport(id: number): Promise<MaintenanceReport | undefined>;
  getMaintenanceReportsByBooking(bookingId: number): Promise<MaintenanceReport[]>;
  getMaintenanceReportsByTechnician(technicianId: number): Promise<MaintenanceReport[]>;
  getAllMaintenanceReports(): Promise<MaintenanceReport[]>;
  createMaintenanceReport(report: InsertMaintenanceReport): Promise<MaintenanceReport>;
  
  // Performance Data operations
  getPerformanceData(id: number): Promise<PerformanceData | undefined>;
  getPerformanceDataBySystem(systemId: number): Promise<PerformanceData[]>;
  getPerformanceDataByDateRange(systemId: number, startDate: Date, endDate: Date): Promise<PerformanceData[]>;
  createPerformanceData(data: InsertPerformanceData): Promise<PerformanceData>;
  
  // Stats operations
  getTicketStats(): Promise<{
    openTickets: number;
    inProgressTickets: number;
    resolvedToday: number;
    avgResponseTime: number;
    customerSatisfaction: number;
  }>;
  
  getMaintenanceStats(): Promise<{
    pendingBookings: number;
    confirmedBookings: number;
    completedServices: number;
    averageRating: number;
    upcomingServices: MaintenanceBooking[];
  }>;
  
  getSystemPerformanceStats(systemId: number): Promise<{
    totalEnergyGenerated: number;
    averageEfficiency: number;
    peakPower: number;
    lastWeekGeneration: number[];
    performanceTrend: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tickets: Map<number, Ticket>;
  private messages: Map<number, Message>;
  private activities: Map<number, Activity>;
  private solarSystems: Map<number, SolarSystem>;
  private maintenanceBookings: Map<number, MaintenanceBooking>;
  private maintenanceReports: Map<number, MaintenanceReport>;
  private performanceData: Map<number, PerformanceData>;
  
  private userIdCounter: number;
  private ticketIdCounter: number;
  private messageIdCounter: number;
  private activityIdCounter: number;
  private solarSystemIdCounter: number;
  private maintenanceBookingIdCounter: number;
  private maintenanceReportIdCounter: number;
  private performanceDataIdCounter: number;

  constructor() {
    this.users = new Map();
    this.tickets = new Map();
    this.messages = new Map();
    this.activities = new Map();
    this.solarSystems = new Map();
    this.maintenanceBookings = new Map();
    this.maintenanceReports = new Map();
    this.performanceData = new Map();
    
    this.userIdCounter = 1;
    this.ticketIdCounter = 1;
    this.messageIdCounter = 1;
    this.activityIdCounter = 1;
    this.solarSystemIdCounter = 1;
    this.maintenanceBookingIdCounter = 1;
    this.maintenanceReportIdCounter = 1;
    this.performanceDataIdCounter = 1;
    
    // Add a default admin user
    this.createUser({
      username: "admin",
      password: "admin123",
      fullName: "Admin User",
      email: "admin@solarflow.com",
      role: "admin",
      avatar: "AU"
    }).then(admin => {
      // Create some sample solar systems
      this.createSolarSystem({
        userId: admin.id,
        name: "Main Residential System",
        installationDate: new Date("2023-04-15"),
        capacity: 8.4,
        panelType: "Monocrystalline",
        panelCount: 24,
        inverterType: "SolarEdge SE7600H",
        location: "123 Solar Lane, Sunnyvale, CA",
        lastServiced: new Date("2023-12-10"),
        notes: "Premium installation with battery backup"
      }).then(system1 => {
        // Add some performance data for this system
        const today = new Date();
        for (let i = 30; i >= 0; i--) {
          const date = new Date();
          date.setDate(today.getDate() - i);
          
          // Generate random data based on weather and season
          const isSunny = Math.random() > 0.3;
          const basePower = 6 + Math.random() * 2.5; // 6-8.5 kW
          const weather = isSunny ? "Sunny" : (Math.random() > 0.5 ? "Partly Cloudy" : "Cloudy");
          const efficiency = isSunny ? 92 + Math.random() * 5 : 75 + Math.random() * 15;
          
          this.createPerformanceData({
            systemId: system1.id,
            date: date,
            energyGenerated: basePower * (isSunny ? (7 + Math.random() * 3) : (3 + Math.random() * 3)),
            peakPower: basePower,
            sunHours: isSunny ? 8 + Math.random() * 4 : 2 + Math.random() * 5,
            efficiency: efficiency,
            weather: weather,
            temperature: isSunny ? 22 + Math.random() * 10 : 15 + Math.random() * 7,
            notes: ""
          });
        }
        
        // Create a pending maintenance booking
        this.createMaintenanceBooking({
          userId: admin.id,
          systemId: system1.id,
          serviceType: "Annual Inspection",
          description: "Regular annual inspection and cleaning of solar panels",
          preferredDate: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 14),
          preferredTimeSlot: "Morning",
          status: "pending",
          technicianId: null,
          confirmedDate: null,
          confirmedTime: null,
          completionNotes: null
        });
        
        // Create a completed maintenance booking
        const pastDate = new Date();
        pastDate.setMonth(pastDate.getMonth() - 2);
        
        this.createMaintenanceBooking({
          userId: admin.id,
          systemId: system1.id,
          serviceType: "Panel Cleaning",
          description: "Cleaning of solar panels to remove dust and debris",
          preferredDate: pastDate,
          preferredTimeSlot: "Afternoon",
          status: "completed",
          technicianId: admin.id,
          confirmedDate: pastDate,
          confirmedTime: "13:00",
          completionNotes: "All panels cleaned and system is performing optimally"
        }).then(booking => {
          // Create a maintenance report for the completed booking
          this.createMaintenanceReport({
            bookingId: booking.id,
            technicianId: admin.id,
            date: pastDate,
            servicePerformed: "Panel Cleaning and System Inspection",
            findings: "Minor dust accumulation on panels. No physical damage observed.",
            recommendations: "Schedule next cleaning in 6 months. Consider trimming nearby tree branches.",
            partsReplaced: "",
            systemPerformance: "Excellent",
            nextServiceDue: new Date(pastDate.getFullYear(), pastDate.getMonth() + 6, pastDate.getDate()),
            photosUrls: JSON.stringify(["/assets/sample-report-1.jpg", "/assets/sample-report-2.jpg"])
          });
        });
      });
      
      // Create a second solar system
      this.createSolarSystem({
        userId: admin.id,
        name: "Commercial Office System",
        installationDate: new Date("2022-06-22"),
        capacity: 25.6,
        panelType: "Polycrystalline",
        panelCount: 64,
        inverterType: "SMA Sunny Tripower",
        location: "456 Business Park, Sunnyvale, CA",
        lastServiced: new Date("2024-01-15"),
        notes: "Commercial installation with monitoring system"
      });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const createdAt = new Date();
    const user: User = { ...insertUser, id, createdAt };
    this.users.set(id, user);
    return user;
  }
  
  // Ticket operations
  async getTicket(id: number): Promise<Ticket | undefined> {
    return this.tickets.get(id);
  }
  
  async getAllTickets(): Promise<Ticket[]> {
    return Array.from(this.tickets.values());
  }
  
  async getTicketsByUser(userId: number): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.createdBy === userId
    );
  }
  
  async getTicketsByStatus(status: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.status === status
    );
  }
  
  async getTicketsByPriority(priority: string): Promise<Ticket[]> {
    return Array.from(this.tickets.values()).filter(
      (ticket) => ticket.priority === priority
    );
  }
  
  async createTicket(insertTicket: InsertTicket): Promise<Ticket> {
    const id = this.ticketIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const ticket: Ticket = { ...insertTicket, id, createdAt, updatedAt };
    this.tickets.set(id, ticket);
    
    // Create an activity for the new ticket
    await this.createActivity({
      ticketId: id,
      userId: insertTicket.createdBy,
      action: "created",
      details: `Ticket #${id} created: ${insertTicket.subject}`
    });
    
    return ticket;
  }
  
  async updateTicket(id: number, ticketUpdate: Partial<InsertTicket>): Promise<Ticket | undefined> {
    const ticket = this.tickets.get(id);
    if (!ticket) return undefined;
    
    const updatedTicket: Ticket = {
      ...ticket,
      ...ticketUpdate,
      updatedAt: new Date()
    };
    
    this.tickets.set(id, updatedTicket);
    
    // Create an activity for the ticket update
    if (ticketUpdate.status) {
      await this.createActivity({
        ticketId: id,
        userId: ticketUpdate.assignedTo || ticket.createdBy,
        action: "updated",
        details: `Ticket #${id} status changed to ${ticketUpdate.status}`
      });
    }
    
    return updatedTicket;
  }
  
  // Message operations
  async getMessagesByUser(userId: number): Promise<Message[]> {
    return Array.from(this.messages.values()).filter(
      (message) => message.userId === userId
    );
  }
  
  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const createdAt = new Date();
    const message: Message = { ...insertMessage, id, createdAt };
    this.messages.set(id, message);
    return message;
  }
  
  // Activity operations
  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const id = this.activityIdCounter++;
    const createdAt = new Date();
    const activity: Activity = { ...insertActivity, id, createdAt };
    this.activities.set(id, activity);
    return activity;
  }
  
  async getRecentActivities(limit: number = 10): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  async getActivitiesByTicket(ticketId: number): Promise<Activity[]> {
    return Array.from(this.activities.values())
      .filter(activity => activity.ticketId === ticketId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  // Solar System operations
  async getSolarSystem(id: number): Promise<SolarSystem | undefined> {
    return this.solarSystems.get(id);
  }
  
  async getSolarSystemsByUser(userId: number): Promise<SolarSystem[]> {
    return Array.from(this.solarSystems.values()).filter(
      (system) => system.userId === userId
    );
  }
  
  async getAllSolarSystems(): Promise<SolarSystem[]> {
    return Array.from(this.solarSystems.values());
  }
  
  async createSolarSystem(insertSystem: InsertSolarSystem): Promise<SolarSystem> {
    const id = this.solarSystemIdCounter++;
    const createdAt = new Date();
    const system: SolarSystem = { ...insertSystem, id, createdAt };
    this.solarSystems.set(id, system);
    
    // Create an activity for the new solar system
    await this.createActivity({
      userId: insertSystem.userId,
      action: "created",
      details: `Solar system "${insertSystem.name}" added`
    });
    
    return system;
  }
  
  async updateSolarSystem(id: number, systemUpdate: Partial<InsertSolarSystem>): Promise<SolarSystem | undefined> {
    const system = this.solarSystems.get(id);
    if (!system) return undefined;
    
    const updatedSystem: SolarSystem = {
      ...system,
      ...systemUpdate,
    };
    
    this.solarSystems.set(id, updatedSystem);
    
    // Create an activity for the system update
    await this.createActivity({
      userId: system.userId,
      action: "updated",
      details: `Solar system "${system.name}" updated`
    });
    
    return updatedSystem;
  }
  
  // Maintenance Booking operations
  async getMaintenanceBooking(id: number): Promise<MaintenanceBooking | undefined> {
    return this.maintenanceBookings.get(id);
  }
  
  async getMaintenanceBookingsByUser(userId: number): Promise<MaintenanceBooking[]> {
    return Array.from(this.maintenanceBookings.values()).filter(
      (booking) => booking.userId === userId
    );
  }
  
  async getMaintenanceBookingsBySystem(systemId: number): Promise<MaintenanceBooking[]> {
    return Array.from(this.maintenanceBookings.values()).filter(
      (booking) => booking.systemId === systemId
    );
  }
  
  async getMaintenanceBookingsByStatus(status: string): Promise<MaintenanceBooking[]> {
    return Array.from(this.maintenanceBookings.values()).filter(
      (booking) => booking.status === status
    );
  }
  
  async getAllMaintenanceBookings(): Promise<MaintenanceBooking[]> {
    return Array.from(this.maintenanceBookings.values());
  }
  
  async createMaintenanceBooking(insertBooking: InsertMaintenanceBooking): Promise<MaintenanceBooking> {
    const id = this.maintenanceBookingIdCounter++;
    const createdAt = new Date();
    const updatedAt = new Date();
    const booking: MaintenanceBooking = { ...insertBooking, id, createdAt, updatedAt };
    this.maintenanceBookings.set(id, booking);
    
    // Create an activity for the new booking
    await this.createActivity({
      userId: insertBooking.userId,
      action: "booked",
      details: `Maintenance service "${insertBooking.serviceType}" booked for ${new Date(insertBooking.preferredDate).toLocaleDateString()}`
    });
    
    return booking;
  }
  
  async updateMaintenanceBooking(id: number, bookingUpdate: Partial<InsertMaintenanceBooking>): Promise<MaintenanceBooking | undefined> {
    const booking = this.maintenanceBookings.get(id);
    if (!booking) return undefined;
    
    const updatedBooking: MaintenanceBooking = {
      ...booking,
      ...bookingUpdate,
      updatedAt: new Date()
    };
    
    this.maintenanceBookings.set(id, updatedBooking);
    
    // Create an activity for the booking update
    if (bookingUpdate.status) {
      await this.createActivity({
        userId: booking.userId,
        action: "updated",
        details: `Maintenance booking status changed to ${bookingUpdate.status}`
      });
    }
    
    return updatedBooking;
  }
  
  // Maintenance Report operations
  async getMaintenanceReport(id: number): Promise<MaintenanceReport | undefined> {
    return this.maintenanceReports.get(id);
  }
  
  async getMaintenanceReportsByBooking(bookingId: number): Promise<MaintenanceReport[]> {
    return Array.from(this.maintenanceReports.values()).filter(
      (report) => report.bookingId === bookingId
    );
  }
  
  async getMaintenanceReportsByTechnician(technicianId: number): Promise<MaintenanceReport[]> {
    return Array.from(this.maintenanceReports.values()).filter(
      (report) => report.technicianId === technicianId
    );
  }
  
  async getAllMaintenanceReports(): Promise<MaintenanceReport[]> {
    return Array.from(this.maintenanceReports.values());
  }
  
  async createMaintenanceReport(insertReport: InsertMaintenanceReport): Promise<MaintenanceReport> {
    const id = this.maintenanceReportIdCounter++;
    const createdAt = new Date();
    const report: MaintenanceReport = { ...insertReport, id, createdAt };
    this.maintenanceReports.set(id, report);
    
    // Get the booking
    const booking = this.maintenanceBookings.get(insertReport.bookingId);
    
    // Create an activity for the new report
    if (booking) {
      await this.createActivity({
        userId: insertReport.technicianId,
        action: "created",
        details: `Maintenance report created for service on ${new Date(insertReport.date).toLocaleDateString()}`
      });
      
      // Update the booking status to completed
      await this.updateMaintenanceBooking(booking.id, { status: "completed" });
      
      // Update the solar system last serviced date
      const system = await this.getSolarSystem(booking.systemId);
      if (system) {
        await this.updateSolarSystem(system.id, { lastServiced: insertReport.date });
      }
    }
    
    return report;
  }
  
  // Performance Data operations
  async getPerformanceData(id: number): Promise<PerformanceData | undefined> {
    return this.performanceData.get(id);
  }
  
  async getPerformanceDataBySystem(systemId: number): Promise<PerformanceData[]> {
    return Array.from(this.performanceData.values())
      .filter(data => data.systemId === systemId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getPerformanceDataByDateRange(systemId: number, startDate: Date, endDate: Date): Promise<PerformanceData[]> {
    return Array.from(this.performanceData.values())
      .filter(data => 
        data.systemId === systemId && 
        new Date(data.date) >= startDate && 
        new Date(data.date) <= endDate
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }
  
  async createPerformanceData(insertData: InsertPerformanceData): Promise<PerformanceData> {
    const id = this.performanceDataIdCounter++;
    const createdAt = new Date();
    const data: PerformanceData = { ...insertData, id, createdAt };
    this.performanceData.set(id, data);
    return data;
  }
  
  // Stats operations
  async getTicketStats(): Promise<{
    openTickets: number;
    inProgressTickets: number;
    resolvedToday: number;
    avgResponseTime: number;
    customerSatisfaction: number;
  }> {
    const allTickets = Array.from(this.tickets.values());
    const openTickets = allTickets.filter(ticket => ticket.status === "open").length;
    const inProgressTickets = allTickets.filter(ticket => ticket.status === "in progress").length;
    
    // Count tickets resolved today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const resolvedToday = allTickets.filter(
      ticket => ticket.status === "resolved" && 
      ticket.updatedAt >= today
    ).length;
    
    // Calculate these metrics based on actual data if available
    const avgResponseTime = 2.4; // in hours
    const customerSatisfaction = 94; // percentage
    
    return {
      openTickets,
      inProgressTickets,
      resolvedToday,
      avgResponseTime,
      customerSatisfaction
    };
  }
  
  async getMaintenanceStats(): Promise<{
    pendingBookings: number;
    confirmedBookings: number;
    completedServices: number;
    averageRating: number;
    upcomingServices: MaintenanceBooking[];
  }> {
    const allBookings = Array.from(this.maintenanceBookings.values());
    const pendingBookings = allBookings.filter(booking => booking.status === "pending").length;
    const confirmedBookings = allBookings.filter(booking => booking.status === "confirmed").length;
    const completedServices = allBookings.filter(booking => booking.status === "completed").length;
    
    // Get upcoming services (confirmed bookings with future dates)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcomingServices = allBookings
      .filter(booking => 
        (booking.status === "confirmed" || booking.status === "pending") &&
        new Date(booking.preferredDate) >= today
      )
      .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())
      .slice(0, 5);
    
    // Calculate average rating (could be derived from customer feedback in a real app)
    const averageRating = 4.7;
    
    return {
      pendingBookings,
      confirmedBookings,
      completedServices,
      averageRating,
      upcomingServices
    };
  }
  
  async getSystemPerformanceStats(systemId: number): Promise<{
    totalEnergyGenerated: number;
    averageEfficiency: number;
    peakPower: number;
    lastWeekGeneration: number[];
    performanceTrend: number;
  }> {
    const performanceRecords = await this.getPerformanceDataBySystem(systemId);
    
    // Calculate total energy generated
    const totalEnergyGenerated = performanceRecords.reduce(
      (sum, record) => sum + record.energyGenerated, 
      0
    );
    
    // Calculate average efficiency
    const efficiencyRecords = performanceRecords.filter(record => record.efficiency !== null);
    const averageEfficiency = efficiencyRecords.length > 0 
      ? efficiencyRecords.reduce((sum, record) => sum + (record.efficiency || 0), 0) / efficiencyRecords.length
      : 0;
    
    // Find peak power
    const peakPowerRecords = performanceRecords.filter(record => record.peakPower !== null);
    const peakPower = peakPowerRecords.length > 0
      ? Math.max(...peakPowerRecords.map(record => record.peakPower || 0))
      : 0;
    
    // Get last week's generation data
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const lastWeek = new Date(today);
    lastWeek.setDate(today.getDate() - 7);
    
    const lastWeekData = await this.getPerformanceDataByDateRange(systemId, lastWeek, today);
    const lastWeekGeneration = Array(7).fill(0);
    
    lastWeekData.forEach(record => {
      const recordDate = new Date(record.date);
      const dayIndex = 6 - Math.floor((today.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayIndex >= 0 && dayIndex < 7) {
        lastWeekGeneration[dayIndex] = record.energyGenerated;
      }
    });
    
    // Calculate performance trend (percentage change from previous week)
    const previousWeekStart = new Date(lastWeek);
    previousWeekStart.setDate(previousWeekStart.getDate() - 7);
    
    const previousWeekData = await this.getPerformanceDataByDateRange(systemId, previousWeekStart, lastWeek);
    
    const currentWeekTotal = lastWeekData.reduce((sum, record) => sum + record.energyGenerated, 0);
    const previousWeekTotal = previousWeekData.reduce((sum, record) => sum + record.energyGenerated, 0);
    
    const performanceTrend = previousWeekTotal > 0 
      ? ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100
      : 0;
    
    return {
      totalEnergyGenerated,
      averageEfficiency,
      peakPower,
      lastWeekGeneration,
      performanceTrend
    };
  }
}

export const storage = new MemStorage();
