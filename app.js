require("dotenv").config();
require("express-async-errors");

const express = require("express");
const app = express();

// connectDB

const apiRouter = require("./routes/api");

const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const pool = require("./db/connect");

// middleware
app.use(express.json());

// mainroutes
app.use("/api/v1", apiRouter);

// Test DB route
app.get("/test-db", async (req, res) => {
    try {
        const result = await pool.query("SELECT NOW() as current_time");
        res.json({
            message: "Database connected successfully",
            timestamp: result.rows[0].current_time,
        });
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Database connection failed" });
    }
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = 5000;

const start = async () => {
    try {
        await pool.query("SELECT 1");
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.log("Error starting server:", error);
    }
};

start();