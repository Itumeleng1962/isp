# Email Setup Instructions

## Why emails weren't working

Your contact and quote forms had several issues:
1. ❌ No email service configured (forms had `action="#"`)
2. ❌ Missing JavaScript handlers for form submission
3. ❌ Missing `name` attributes on form inputs
4. ❌ Forms didn't match the expected structure

## What I've fixed

✅ Added Web3Forms email service integration  
✅ Added proper form structure with `name` attributes  
✅ Added JavaScript handlers for both forms  
✅ Added status messages for success/error feedback  

## Next Step: Get Your Web3Forms Access Key

To receive emails, you need to get a free access key from Web3Forms:

1. **Visit**: https://web3forms.com
2. **Sign up** for a free account (or sign in if you have one)
3. **Get your access key** from the dashboard
4. **Replace** `YOUR_WEB3FORMS_ACCESS_KEY` in both files:
   - `quote.html` (line ~133)
   - `contact.html` (line ~142)

### How to replace the access key:

1. Open `quote.html`
2. Find this line:
   ```html
   <input type="hidden" name="access_key" value="YOUR_WEB3FORMS_ACCESS_KEY">
   ```
3. Replace `YOUR_WEB3FORMS_ACCESS_KEY` with your actual key from Web3Forms
4. Do the same in `contact.html`

## Alternative Email Services

If you prefer a different service, you can use:

- **Formspree**: https://formspree.io
- **EmailJS**: https://www.emailjs.com
- **SendGrid**: https://sendgrid.com
- **Your own backend**: Set up a server endpoint

Just update the `action` attribute in the forms and adjust the JavaScript in `script.js` if needed.

## Testing

After adding your access key:
1. Open `quote.html` in your browser
2. Fill out the form
3. Submit it
4. Check your email (the one associated with your Web3Forms account)
5. You should receive the form submission!

## Email Configuration

By default, emails will be sent to the email address associated with your Web3Forms account. You can configure:
- Custom recipient emails
- Email templates
- Auto-replies
- Spam protection

All of this is available in your Web3Forms dashboard.



