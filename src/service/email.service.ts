// Email service

import nodemailer from "nodemailer";
import config from "config";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.get("email"),
    pass: config.get("emailPassword"),
  },
});

export async function sendEmail(to: string, subject: string, text: string) {
  const mailOptions: nodemailer.SendMailOptions = {
    from: config.get("email") as string,
    to,
    subject,
    text,
  };

  return transporter.sendMail(mailOptions);
}
// In the email service, we have a sendEmail function that sends an email to the recipient. The function uses the nodemailer library to send the email. The configuration for the email service is stored in the config file using the config package.

// The email service is used in the forgotPasswordHandler function in the auth controller to send a reset password link to the user's email address.

// In this example, we have separated the email service from the rest of the application logic to keep the code modular and maintainable. This separation allows us to easily change the email service implementation without affecting other parts of the application.

// By following this pattern, we can keep our codebase clean, organized, and easy to maintain. It also makes it easier to test the email service independently of the rest of the application logic.

// Overall, separating the email service from the rest of the application logic is a good practice that can help improve the maintainability and scalability of the codebase. It allows us to focus on the specific functionality of sending emails without cluttering the rest of the code with email-related logic.
