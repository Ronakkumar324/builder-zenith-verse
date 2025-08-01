// auth.js - Authentication utilities and form validation

import { userManager, modalManager } from './main.js';

/**
 * Form Validation Utilities
 */
export class FormValidator {
  constructor() {
    this.rules = {
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Please enter a valid email address'
      },
      password: {
        required: true,
        minLength: 6,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'Password must be at least 6 characters with uppercase, lowercase, and number'
      },
      name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: 'Name must be at least 2 characters and contain only letters'
      },
      role: {
        required: true,
        options: ['participant', 'organizer'],
        message: 'Please select a valid role'
      }
    };
  }

  // Validate a single field
  validateField(fieldName, value, customRules = {}) {
    const rules = { ...this.rules[fieldName], ...customRules };
    const errors = [];

    // Required check
    if (rules.required && (!value || value.trim() === '')) {
      errors.push(`${this.capitalizeFirst(fieldName)} is required`);
      return errors;
    }

    // Skip other validations if field is empty and not required
    if (!value || value.trim() === '') {
      return errors;
    }

    // Minimum length check
    if (rules.minLength && value.length < rules.minLength) {
      errors.push(`${this.capitalizeFirst(fieldName)} must be at least ${rules.minLength} characters`);
    }

    // Maximum length check
    if (rules.maxLength && value.length > rules.maxLength) {
      errors.push(`${this.capitalizeFirst(fieldName)} must be no more than ${rules.maxLength} characters`);
    }

    // Pattern check
    if (rules.pattern && !rules.pattern.test(value)) {
      errors.push(rules.message || `${this.capitalizeFirst(fieldName)} format is invalid`);
    }

    // Options check (for select fields)
    if (rules.options && !rules.options.includes(value)) {
      errors.push(rules.message || `Please select a valid ${fieldName}`);
    }

    return errors;
  }

  // Validate entire form
  validateForm(formData, fieldRules = {}) {
    const errors = {};
    let isValid = true;

    Object.keys(formData).forEach(fieldName => {
      const fieldErrors = this.validateField(fieldName, formData[fieldName], fieldRules[fieldName]);
      if (fieldErrors.length > 0) {
        errors[fieldName] = fieldErrors;
        isValid = false;
      }
    });

    return { isValid, errors };
  }

  // Display field error
  displayFieldError(fieldElement, errors) {
    this.clearFieldError(fieldElement);

    if (errors && errors.length > 0) {
      // Add error styling to field
      fieldElement.classList.add('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
      fieldElement.classList.remove('border-gray-200', 'focus:border-indigo-500', 'focus:ring-indigo-500');

      // Create error message element
      const errorElement = document.createElement('div');
      errorElement.className = 'field-error text-sm text-red-600 mt-1 flex items-center';
      errorElement.innerHTML = `
        <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        ${errors[0]}
      `;

      // Insert error message after field
      fieldElement.parentNode.insertBefore(errorElement, fieldElement.nextSibling);
    }
  }

  // Clear field error
  clearFieldError(fieldElement) {
    // Remove error styling
    fieldElement.classList.remove('border-red-500', 'focus:border-red-500', 'focus:ring-red-500');
    fieldElement.classList.add('border-gray-200', 'focus:border-indigo-500', 'focus:ring-indigo-500');

    // Remove error message
    const errorElement = fieldElement.parentNode.querySelector('.field-error');
    if (errorElement) {
      errorElement.remove();
    }
  }

  // Capitalize first letter
  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Real-time validation setup
  setupRealTimeValidation(form) {
    const fields = form.querySelectorAll('input, select, textarea');
    
    fields.forEach(field => {
      field.addEventListener('blur', () => {
        const fieldName = field.name || field.id;
        const value = field.value;
        const errors = this.validateField(fieldName, value);
        this.displayFieldError(field, errors);
      });

      field.addEventListener('input', () => {
        // Clear errors when user starts typing
        this.clearFieldError(field);
      });
    });
  }
}

/**
 * Authentication Manager
 */
export class AuthManager {
  constructor() {
    this.validator = new FormValidator();
    this.isLoading = false;
  }

  // Handle login form submission
  async handleLogin(formElement) {
    if (this.isLoading) return;

    const formData = new FormData(formElement);
    const loginData = {
      email: formData.get('email'),
      password: formData.get('password')
    };

    // Validate form
    const { isValid, errors } = this.validator.validateForm(loginData);
    
    if (!isValid) {
      this.displayFormErrors(formElement, errors);
      return false;
    }

    // Show loading state
    this.setLoadingState(formElement, true);

    try {
      // Simulate API call
      await this.delay(1500);

      // Simulate successful login
      const userData = {
        id: Math.floor(Math.random() * 1000),
        name: this.getNameFromEmail(loginData.email),
        email: loginData.email,
        role: 'organizer', // Default role - in real app this comes from server
        avatar: '/placeholder.svg',
        loginTime: new Date().toISOString()
      };

      // Store user data and redirect
      userManager.simulateLogin(userData);
      return true;

    } catch (error) {
      console.error('Login error:', error);
      this.showError(formElement, 'Login failed. Please try again.');
      return false;
    } finally {
      this.setLoadingState(formElement, false);
    }
  }

