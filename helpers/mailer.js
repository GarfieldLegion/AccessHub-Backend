const nodemailer = require("nodemailer");

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
	service:'gmail',
	// host: process.env.EMAIL_SMTP_HOST,
	// port: process.env.EMAIL_SMTP_PORT,
	//secure: process.env.EMAIL_SMTP_SECURE, // lack of ssl commented this. You can uncomment it.
	auth: {
		user: process.env.EMAIL_SMTP_USERNAME,
		pass: process.env.EMAIL_SMTP_PASSWORD
	}
});

exports.sendMail = async function (to, subject, html) {
	try {
		// Create the email options
		const mailOptions = {
			from: process.env.EMAIL_SMTP_USERNAME,
			to: to,
			subject: subject,
			html: html,
		};

		// Send the email
		const info = await transporter.sendMail(mailOptions);
		console.log('Email sent successfully.');
	} catch (error) {
		console.error('Error sending email:', error);
	}
};