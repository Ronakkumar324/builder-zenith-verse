// main.js - Core utility functions for navigation and user management

/**
 * Mobile Navigation Toggle
 */
export class MobileNavigation {
  constructor() {
    this.isOpen = false;
    this.mobileMenuButton = null;
    this.mobileMenu = null;
    this.init();
  }

  init() {
    // Create mobile menu elements if they don't exist
    this.createMobileElements();
    this.bindEvents();
  }

  createMobileElements() {
    // Create mobile menu button
    const header = document.querySelector('header');
    if (!header) return;

    const existingButton = header.querySelector('.mobile-menu-button');
    if (existingButton) return;

    // Create hamburger button
    const button = document.createElement('button');
    button.className = 'mobile-menu-button md:hidden p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-gray-100 transition-colors';
    button.innerHTML = `
      <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
      </svg>
    `;

    // Insert button before desktop nav
    const desktopNav = header.querySelector('nav');
    if (desktopNav) {
      desktopNav.parentNode.insertBefore(button, desktopNav);
    }

    this.mobileMenuButton = button;

    // Create mobile menu overlay
    this.createMobileMenu();
  }

  createMobileMenu() {
    const existingMenu = document.querySelector('.mobile-menu-overlay');
    if (existingMenu) return;

    const overlay = document.createElement('div');
    overlay.className = 'mobile-menu-overlay fixed inset-0 z-50 hidden';
    overlay.innerHTML = `
      <div class="fixed inset-0 bg-black bg-opacity-50" data-close-menu></div>
      <div class="fixed top-0 right-0 h-full w-64 bg-white shadow-xl transform translate-x-full transition-transform duration-300 ease-in-out">
        <div class="flex items-center justify-between p-4 border-b">
          <span class="text-lg font-bold text-gray-900">Menu</span>
          <button class="close-mobile-menu p-2 rounded-md text-gray-700 hover:text-indigo-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        <nav class="p-4 space-y-4">
          <a href="/" class="block py-2 text-gray-700 hover:text-indigo-600 font-medium">Home</a>
          <a href="/events" class="block py-2 text-gray-700 hover:text-indigo-600 font-medium">Events</a>
          <a href="/dashboard" class="block py-2 text-gray-700 hover:text-indigo-600 font-medium">Dashboard</a>
          <div class="border-t pt-4 mt-4 space-y-2">
            <a href="/login" class="block w-full py-2 px-4 text-center border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">Sign In</a>
            <a href="/signup" class="block w-full py-2 px-4 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700">Sign Up</a>
          </div>
        </nav>
      </div>
    `;

    document.body.appendChild(overlay);
    this.mobileMenu = overlay;
  }

  bindEvents() {
    // Mobile menu button click
    if (this.mobileMenuButton) {
      this.mobileMenuButton.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu events
    document.addEventListener('click', (e) => {
      if (e.target.hasAttribute('data-close-menu') || e.target.closest('.close-mobile-menu')) {
        this.closeMenu();
      }
    });

    // Escape key to close menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMenu();
      }
    });

    // Handle window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isOpen) {
        this.closeMenu();
      }
    });
  }

  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  openMenu() {
    if (!this.mobileMenu) return;
    
    this.isOpen = true;
    this.mobileMenu.classList.remove('hidden');
    
    // Animate menu slide in
    setTimeout(() => {
      const menuPanel = this.mobileMenu.querySelector('.fixed.top-0.right-0');
      if (menuPanel) {
        menuPanel.classList.remove('translate-x-full');
      }
    }, 10);

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMenu() {
    if (!this.mobileMenu || !this.isOpen) return;
    
    const menuPanel = this.mobileMenu.querySelector('.fixed.top-0.right-0');
    if (menuPanel) {
      menuPanel.classList.add('translate-x-full');
    }

    // Hide overlay after animation
    setTimeout(() => {
      this.mobileMenu.classList.add('hidden');
      this.isOpen = false;
    }, 300);

    // Restore body scroll
    document.body.style.overflow = '';
  }
}

/**
 * User Role Management
 */
export class UserManager {
  constructor() {
    this.storageKey = 'eventhub_user';
    this.roleRedirectMap = {
      'admin': '/admin-panel',
      'organizer': '/dashboard',
      'participant': '/dashboard'
    };
  }

