const nodemailer = require('nodemailer');

exports.handler = async (event, context) => {
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    
    // We need standard Gmail SMTP credentials
    // Note: The user MUST provide their own credentials in Netlify Environment Variables
    // GMAIL_USER = their gmail address
    // GMAIL_PASS = their google app password
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'manarqise19@gmail.com', // fallback, but needs App Password
        pass: process.env.GMAIL_PASS || 'your-app-password-here' 
      }
    });

    const mailOptions = {
      from: process.env.GMAIL_USER || 'manarqise19@gmail.com',
      to: 'manarqise19@gmail.com', // sending to admin
      subject: `تسجيل جديد من: ${data['الاسم الكامل']}`,
      text: `تم استلام تسجيل جديد في مؤتمر MEGA.\n\n` + 
            `الاسم: ${data['الاسم الكامل']}\n` +
            `المدينة: ${data['المدينة']}\n` +
            `واتساب: ${data['رقم الواتساب']}\n` +
            `إيميل: ${data['البريد الإلكتروني']}\n\n` +
            `باقي التفاصيل موجودة في التذكرة المرفقة.`,
      attachments: [
        {
          filename: 'MEGA_Ticket.pdf',
          content: data.pdfBase64,
          encoding: 'base64'
        }
      ]
    };

    await transporter.sendMail(mailOptions);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Email sent successfully!' })
    };
  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
