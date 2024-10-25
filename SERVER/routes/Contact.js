const express = require('express');
const router = express.Router();

const { submitContactForm } =  require("../controllers/ContactUs");

router.post('/submit-form', submitContactForm);

module.exports = router;