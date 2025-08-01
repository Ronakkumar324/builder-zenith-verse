// events.js - Event management and form handling

class EventManager {
    constructor() {
        this.form = document.getElementById('create-event-form');
        this.modal = document.getElementById('success-modal');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.events = this.loadEvents();
        
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormValidation();
            this.setupFileUpload();
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
        
        this.setupModalHandlers();
        this.setupThemeToggle();
    }

    // Form validation setup
    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearError(input));
        });
    }

    // Validate individual field
    validateField(field) {
        const value = field.value.trim();
        const name = field.name;
        let isValid = true;
        let message = '';

        // Clear previous error
        this.clearError(field);

        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            message = `${this.formatFieldName(name)} is required`;
        }
        // Specific validations
        else if (value) {
            switch (name) {
                case 'title':
                    if (value.length < 5) {
                        isValid = false;
                        message = 'Title must be at least 5 characters';
                    } else if (value.length > 100) {
                        isValid = false;
                        message = 'Title must be less than 100 characters';
                    }
                    break;
                    
                case 'description':
                    if (value.length < 20) {
                        isValid = false;
                        message = 'Description must be at least 20 characters';
                    } else if (value.length > 1000) {
                        isValid = false;
                        message = 'Description must be less than 1000 characters';
                    }
                    break;
                    
                case 'date':
                    const selectedDate = new Date(value);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (selectedDate < today) {
                        isValid = false;
                        message = 'Event date cannot be in the past';
                    }
                    break;
                    
                case 'maxSeats':
                    const seats = parseInt(value);
                    if (seats < 1) {
                        isValid = false;
                        message = 'Maximum seats must be at least 1';
                    } else if (seats > 10000) {
                        isValid = false;
                        message = 'Maximum seats cannot exceed 10,000';
                    }
                    break;
            }
        }

        if (!isValid) {
            this.showError(field, message);
        }

        return isValid;
    }

    // Show field error
    showError(field, message) {
        field.classList.add('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.add('show');
        }
    }

    // Clear field error
    clearError(field) {
        field.classList.remove('error');
        const errorElement = document.getElementById(`${field.name}-error`);
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('show');
        }
    }

    // Format field name for display
    formatFieldName(name) {
        return name.replace(/([A-Z])/g, ' $1')
                  .replace(/^./, str => str.toUpperCase())
                  .replace(/([a-z])([A-Z])/g, '$1 $2');
    }

    // Validate entire form
    validateForm() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });

        return isValid;
    }

    // File upload setup
    setupFileUpload() {
        const fileUpload = document.getElementById('file-upload');
        const fileInput = document.getElementById('image');
        
        if (fileUpload && fileInput) {
            fileUpload.addEventListener('click', () => fileInput.click());
            
            fileInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.handleFileSelect(file);
                }
            });

            // Drag and drop
            fileUpload.addEventListener('dragover', (e) => {
                e.preventDefault();
                fileUpload.style.borderColor = 'var(--primary)';
                fileUpload.style.background = 'var(--bg-secondary)';
            });

            fileUpload.addEventListener('dragleave', (e) => {
                e.preventDefault();
                fileUpload.style.borderColor = 'var(--border)';
                fileUpload.style.background = 'transparent';
            });

            fileUpload.addEventListener('drop', (e) => {
                e.preventDefault();
                fileUpload.style.borderColor = 'var(--border)';
                fileUpload.style.background = 'transparent';
                
                const file = e.dataTransfer.files[0];
                if (file && file.type.startsWith('image/')) {
                    fileInput.files = e.dataTransfer.files;
                    this.handleFileSelect(file);
                }
            });
        }
    }

    // Handle file selection
    handleFileSelect(file) {
        const uploadContent = document.querySelector('.upload-content');
        
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            this.showError(document.getElementById('image'), 'File size must be less than 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            this.showError(document.getElementById('image'), 'Please select a valid image file');
            return;
        }

        // Clear any previous errors
        this.clearError(document.getElementById('image'));

        // Show preview
        const reader = new FileReader();
        reader.onload = (e) => {
            uploadContent.innerHTML = `
                <div class="file-preview">
                    <img src="${e.target.result}" alt="Preview" style="max-width: 100px; max-height: 100px; border-radius: 8px;">
                    <p class="upload-text">${file.name}</p>
                    <button type="button" class="btn btn-small btn-outline" onclick="eventManager.clearFile()">Remove</button>
                </div>
            `;
        };
        reader.readAsDataURL(file);
    }

    // Clear selected file
    clearFile() {
        const fileInput = document.getElementById('image');
        const uploadContent = document.querySelector('.upload-content');
        
        fileInput.value = '';
        uploadContent.innerHTML = `
            <div class="upload-icon">📎</div>
            <p class="upload-text">Click to upload event image</p>
            <p class="upload-subtext">PNG, JPG up to 5MB</p>
        `;
    }

    // Handle form submission
    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateForm()) {
            return;
        }

        // Show loading
        this.showLoading();

        // Simulate API call
        await this.delay(2000);

        // Get form data
        const formData = new FormData(this.form);
        const eventData = {
            id: this.generateId(),
            title: formData.get('title'),
            description: formData.get('description'),
            date: formData.get('date'),
            time: formData.get('time'),
            venue: formData.get('venue'),
            category: formData.get('category'),
            maxSeats: parseInt(formData.get('maxSeats')),
            image: formData.get('image'),
            createdAt: new Date().toISOString(),
            status: 'pending',
            attendees: 0
        };

        // Save event
        this.saveEvent(eventData);

        // Hide loading
        this.hideLoading();

        // Show success modal
        this.showSuccessModal(eventData);
    }

    // Generate unique ID
    generateId() {
        return 'evt_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    // Save event to localStorage
    saveEvent(event) {
        this.events.push(event);
        localStorage.setItem('eventhub_events', JSON.stringify(this.events));
    }

    // Load events from localStorage
    loadEvents() {
        try {
            const stored = localStorage.getItem('eventhub_events');
            return stored ? JSON.parse(stored) : [];
        } catch (error) {
            console.error('Error loading events:', error);
            return [];
        }
    }

    // Show loading overlay
    showLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.add('show');
        }
    }

    // Hide loading overlay
    hideLoading() {
        if (this.loadingOverlay) {
            this.loadingOverlay.classList.remove('show');
        }
    }

    // Show success modal
    showSuccessModal(event) {
        if (this.modal) {
            document.getElementById('generated-id').textContent = event.id;
            this.modal.classList.add('show');
            
            // Store event ID for redirection
            this.modal.dataset.eventId = event.id;
        }
    }

    // Setup modal handlers
    setupModalHandlers() {
        if (this.modal) {
            // Close modal when clicking outside
            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) {
                    this.closeModal();
                }
            });

            // ESC key to close modal
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                    this.closeModal();
                }
            });
        }
    }

    // Close modal
    closeModal() {
        if (this.modal) {
            this.modal.classList.remove('show');
        }
    }

    // Setup theme toggle
    setupThemeToggle() {
        const themeToggle = document.getElementById('theme-toggle');
        const themeIndicator = document.getElementById('theme-indicator');
        
        if (themeToggle) {
            // Load saved theme
            const savedTheme = localStorage.getItem('theme') || 'light';
            this.setTheme(savedTheme);
            
            themeToggle.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }

        if (themeIndicator) {
            themeIndicator.addEventListener('click', () => {
                const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
                const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            });
        }
    }

    // Set theme
    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        // Update toggle button
        const themeToggle = document.getElementById('theme-toggle');
        const themeIndicator = document.getElementById('theme-indicator');
        
        if (themeToggle) {
            themeToggle.textContent = theme === 'light' ? '🌙' : '☀️';
        }
        
        if (themeIndicator) {
            themeIndicator.textContent = theme === 'light' ? '🌙' : '☀️';
            themeIndicator.classList.add('show');
            
            // Hide indicator after 2 seconds
            setTimeout(() => {
                themeIndicator.classList.remove('show');
            }, 2000);
        }
    }

    // Utility: delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Get all events
    getAllEvents() {
        return this.events;
    }

    // Get event by ID
    getEventById(id) {
        return this.events.find(event => event.id === id);
    }
}

