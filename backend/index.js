const express = require("express");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret-change-me",
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  res.send("LTI 1.3 Tool Running 🚀");
});

// Health check
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "lti13-multilms-tool",
  });
});

// Step 1 of LTI 1.3 launch: OIDC login initiation
app.post("/lti/login", (req, res) => {
  console.log("LTI Login Request:", req.body);

  const {
    iss,
    login_hint,
    target_link_uri,
    lti_message_hint,
    client_id,
  } = req.body;

  if (!iss || !login_hint || !target_link_uri || !client_id) {
    return res.status(400).json({
      error: "Missing required LTI login parameters",
      received: req.body,
    });
  }

  req.session.ltiLogin = {
    iss,
    login_hint,
    target_link_uri,
    lti_message_hint,
    client_id,
    createdAt: new Date().toISOString(),
  };

  res.json({
    message: "LTI login request received",
    nextStep: "Redirect user to LMS authorization endpoint",
    data: req.session.ltiLogin,
  });
});

// Step 2 placeholder: LMS sends ID token here
app.post("/lti/launch", (req, res) => {
  console.log("LTI Launch Request:", req.body);

  res.json({
    message: "LTI launch endpoint ready",
    note: "Next step will validate id_token JWT from LMS",
    body: req.body,
  });
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});