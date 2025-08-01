// events.js - Event management utilities and form handling

import { modalManager, userManager } from "./main.js";
import { formValidator } from "./auth.js";

/**
 * Event Manager
 */
export class EventManager {
  constructor() {
    this.validator = formValidator;
    this.isLoading = false;
    this.eventStorage = "eventhub_events";
    this.categories = [
      "Technology",
      "Cultural",
      "Career",
      "Education",
      "Sports",
      "Health & Wellness",
      "Entertainment",
      "Social",
      "Professional",
      "Academic",
    ];
  }

  // Handle create event form submission
  async handleCreateEvent(formElement) {
    if (this.isLoading) return;

    const formData = new FormData(formElement);
    const eventData = {
      title: formData.get("title"),
      description: formData.get("description"),
      date: formData.get("date"),
      time: formData.get("time"),
      venue: formData.get("venue"),
      category: formData.get("category"),
      maxSeats: formData.get("maxSeats"),
      image: formData.get("image"),
    };

    // Validate form
    const customRules = {
      title: {
        required: true,
        minLength: 5,
        maxLength: 100,
        message: "Title must be between 5 and 100 characters",
      },
      description: {
        required: true,
        minLength: 20,
        maxLength: 1000,
        message: "Description must be between 20 and 1000 characters",
      },
      date: {
        required: true,
        custom: (value) => {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return selectedDate >= today;
        },
        message: "Event date cannot be in the past",
      },
      time: {
        required: true,
        pattern: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
        message: "Please enter a valid time",
      },
      venue: {
        required: true,
        minLength: 3,
        message: "Venue must be at least 3 characters",
      },
      category: {
        required: true,
        options: this.categories,
        message: "Please select a valid category",
      },
      maxSeats: {
        required: true,
        pattern: /^\d+$/,
        custom: (value) => {
          const seats = parseInt(value);
          return seats >= 1 && seats <= 10000;
        },
        message: "Maximum seats must be between 1 and 10,000",
      },
    };

    const { isValid, errors } = this.validateEventForm(eventData, customRules);

    if (!isValid) {
      this.displayFormErrors(formElement, errors);
      return false;
    }

    // Show loading state
    this.setLoadingState(formElement, true);

    try {
      // Simulate API call
      await this.delay(2000);

      // Create event object
      const newEvent = {
        id: this.generateEventId(),
        ...eventData,
        organizer: userManager.getUser()?.name || "Unknown Organizer",
        organizerId: userManager.getUser()?.id,
        createdAt: new Date().toISOString(),
        status: "pending",
        attendees: 0,
        registrations: [],
      };

      // Store event
      this.saveEvent(newEvent);

      // Show success modal
      modalManager.showEventCreationSuccess(newEvent.title, newEvent.id);

      return true;
    } catch (error) {
      console.error("Event creation error:", error);
      this.showError(formElement, "Failed to create event. Please try again.");
      return false;
    } finally {
      this.setLoadingState(formElement, false);
    }
  }

