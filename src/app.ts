import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import router from "./router/index.js";
import config from "./config/index.js";
import globalErrorHandler from "./middlewire/globalErrorHandler.js";
import notFound from "./middlewire/notFound.js";

const app:Application = express();
app.use(express.json());
app.use(cookieParser());
const corsOption = {
  origin: [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:5174",
  ],
  credentials: true,
};
app.use(cors(corsOption));
app.use("/api/v1", router);
const test = (req:Request, res: Response) => {
  const message = `server is running on port ${config.port}`;
  res.send(message);
};
app.get("/", test);
app.use(globalErrorHandler);
app.use(notFound);
export default app;
