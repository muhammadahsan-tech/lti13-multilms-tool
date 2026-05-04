const express = require("express");
const cors = require("cors");
const session = require("express-session");
const crypto = require("crypto");
const platforms = require("./config/platforms");
const jwt = require("jsonwebtoken");

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


app.post("/lti/launch", (req, res) => {
  const idToken = req.body.id_token;

  if (!idToken) {
    return res.status(400).send("Missing id_token");
  }

  try {
    const decoded = jwt.decode(idToken, { complete: true });

    console.log("Decoded LTI Token:", decoded);

    const payload = decoded.payload;

    res.send(`
      <h1>🚀 REAL LTI Launch</h1>
      <p>User ID: ${payload.sub}</p>
      <p>Issuer: ${payload.iss}</p>
      <p>Audience: ${payload.aud}</p>
      <p>Course Context: ${payload["https://purl.imsglobal.org/spec/lti/claim/context"]?.title}</p>
    `);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to decode LTI token");
  }
});

app.get("/test-launch", (req, res) => {
  const user = {
    name: "Muhammad Ahsan",
    role: req.query.role || "Instructor",
  };

  const course = {
    name: "LTI 1.3 Portfolio Test Course",
  };

  const isInstructor = user.role.toLowerCase() === "instructor";

  res.send(`
    <html>
      <head>
        <title>LTI 1.3 Learning Tool</title>
        <style>
          body { font-family: Arial, sans-serif; background:#f6f8fb; margin:0; padding:40px; }
          .card { background:white; border-radius:16px; padding:30px; max-width:850px; box-shadow:0 10px 30px rgba(0,0,0,.08); }
          .badge { display:inline-block; padding:6px 12px; border-radius:999px; background:#e8f1ff; color:#1f5fbf; font-weight:bold; }
          .grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:24px; }
          .metric { background:#f1f5f9; padding:18px; border-radius:12px; }
          .metric h3 { margin:0; font-size:28px; }
          .metric p { margin:6px 0 0; color:#555; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">${user.role} View</span>
          <h1>🚀 LTI 1.3 Launch Successful</h1>
          <p><strong>User:</strong> ${user.name}</p>
          <p><strong>Course:</strong> ${course.name}</p>

          ${
            isInstructor
              ? `
                <h2>Instructor Dashboard</h2>
                <div class="grid">
                  <div class="metric"><h3>24</h3><p>Total Launches</p></div>
                  <div class="metric"><h3>86%</h3><p>Avg Score</p></div>
                  <div class="metric"><h3>18</h3><p>Completions</p></div>
                </div>
              `
              : `
                <h2>Student Activity</h2>
                <p>Welcome to your LMS-connected learning activity.</p>
                <button style="padding:12px 18px;border:0;border-radius:10px;background:#111;color:white;">
                  Start Activity
                </button>
              `
          }
        </div>
      </body>
    </html>
  `);
});

app.get("/test-jwt", (req, res) => {
  const fakeJwtPayload = {
    sub: "user-123",
    iss: "https://canvas.instructure.com",
    aud: "client-id-xyz",
    "https://purl.imsglobal.org/spec/lti/claim/context": {
      title: "LTI 1.3 Portfolio Test Course"
    },
    "https://purl.imsglobal.org/spec/lti/claim/roles": [
      "http://purl.imsglobal.org/vocab/lis/v2/membership#Instructor"
    ]
  };

  console.log("Simulated JWT Payload:", fakeJwtPayload);

  res.json(fakeJwtPayload);
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});

