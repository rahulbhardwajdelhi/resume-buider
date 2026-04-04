import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ScreeningPage() {
  const [jobDescription, setJobDescription] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [candidateName, setCandidateName] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!jobDescription.trim() || !resumeText.trim()) {
      setError("Please enter both job description and resume text");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/ats-score`,
        {
          jd_text: jobDescription,
          resume_text: resumeText,
          name: candidateName || "Candidate",
        }
      );

      const d = response.data || {};
      setResult({
        ...d,
        ai_score: Number(d.ai_score ?? 0),
        ats_score: Number(d.ats_score ?? 0),
        final_score: Number(d.final_score ?? 0),
        skills_found: Array.isArray(d.skills_found) ? d.skills_found : [],
        missing_skills: Array.isArray(d.missing_skills) ? d.missing_skills : [],
        jd_skills: Array.isArray(d.jd_skills) ? d.jd_skills : [],
      });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Error analyzing resume. Please try again."
      );
      console.error("Screening error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 65) return "text-blue-600";
    if (score >= 50) return "text-yellow-600";
    if (score >= 35) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 65) return "bg-blue-100";
    if (score >= 50) return "bg-yellow-100";
    if (score >= 35) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/home")}
            className="mb-4 text-indigo-600 hover:text-indigo-800 font-semibold"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🎯 Resume ATS Screening
          </h1>
          <p className="text-gray-600">
            Analyze your resume against a job description using AI scoring
          </p>
        </div>

        {!result ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                📋 Job Description
              </label>
              <textarea
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description here..."
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>

            {/* Resume Text */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <label className="block text-lg font-semibold text-gray-700 mb-3">
                📄 Resume Text
              </label>
              <textarea
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                placeholder="Paste your resume content here..."
                className="w-full h-64 p-4 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </div>
        ) : null}

        {/* Candidate Name & Actions */}
        <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6">
            <label className="block text-lg font-semibold text-gray-700 mb-2">
              👤 Candidate Name (Optional)
            </label>
            <input
              type="text"
              value={candidateName}
              onChange={(e) => setCandidateName(e.target.value)}
              placeholder="Your name"
              disabled={loading || result}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-indigo-500"
            />
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
              {error}
            </div>
          )}

          <div className="flex gap-4">
            {!result ? (
              <button
                onClick={handleAnalyze}
                disabled={loading}
                className={`flex-1 py-3 px-6 font-bold rounded-lg transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed text-gray-600"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {loading ? "⏳ Analyzing..." : "🚀 Analyze Resume"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setResult(null);
                    setJobDescription("");
                    setResumeText("");
                    setCandidateName("");
                  }}
                  className="flex-1 py-3 px-6 font-bold rounded-lg bg-gray-600 hover:bg-gray-700 text-white transition"
                >
                  ← Try Another
                </button>
                <button
                  onClick={() => navigate("/home")}
                  className="flex-1 py-3 px-6 font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white transition"
                >
                  → Back to Dashboard
                </button>
              </>
            )}
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="mt-8 space-y-6">
            {/* Score Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${getScoreBgColor(result.ai_score)} rounded-lg p-6 shadow-lg`}>
                <h3 className="text-gray-700 font-semibold mb-2">AI Score</h3>
                <p className={`text-4xl font-bold ${getScoreColor(result.ai_score)}`}>
                  {result.ai_score}%
                </p>
                <p className="text-sm text-gray-600 mt-2">Semantic Matching</p>
              </div>

              <div className={`${getScoreBgColor(result.ats_score)} rounded-lg p-6 shadow-lg`}>
                <h3 className="text-gray-700 font-semibold mb-2">ATS Score</h3>
                <p className={`text-4xl font-bold ${getScoreColor(result.ats_score)}`}>
                  {result.ats_score}%
                </p>
                <p className="text-sm text-gray-600 mt-2">Keyword Match</p>
              </div>

              <div className={`${getScoreBgColor(result.final_score)} rounded-lg p-6 shadow-lg`}>
                <h3 className="text-gray-700 font-semibold mb-2">Final Score</h3>
                <p className={`text-4xl font-bold ${getScoreColor(result.final_score)}`}>
                  {result.final_score}%
                </p>
                <p className="text-sm text-gray-600 mt-2">Overall Match</p>
              </div>
            </div>

            {/* Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Skills Section */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">✅ Skills Found</h3>
                <div className="flex flex-wrap gap-2 mb-6">
                  {result.skills_found && result.skills_found.length > 0 ? (
                    result.skills_found.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-semibold"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">No skills found in resume</p>
                  )}
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-4">❌ Missing Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {result.missing_skills && result.missing_skills.length > 0 ? (
                    result.missing_skills.map((skill, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-semibold"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-600">Great! No missing skills.</p>
                  )}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">💡 Recommendations</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <p className="text-blue-900 font-semibold">Suggestion:</p>
                    <p className="text-blue-800">{result.suggestion}</p>
                  </div>

                  <div className="p-4 bg-purple-50 border-l-4 border-purple-500 rounded">
                    <p className="text-purple-900 font-semibold">Suggested Role:</p>
                    <p className="text-purple-800 text-lg font-bold">
                      {result.suggested_role}
                    </p>
                  </div>

                  <div className="p-4 bg-indigo-50 border-l-4 border-indigo-500 rounded">
                    <p className="text-indigo-900 font-semibold">Job Description Skills:</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {result.jd_skills && result.jd_skills.length > 0 ? (
                        result.jd_skills.map((skill, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-indigo-200 text-indigo-900 rounded text-xs font-semibold"
                          >
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-indigo-800 text-sm">No specific skills identified</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
