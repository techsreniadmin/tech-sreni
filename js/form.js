
// Form handling JavaScript

document.addEventListener('DOMContentLoaded', function() {
  // Common form submission handler
  const setupFormSubmission = (formId) => {
    const form = document.getElementById(formId);
    
    if (form) {
      // Add phone verification
      addPhoneVerification(form);
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Check if phone verification is required and completed
        const phoneInput = this.querySelector('input[type="tel"]');
        if (phoneInput && phoneInput.hasAttribute('data-verification-required')) {
          if (phoneInput.getAttribute('data-verified') !== 'true') {
            showAlert('danger', 'Please verify your phone number before submitting');
            return;
          }
        }
        
        // Show loading state on submit button
        const submitBtn = this.querySelector('button[type="submit"]');
        const originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
          Sending...
        `;
        
        // In a real implementation, you would connect to your SMS API here
        // For demonstration, we'll use a simulated form submission
        
        // Simulate form submission (replace this with your actual form submission code)
        setTimeout(function() {
          // Show success message
          showAlert('success', 'Thank you! Your message has been sent successfully.');
          
          // Reset form
          form.reset();
          
          // Reset phone verification if it exists
          const phoneVerificationDiv = form.querySelector('.phone-verification-container');
          if (phoneVerificationDiv) {
            phoneVerificationDiv.innerHTML = '';
          }
          
          // Reset phone input verified state
          if (phoneInput) {
            phoneInput.removeAttribute('data-verified');
            phoneInput.disabled = false;
            phoneInput.classList.remove('is-valid', 'border-success');
            
            // Reset verification badge if exists
            const verificationBadge = form.querySelector('.verification-badge');
            if (verificationBadge) {
              verificationBadge.remove();
            }
            
            // Reset get OTP button
            const getOtpBtn = form.querySelector('.get-otp-btn');
            if (getOtpBtn) {
              getOtpBtn.style.display = '';
              getOtpBtn.disabled = false;
            }
          }
          
          // Reset button
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalBtnText;
        }, 1500);
      });
    }
  };
  
  // Add phone verification functionality
  const addPhoneVerification = (form) => {
    const phoneInput = form.querySelector('input[type="tel"]');
    if (!phoneInput) return;
    
    // Mark this phone input as requiring verification
    phoneInput.setAttribute('data-verification-required', 'true');
    
    // Create container for verification components
    const phoneInputParent = phoneInput.parentElement;
    
    // Create country code selector
    const countryCodeGroup = document.createElement('div');
    countryCodeGroup.className = 'input-group mb-3';
    
    const countryCodeSelect = document.createElement('select');
    countryCodeSelect.className = 'form-select country-code-select';
    countryCodeSelect.style.maxWidth = '120px';
    
    // Add common country codes
    const countryCodes = [
      { code: '+1', country: 'US/CA' },
      { code: '+44', country: 'UK' },
      { code: '+91', country: 'India' },
      { code: '+61', country: 'Australia' },
      { code: '+86', country: 'China' },
      { code: '+49', country: 'Germany' },
      { code: '+33', country: 'France' },
      { code: '+81', country: 'Japan' }
    ];
    
    countryCodes.forEach(country => {
      const option = document.createElement('option');
      option.value = country.code;
      option.text = `${country.code} ${country.country}`;
      if (country.code === '+91') {
        option.selected = true;
      }
      countryCodeSelect.appendChild(option);
    });
    
    // Insert country code selector before phone input
    phoneInputParent.insertBefore(countryCodeGroup, phoneInput);
    
    // Move phone input to the new input group
    phoneInput.placeholder = 'Phone number without country code';
    phoneInput.pattern = '[0-9]*';
    
    // Replace original phone input with country code group
    countryCodeGroup.appendChild(countryCodeSelect);
    countryCodeGroup.appendChild(phoneInput);
    
    // Convert to input group if not already
    if (!phoneInputParent.classList.contains('input-group')) {
      const inputGroup = document.createElement('div');
      inputGroup.className = 'input-group';
      phoneInputParent.appendChild(inputGroup);
      
      // Add get OTP button
      const getOtpBtn = document.createElement('button');
      getOtpBtn.type = 'button';
      getOtpBtn.className = 'btn btn-gold get-otp-btn';
      getOtpBtn.innerText = 'Get OTP';
      inputGroup.appendChild(getOtpBtn);
    } else {
      // Add get OTP button
      const getOtpBtn = document.createElement('button');
      getOtpBtn.type = 'button';
      getOtpBtn.className = 'btn btn-gold get-otp-btn';
      getOtpBtn.innerText = 'Get OTP';
      phoneInputParent.appendChild(getOtpBtn);
    }
    
    // Add verification container after the input group
    const verificationContainer = document.createElement('div');
    verificationContainer.className = 'phone-verification-container mt-2';
    phoneInputParent.parentNode.insertBefore(verificationContainer, phoneInputParent.nextSibling);
    
    // Get the button that was just added
    const getOtpBtn = phoneInputParent.querySelector('.get-otp-btn');
    
    // Handle OTP request
    getOtpBtn.addEventListener('click', function() {
      const countryCode = countryCodeSelect.value;
      const phoneNumber = phoneInput.value;
      
      // Simple validation
      if (!phoneNumber) {
        showAlert('danger', 'Please enter a phone number');
        return;
      }
      
      if (!/^\d+$/.test(phoneNumber)) {
        showAlert('danger', 'Please enter a valid phone number (digits only)');
        return;
      }
      
      // Disable button and show loading
      getOtpBtn.disabled = true;
      getOtpBtn.innerHTML = `
        <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
        Sending...
      `;
      
      // Call Twilio service to send OTP
      window.twilioService.sendOTP(countryCode, phoneNumber)
        .then(response => {
          // Log success message for testing purposes
          console.log('Twilio API Response:', response);
          
          // Show OTP verification UI
          verificationContainer.innerHTML = `
            <div class="card card-body bg-light mb-3">
              <label for="otp-input" class="form-label mb-2">Enter OTP sent to your phone</label>
              <div class="d-flex gap-1 mb-2">
                <input type="text" class="form-control otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="form-control otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="form-control otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="form-control otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="form-control otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
                <input type="text" class="form-control otp-digit" maxlength="1" pattern="[0-9]" inputmode="numeric">
              </div>
              <div class="d-flex gap-2">
                <button type="button" class="btn btn-gold flex-grow-1 verify-otp-btn">Verify OTP</button>
                <button type="button" class="btn btn-outline-secondary resend-otp-btn">Resend</button>
              </div>
              
              <div class="mt-2 text-center">
                <small class="text-info">For testing: OTP is <span class="test-otp fw-bold">${response.otp}</span></small>
              </div>
            </div>
          `;
          
          // Setup OTP inputs for better UX
          setupOtpInputs(verificationContainer);
          
          // Reset get OTP button
          getOtpBtn.disabled = false;
          getOtpBtn.innerText = 'Get OTP';
          
          // Show success message
          showAlert('success', response.message);
          
          // Handle OTP verification
          const verifyOtpBtn = verificationContainer.querySelector('.verify-otp-btn');
          verifyOtpBtn.addEventListener('click', function() {
            const otpInputs = verificationContainer.querySelectorAll('.otp-digit');
            let otpValue = '';
            otpInputs.forEach(input => {
              otpValue += input.value;
            });
            
            if (!otpValue || otpValue.length !== 6) {
              showAlert('danger', 'Please enter a valid 6-digit OTP');
              return;
            }
            
            // Disable verify button and show loading
            verifyOtpBtn.disabled = true;
            verifyOtpBtn.innerHTML = `
              <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Verifying...
            `;
            
            // Verify OTP using Twilio service
            window.twilioService.verifyOTP(countryCode, phoneNumber, otpValue)
              .then(verificationResult => {
                if (verificationResult.success) {
                  // Mark phone as verified
                  phoneInput.setAttribute('data-verified', 'true');
                  phoneInput.disabled = true;
                  phoneInput.classList.add('is-valid', 'border-success');
                  
                  // Disable country code selector
                  countryCodeSelect.disabled = true;
                  
                  // Add verification badge
                  const badge = document.createElement('span');
                  badge.className = 'verification-badge ms-2 badge bg-success';
                  badge.innerHTML = '<i class="fas fa-check me-1"></i> Verified';
                  phoneInputParent.appendChild(badge);
                  
                  // Hide get OTP button
                  getOtpBtn.style.display = 'none';
                  
                  // Clear verification UI
                  verificationContainer.innerHTML = '';
                  
                  // Show success message
                  showAlert('success', 'Phone number verified successfully!');
                } else {
                  // Reset verify button
                  verifyOtpBtn.disabled = false;
                  verifyOtpBtn.innerText = 'Verify OTP';
                  
                  // Show error message
                  showAlert('danger', verificationResult.message);
                }
              })
              .catch(error => {
                // Reset verify button
                verifyOtpBtn.disabled = false;
                verifyOtpBtn.innerText = 'Verify OTP';
                
                // Show error message
                showAlert('danger', error);
              });
          });
          
          // Handle resend OTP
          const resendBtn = verificationContainer.querySelector('.resend-otp-btn');
          resendBtn.addEventListener('click', function() {
            getOtpBtn.click();
          });
        })
        .catch(error => {
          // Reset button
          getOtpBtn.disabled = false;
          getOtpBtn.innerText = 'Get OTP';
          
          // Show error message
          showAlert('danger', error);
        });
    });
  };
  
  // Setup OTP input fields for better UX
  const setupOtpInputs = (container) => {
    // ... keep existing code (OTP input setup functionality)
  };
  
  // Setup alert function to show notifications
  const showAlert = (type, message) => {
    // ... keep existing code (alert display functionality)
  };
  
  // Setup all forms on the website
  setupFormSubmission('enquiryForm');
  setupFormSubmission('contactForm');
  setupFormSubmission('venueEnquiryForm');
  
  // Add any other forms that need phone verification here
  const allForms = document.querySelectorAll('form');
  allForms.forEach(form => {
    if (form.id && !['enquiryForm', 'contactForm', 'venueEnquiryForm'].includes(form.id)) {
      // Check if the form has a phone input
      const hasPhoneInput = form.querySelector('input[type="tel"]');
      if (hasPhoneInput) {
        setupFormSubmission(form.id);
      }
    }
  });
});
