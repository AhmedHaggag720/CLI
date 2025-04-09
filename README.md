# CLI

This repository contains a Command Line Interface (CLI) application built with Node.js, following the Model-View-Controller (MVC) architecture. It includes user authentication and a full payment integration using Paymob.

## Features

- Modular MVC structure
- User authentication with JWT
- Payment processing with Paymob
- Email integration using Nodemailer

## Project Structure

- `config/` - App configurations (e.g., JWT, Paymob credentials).
- `controllers/` - Handles business logic (`auth`, `payment`, etc.).
- `middlewares/` - Middleware for authentication and error handling.
- `models/` - MongoDB models (e.g., User).
- `routes/` - Express routers (e.g., `/auth`, `/payment`).
- `app.js` - Entry point for the application.
- `.env` - Environment variables (not included in repo).

## Payment Integration (Paymob)

This project supports payment via [Paymob](https://www.paymob.com/). The flow includes:

1. Creating an authentication token with Paymob.
2. Creating an order and retrieving a payment key.
3. Redirecting to Paymob’s hosted payment page.

To configure payments:

1. Sign up at [Paymob Dashboard](https://accept.paymobsolutions.com/).
2. Get your API key and integration ID.
3. Create a `.env` file and add:
   ```env
   PAYMOB_API_KEY=your_paymob_api_key
   PAYMOB_IFRAME_ID=your_iframe_id
   PAYMOB_INTEGRATION_ID=your_integration_id
