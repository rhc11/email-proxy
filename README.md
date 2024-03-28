**WhatsApp Integration with Smoobu via Email for Access Codes using Node.js**

## Overview
This Node.js application demonstrates how to integrate Smoobu, a vacation rental management software, with WhatsApp using email as a medium to obtain access codes for accommodations. By following the instructions below, you'll be able to set up a system where your guests receive automated messages via WhatsApp containing access codes retrieved from emails sent by Smoobu.

## Prerequisites
- Smoobu account with access to email notifications for bookings.
- Dedicated email account
- Whatsapp account.

## Setup Instructions
1. Clone this repository to your local machine.
   ```bash
   git clone https://github.com/your-username/smoobu-whatsapp-email-integration.git
   ```

2. Navigate to the project directory.
   ```bash
   cd smoobu-whatsapp-email-integration
   ```

3. Install dependencies.
   ```bash
   npm install && tsc
   ```

4. Set up your configuration by creating a `.env` file in the root directory of the project. Replace the placeholder values with your actual credentials.
   ```plaintext
   EMAIL=your-email-username
   EMAIL_PASSWORD=your-email-password
   VALID_EMAILS=array-with-emails-from-host
   LATITUDE=
   LONGITUDE=-
   NAME_HOME=for-msg-copy
   OWNER_PHONE=for-whatsapp-errors
   PORT=
   ```

5. Start the application.
   ```bash
   npm start
   ```

6. Your application should now be running. First you should scan QR code with Whatsapp app. It will monitor your email inbox for messages from Smoobu containing access codes. Once a new email is detected, it will extract the access code and send it via WhatsApp to the guest's phone number.

## How It Works
- The application periodically checks your email inbox for new messages.
- When a new email from Smoobu is detected, it extracts the information with access code. The format is day|checkinTime|phone|room|code. This is format to welcome message.
- The welcome message is then sent to the guest's WhatsApp number using whatsapp-web.js.

## Additional Notes
- Configure in Smoobu an email template with the medium email account.
- Customize the email parsing logic according to the format of emails sent by Smoobu.
- Customize the message templates and integration logic according to your requirements.
- Consider implementing error handling and logging for robustness in a production environment.
- Monitor email usage and ensure that the email account used for integration has sufficient access. Not compatible with 2fa authentication.

## Author
[Rubén Herrera](https://github.com/rhc11)

Feel free to reach out with any questions or feedback!
