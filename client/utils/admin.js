// admin.js - Admin panel utilities and management functions

import { userManager } from './main.js';
import { eventManager } from './events.js';

/**
 * Admin Manager
 */
export class AdminManager {
  constructor() {
    this.adminStorage = 'eventhub_admin_data';
    this.isLoading = false;
  }

  // Handle approve/reject event actions
  handleEventAction(eventId, action, buttonElement = null) {
    try {
      // Update UI immediately for better UX
      if (buttonElement) {
        this.setButtonLoading(buttonElement, true);
      }

      // Simulate API delay
      setTimeout(() => {
        // Get event data
        const events = eventManager.getAllEvents();
        const eventIndex = events.findIndex(e => e.id == eventId);
        
        if (eventIndex === -1) {
          this.showMessage('Event not found', 'error');
          return;
        }

        // Update event status
        const newStatus = action === 'approve' ? 'approved' : 'rejected';
        events[eventIndex].status = newStatus;
        events[eventIndex].reviewedAt = new Date().toISOString();
        events[eventIndex].reviewedBy = userManager.getUser()?.name || 'Admin';

        // Save updated events
        localStorage.setItem(eventManager.eventStorage, JSON.stringify(events));

        // Update UI
        this.updateEventRowStatus(eventId, newStatus);
        this.updateStats();

        // Show success message
        const actionText = action === 'approve' ? 'approved' : 'rejected';
        this.showMessage(`Event ${actionText} successfully`, 'success');

        // Reset button state
        if (buttonElement) {
          this.setButtonLoading(buttonElement, false);
        }

      }, 1000); // Simulate network delay

    } catch (error) {
      console.error('Event action error:', error);
      this.showMessage('Action failed. Please try again.', 'error');
      
      if (buttonElement) {
        this.setButtonLoading(buttonElement, false);
      }
    }
  }

  // Handle user management actions (ban/unban/delete)
  handleUserAction(userId, action, buttonElement = null) {
    try {
      if (buttonElement) {
        this.setButtonLoading(buttonElement, true);
      }

      // Simulate API delay
      setTimeout(() => {
        const users = this.getAllUsers();
        const userIndex = users.findIndex(u => u.id == userId);
        
        if (userIndex === -1) {
          this.showMessage('User not found', 'error');
          return;
        }

        if (action === 'delete') {
          // Remove user from array
          users.splice(userIndex, 1);
          this.saveUsers(users);
          
          // Remove user row from UI
          this.removeUserRow(userId);
          this.showMessage('User deleted successfully', 'success');
          
        } else if (action === 'ban' || action === 'unban') {
          // Toggle ban status
          const newStatus = action === 'ban' ? 'banned' : 'active';
          users[userIndex].status = newStatus;
          users[userIndex].statusChangedAt = new Date().toISOString();
          users[userIndex].statusChangedBy = userManager.getUser()?.name || 'Admin';
          
          this.saveUsers(users);
          
          // Update UI
          this.updateUserRowStatus(userId, newStatus);
          
          const actionText = action === 'ban' ? 'banned' : 'unbanned';
          this.showMessage(`User ${actionText} successfully`, 'success');
        }

        // Update statistics
        this.updateStats();

        if (buttonElement) {
          this.setButtonLoading(buttonElement, false);
        }

      }, 800);

    } catch (error) {
      console.error('User action error:', error);
      this.showMessage('Action failed. Please try again.', 'error');
      
      if (buttonElement) {
        this.setButtonLoading(buttonElement, false);
      }
    }
  }

  // Update event row status in the table
  updateEventRowStatus(eventId, newStatus) {
    const row = document.querySelector(`[data-event-id="${eventId}"]`);
    if (!row) return;

    // Update status badge
    const statusBadge = row.querySelector('.event-status');
    if (statusBadge) {
      statusBadge.className = `event-status px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClasses(newStatus)}`;
      statusBadge.textContent = newStatus;
    }

    // Update action buttons
    const actionsCell = row.querySelector('.event-actions');
    if (actionsCell && newStatus !== 'pending') {
      // Hide approve/reject buttons for non-pending events
      const actionButtons = actionsCell.querySelectorAll('.action-btn');
      actionButtons.forEach(btn => {
        if (btn.dataset.action === 'approve' || btn.dataset.action === 'reject') {
          btn.style.display = 'none';
        }
      });

      // Add status indicator
      const statusIndicator = document.createElement('span');
      statusIndicator.className = `ml-2 text-xs text-gray-500`;
      statusIndicator.textContent = `(${newStatus})`;
      actionsCell.appendChild(statusIndicator);
    }
  }

