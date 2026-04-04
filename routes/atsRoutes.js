const express = require("express");

const router = express.Router();

// Proxy to Flask ATS service
// Env: ATS_SERVICE_URL (e.g., http://127.0.0.1:10000)
const ATS_SERVICE_URL =
  process.env.ATS_SERVICE_URL || "http://127.0.0.1:10000";

router.post("/ats-score", async (req, res) => {
  try {
    const { jd_text, resume_text, name } = req.body || {};

    if (!jd_text || !resume_text) {
      return res
        .status(400)
        .json({ message: "jd_text and resume_text are required" });
    }

    // Use global fetch (Node 18+) to call Flask service
    const response = await fetch(`${ATS_SERVICE_URL}/api/ats-score`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jd_text, resume_text, name }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return res
        .status(response.status || 500)
        .json({ message: data?.error || "ATS service error" });
    }

    // Normalize Flask response shape for frontend consumers
    // Flask currently returns: { result: { ai, ats, final, skills, missing, suggestion, roles, ... } }
    const payload = data?.result || data;

    const normalized = {
      name: payload?.name || name || "Candidate",
      ai_score: Number(payload?.ai ?? payload?.ai_score ?? 0),
      ats_score: Number(payload?.ats ?? payload?.ats_score ?? 0),
      final_score: Number(payload?.final ?? payload?.final_score ?? 0),
      suggestion: payload?.suggestion || "",
      suggested_role: payload?.roles || payload?.suggested_role || "Software Engineer",
      skills_found: Array.isArray(payload?.skills_found)
        ? payload.skills_found
        : String(payload?.skills || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .filter((s) => s !== "—"),
      missing_skills: Array.isArray(payload?.missing_skills)
        ? payload.missing_skills
        : String(payload?.missing || "")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .filter((s) => s.toLowerCase() !== "none"),
      jd_skills: Array.isArray(payload?.jd_skills) ? payload.jd_skills : [],
      raw: data,
    };

    return res.status(200).json(normalized);
  } catch (err) {
    console.error("ATS proxy error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;

