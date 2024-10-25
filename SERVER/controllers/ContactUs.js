const Contact = require("../models/Contact");
const mailSender = require("../utils/mailSender");
const { contactUsEmail } = require("../mail/templates/contactFormRes");

// Contact form submission

exports.submitContactForm = async (req, res) => {
  try {
    const { firstname, lastname, email, countrycode, phoneNo, message } =
      req.body;

    // Validation
    if (!firstname || !email || !phoneNo || !message) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Format phone number
    const phone = `${countrycode}${phoneNo}`;

    // Create a new contact
    const newContact = new Contact({
      firstname,
      lastname,
      email,
      phone,
      message,
    });

    // Save to the database
    await newContact.save();

    // Send email notification
    const emailRes = await mailSender(
      email,
      "Study Notion - Message Sent",
      contactUsEmail(firstname, lastname, email, phone, message)
    );

    res.status(200).json({
      success: true,
      message: "Contact form submitted successfully.",
      data: emailRes
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "could not submit contact form",
    });
  }
};