  // Update user row status in the table
  updateUserRowStatus(userId, newStatus) {
    const row = document.querySelector(`[data-user-id="${userId}"]`);
    if (!row) return;

    // Update status badge
    const statusBadge = row.querySelector('.user-status');
    if (statusBadge) {
      statusBadge.className = `user-status px-2 py-1 rounded-full text-xs font-medium ${this.getStatusClasses(newStatus)}`;
      statusBadge.textContent = newStatus;
    }

    // Update ban/unban button
    const banButton = row.querySelector('[data-action="ban"], [data-action="unban"]');
    if (banButton) {
      if (newStatus === 'banned') {
        banButton.dataset.action = 'unban';
        banButton.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path>
          </svg>
          Unban
        `;
        banButton.className = 'action-btn px-3 py-1 border border-green-500 text-green-600 hover:bg-green-50 rounded text-sm';
      } else {
        banButton.dataset.action = 'ban';
        banButton.innerHTML = `
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728"></path>
          </svg>
          Ban
        `;
        banButton.className = 'action-btn px-3 py-1 border border-orange-500 text-orange-600 hover:bg-orange-50 rounded text-sm';
      }
    }
  }

  // Remove user row from table
  removeUserRow(userId) {
    const row = document.querySelector(`[data-user-id="${userId}"]`);
    if (row) {
      row.style.opacity = '0';
      row.style.transform = 'translateX(-20px)';
      setTimeout(() => {
        if (row.parentNode) {
          row.parentNode.removeChild(row);
        }
      }, 300);
    }
  }

  // Get status CSS classes
  getStatusClasses(status) {
    const statusClasses = {
      'approved': 'bg-green-100 text-green-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'rejected': 'bg-red-100 text-red-800',
      'active': 'bg-green-100 text-green-800',
      'banned': 'bg-red-100 text-red-800',
      'flagged': 'bg-orange-100 text-orange-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  }

  // Update dashboard statistics
  updateStats() {
    const events = eventManager.getAllEvents();
    const users = this.getAllUsers();

    const stats = {
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      totalEvents: events.length,
      pendingEvents: events.filter(e => e.status === 'pending').length,
      approvedEvents: events.filter(e => e.status === 'approved').length,
      rejectedEvents: events.filter(e => e.status === 'rejected').length
    };

    // Update stat cards
    Object.keys(stats).forEach(statKey => {
      const statElement = document.querySelector(`[data-stat="${statKey}"]`);
      if (statElement) {
        statElement.textContent = stats[statKey];
        
        // Add animation
        statElement.style.transform = 'scale(1.1)';
        setTimeout(() => {
          statElement.style.transform = 'scale(1)';
        }, 200);
      }
    });
  }

  // Set button loading state
  setButtonLoading(button, isLoading) {
    if (isLoading) {
      button.disabled = true;
      button.dataset.originalContent = button.innerHTML;
      button.innerHTML = `
        <svg class="animate-spin w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      `;
    } else {
      button.disabled = false;
      if (button.dataset.originalContent) {
        button.innerHTML = button.dataset.originalContent;
      }
    }
  }

  // Show toast message
  showMessage(message, type = 'info') {
    const colors = {
      success: 'bg-green-500',
      error: 'bg-red-500',
      warning: 'bg-yellow-500',
      info: 'bg-blue-500'
    };

    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${colors[type]} text-white px-6 py-3 rounded-lg shadow-lg z-50 transform transition-all duration-300`;
    toast.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          ${this.getIconPath(type)}
        </svg>
        ${message}
      </div>
    `;

    document.body.appendChild(toast);

    // Auto remove
    setTimeout(() => {
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 300);
    }, 3000);
  }

  // Get icon path for message type
  getIconPath(type) {
    const icons = {
      success: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>',
      error: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>',
      warning: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>',
      info: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>'
    };
    return icons[type] || icons.info;
  }

  // User management utilities
  getAllUsers() {
    try {
      const users = localStorage.getItem('eventhub_users');
      return users ? JSON.parse(users) : this.getDefaultUsers();
    } catch (error) {
      console.error('Failed to get users:', error);
      return this.getDefaultUsers();
    }
  }

