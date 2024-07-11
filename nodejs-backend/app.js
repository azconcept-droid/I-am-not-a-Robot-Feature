const express = require("express");
const cors = require("cors");
const { default: axios } = require("axios");

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded());

// allow cors requests from any origin and with credentials
app.use(
  cors({
    origin: (origin, callback) => callback(null, true),
    credentials: true,
  })
);

app.get("/", function (req, res) {
  res.json({
    status: "success",
    message: "Welcome to my GOOGLE RECAPTCHA"});
});

app.post("/i-am-not-a-robot", async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        status: "failed",
        message: "Recaptcha token is required"
      });
    }

    console.log("Request body", req.body);

    const { data, status, statusText } = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.SECRET_KEY}&response=${token}`
    );
    if (data.success) {
      // continue some model save operations
      console.log("Demo Model saved");
      console.log({ data, status, statusText })
      return res.json({ data, status, statusText });
    } else {
        console.log("Demo Model saved failed");
        return res.status(400).json({ data, message: "Invalid recapthca" });
    }
  } catch (error) {
    console.log("test-recaptcha error", error);
    return res.status(400).json("Failed");
  }
});

app.listen(port, () => console.log(`Backend running on PORT: ${port}`));
