const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1. إعداد النقل (transporter)
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // بريدك
      pass: process.env.EMAIL_PASS, // كلمة المرور أو app password
    },
  });

  // 2. إعداد محتوى الرسالة
  const mailOptions = {
    from: `"Booking System" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3. إرسال الرسالة
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
