## 🔐 LTI 1.3 Integration Overview

This project demonstrates a simulated **LTI 1.3 Tool Provider** integrated with an LMS (Canvas-style).

---

## 🧠 What is LTI 1.3?

LTI (Learning Tools Interoperability) 1.3 is a standard that allows external tools to integrate securely with Learning Management Systems (LMS) like:

- Canvas
- Moodle
- Blackboard

It uses:
- OpenID Connect (OIDC)
- OAuth 2.0
- JWT (JSON Web Tokens)

---

## 🔵 Required Configuration from LMS (Platform)

To integrate an LTI tool, the LMS provides:

| Parameter | Description |
|----------|------------|
| **Issuer (iss)** | Identifies the LMS |
| **Client ID** | Unique ID for your tool |
| **Deployment ID** | Tool installation reference |
| **Authorization URL** | Used for login (OIDC flow) |
| **Token Endpoint** | Used for API + grade passback |
| **JWKS URL** | LMS public keys for verifying JWT |

Example:

Issuer: https://canvas.instructure.com

JWKS URL: https://canvas.instructure.com/api/lti/security/jwks

Auth URL: https://canvas.instructure.com/api/lti/authorize_redirect
---

## 🟢 Required Configuration from Tool (This App)

Your LTI tool must expose:

| Endpoint | Purpose |
|---------|--------|
| `/lti/login` | Initiates OIDC login |
| `/lti/launch` | Receives LTI launch (POST with JWT) |
| `/test-launch` | Simulated launch (GET) |
| `/simulate-jwt-launch` | Simulated JWT-based launch |
| `/.well-known/jwks.json` | Public keys for verification |

---

## 🔁 LTI 1.3 Launch Flow

1. User clicks tool inside LMS  
2. LMS calls `/lti/login`  
3. Tool redirects to LMS Authorization URL  
4. LMS sends POST request to `/lti/launch`  
5. Request includes `id_token` (JWT)  
6. Tool:
   - Validates JWT
   - Extracts user, role, course
7. Tool renders UI based on context

---

## 🔐 JWT Payload Example

```json
{
  "iss": "https://canvas.instructure.com",
  "sub": "user-123",
  "name": "Muhammad Ahsan",
  "https://purl.imsglobal.org/spec/lti/claim/context": {
    "title": "LTI 1.3 Portfolio Test Course"
  },
  "https://purl.imsglobal.org/spec/lti/claim/roles": [
    "Instructor"
  ]
}
```

## ✅ Current Working Demo

The project currently demonstrates an end-to-end LMS-style workflow:

1. Student opens the LTI activity
2. Student completes the activity
3. Frontend sends score to backend
4. Backend records grade submission
5. Instructor dashboard displays submitted grades

### Demo Flow

Student Activity:

```text
http://localhost:3000/student

Instructor Dashboard:

http://localhost:3000/instructor

Backend APIs:

POST /grade
GET /grades
```
