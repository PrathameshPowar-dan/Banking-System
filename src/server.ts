import express, { NextFunction, Request, Response } from "express";
import ConnectDB from "./database/index";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AllRoutes from "./routes/routes";
import { ApiError } from "./utils/ApiError";

// Env Config
dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.use("/api", AllRoutes);

// Check up Error
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode || 500;

    res.status(statusCode).json({
        success: err.success || false,
        message: err.message || "Internal Server Error",
        errors: err.errors || [],
    });
});

// Connect to the database and start the server
ConnectDB().then(() => {
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
})
    .catch((err) => {
        console.log("Server Error: ", err)
    });