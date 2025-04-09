
/**
 * Twilio SMS API integration for OTP verification
 * Simulates server-side functionality for demo purposes
 */

// Twilio credentials configuration - replace with your actual test credentials
const twilioConfig = {
  accountSid: 'ACec758aa9f42954eb19eff903c2b96816', // Replace with your Twilio Account SID
  authToken: '1a9e4f9eebddb3d63fbc35f613352699',   // Replace with your Twilio Auth Token
  phoneNumber: '19787652488' // Replace with your Twilio phone number
};

// Cache for storing generated OTPs (in a real implementation this would be server-side)
const otpCache = {};

/**
 * Generates a random OTP code
 * @returns {string} 6-digit OTP code
 */
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
* Formats a phone number to international format
 * @param {string} countryCode - Country code (e.g. +91)
 * @param {string} phoneNumber - Phone number without country code
 * @returns {string} Formatted phone number
 */
function formatPhoneNumber(countryCode, phoneNumber) {
    // Remove any non-digit characters
    const cleanCountryCode = countryCode.replace(/\D/g, '');
    const cleanPhoneNumber = phoneNumber.replace(/\D/g, '');
    
    // Ensure country code starts with '+'
    const formattedCountryCode = cleanCountryCode.startsWith('+') ? cleanCountryCode : `+${cleanCountryCode}`;
    
    return `${formattedCountryCode}${cleanPhoneNumber}`;
  }
  
  /**
   * Sends OTP via Twilio API
   * @param {string} countryCode - Country code (e.g. +91)
   * @param {string} phoneNumber - Phone number without country code
   * @returns {Promise} - Promise that resolves with success or error message
   */
  function sendOTP(countryCode, phoneNumber) {
    return new Promise((resolve, reject) => {
      if (!phoneNumber || !countryCode) {
        reject('Both country code and phone number are required.');
        return;
      }
      
      // Validate basic phone number format
      if (!/^\d+$/.test(phoneNumber)) {
        reject('Invalid phone number. Please enter only digits for the phone number.');
        return;
      }
      
      // Format for Twilio
      const formattedPhoneNumber = formatPhoneNumber(countryCode, phoneNumber);
      
      // Generate and store OTP
      const otp = generateOTP();
      otpCache[formattedPhoneNumber] = otp;
      
      // In a real implementation, this is where you would make an API call to Twilio
      // For demo purposes, we'll simulate a successful API call
      
      console.log(`Sending OTP: ${otp} to ${formattedPhoneNumber}`);
      
      // Simulate API delay
      setTimeout(() => {
        // For testing purposes, always return success
        // In production, this would depend on the actual Twilio API response
        resolve({
          success: true,
          message: `OTP sent successfully to ${formattedPhoneNumber}`,
          // In a real implementation, you wouldn't return the OTP in the response
          // This is just for testing purposes
          otp: otp
        });
      }, 1000);
    });
  }
  
  /**
   * Verifies the OTP entered by the user
   * @param {string} countryCode - Country code (e.g. +91)
   * @param {string} phoneNumber - Phone number without country code
   * @param {string} userEnteredOTP - OTP entered by the user
   * @returns {Promise} - Promise that resolves with verification result
   */
  function verifyOTP(countryCode, phoneNumber, userEnteredOTP) {
    return new Promise((resolve, reject) => {
      if (!phoneNumber || !countryCode || !userEnteredOTP) {
        reject('Country code, phone number, and OTP are required');
        return;
      }
      
      const formattedPhoneNumber = formatPhoneNumber(countryCode, phoneNumber);
      const storedOTP = otpCache[formattedPhoneNumber];
      
      if (!storedOTP) {
        reject('OTP expired or not sent. Please request a new OTP.');
        return;
      }
      
      // Check if OTP matches
      if (storedOTP === userEnteredOTP) {
        // Clear OTP from cache after successful verification
        delete otpCache[formattedPhoneNumber];
        resolve({
          success: true,
          message: 'OTP verified successfully'
        });
      } else {
        resolve({
          success: false,
          message: 'Invalid OTP. Please try again.'
        });
      }
    });
  }
  
  // Export functions for use in form.js
  window.twilioService = {
    sendOTP,
    verifyOTP
  };
  