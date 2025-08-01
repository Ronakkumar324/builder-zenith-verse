// dashboard.js - Dashboard functionality and user management

class DashboardManager {
  constructor() {
    this.user = this.getCurrentUser();
    this.events = this.loadEvents();
    this.registeredEvents = this.loadRegisteredEvents();
    this.organizedEvents = this.loadOrganizedEvents();

    this.init();
  }

  init() {
    this.setupUserInterface();
    this.setupTabs();
    this.setupThemeToggle();
    this.loadDashboardData();
    this.setupMobileNavigation();
  }

  // Get current user from localStorage
  getCurrentUser() {
    try {
      const stored = localStorage.getItem("eventhub_user");
      return stored
        ? JSON.parse(stored)
        : {
            name: "Ronak",
            email: "ronak@college.edu",
            role: "organizer",
            avatar: "https://via.placeholder.com/80",
          };
    } catch (error) {
      console.error("Error loading user:", error);
      return {
        name: "Guest",
        email: "guest@college.edu",
        role: "participant",
        avatar: "https://via.placeholder.com/80",
      };
    }
  }

  // Setup user interface based on role
  setupUserInterface() {
    // Update user name and role
    const userNameEl = document.getElementById("user-name");
    const userRoleEl = document.getElementById("user-role-text");
    const profileNameEl = document.getElementById("profile-name");
    const profileEmailEl = document.getElementById("profile-email");
    const profileRoleEl = document.getElementById("profile-role");

    if (userNameEl) userNameEl.textContent = this.user.name;
    if (userRoleEl) userRoleEl.textContent = this.formatRole(this.user.role);
    if (profileNameEl) profileNameEl.textContent = this.user.name;
    if (profileEmailEl) profileEmailEl.textContent = this.user.email;
    if (profileRoleEl)
      profileRoleEl.textContent = this.formatRole(this.user.role);

    // Show/hide organizer-specific elements
    if (this.user.role === "organizer") {
      this.showElement("organizer-stats-1");
      this.showElement("organizer-stats-2");
      this.showElement("organized-tab");
      this.hideElement("participant-stats-1");
      this.hideElement("participant-stats-2");
    } else {
      this.hideElement("organizer-stats-1");
      this.hideElement("organizer-stats-2");
      this.hideElement("organized-tab");
      this.showElement("participant-stats-1");
      this.showElement("participant-stats-2");
    }

    // Update avatar
    const avatarElements = document.querySelectorAll(
      ".avatar-img, .profile-img",
    );
    avatarElements.forEach((img) => {
      img.src = this.user.avatar;
      img.alt = `${this.user.name} Avatar`;
    });
  }

  // Format role for display
  formatRole(role) {
    switch (role) {
      case "organizer":
        return "Event Organizer";
      case "participant":
        return "Event Participant";
      case "admin":
        return "Administrator";
      default:
        return "User";
    }
  }

