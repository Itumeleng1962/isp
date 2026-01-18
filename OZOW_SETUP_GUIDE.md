# Ozow Payment Integration - Complete Setup Guide

## Overview

Your modeling agency packages are now configured to use **Ozow**, one of South Africa's leading instant EFT payment providers. Ozow offers:

- ✅ Instant payment confirmation
- ✅ Lower transaction fees than card payments
- ✅ Direct bank-to-bank transfers
- ✅ No chargebacks
- ✅ Real-time payment notifications

---

## Quick Start Guide

### Step 1: Sign Up for Ozow

1. Visit **[https://www.ozow.com/](https://www.ozow.com/)**
2. Click "Get Started" or "Sign Up"
3. Choose "Merchant" account type
4. Complete the registration form
5. Submit required business documents

**What you'll need:**
- Business registration documents
- Bank account details
- ID/Passport of business owner
- Proof of address

### Step 2: Get Your Credentials

Once your account is approved:

1. Log into your Ozow dashboard
2. Navigate to **Settings** → **API Integration**
3. You'll find three important values:
   - **Site Code** (e.g., `ABC-ABC-001`)
   - **Private Key** (long alphanumeric string)
   - **API Key** (for API calls)

**Important:** Keep your Private Key secret! Never share it or commit it to public repositories.

### Step 3: Update packages.js

Open `c:/Users/Itumeleng Mahwa/Desktop/ISP/ISP/packages.js` and update lines 23-25:

```javascript
const OZOW_CONFIG = {
    siteCode: 'YOUR_ACTUAL_SITE_CODE',        // Replace this
    privateKey: 'YOUR_ACTUAL_PRIVATE_KEY',    // Replace this
    apiKey: 'YOUR_ACTUAL_API_KEY',            // Replace this
    isTest: false,  // Change to false for production
    // ... rest of config
};
```

### Step 4: Implement Server-Side Hash Generation

**CRITICAL:** For security, payment hash generation MUST be done on your server, not in JavaScript.

#### Why Server-Side?

Your Private Key must remain secret. If it's in JavaScript, anyone can see it and create fraudulent payment requests.

#### Implementation Options

**Option A: PHP Backend** (Recommended for simple sites)

Create `ozow-payment.php`:

```php
<?php
header('Content-Type: application/json');

// Ozow credentials (store these securely, not in code!)
$siteCode = 'YOUR_SITE_CODE';
$privateKey = 'YOUR_PRIVATE_KEY';

// Get payment data from request
$data = json_decode(file_get_contents('php://input'), true);

// Build hash string
$hashString = implode('', [
    $siteCode,
    $data['countryCode'],
    $data['currencyCode'],
    $data['amount'],
    $data['transactionReference'],
    $data['bankReference'],
    $data['optional1'] ?? '',
    $data['optional2'] ?? '',
    $data['optional3'] ?? '',
    $data['optional4'] ?? '',
    $data['optional5'] ?? '',
    $data['cancelUrl'],
    $data['errorUrl'],
    $data['successUrl'],
    $data['notifyUrl'],
    $data['isTest'] ? 'true' : 'false',
    $privateKey
]);

// Generate SHA512 hash
$hashCheck = hash('sha512', strtolower($hashString));

// Return payment form HTML
$formHtml = '<form method="POST" action="https://pay.ozow.com/" id="ozowForm">';
$formHtml .= '<input type="hidden" name="SiteCode" value="' . htmlspecialchars($siteCode) . '">';
$formHtml .= '<input type="hidden" name="CountryCode" value="' . htmlspecialchars($data['countryCode']) . '">';
$formHtml .= '<input type="hidden" name="CurrencyCode" value="' . htmlspecialchars($data['currencyCode']) . '">';
$formHtml .= '<input type="hidden" name="Amount" value="' . htmlspecialchars($data['amount']) . '">';
$formHtml .= '<input type="hidden" name="TransactionReference" value="' . htmlspecialchars($data['transactionReference']) . '">';
$formHtml .= '<input type="hidden" name="BankReference" value="' . htmlspecialchars($data['bankReference']) . '">';
$formHtml .= '<input type="hidden" name="CancelUrl" value="' . htmlspecialchars($data['cancelUrl']) . '">';
$formHtml .= '<input type="hidden" name="ErrorUrl" value="' . htmlspecialchars($data['errorUrl']) . '">';
$formHtml .= '<input type="hidden" name="SuccessUrl" value="' . htmlspecialchars($data['successUrl']) . '">';
$formHtml .= '<input type="hidden" name="NotifyUrl" value="' . htmlspecialchars($data['notifyUrl']) . '">';
$formHtml .= '<input type="hidden" name="IsTest" value="' . ($data['isTest'] ? 'true' : 'false') . '">';
$formHtml .= '<input type="hidden" name="HashCheck" value="' . $hashCheck . '">';
$formHtml .= '</form>';
$formHtml .= '<script>document.getElementById("ozowForm").submit();</script>';

echo json_encode(['html' => $formHtml]);
?>
```

Then update `packages.js` `initiatePayment()` function to call your PHP endpoint:

```javascript
function initiatePayment(packageType) {
    const pkg = PACKAGES[packageType];
    const transactionReference = generateTransactionReference();
    
    const paymentData = {
        countryCode: 'ZA',
        currencyCode: 'ZAR',
        amount: pkg.price.toFixed(2),
        transactionReference: transactionReference,
        bankReference: `ISP-MODEL-${packageType.toUpperCase()}`,
        cancelUrl: OZOW_CONFIG.cancelUrl,
        errorUrl: OZOW_CONFIG.errorUrl,
        successUrl: OZOW_CONFIG.successUrl,
        notifyUrl: OZOW_CONFIG.notifyUrl,
        isTest: OZOW_CONFIG.isTest,
        optional1: packageType,
        optional2: pkg.name
    };

    // Send to your PHP backend
    fetch('/ozow-payment.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
    })
    .then(response => response.json())
    .then(data => {
        // Inject form and submit
        const div = document.createElement('div');
        div.innerHTML = data.html;
        document.body.appendChild(div);
    })
    .catch(error => {
        alert('Error initiating payment. Please try again.');
        console.error(error);
    });
}
```

**Option B: Node.js Backend**

Create `ozow-payment.js`:

```javascript
const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

const OZOW_CONFIG = {
    siteCode: process.env.OZOW_SITE_CODE,
    privateKey: process.env.OZOW_PRIVATE_KEY
};

app.post('/api/ozow-payment', (req, res) => {
    const data = req.body;
    
    // Build hash string
    const hashString = [
        OZOW_CONFIG.siteCode,
        data.countryCode,
        data.currencyCode,
        data.amount,
        data.transactionReference,
        data.bankReference,
        data.optional1 || '',
        data.optional2 || '',
        data.optional3 || '',
        data.optional4 || '',
        data.optional5 || '',
        data.cancelUrl,
        data.errorUrl,
        data.successUrl,
        data.notifyUrl,
        data.isTest ? 'true' : 'false',
        OZOW_CONFIG.privateKey
    ].join('').toLowerCase();
    
    // Generate SHA512 hash
    const hashCheck = crypto.createHash('sha512').update(hashString).digest('hex');
    
    // Return form data
    res.json({
        siteCode: OZOW_CONFIG.siteCode,
        hashCheck: hashCheck,
        ...data
    });
});

app.listen(3000);
```

### Step 5: Handle Payment Notifications

Create a notification handler to receive payment confirmations from Ozow:

**ozow-notify.php:**

```php
<?php
// Ozow will POST payment status to this URL
$data = $_POST;

// Verify hash (important for security!)
$privateKey = 'YOUR_PRIVATE_KEY';
$hashString = implode('', [
    $data['SiteCode'],
    $data['TransactionId'],
    $data['TransactionReference'],
    $data['Amount'],
    $data['Status'],
    $data['Optional1'] ?? '',
    $data['Optional2'] ?? '',
    $data['Optional3'] ?? '',
    $data['Optional4'] ?? '',
    $data['Optional5'] ?? '',
    $data['CurrencyCode'],
    $data['IsTest'],
    $data['StatusMessage'],
    $privateKey
]);

$expectedHash = hash('sha512', strtolower($hashString));

if ($expectedHash === $data['HashCheck']) {
    // Hash is valid - payment is legitimate
    
    if ($data['Status'] === 'Complete') {
        // Payment successful!
        // Update your database
        // Send confirmation email
        
        $packageType = $data['Optional1'];
        $transactionRef = $data['TransactionReference'];
        $amount = $data['Amount'];
        
        // Your database logic here
        // e.g., mark order as paid, send email, etc.
        
        error_log("Payment successful: $transactionRef - R$amount - $packageType");
    }
    
    // Return 200 OK to Ozow
    http_response_code(200);
} else {
    // Invalid hash - possible fraud attempt
    http_response_code(400);
    error_log("Invalid Ozow hash received");
}
?>
```

---

## Testing

### Test Mode

1. Set `isTest: true` in `packages.js`
2. Use your test credentials from Ozow
3. Ozow provides test bank accounts for testing
4. No real money is transferred

### Test Bank Accounts (Provided by Ozow)

When in test mode, use these details:
- **Bank:** Any bank
- **Account Type:** Current/Savings
- **Branch Code:** Any valid code

Ozow will simulate the payment without actual transfers.

### Going Live

1. Complete Ozow verification process
2. Get production credentials
3. Update `packages.js` with production credentials
4. Set `isTest: false`
5. Test with small amount first
6. Monitor first few transactions

---

## Current Status

✅ **Package Display** - Working perfectly  
✅ **Registration Closing Date** - Automated  
✅ **Ozow Integration** - Configured (needs credentials)  
⚠️ **Server-Side Hash** - Needs implementation  
⚠️ **Payment Notifications** - Needs implementation  

---

## Security Checklist

- [ ] Private Key stored securely (not in JavaScript)
- [ ] Hash generation done server-side
- [ ] HTTPS enabled on your website
- [ ] Payment notifications verified with hash
- [ ] Transaction references are unique
- [ ] Database records all transactions
- [ ] Email confirmations sent to customers
- [ ] Admin notifications for new payments

---

## Support & Resources

- **Ozow Website:** [https://www.ozow.com/](https://www.ozow.com/)
- **Ozow Documentation:** [https://docs.ozow.com/](https://docs.ozow.com/)
- **Ozow Support:** support@ozow.com
- **Ozow Phone:** 087 820 7930

---

## Pricing

Ozow typically charges:
- **Transaction Fee:** ~1.5% per transaction
- **Monthly Fee:** Varies by plan
- **Setup Fee:** May apply

Contact Ozow for exact pricing for your business.

---

## Advantages of Ozow

✅ **Instant Confirmation** - Know immediately when paid  
✅ **Lower Fees** - Cheaper than credit cards  
✅ **No Chargebacks** - Bank transfers can't be reversed  
✅ **Local** - South African company, ZAR support  
✅ **Easy Integration** - Simple API  
✅ **Mobile Friendly** - Works great on phones  

---

## Next Steps

1. **Right Now:** System works in demo mode (shows alerts)
2. **This Week:** Sign up for Ozow account
3. **After Approval:** Implement server-side hash generation
4. **Before Launch:** Test thoroughly in test mode
5. **Go Live:** Switch to production credentials

Your packages system is ready - just add your Ozow credentials and implement the server-side components!
