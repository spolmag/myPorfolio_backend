export const corsOption = {
  origin: (origin, callback) => {
    // Allow local development testing and any Vercel app domain dynamically
    if (
      !origin ||
      origin.startsWith("http://localhost:") ||
      origin.endsWith("vercel.app")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Blocked by premium metallic security CORS layer"));
    }
  },
  credentials: true,
};
