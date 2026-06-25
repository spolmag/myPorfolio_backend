import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/error.middleware.js";
import { connectDB } from "./config/mongoDB.js";
import { router as apiRoutes } from "./routes/index.js";
import { corsOption } from "./config/cors.config.js";

const app = express();

app.use(express.json());
app.use(cors(corsOption));
app.use(cookieParser());
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send(
    `<!doctype html>
    <html lang="en">
    <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>My Portfolio-Backend</title>
    </head>
    <body>
    <h1>Suttipong Polmag's portfolio - Backend</h1>
    </body>
    </html>`,
  );
});

app.use(errorHandler);

await connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} 🟢`);
});