// Global functions for button handlers
function redirectToDashboard() {
    window.location.href = 'dashboard.html';
}

function viewEvent() {
    const modal = document.getElementById('success-modal');
    const eventId = modal.dataset.eventId;
    
    if (eventId) {
        // In a real app, this would navigate to event details page
        window.location.href = `event-details.html?id=${eventId}`;
    }
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('eventhub_user');
        window.location.href = 'index.html';
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eventManager = new EventManager();
});

// Mobile navigation toggle
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navActions = document.querySelector('.nav-actions');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            
            // Create mobile menu if it doesn't exist
            let mobileMenu = document.querySelector('.mobile-menu');
            if (!mobileMenu) {
                mobileMenu = document.createElement('div');
                mobileMenu.className = 'mobile-menu';
                mobileMenu.innerHTML = `
                    <div class="mobile-menu-content">
                        <a href="index.html" class="mobile-nav-link">Home</a>
                        <a href="#" class="mobile-nav-link">Events</a>
                        <a href="dashboard.html" class="mobile-nav-link">Dashboard</a>
                        <div class="mobile-actions">
                            <button class="btn btn-outline">Sign In</button>
                            <button class="btn btn-primary">Sign Up</button>
                        </div>
                    </div>
                `;
                document.body.appendChild(mobileMenu);
                
                // Add styles for mobile menu
                const style = document.createElement('style');
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
                    
                    .mobile-nav-link:hover {
                        color: var(--primary);
                    }
                    
                    .mobile-actions {
                        margin-top: 1rem;
                        display: flex;
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
                `;
                document.head.appendChild(style);
            }
            
            mobileMenu.classList.toggle('show');
        });
    }
});
