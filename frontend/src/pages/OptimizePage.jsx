import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';

export default function OptimizePage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await resumeAPI.getResume(resumeId);
        setResume(response.data.resume);
      } catch (err) {
        setError('Error fetching resume');
      }
    };

    fetchResume();
  }, [resumeId]);

  const handleOptimize = async (e) => {
    e.preventDefault();
    setError('');

    if (!jobDescription.trim()) {
      setError('Please enter a job description');
      return;
    }

    setOptimizing(true);
    try {
      const response = await resumeAPI.optimizeResume(resumeId, jobDescription);
      setOptimizedResult(response.data.optimizedResume);
    } catch (err) {
      setError(err.response?.data?.error || 'Optimization failed');
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <button
        onClick={() => navigate('/dashboard')}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to Dashboard
      </button>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Job Description Input */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Job Description</h2>
          <form onSubmit={handleOptimize}>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full h-96 px-4 py-2 border rounded resize-none"
              required
            />
            <button
              type="submit"
              disabled={optimizing}
              className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
            >
              {optimizing ? 'Optimizing...' : 'Optimize Resume'}
            </button>
          </form>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-2xl font-bold mb-4">Result</h2>
          {optimizedResult ? (
            <div>
              <p className="text-green-600 font-semibold mb-4">✓ Optimization Complete!</p>
              <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
                <p className="whitespace-pre-wrap text-sm">{optimizedResult.content}</p>
              </div>
              {optimizedResult.keywords && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Key Skills Matched:</h3>
                  <div className="flex flex-wrap gap-2">
                    {optimizedResult.keywords.map((keyword, idx) => (
                      <span
                        key={idx}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm"
                      >
                        {keyword}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Enter a job description and click optimize to see results</p>
          )}
        </div>
      </div>
    </div>
  );
}
