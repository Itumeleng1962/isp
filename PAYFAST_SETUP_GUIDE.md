# Quick Fix: PayFast "Invalid Merchant Key" Error

## The Problem

You're seeing this error because the payment system is using **demo credentials** that don't actually work with PayFast. This is expected!

## The Solution

You have **two options**:

---

## Option 1: Get Real PayFast Credentials (Recommended for Production)

### Step 1: Sign Up for PayFast
1. Go to **[https://www.payfast.co.za/](https://www.payfast.co.za/)**
2. Click "Sign Up" or "Register"
3. Complete the registration form
4. Verify your email address

### Step 2: Get Your Credentials
1. Log into your PayFast dashboard
2. Navigate to **Settings** → **Integration**
3. You'll see:
   - **Merchant ID** (a number like `10012345`)
   - **Merchant Key** (a string like `abc123xyz456`)
4. Copy both values

### Step 3: Update packages.js
1. Open `c:/Users/Itumeleng Mahwa/Desktop/ISP/ISP/packages.js`
2. Find lines 21-22:
   ```javascript
   merchant_id: '10000100', // ⚠️ REPLACE with your actual merchant ID
   merchant_key: 'q1cd2rdny4a53', // ⚠️ REPLACE with your actual merchant key
   ```
3. Replace with your actual credentials:
   ```javascript
   merchant_id: 'YOUR_ACTUAL_MERCHANT_ID',
   merchant_key: 'YOUR_ACTUAL_MERCHANT_KEY',
   ```
4. Save the file

### Step 4: Go Live
Once you have real credentials:
1. Change line 27 from `sandbox: true` to `sandbox: false`
2. Save the file
3. Test with a small payment first!

---

## Option 2: Disable Payment for Now (Testing Only)

If you're not ready to set up payments yet, you can temporarily disable the payment functionality:

### Quick Disable Method

Open `packages.js` and replace the payment button click handler (around line 234) with this:

```javascript
payButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        alert('Payment system is not yet configured.\n\nTo enable payments:\n1. Sign up at PayFast.co.za\n2. Get your credentials\n3. Update packages.js with your Merchant ID and Key\n\nSee PAYFAST_SETUP_GUIDE.md for details.');
    });
});
```

This will show a helpful message instead of trying to process payments.

---

## Option 3: Contact PayFast for Sandbox Credentials

For testing purposes, you can request sandbox credentials from PayFast:

1. Email: **support@payfast.co.za**
2. Subject: "Request for Sandbox Test Credentials"
3. Explain you're testing integration
4. They'll provide test credentials that work in sandbox mode

---

## What Each Option Gives You

| Option | Best For | Payment Works? | Cost |
|--------|----------|----------------|------|
| **Option 1: Real Credentials** | Going live, accepting real payments | ✅ Yes | PayFast fees apply |
| **Option 2: Disable Payments** | Just showing the UI, not ready for payments | ❌ No | Free |
| **Option 3: Sandbox Credentials** | Testing payment flow without real money | ✅ Yes (test mode) | Free |

---

## Recommended Path

1. **Right Now:** Use Option 2 (disable payments) so you can show the page
2. **When Ready to Test:** Use Option 3 (get sandbox credentials)
3. **When Going Live:** Use Option 1 (get real credentials)

---

## Need Help?

- **PayFast Support:** [https://www.payfast.co.za/support/](https://www.payfast.co.za/support/)
- **PayFast Documentation:** [https://developers.payfast.co.za/](https://developers.payfast.co.za/)
- **Email:** support@payfast.co.za
- **Phone:** 0861 729 227

---

## Current Status

✅ Package display is working  
✅ Registration closing date is working  
✅ UI and design are complete  
⚠️ Payment integration needs your PayFast credentials  

The system is 95% ready - you just need to add your payment credentials!