  // Store user data in localStorage
  setUser(userData) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Failed to store user data:', error);
      return false;
    }
  }

  // Get user data from localStorage
  getUser() {
    try {
      const userData = localStorage.getItem(this.storageKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Failed to retrieve user data:', error);
      return null;
    }
  }

  // Remove user data (logout)
  clearUser() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('Failed to clear user data:', error);
      return false;
    }
  }

  // Check if user is logged in
  isLoggedIn() {
    const user = this.getUser();
    return user && user.email && user.role;
  }

  // Get user role
  getUserRole() {
    const user = this.getUser();
    return user ? user.role : null;
  }

  // Redirect user based on role
  redirectByRole(defaultPath = '/') {
    const user = this.getUser();
    if (!user || !user.role) {
      window.location.href = defaultPath;
      return;
    }

    const redirectPath = this.roleRedirectMap[user.role] || defaultPath;
    window.location.href = redirectPath;
  }

  // Simulate login and redirect
  simulateLogin(userData) {
    if (this.setUser(userData)) {
      this.redirectByRole();
      return true;
    }
    return false;
  }

  // Simulate logout and redirect
  simulateLogout() {
    this.clearUser();
    window.location.href = '/';
  }
}

/**
 * Modal Management
 */
export class ModalManager {
  constructor() {
    this.activeModal = null;
  }

  // Show registration success modal
  showRegistrationSuccess(eventTitle, redirectPath = '/dashboard') {
    const modal = this.createModal('registration-success', {
      title: 'Registration Successful!',
      content: `
        <div class="text-center">
          <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">You're all set!</h3>
          <p class="text-gray-600 mb-4">
            You have successfully registered for <strong>${eventTitle}</strong>
          </p>
          <p class="text-sm text-gray-500 mb-6">
            A confirmation email has been sent to your registered email address.
          </p>
          <div class="flex space-x-3">
            <button class="modal-close flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
              Close
            </button>
            <button class="modal-redirect flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700" data-redirect="${redirectPath}">
              Go to Dashboard
            </button>
          </div>
        </div>
      `
    });

    this.showModal(modal);
  }

  // Show event creation success modal
  showEventCreationSuccess(eventTitle, eventId) {
    const modal = this.createModal('event-creation-success', {
      title: 'Event Created Successfully!',
      content: `
        <div class="text-center">
          <div class="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Event Created!</h3>
          <p class="text-gray-600 mb-4">
            Your event <strong>"${eventTitle}"</strong> has been created successfully!
          </p>
          <div class="flex justify-center mb-4">
            <span class="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Event ID: ${eventId}</span>
          </div>
          <p class="text-sm text-gray-500 mb-6">
            Your event is now live and people can start registering!
          </p>
          <div class="flex space-x-3">
            <button class="modal-redirect flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" data-redirect="/dashboard">
              Go to Dashboard
            </button>
            <button class="modal-redirect flex-1 px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-md hover:from-indigo-700 hover:to-purple-700" data-redirect="/event-details/${eventId}">
              View Event
            </button>
          </div>
        </div>
      `
    });

    this.showModal(modal);
  }

  // Create modal element
  createModal(id, options) {
    const modal = document.createElement('div');
    modal.id = id;
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50';
    modal.innerHTML = `
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all" onclick="event.stopPropagation()">
        <div class="p-6">
          ${options.content}
        </div>
      </div>
    `;

    // Bind events
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal(modal);
      }
    });

    // Close button events
    modal.querySelectorAll('.modal-close').forEach(btn => {
      btn.addEventListener('click', () => this.closeModal(modal));
    });

    // Redirect button events
    modal.querySelectorAll('.modal-redirect').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const redirectPath = e.target.getAttribute('data-redirect');
        if (redirectPath) {
          window.location.href = redirectPath;
        }
      });
    });

    // Escape key to close
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        this.closeModal(modal);
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    return modal;
  }

  // Show modal
  showModal(modal) {
    if (this.activeModal) {
      this.closeModal(this.activeModal);
    }

    document.body.appendChild(modal);
    this.activeModal = modal;

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Animate in
    setTimeout(() => {
      modal.querySelector('.bg-white').style.transform = 'scale(1)';
    }, 10);
  }

  // Close modal
  closeModal(modal) {
    if (!modal || !modal.parentNode) return;

    // Animate out
    modal.querySelector('.bg-white').style.transform = 'scale(0.95)';
    modal.style.opacity = '0';

    setTimeout(() => {
      if (modal.parentNode) {
        modal.parentNode.removeChild(modal);
      }
      if (this.activeModal === modal) {
        this.activeModal = null;
      }
      // Restore body scroll
      document.body.style.overflow = '';
    }, 200);
  }
}

// Initialize mobile navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new MobileNavigation();
});

// Export instances for global use
export const userManager = new UserManager();
export const modalManager = new ModalManager();
