export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  category: string;
  maxSeats: number;
  organizer: string;
  organizerId: string;
  createdAt: string;
  status: "active" | "cancelled" | "completed";
  attendees: number;
  registrations: string[];
  image?: string | null;
}

const STORAGE_KEY = "eventhub_events";

export const eventStorage = {
  // Get all events
  getAllEvents(): Event[] {
    try {
      const events = localStorage.getItem(STORAGE_KEY);
      return events ? JSON.parse(events) : [];
    } catch (error) {
      console.error("Failed to get events:", error);
      return [];
    }
  },

  // Save a new event
  saveEvent(event: Event): boolean {
    try {
      const events = this.getAllEvents();
      const existingIndex = events.findIndex((e) => e.id === event.id);

      if (existingIndex !== -1) {
        events[existingIndex] = event;
      } else {
        events.push(event);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return true;
    } catch (error) {
      console.error("Failed to save event:", error);
      return false;
    }
  },

  // Get event by ID
  getEventById(id: string): Event | null {
    const events = this.getAllEvents();
    return events.find((event) => event.id === id) || null;
  },

  // Get active/upcoming events only
  getActiveEvents(): Event[] {
    // Seed sample events if none exist
    this.seedSampleEvents();

    const events = this.getAllEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return events.filter(
      (event) => event.status === "active" && new Date(event.date) >= today,
    );
  },

  // Get events by organizer
  getEventsByOrganizer(organizerId: string): Event[] {
    const events = this.getAllEvents();
    return events.filter((event) => event.organizerId === organizerId);
  },

  // Register for an event
  registerForEvent(eventId: string, userEmail: string): boolean {
    try {
      const event = this.getEventById(eventId);
      if (!event) return false;

      // Check if already registered
      if (event.registrations.includes(userEmail)) {
        return false; // Already registered
      }

      // Check capacity
      if (event.attendees >= event.maxSeats) {
        return false; // Event full
      }

      // Add registration
      event.registrations.push(userEmail);
      event.attendees += 1;

      return this.saveEvent(event);
    } catch (error) {
      console.error("Failed to register for event:", error);
      return false;
    }
  },

  // Generate unique event ID
  generateEventId(): string {
    return `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  },

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  },

  // Delete event
  deleteEvent(eventId: string): boolean {
    try {
      const events = this.getAllEvents();
      const filteredEvents = events.filter((event) => event.id !== eventId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEvents));
      return true;
    } catch (error) {
      console.error("Failed to delete event:", error);
      return false;
    }
  },

  // Seed sample events if storage is empty
  seedSampleEvents(): void {
    const existingEvents = this.getAllEvents();
    if (existingEvents.length > 0) return; // Don't seed if events already exist

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextMonth = new Date();
    nextMonth.setDate(nextMonth.getDate() + 30);

    const sampleEvents: Event[] = [
      {
        id: this.generateEventId(),
        title: "Tech Innovation Summit 2024",
        description:
          "Join industry leaders for a day of cutting-edge technology presentations, networking, and innovation showcase. Discover the latest trends in AI, blockchain, and software development.",
        date: tomorrow.toISOString().split("T")[0],
        time: "10:00",
        venue: "Main Auditorium, Tech Campus",
        category: "Technology",
        maxSeats: 150,
        organizer: "Tech Society",
        organizerId: "org_tech_001",
        createdAt: new Date().toISOString(),
        status: "active",
        attendees: 45,
        registrations: [],
        image: null,
      },
      {
        id: this.generateEventId(),
        title: "Annual Cultural Festival",
        description:
          "Experience a vibrant celebration of diverse cultures with music, dance, food, and art from around the world. A perfect event for the entire community to come together.",
        date: nextWeek.toISOString().split("T")[0],
        time: "18:00",
        venue: "College Grounds",
        category: "Cultural",
        maxSeats: 500,
        organizer: "Cultural Committee",
        organizerId: "org_cultural_001",
        createdAt: new Date().toISOString(),
        status: "active",
        attendees: 234,
        registrations: [],
        image: null,
      },
      {
        id: this.generateEventId(),
        title: "Career Development Workshop",
        description:
          "Learn essential career skills including resume writing, interview techniques, and professional networking. Perfect for students and recent graduates looking to advance their careers.",
        date: nextMonth.toISOString().split("T")[0],
        time: "14:00",
        venue: "Conference Hall B",
        category: "Career",
        maxSeats: 80,
        organizer: "Career Services",
        organizerId: "org_career_001",
        createdAt: new Date().toISOString(),
        status: "active",
        attendees: 12,
        registrations: [],
        image: null,
      },
    ];

    // Save sample events
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEvents));
  },
};
