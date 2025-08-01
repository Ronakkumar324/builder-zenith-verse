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
  status: 'active' | 'cancelled' | 'completed';
  attendees: number;
  registrations: string[];
  image?: string | null;
}

const STORAGE_KEY = 'eventhub_events';

export const eventStorage = {
  // Get all events
  getAllEvents(): Event[] {
    try {
      const events = localStorage.getItem(STORAGE_KEY);
      return events ? JSON.parse(events) : [];
    } catch (error) {
      console.error('Failed to get events:', error);
      return [];
    }
  },

  // Save a new event
  saveEvent(event: Event): boolean {
    try {
      const events = this.getAllEvents();
      const existingIndex = events.findIndex(e => e.id === event.id);
      
      if (existingIndex !== -1) {
        events[existingIndex] = event;
      } else {
        events.push(event);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
      return true;
    } catch (error) {
      console.error('Failed to save event:', error);
      return false;
    }
  },

  // Get event by ID
  getEventById(id: string): Event | null {
    const events = this.getAllEvents();
    return events.find(event => event.id === id) || null;
  },

  // Get active/upcoming events only
  getActiveEvents(): Event[] {
    const events = this.getAllEvents();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return events.filter(event => 
      event.status === 'active' && 
      new Date(event.date) >= today
    );
  },

  // Get events by organizer
  getEventsByOrganizer(organizerId: string): Event[] {
    const events = this.getAllEvents();
    return events.filter(event => event.organizerId === organizerId);
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
      console.error('Failed to register for event:', error);
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
      const filteredEvents = events.filter(event => event.id !== eventId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEvents));
      return true;
    } catch (error) {
      console.error('Failed to delete event:', error);
      return false;
    }
  }
};
