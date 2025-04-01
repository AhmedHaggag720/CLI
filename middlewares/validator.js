const { body, validationResult } = require("express-validator");

// Validation for user registration
const validateUser = [
  body("name").trim().isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

// Validation for user login
const validateLogin = [
  body("email").trim().isEmail().withMessage("Invalid email format"),
  body("password").notEmpty().withMessage("Password is required"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  },
];

module.exports = { validateUser, validateLogin };
