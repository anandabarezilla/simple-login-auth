import nodemailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

const mailGenerator = new Mailgen({
  theme: "default",
  product: {
    name: "Barezilla",
    link: "https://twitter.com/anndbrzll",
  },
});

export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;
  try {
    const email = {
      body: {
        name: username,
        intro: text || "Welcome to Mailgen!",
        outro: "Need help? just reply this email",
      },
    };

    const emailBody = mailGenerator.generate(email);

    const mailOptions = {
      from: process.env.EMAIL,
      to: userEmail,
      subject: subject || "Signup success!",
      html: emailBody,
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: "Email sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
