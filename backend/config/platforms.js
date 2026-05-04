const platforms = {
  canvas: {
    name: "Canvas",
    issuer: "https://canvas.instructure.com",
    clientId: process.env.CANVAS_CLIENT_ID,
    authUrl: process.env.CANVAS_AUTH_URL,
    tokenUrl: process.env.CANVAS_TOKEN_URL,
    jwksUrl: process.env.CANVAS_JWKS_URL,
  },
};

module.exports = platforms;