const express = require("express");
const cors = require("cors");
require("dotenv").config();
const session = require("express-session");
const MongoStore = require("connect-mongo").default;

const connectDB = require("./config/database");
const authRouter = require("./routes/authRouter");
const donorRouter = require("./routes/donorRouter");
const donationRouter = require("./routes/donationRouter");
const bloodRequestRouter = require("./routes/bloodRequestRouter");
const contactRequestRouter = require("./routes/contactRequestRouter");

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),

    cookie: {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    },
  }),
);

app.use("/api/auth", authRouter);
app.use("/api/donor", donorRouter);
app.use("/api/donation", donationRouter);
app.use("/api/blood-request", bloodRequestRouter);
app.use("/api/contact-request", contactRequestRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BloodConnect API is running",
  });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
