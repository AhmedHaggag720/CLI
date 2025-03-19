const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const pool = require("./config/db"); // Import pool

dotenv.config();
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use(express.json()); // ✅ Add this line to parse JSON requests

// Import Routes
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");

app.use("/user/", userRoutes); // ✅ Better route structure
app.use("/task/", taskRoutes); // ✅ Better route structure
  
// // Start Server
const PORT = process.env.PORT || 3000; // Default to port 5000
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
