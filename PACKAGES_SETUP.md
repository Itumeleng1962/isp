# Modeling Agency Packages - Setup Guide

## Overview
This system provides a complete paid packages solution for your modeling agency with:
- Three package tiers (Basic, Standard, Premium)
- Online payment integration via PayFast
- Registration closing date functionality
- Automatic UI updates when registration closes

## Quick Start

### 1. Configure Registration Closing Date

Open `packages.js` and modify line 9:
```javascript
const REGISTRATION_CLOSING_DATE = '2026-02-28'; // Change to your desired date (YYYY-MM-DD)
```

### 2. Configure PayFast Payment Gateway

#### Get PayFast Credentials
1. Sign up at [PayFast](https://www.payfast.co.za/)
2. Get your Merchant ID and Merchant Key from your PayFast dashboard

#### Update Configuration
Open `packages.js` and update lines 12-18:
```javascript
const PAYFAST_CONFIG = {
    merchant_id: 'YOUR_MERCHANT_ID',      // Replace with your actual merchant ID
    merchant_key: 'YOUR_MERCHANT_KEY',    // Replace with your actual merchant key
    return_url: window.location.origin + '/models.html?payment=success',
    cancel_url: window.location.origin + '/models.html?payment=cancelled',
    notify_url: window.location.origin + '/payment-notify.php',
    sandbox: true  // Set to false when going live
};
```

**Important:** 
- Keep `sandbox: true` for testing
- Set `sandbox: false` when you're ready to accept real payments

### 3. Customize Package Details

#### Update Prices
In `models.html`, find the packages section and modify the prices:
```html
<div class="package-price">
    <span class="currency">R</span>
    <span class="amount">2,500</span>  <!-- Change this -->
</div>
```

Also update the `data-price` attribute on the button:
```html
<button class="package-btn btn-pay" data-package="basic" data-price="2500">
```

#### Update Package Features
Modify the feature lists in `models.html`:
```html
<ul class="package-features">
    <li><span class="feature-icon">✓</span> Your feature here</li>
    <!-- Add or remove features as needed -->
</ul>
```

## How It Works

### Registration Open
- Users can see all packages with "Pay Now" buttons
- Clicking "Pay Now" shows a confirmation dialog
- After confirmation, users are redirected to PayFast to complete payment
- After payment, users return to your site with a success/cancel message

### Registration Closed
- The system automatically checks the closing date
- When the date passes:
  - "Pay Now" buttons are hidden
  - A "Registration Closed" message appears
  - The deadline banner turns red
  - Payment functionality is disabled

### Payment Flow
1. User clicks "Pay Now" on a package
2. Confirmation dialog appears with package details
3. User confirms and is redirected to PayFast
4. User completes payment on PayFast
5. User returns to your site with payment status
6. Success/cancel message is displayed

## Testing

### Test Mode (Sandbox)
With `sandbox: true`, you can test payments without real money:
1. Use PayFast sandbox credentials
2. Test card details are provided by PayFast
3. All transactions are simulated

### Test Closing Date
To test the closing date functionality:
1. Set `REGISTRATION_CLOSING_DATE` to yesterday's date
2. Reload the page
3. You should see the closed state

## Server-Side Setup (Optional but Recommended)

For production use, you should implement server-side payment verification:

1. Create `payment-notify.php` (or equivalent) on your server
2. This endpoint receives payment notifications from PayFast
3. Verify the payment signature
4. Update your database with payment status
5. Send confirmation emails to customers

Example PHP structure:
```php
<?php
// payment-notify.php
// Verify PayFast payment notification
// Update database
// Send confirmation email
?>
```

## Security Notes

⚠️ **Important Security Considerations:**

1. **Never store sensitive data client-side**
2. **Implement server-side payment verification**
3. **Use HTTPS in production**
4. **Keep your merchant key secret**
5. **Validate all payment notifications from PayFast**

## Customization

### Change Colors
Edit `styles.css` to customize the package card colors:
```css
.package-card {
    border: 2px solid transparent;
    /* Modify colors here */
}
```

### Add More Packages
1. Copy an existing package card in `models.html`
2. Update the package details
3. Add the package to the `PACKAGES` object in `packages.js`

## Support

For PayFast support: https://www.payfast.co.za/support/
For technical issues: Contact your web developer

## File Structure

```
ISP/
├── models.html          # Main page with packages section
├── packages.js          # Payment logic and closing date handler
├── styles.css           # Package styling
└── PACKAGES_SETUP.md    # This file
```

## Troubleshooting

### Payments not working
- Check PayFast credentials are correct
- Ensure `sandbox` mode matches your environment
- Verify return URLs are accessible

### Closing date not working
- Check date format is YYYY-MM-DD
- Verify JavaScript is loading (check browser console)
- Clear browser cache and reload

### Styling issues
- Clear browser cache
- Check `styles.css` is loading
- Verify CSS classes match HTML

## Going Live Checklist

- [ ] Update PayFast credentials to production values
- [ ] Set `sandbox: false` in `packages.js`
- [ ] Test all payment flows
- [ ] Set correct registration closing date
- [ ] Implement server-side payment verification
- [ ] Set up SSL certificate (HTTPS)
- [ ] Test on mobile devices
- [ ] Create backup of all files