  // Setup tab functionality
  setupTabs() {
    const tabButtons = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const targetTab = button.getAttribute("data-tab");

        // Remove active class from all tabs and contents
        tabButtons.forEach((btn) => btn.classList.remove("active"));
        tabContents.forEach((content) => content.classList.remove("active"));

        // Add active class to clicked tab and corresponding content
        button.classList.add("active");
        const targetContent = document.getElementById(
          `${targetTab}-tab-content`,
        );
        if (targetContent) {
          targetContent.classList.add("active");
        }

        // Load tab-specific data
        this.loadTabData(targetTab);
      });
    });
  }

  // Load data for specific tab
  loadTabData(tab) {
    switch (tab) {
      case "registered":
        this.loadRegisteredEventsData();
        break;
      case "organized":
        this.loadOrganizedEventsData();
        break;
      case "profile":
        // Profile data is already loaded
        break;
    }
  }

  // Load dashboard data
  loadDashboardData() {
    this.updateStatistics();
    this.loadRegisteredEventsData();
    if (this.user.role === "organizer") {
      this.loadOrganizedEventsData();
    }
  }

  // Update statistics
  updateStatistics() {
    const stats = this.calculateStatistics();

    this.updateStatElement("registered-events", stats.registeredEvents);
    this.updateStatElement("events-attended", stats.eventsAttended);
    this.updateStatElement("upcoming-events", stats.upcomingEvents);

    if (this.user.role === "organizer") {
      this.updateStatElement("organized-events", stats.organizedEvents);
      this.updateStatElement("total-registrations", stats.totalRegistrations);
    }
  }

  // Calculate statistics
  calculateStatistics() {
    const now = new Date();

    return {
      registeredEvents: this.registeredEvents.length,
      eventsAttended: this.registeredEvents.filter(
        (event) => new Date(event.date) < now && event.status !== "cancelled",
      ).length,
      upcomingEvents: this.registeredEvents.filter(
        (event) => new Date(event.date) > now,
      ).length,
      organizedEvents: this.organizedEvents.length,
      totalRegistrations: this.organizedEvents.reduce(
        (total, event) => total + (event.attendees || 0),
        0,
      ),
    };
  }

  // Update stat element
  updateStatElement(id, value) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = value;
      // Add animation
      element.style.transform = "scale(1.1)";
      setTimeout(() => {
        element.style.transform = "scale(1)";
      }, 200);
    }
  }

  // Load registered events data
  loadRegisteredEventsData() {
    const container = document.getElementById("registered-events-grid");
    if (container) {
      this.renderEvents(container, this.registeredEvents, "registered");
    }
  }

  // Load organized events data
  loadOrganizedEventsData() {
    const container = document.getElementById("organized-events-grid");
    if (container) {
      this.renderEvents(container, this.organizedEvents, "organized");
    }
  }

  // Render events in container
  renderEvents(container, events, type) {
    if (!container) return;

    if (events.length === 0) {
      container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📅</div>
                    <h3>No events found</h3>
                    <p>You haven't ${type === "registered" ? "registered for" : "organized"} any events yet.</p>
                    <button class="btn btn-primary" onclick="location.href='create-event.html'">
                        ${type === "registered" ? "Browse Events" : "Create Event"}
                    </button>
                </div>
            `;
      return;
    }

    container.innerHTML = "";
    events.forEach((event, index) => {
      const eventCard = this.createEventCard(event, type, index);
      container.appendChild(eventCard);
    });
  }

  // Create event card element
  createEventCard(event, type, index) {
    const template = document.getElementById("event-card-template");
    if (!template) return document.createElement("div");

    const card = template.content.cloneNode(true);
    const cardElement = card.querySelector(".event-card");

    // Add animation delay
    cardElement.style.animationDelay = `${index * 0.1}s`;
    cardElement.classList.add("fade-in");

    // Fill in event data
    const img = card.querySelector(".card-img");
    const title = card.querySelector(".event-title");
    const date = card.querySelector(".event-date");
    const time = card.querySelector(".event-time");
    const location = card.querySelector(".event-location");
    const attendees = card.querySelector(".event-attendees");
    const status = card.querySelector(".event-status");
    const actionBtn = card.querySelector(".event-action-btn");

    if (img) img.src = event.image || "https://via.placeholder.com/300x150";
    if (title) title.textContent = event.title;
    if (date) date.textContent = this.formatDate(event.date);
    if (time) time.textContent = event.time;
    if (location) location.textContent = event.venue;

    if (attendees) {
      if (type === "organized") {
        attendees.textContent = `${event.attendees || 0}/${event.maxSeats} registered`;
      } else {
        attendees.textContent = `${event.attendees || 0} attending`;
      }
    }

    // Set status
    if (status) {
      const eventStatus = this.getEventStatus(event);
      status.textContent = eventStatus.text;
      status.className = `event-status ${eventStatus.class}`;
    }

    // Set action button
    if (actionBtn) {
      if (type === "organized") {
        actionBtn.textContent = "Manage";
        actionBtn.onclick = () => this.manageEvent(event.id);
      } else {
        actionBtn.textContent = "View Details";
        actionBtn.onclick = () => this.viewEventDetails(event.id);
      }
    }

    return cardElement;
  }

  // Get event status
  getEventStatus(event) {
    const now = new Date();
    const eventDate = new Date(event.date);

    if (event.status === "cancelled") {
      return { text: "Cancelled", class: "status-cancelled" };
    } else if (eventDate < now) {
      return { text: "Completed", class: "status-completed" };
    } else {
      return { text: "Upcoming", class: "status-upcoming" };
    }
  }

  // Format date for display
  formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  // Load events from localStorage
  loadEvents() {
    try {
      const stored = localStorage.getItem("eventhub_events");
      return stored ? JSON.parse(stored) : this.getSampleEvents();
    } catch (error) {
      console.error("Error loading events:", error);
      return this.getSampleEvents();
    }
  }

  // Load registered events
  loadRegisteredEvents() {
    // In a real app, this would be user-specific
    return this.getSampleRegisteredEvents();
  }

  // Load organized events
  loadOrganizedEvents() {
    if (this.user.role !== "organizer") return [];
    return this.getSampleOrganizedEvents();
  }

  // Get sample events data
  getSampleEvents() {
    return [
      {
        id: "evt_1",
        title: "Tech Innovation Summit 2024",
        description:
          "Join us for an exciting day of technological innovation...",
        date: "2024-03-15",
        time: "10:00 AM",
        venue: "Main Auditorium",
        category: "Technology",
        maxSeats: 200,
        attendees: 150,
        image: "https://via.placeholder.com/300x150",
      },
      {
        id: "evt_2",
        title: "Annual Cultural Festival",
        description: "Celebrate diversity with performances and exhibitions...",
        date: "2024-03-22",
        time: "6:00 PM",
        venue: "College Grounds",
        category: "Cultural",
        maxSeats: 500,
        attendees: 350,
        image: "https://via.placeholder.com/300x150",
      },
    ];
  }

  // Get sample registered events
  getSampleRegisteredEvents() {
    return [
      {
        id: "evt_1",
        title: "Tech Innovation Summit 2024",
        date: "2024-03-15",
        time: "10:00 AM",
        venue: "Main Auditorium",
        attendees: 150,
        status: "active",
        image: "https://via.placeholder.com/300x150",
      },
      {
        id: "evt_2",
        title: "Annual Cultural Festival",
        date: "2024-03-22",
        time: "6:00 PM",
        venue: "College Grounds",
        attendees: 350,
        status: "active",
        image: "https://via.placeholder.com/300x150",
      },
      {
        id: "evt_3",
        title: "Web Development Workshop",
        date: "2024-03-08",
        time: "2:00 PM",
        venue: "Computer Lab",
        attendees: 45,
        status: "completed",
        image: "https://via.placeholder.com/300x150",
      },
    ];
  }

  // Get sample organized events
  getSampleOrganizedEvents() {
    return [
      {
        id: "evt_4",
        title: "AI & Machine Learning Seminar",
        date: "2024-04-12",
        time: "11:00 AM",
        venue: "Conference Hall",
        maxSeats: 120,
        attendees: 89,
        status: "active",
        image: "https://via.placeholder.com/300x150",
      },
      {
        id: "evt_5",
        title: "Spring Career Fair",
        date: "2024-04-18",
        time: "9:00 AM",
        venue: "Student Center",
        maxSeats: 300,
        attendees: 234,
        status: "active",
        image: "https://via.placeholder.com/300x150",
      },
    ];
  }

  // Event actions
  viewEventDetails(eventId) {
    // In a real app, navigate to event details page
    window.location.href = `event-details.html?id=${eventId}`;
  }

  manageEvent(eventId) {
    // In a real app, navigate to event management page
    window.location.href = `manage-event.html?id=${eventId}`;
  }

  // Setup theme toggle
  setupThemeToggle() {
    const themeToggle = document.getElementById("theme-toggle");

    if (themeToggle) {
      // Load saved theme
      const savedTheme = localStorage.getItem("theme") || "light";
      this.setTheme(savedTheme);

      themeToggle.addEventListener("click", () => {
        const currentTheme =
          document.documentElement.getAttribute("data-theme") || "light";
        const newTheme = currentTheme === "light" ? "dark" : "light";
        this.setTheme(newTheme);
      });
    }
  }

  // Set theme
  setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    // Update toggle button
    const themeToggle = document.getElementById("theme-toggle");
    if (themeToggle) {
      themeToggle.textContent = theme === "light" ? "🌙" : "☀️";
    }
  }

  // Setup mobile navigation
  setupMobileNavigation() {
    const hamburger = document.querySelector(".hamburger");

    if (hamburger) {
      hamburger.addEventListener("click", () => {
        this.toggleMobileMenu();
      });
    }
  }

  // Toggle mobile menu
  toggleMobileMenu() {
    const hamburger = document.querySelector(".hamburger");

    hamburger.classList.toggle("active");

    // Create mobile menu if it doesn't exist
    let mobileMenu = document.querySelector(".mobile-menu");
    if (!mobileMenu) {
      mobileMenu = this.createMobileMenu();
      document.body.appendChild(mobileMenu);
    }

    mobileMenu.classList.toggle("show");
  }

  // Create mobile menu
  createMobileMenu() {
    const mobileMenu = document.createElement("div");
    mobileMenu.className = "mobile-menu";
    mobileMenu.innerHTML = `
            <div class="mobile-menu-content">
                <a href="index.html" class="mobile-nav-link">Home</a>
                <a href="#" class="mobile-nav-link">Events</a>
                <a href="dashboard.html" class="mobile-nav-link active">Dashboard</a>
                <div class="mobile-actions">
                    <button class="btn btn-primary" onclick="location.href='create-event.html'">Create Event</button>
                    <button class="btn btn-outline btn-danger" onclick="logout()">Logout</button>
                </div>
            </div>
        `;

    // Add mobile menu styles
    if (!document.querySelector("#mobile-menu-styles")) {
      const style = document.createElement("style");
      style.id = "mobile-menu-styles";
      style.textContent = `
                .mobile-menu {
                    position: fixed;
                    top: 70px;
                    left: 0;
                    right: 0;
                    background: var(--bg-primary);
                    border-top: 1px solid var(--border);
                    transform: translateY(-100%);
                    transition: transform 0.3s ease;
                    z-index: 999;
                    box-shadow: var(--shadow-lg);
                }
                
                .mobile-menu.show {
                    transform: translateY(0);
                }
                
                .mobile-menu-content {
                    padding: 1rem;
                }
                
                .mobile-nav-link {
                    display: block;
                    padding: 0.75rem 0;
                    color: var(--text-primary);
                    text-decoration: none;
                    font-weight: 500;
                    border-bottom: 1px solid var(--border);
                }
                
                .mobile-nav-link:hover,
                .mobile-nav-link.active {
                    color: var(--primary);
                }
                
                .mobile-actions {
                    margin-top: 1rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }
                
                .hamburger.active .bar:nth-child(2) {
                    opacity: 0;
                }
                
                .hamburger.active .bar:nth-child(1) {
                    transform: translateY(7px) rotate(45deg);
                }
                
                .hamburger.active .bar:nth-child(3) {
                    transform: translateY(-7px) rotate(-45deg);
                }
                
                .empty-state {
                    text-align: center;
                    padding: 3rem 1rem;
                    color: var(--text-secondary);
                }
                
                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }
                
                .empty-state h3 {
                    margin-bottom: 0.5rem;
                    color: var(--text-primary);
                }
                
                .empty-state p {
                    margin-bottom: 1.5rem;
                }
                
                .status-upcoming {
                    background: var(--primary);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: var(--radius);
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                
                .status-completed {
                    background: var(--success);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: var(--radius);
                    font-size: 0.75rem;
                    font-weight: 500;
                }
                
                .status-cancelled {
                    background: var(--error);
                    color: white;
                    padding: 0.25rem 0.75rem;
                    border-radius: var(--radius);
                    font-size: 0.75rem;
                    font-weight: 500;
                }
            `;
      document.head.appendChild(style);
    }

    return mobileMenu;
  }

  // Utility functions
  showElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = "block";
    }
  }

  hideElement(id) {
    const element = document.getElementById(id);
    if (element) {
      element.style.display = "none";
    }
  }
}

// Global functions
function logout() {
  if (confirm("Are you sure you want to logout?")) {
    localStorage.removeItem("eventhub_user");
    localStorage.removeItem("eventhub_session");
    window.location.href = "index.html";
  }
}

// Initialize dashboard when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  window.dashboardManager = new DashboardManager();
});
