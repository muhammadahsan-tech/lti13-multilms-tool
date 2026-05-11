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

app.get("/simulate-jwt-launch", (req, res) => {
  const role = req.query.role || "Instructor";

  const ltiPayload = {
    iss: "https://canvas.instructure.com",
    aud: "demo-client-id-123",
    sub: "user-12345",
    name: "Muhammad Ahsan",
    email: "dev.muhammadahsan@outlook.com",
    "https://purl.imsglobal.org/spec/lti/claim/context": {
      id: "course-14742071",
      title: "LTI 1.3 Portfolio Test Course",
      type: ["CourseSection"],
    },
    "https://purl.imsglobal.org/spec/lti/claim/roles": [
      `http://purl.imsglobal.org/vocab/lis/v2/membership#${role}`,
    ],
    "https://purl.imsglobal.org/spec/lti/claim/resource_link": {
      id: "resource-001",
      title: "LTI Learning Activity",
    },
  };

  const token = jwt.sign(ltiPayload, "demo-secret", {
    algorithm: "HS256",
    expiresIn: "1h",
  });

  const decoded = jwt.decode(token);

  res.send(`
    <html>
      <head>
        <title>Simulated LTI JWT Launch</title>
        <style>
          body { font-family: Arial, sans-serif; background:#f6f8fb; padding:40px; }
          .card { background:white; border-radius:16px; padding:30px; max-width:950px; box-shadow:0 10px 30px rgba(0,0,0,.08); }
          pre { background:#0f172a; color:#e2e8f0; padding:20px; border-radius:12px; overflow:auto; }
          .badge { display:inline-block; padding:6px 12px; border-radius:999px; background:#e8f1ff; color:#1f5fbf; font-weight:bold; }
        </style>
      </head>
      <body>
        <div class="card">
          <span class="badge">Simulated LTI 1.3 JWT</span>
          <h1>🚀 JWT Launch Simulation</h1>
          <p><strong>User:</strong> ${decoded.name}</p>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Course:</strong> ${decoded["https://purl.imsglobal.org/spec/lti/claim/context"].title}</p>

          <h2>Signed JWT</h2>
          <pre>${token}</pre>

          <h2>Decoded JWT Payload</h2>
          <pre>${JSON.stringify(decoded, null, 2)}</pre>
        </div>
      </body>
    </html>
  `);
});

let grades = []; // 👈 add this at top

app.post("/grade", (req, res) => {
  const { userId, score } = req.body;

  const record = {
    userId,
    score,
    timestamp: new Date().toISOString(),
  };

  grades.push(record); // 👈 store it

  console.log("Grade received:", record);

  res.json({
    message: "Grade recorded successfully",
    record,
  });
});

app.get("/grades", (req, res) => {
  res.json(grades);
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

let lineItems = [
  {
    id: "lineitem-001",
    label: "LTI Learning Activity",
    scoreMaximum: 100,
    resourceId: "resource-001",
  },
];

let scores = [];

app.get("/ags/lineitems", (req, res) => {
  res.json(lineItems);
});

app.post("/ags/scores", (req, res) => {
  const { userId, lineItemId, scoreGiven, scoreMaximum, activityProgress, gradingProgress } = req.body;

  if (!userId || !lineItemId || scoreGiven === undefined) {
    return res.status(400).json({ error: "Missing required score fields" });
  }

  const scoreRecord = {
    userId,
    lineItemId,
    scoreGiven,
    scoreMaximum: scoreMaximum || 100,
    activityProgress: activityProgress || "Completed",
    gradingProgress: gradingProgress || "FullyGraded",
    timestamp: new Date().toISOString(),
  };

  scores.push(scoreRecord);

  res.json({
    message: "AGS score submitted successfully",
    scoreRecord,
  });
});

app.get("/ags/scores", (req, res) => {
  res.json(scores);
});

app.listen(3001, () => {
  console.log("Backend running on port 3001");
});