  // Handle signup form submission
  async handleSignup(formElement) {
    if (this.isLoading) return;

    const formData = new FormData(formElement);
    const signupData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
      role: formData.get('role')
    };

    // Validate form with custom rules for signup
    const customRules = {
      password: {
        required: true,
        minLength: 6,
        pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        message: 'Password must contain uppercase, lowercase, and number'
      }
    };

    const { isValid, errors } = this.validator.validateForm(signupData, customRules);
    
    if (!isValid) {
      this.displayFormErrors(formElement, errors);
      return false;
    }

    // Check terms acceptance
    const termsCheckbox = formElement.querySelector('input[type="checkbox"]');
    if (termsCheckbox && !termsCheckbox.checked) {
      this.showError(formElement, 'Please accept the terms and conditions');
      return false;
    }

    // Show loading state
    this.setLoadingState(formElement, true);

    try {
      // Simulate API call
      await this.delay(2000);

      // Simulate successful signup
      const userData = {
        id: Math.floor(Math.random() * 1000),
        name: signupData.name,
        email: signupData.email,
        role: signupData.role,
        avatar: '/placeholder.svg',
        signupTime: new Date().toISOString()
      };

      // Store user data and redirect
      userManager.simulateLogin(userData);
      return true;

    } catch (error) {
      console.error('Signup error:', error);
      this.showError(formElement, 'Registration failed. Please try again.');
      return false;
    } finally {
      this.setLoadingState(formElement, false);
    }
  }

  // Display form errors
  displayFormErrors(formElement, errors) {
    Object.keys(errors).forEach(fieldName => {
      const field = formElement.querySelector(`[name="${fieldName}"], #${fieldName}`);
      if (field) {
        this.validator.displayFieldError(field, errors[fieldName]);
      }
    });
  }

  // Show general error message
  showError(formElement, message) {
    // Remove existing error
    const existingError = formElement.querySelector('.form-error');
    if (existingError) {
      existingError.remove();
    }

    // Create error element
    const errorElement = document.createElement('div');
    errorElement.className = 'form-error bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4';
    errorElement.innerHTML = `
      <div class="flex items-center">
        <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        ${message}
      </div>
    `;

    // Insert at top of form
    formElement.insertBefore(errorElement, formElement.firstChild);
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
            ${formElement.dataset.loadingText || 'Processing...'}
          </div>
        `;
      } else {
        submitButton.disabled = false;
        submitButton.innerHTML = formElement.dataset.originalButtonText || 'Submit';
      }
    }
  }

  // Utility: Get name from email
  getNameFromEmail(email) {
    const name = email.split('@')[0];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  // Utility: Delay function
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Setup form handling
  setupFormHandling() {
    // Login form
    const loginForm = document.querySelector('#login-form, form[data-type="login"]');
    if (loginForm) {
      // Store original button text
      const submitButton = loginForm.querySelector('button[type="submit"]');
      if (submitButton) {
        loginForm.dataset.originalButtonText = submitButton.textContent;
        loginForm.dataset.loadingText = 'Signing In...';
      }

      this.validator.setupRealTimeValidation(loginForm);
      
      loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleLogin(loginForm);
      });
    }

    // Signup form
    const signupForm = document.querySelector('#signup-form, form[data-type="signup"]');
    if (signupForm) {
      // Store original button text
      const submitButton = signupForm.querySelector('button[type="submit"]');
      if (submitButton) {
        signupForm.dataset.originalButtonText = submitButton.textContent;
        signupForm.dataset.loadingText = 'Creating Account...';
      }

      this.validator.setupRealTimeValidation(signupForm);
      
      signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        await this.handleSignup(signupForm);
      });
    }
  }

  // Role-based redirection after login
  handleRoleBasedRedirection(user) {
    const roleRedirects = {
      'admin': '/admin-panel',
      'organizer': '/dashboard',
      'participant': '/dashboard'
    };

    const redirectPath = roleRedirects[user.role] || '/dashboard';
    
    // Show brief success message before redirect
    const successMessage = document.createElement('div');
    successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-md shadow-lg z-50';
    successMessage.textContent = `Welcome ${user.name}! Redirecting...`;
    document.body.appendChild(successMessage);

    setTimeout(() => {
      window.location.href = redirectPath;
    }, 1500);
  }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const authManager = new AuthManager();
  authManager.setupFormHandling();
});

// Export for use in other modules
export const formValidator = new FormValidator();
export const authManager = new AuthManager();