  // Validate event form with custom rules
  validateEventForm(eventData, customRules) {
    const errors = {};
    let isValid = true;

    Object.keys(eventData).forEach((fieldName) => {
      const value = eventData[fieldName];
      const rules = customRules[fieldName];

      if (!rules) return;

      const fieldErrors = [];

      // Required check
      if (rules.required && (!value || String(value).trim() === "")) {
        fieldErrors.push(`${this.capitalizeFirst(fieldName)} is required`);
        errors[fieldName] = fieldErrors;
        isValid = false;
        return;
      }

      // Skip other validations if field is empty and not required
      if (!value || String(value).trim() === "") return;

      // Length checks
      if (rules.minLength && String(value).length < rules.minLength) {
        fieldErrors.push(
          `${this.capitalizeFirst(fieldName)} must be at least ${rules.minLength} characters`,
        );
      }

      if (rules.maxLength && String(value).length > rules.maxLength) {
        fieldErrors.push(
          `${this.capitalizeFirst(fieldName)} must be no more than ${rules.maxLength} characters`,
        );
      }

      // Pattern check
      if (rules.pattern && !rules.pattern.test(String(value))) {
        fieldErrors.push(
          rules.message ||
            `${this.capitalizeFirst(fieldName)} format is invalid`,
        );
      }

      // Options check
      if (rules.options && !rules.options.includes(value)) {
        fieldErrors.push(rules.message || `Please select a valid ${fieldName}`);
      }

      // Custom validation
      if (rules.custom && !rules.custom(value)) {
        fieldErrors.push(
          rules.message || `${this.capitalizeFirst(fieldName)} is invalid`,
        );
      }

      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  // Handle event registration
  async handleEventRegistration(eventId, userEmail = null) {
    const user = userManager.getUser();
    const email = userEmail || user?.email;

    if (!email) {
      // Redirect to login if not authenticated
      window.location.href = "/login";
      return false;
    }

    try {
      // Simulate API call
      await this.delay(1000);

      // Get event data
      const event = this.getEventById(eventId);
      if (!event) {
        throw new Error("Event not found");
      }

      // Check if already registered
      if (event.registrations.includes(email)) {
        this.showMessage(
          "You are already registered for this event",
          "warning",
        );
        return false;
      }

      // Check capacity
      if (event.attendees >= event.maxSeats) {
        this.showMessage("Sorry, this event is full", "error");
        return false;
      }

      // Register user
      event.registrations.push(email);
      event.attendees += 1;
      this.saveEvent(event);

      // Show success modal
      modalManager.showRegistrationSuccess(event.title);

      return true;
    } catch (error) {
      console.error("Registration error:", error);
      this.showMessage("Registration failed. Please try again.", "error");
      return false;
    }
  }

  // Display event cards
  displayEventCards(events, containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = "";

    events.forEach((event, index) => {
      const card = this.createEventCard(event, index);
      container.appendChild(card);
    });
  }

  // Create event card element
  createEventCard(event, index = 0) {
    const card = document.createElement("div");
    card.className =
      "event-card bg-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer";
    card.style.animationDelay = `${index * 0.1}s`;

    const seatsLeft = event.maxSeats - event.attendees;
    const seatsPercentage = (event.attendees / event.maxSeats) * 100;

    card.innerHTML = `
      <div class="relative overflow-hidden">
        <img 
          src="${event.image || "/placeholder.svg"}" 
          alt="${event.title}"
          class="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-110"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div class="absolute top-4 right-4">
          <span class="px-2 py-1 bg-white/90 text-gray-800 rounded-full text-xs font-medium">
            ${event.category}
          </span>
        </div>
        ${
          event.status === "featured"
            ? `
          <div class="absolute top-4 left-4">
            <span class="px-2 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs font-medium flex items-center">
              <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
              </svg>
              Featured
            </span>
          </div>
        `
            : ""
        }
      </div>
      
      <div class="p-6">
        <h3 class="text-xl font-semibold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors">
          ${event.title}
        </h3>
        
        <p class="text-gray-600 text-sm mb-4 line-clamp-2">
          ${event.description}
        </p>
        
        <div class="space-y-2 text-sm text-gray-500 mb-4">
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            ${this.formatDate(event.date)}
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            ${event.time}
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            ${event.venue}
          </div>
          <div class="flex items-center">
            <svg class="w-4 h-4 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
            </svg>
            ${seatsLeft} seats left
          </div>
        </div>
        
        <!-- Capacity Bar -->
        <div class="mb-4">
          <div class="flex justify-between text-xs text-gray-500 mb-1">
            <span>${event.attendees} registered</span>
            <span>${event.maxSeats} capacity</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300" 
                 style="width: ${seatsPercentage}%"></div>
          </div>
        </div>
        
        <div class="flex space-x-2">
          <button 
            class="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-4 rounded-md transition-all duration-300 font-medium"
            onclick="eventManager.handleEventRegistration('${event.id}')"
          >
            Register Now
          </button>
          <button 
            class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onclick="window.location.href='/event-details/${event.id}'"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
          </button>
        </div>
      </div>
    `;

    // Add click handler for card
    card.addEventListener("click", (e) => {
      // Don't navigate if clicking on buttons
      if (e.target.tagName === "BUTTON" || e.target.closest("button")) {
        return;
      }
      window.location.href = `/event-details/${event.id}`;
    });

    return card;
  }

  // Utility functions
  generateEventId() {
    return "evt_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  saveEvent(event) {
    try {
      const events = this.getAllEvents();
      const existingIndex = events.findIndex((e) => e.id === event.id);

      if (existingIndex !== -1) {
        events[existingIndex] = event;
      } else {
        events.push(event);
      }

      localStorage.setItem(this.eventStorage, JSON.stringify(events));
      return true;
    } catch (error) {
      console.error("Failed to save event:", error);
      return false;
    }
  }

  getAllEvents() {
    try {
      const events = localStorage.getItem(this.eventStorage);
      return events ? JSON.parse(events) : [];
    } catch (error) {
      console.error("Failed to get events:", error);
      return [];
    }
  }

  getEventById(eventId) {
    const events = this.getAllEvents();
    return events.find((event) => event.id === eventId);
  }

  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Display form errors
  displayFormErrors(formElement, errors) {
    Object.keys(errors).forEach((fieldName) => {
      const field = formElement.querySelector(
        `[name="${fieldName}"], #${fieldName}`,
      );
      if (field) {
        this.validator.displayFieldError(field, errors[fieldName]);
      }
    });
  }

  // Show error message
  showError(formElement, message) {
    const existingError = formElement.querySelector(".form-error");
    if (existingError) {
      existingError.remove();
    }

    const errorElement = document.createElement("div");
    errorElement.className =
      "form-error bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4";
    errorElement.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        ${message}
      </div>
    `;

    formElement.insertBefore(errorElement, formElement.firstChild);
  }

  // Show message
  showMessage(message, type = "info") {
    const colors = {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
    };

    const messageElement = document.createElement("div");
    messageElement.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-md shadow-lg z-50 transform transition-all duration-300`;
    messageElement.textContent = message;

    document.body.appendChild(messageElement);

    // Auto remove after 3 seconds
    setTimeout(() => {
      messageElement.style.transform = "translateX(100%)";
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.parentNode.removeChild(messageElement);
        }
      }, 300);
    }, 3000);
  }

  // Set loading state
  setLoadingState(formElement, isLoading) {
    this.isLoading = isLoading;
    const submitButton = formElement.querySelector('button[type="submit"]');

    if (submitButton) {
      if (isLoading) {
        submitButton.disabled = true;
        submitButton.innerHTML = `
          <div class="flex items-center justify-center">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Creating Event...
          </div>
        `;
      } else {
        submitButton.disabled = false;
        submitButton.innerHTML = "Create Event";
      }
    }
  }

  // Setup form handling
  setupEventFormHandling() {
    const createEventForm = document.querySelector(
      '#create-event-form, form[data-type="create-event"]',
    );
    if (createEventForm) {
      this.validator.setupRealTimeValidation(createEventForm);

      createEventForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        await this.handleCreateEvent(createEventForm);
      });
    }
  }
}

// Initialize event manager when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const eventManager = new EventManager();
  eventManager.setupEventFormHandling();

  // Make available globally
  window.eventManager = eventManager;
});

// Export for use in other modules
export const eventManager = new EventManager();
