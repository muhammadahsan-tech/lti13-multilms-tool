const express = require("express");
const cors = require("cors");
const session = require("express-session");
const crypto = require("crypto");
const platforms = require("./config/platforms");
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
  const { iss, login_hint, target_link_uri, lti_message_hint, client_id } = req.body;

  if (!iss || !login_hint || !target_link_uri || !client_id) {
    return res.status(400).json({
      error: "Missing required LTI login parameters",
      received: req.body,
    });
  }

  const platform = platforms.canvas;

  const state = crypto.randomBytes(16).toString("hex");
  const nonce = crypto.randomBytes(16).toString("hex");

  req.session.ltiLogin = {
    iss,
    login_hint,
    target_link_uri,
    lti_message_hint,
    client_id,
    state,
    nonce,
    createdAt: new Date().toISOString(),
  };

  const redirectUrl = new URL(platform.authUrl);

  redirectUrl.searchParams.set("scope", "openid");
  redirectUrl.searchParams.set("response_type", "id_token");
  redirectUrl.searchParams.set("client_id", client_id);
  redirectUrl.searchParams.set("redirect_uri", target_link_uri);
  redirectUrl.searchParams.set("login_hint", login_hint);
  redirectUrl.searchParams.set("state", state);
  redirectUrl.searchParams.set("nonce", nonce);
  redirectUrl.searchParams.set("prompt", "none");

  if (lti_message_hint) {
    redirectUrl.searchParams.set("lti_message_hint", lti_message_hint);
  }

  res.redirect(redirectUrl.toString());
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