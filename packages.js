// Packages Payment System with Registration Closing Date
// This script handles Ozow payment integration and registration deadline logic

(function () {
    'use strict';

    // ===== CONFIGURATION =====
    // Set your registration closing date here (YYYY-MM-DD format)
    const REGISTRATION_CLOSING_DATE = '2026-02-28'; // February 28, 2026

    // Ozow Configuration (South African Payment Gateway)
    // IMPORTANT: Replace these with your actual Ozow credentials
    // 
    // TO GET YOUR OZOW CREDENTIALS:
    // 1. Sign up at https://www.ozow.com/
    // 2. Complete merchant onboarding
    // 3. Get your Site Code, Private Key, and API Key from the Ozow dashboard
    // 4. Replace the values below
    //
    // For testing, use Ozow's test environment
    const OZOW_CONFIG = {
        siteCode: 'TST-TST-TST', // ⚠️ REPLACE with your actual Site Code
        privateKey: 'YOUR_PRIVATE_KEY_HERE', // ⚠️ REPLACE with your actual Private Key
        apiKey: 'YOUR_API_KEY_HERE', // ⚠️ REPLACE with your actual API Key
        isTest: true, // Set to false for production
        successUrl: window.location.origin + '/models.html?payment=success',
        cancelUrl: window.location.origin + '/models.html?payment=cancelled',
        errorUrl: window.location.origin + '/models.html?payment=error',
        notifyUrl: window.location.origin + '/ozow-notify.php', // Server-side notification handler
        currency: 'ZAR',
        bankReference: 'ISP-MODEL'
    };

    // Package details
    const PACKAGES = {
        basic: {
            name: 'Basic Package',
            price: 2500,
            description: 'Perfect for aspiring models starting their journey'
        },
        standard: {
            name: 'Standard Package',
            price: 5000,
            description: 'Comprehensive package for serious models'
        },
        premium: {
            name: 'Premium Package',
            price: 10000,
            description: 'Elite package for professional models'
        }
    };

    // ===== UTILITY FUNCTIONS =====

    /**
     * Check if registration is still open
     * @returns {boolean} True if registration is open, false otherwise
     */
    function isRegistrationOpen() {
        const closingDate = new Date(REGISTRATION_CLOSING_DATE);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        closingDate.setHours(23, 59, 59, 999);
        return today <= closingDate;
    }

    /**
     * Format date for display
     * @param {string} dateString - Date in YYYY-MM-DD format
     * @returns {string} Formatted date
     */
    function formatDate(dateString) {
        const date = new Date(dateString);
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString('en-ZA', options);
    }

    /**
     * Generate unique transaction reference
     * @returns {string} Transaction reference
     */
    function generateTransactionReference() {
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 10000);
        return `ISP-${timestamp}-${random}`;
    }

    /**
     * Create Ozow payment request
     * NOTE: In production, hash generation MUST be done server-side for security
     * This is a simplified demonstration version
     * @param {string} packageType - Package type (basic, standard, premium)
     */
    function initiatePayment(packageType) {
        const pkg = PACKAGES[packageType];
        if (!pkg) {
            alert('Invalid package selected. Please try again.');
            return;
        }

        const transactionReference = generateTransactionReference();
        const amount = pkg.price.toFixed(2);

        // For demonstration: Show what would be sent to Ozow
        // In production, this should be done server-side
        const paymentInfo = {
            siteCode: OZOW_CONFIG.siteCode,
            countryCode: 'ZA',
            currencyCode: OZOW_CONFIG.currency,
            amount: amount,
            transactionReference: transactionReference,
            bankReference: `${OZOW_CONFIG.bankReference}-${packageType.toUpperCase()}`,
            customer: '', // Customer name (optional)
            cancelUrl: OZOW_CONFIG.cancelUrl,
            errorUrl: OZOW_CONFIG.errorUrl,
            successUrl: OZOW_CONFIG.successUrl,
            notifyUrl: OZOW_CONFIG.notifyUrl,
            isTest: OZOW_CONFIG.isTest.toString()
        };

        // Check if we have valid credentials
        if (OZOW_CONFIG.siteCode === 'TST-TST-TST' ||
            OZOW_CONFIG.privateKey === 'YOUR_PRIVATE_KEY_HERE') {

            // Show setup instructions
            alert(
                '⚠️ Ozow Payment Not Configured\n\n' +
                'To enable payments:\n\n' +
                '1. Sign up at https://www.ozow.com/\n' +
                '2. Get your Site Code and Private Key\n' +
                '3. Update packages.js with your credentials\n\n' +
                'See OZOW_SETUP_GUIDE.md for detailed instructions.\n\n' +
                `Selected: ${pkg.name} - R${amount}`
            );
            return;
        }

        // In production, you would:
        // 1. Send payment data to YOUR server
        // 2. Server generates hash using private key
        // 3. Server creates form and redirects to Ozow

        // For now, show a message
        const proceed = confirm(
            `Ready to process payment via Ozow\n\n` +
            `Package: ${pkg.name}\n` +
            `Amount: R${amount}\n` +
            `Reference: ${transactionReference}\n\n` +
            `⚠️ IMPORTANT: Hash generation must be done server-side.\n` +
            `See OZOW_SETUP_GUIDE.md for implementation details.\n\n` +
            `Click OK to see payment details (demo mode)`
        );

        if (proceed) {
            console.log('Ozow Payment Request:', paymentInfo);
            alert(
                'Demo Mode: Payment request logged to console.\n\n' +
                'In production, you would be redirected to Ozow payment page.\n\n' +
                'Check browser console for payment details.'
            );
        }
    }

    /**
     * Show confirmation modal before payment
     * @param {string} packageType - Package type
     * @param {number} price - Package price
     */
    function showPaymentConfirmation(packageType, price) {
        const pkg = PACKAGES[packageType];

        const confirmed = confirm(
            `You are about to purchase the ${pkg.name} for R${price.toLocaleString()}.\n\n` +
            `${pkg.description}\n\n` +
            `You will be redirected to Ozow to complete your payment securely.\n\n` +
            `Click OK to continue or Cancel to go back.`
        );

        if (confirmed) {
            initiatePayment(packageType);
        }
    }

    /**
     * Update UI based on registration status
     */
    function updateRegistrationStatus() {
        const isOpen = isRegistrationOpen();
        const payButtons = document.querySelectorAll('.btn-pay');
        const closedMessages = document.querySelectorAll('.package-closed-message');
        const closingDateElement = document.getElementById('closing-date');

        // Update closing date display
        if (closingDateElement) {
            closingDateElement.textContent = formatDate(REGISTRATION_CLOSING_DATE);
        }

        if (!isOpen) {
            // Registration is closed
            payButtons.forEach(btn => {
                btn.style.display = 'none';
                btn.disabled = true;
            });

            closedMessages.forEach(msg => {
                msg.style.display = 'block';
            });

            // Update deadline banner
            const deadlineDiv = document.querySelector('.registration-deadline');
            if (deadlineDiv) {
                deadlineDiv.style.background = 'rgba(239, 68, 68, 0.1)';
                deadlineDiv.style.borderColor = '#ef4444';
                const deadlineText = deadlineDiv.querySelector('.deadline-text');
                if (deadlineText) {
                    deadlineText.innerHTML = '<strong style="color: #dc2626;">Registration is now closed</strong>';
                }
            }
        } else {
            // Registration is open
            payButtons.forEach(btn => {
                btn.style.display = 'flex';
                btn.disabled = false;
            });

            closedMessages.forEach(msg => {
                msg.style.display = 'none';
            });
        }
    }

    /**
     * Handle payment status from URL parameters
     */
    function handlePaymentStatus() {
        const urlParams = new URLSearchParams(window.location.search);
        const paymentStatus = urlParams.get('payment');

        if (paymentStatus === 'success') {
            alert('Payment successful! Thank you for your purchase. We will contact you shortly with further details.');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (paymentStatus === 'cancelled') {
            alert('Payment was cancelled. If you need assistance, please contact us.');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (paymentStatus === 'error') {
            alert('There was an error processing your payment. Please try again or contact us for assistance.');
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    }

    /**
     * Initialize the packages system
     */
    function init() {
        // Update registration status on page load
        updateRegistrationStatus();

        // Handle payment status if redirected from Ozow
        handlePaymentStatus();

        // Add click event listeners to payment buttons
        const payButtons = document.querySelectorAll('.btn-pay');
        payButtons.forEach(btn => {
            btn.addEventListener('click', function (e) {
                e.preventDefault();

                if (!isRegistrationOpen()) {
                    alert('Registration is now closed. We are no longer accepting new registrations for this period.');
                    return;
                }

                const packageType = this.getAttribute('data-package');
                const price = parseFloat(this.getAttribute('data-price'));

                showPaymentConfirmation(packageType, price);
            });
        });

        // Add smooth scroll to packages section if hash is present
        if (window.location.hash === '#packages') {
            setTimeout(() => {
                const packagesSection = document.getElementById('packages');
                if (packagesSection) {
                    packagesSection.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