  saveUsers(users) {
    try {
      localStorage.setItem('eventhub_users', JSON.stringify(users));
      return true;
    } catch (error) {
      console.error('Failed to save users:', error);
      return false;
    }
  }

  getDefaultUsers() {
    return [
      {
        id: 1,
        name: "Ronak Bhambu",
        email: "ronak@college.edu",
        role: "organizer",
        status: "active",
        joinDate: "Jan 2024",
        eventsCreated: 3,
        avatar: "/placeholder.svg"
      },
      {
        id: 2,
        name: "Sarah Johnson",
        email: "sarah@college.edu",
        role: "participant",
        status: "active",
        joinDate: "Feb 2024",
        eventsCreated: 0,
        avatar: "/placeholder.svg"
      },
      {
        id: 3,
        name: "Mike Chen",
        email: "mike@college.edu",
        role: "organizer",
        status: "active",
        joinDate: "Dec 2023",
        eventsCreated: 5,
        avatar: "/placeholder.svg"
      }
    ];
  }

  // Setup admin panel event handlers
  setupAdminHandlers() {
    // Event action handlers
    document.addEventListener('click', (e) => {
      const actionButton = e.target.closest('[data-action]');
      if (!actionButton) return;

      const action = actionButton.dataset.action;
      const eventId = actionButton.dataset.eventId;
      const userId = actionButton.dataset.userId;

      if (eventId && (action === 'approve' || action === 'reject')) {
        e.preventDefault();
        this.handleEventAction(eventId, action, actionButton);
      } else if (userId && (action === 'ban' || action === 'unban' || action === 'delete')) {
        e.preventDefault();
        
        // Confirm destructive actions
        if (action === 'delete') {
          if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
            this.handleUserAction(userId, action, actionButton);
          }
        } else {
          this.handleUserAction(userId, action, actionButton);
        }
      }
    });

    // Initialize stats
    this.updateStats();
  }

  // Export data functionality
  exportEvents() {
    const events = eventManager.getAllEvents();
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `events_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    this.showMessage('Events exported successfully', 'success');
  }

  exportUsers() {
    const users = this.getAllUsers();
    const dataStr = JSON.stringify(users, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `users_export_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    this.showMessage('Users exported successfully', 'success');
  }

  // Bulk actions
  bulkApproveEvents() {
    const events = eventManager.getAllEvents();
    const pendingEvents = events.filter(e => e.status === 'pending');
    
    if (pendingEvents.length === 0) {
      this.showMessage('No pending events to approve', 'warning');
      return;
    }

    if (confirm(`Are you sure you want to approve all ${pendingEvents.length} pending events?`)) {
      pendingEvents.forEach(event => {
        event.status = 'approved';
        event.reviewedAt = new Date().toISOString();
        event.reviewedBy = userManager.getUser()?.name || 'Admin';
      });

      localStorage.setItem(eventManager.eventStorage, JSON.stringify(events));
      
      // Refresh page to update UI
      window.location.reload();
    }
  }

  // System health check
  performSystemCheck() {
    const checks = {
      localStorage: this.checkLocalStorage(),
      userSessions: this.checkUserSessions(),
      eventData: this.checkEventData(),
      adminPermissions: this.checkAdminPermissions()
    };

    const results = Object.entries(checks).map(([check, status]) => 
      `${check}: ${status ? '✅ OK' : '❌ FAIL'}`
    ).join('\n');

    alert(`System Health Check:\n\n${results}`);
  }

  checkLocalStorage() {
    try {
      localStorage.setItem('test', 'test');
      localStorage.removeItem('test');
      return true;
    } catch (error) {
      return false;
    }
  }

  checkUserSessions() {
    const user = userManager.getUser();
    return user && user.role === 'admin';
  }

  checkEventData() {
    try {
      const events = eventManager.getAllEvents();
      return Array.isArray(events);
    } catch (error) {
      return false;
    }
  }

  checkAdminPermissions() {
    const user = userManager.getUser();
    return user && (user.role === 'admin' || user.role === 'organizer');
  }
}

// Initialize admin manager when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on admin pages
  if (window.location.pathname.includes('admin') || document.querySelector('[data-admin-panel]')) {
    const adminManager = new AdminManager();
    adminManager.setupAdminHandlers();
    
    // Make available globally
    window.adminManager = adminManager;
  }
});

// Export for use in other modules
export const adminManager = new AdminManager();
