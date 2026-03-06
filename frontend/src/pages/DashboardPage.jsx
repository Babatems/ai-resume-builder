import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { resumeAPI } from '../services/api';

export default function DashboardPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await resumeAPI.getAllResumes();
        setResumes(response.data.resumes);
      } catch (error) {
        console.error('Error fetching resumes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResumes();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">My Resumes</h1>
      
      <button
        onClick={() => navigate('/upload')}
        className="bg-blue-600 text-white px-6 py-2 rounded mb-6 hover:bg-blue-700"
      >
        Upload New Resume
      </button>

      {loading ? (
        <p className="text-gray-600">Loading resumes...</p>
      ) : resumes.length === 0 ? (
        <p className="text-gray-600">No resumes yet. Upload your first resume!</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resumes.map((resume) => (
            <div key={resume.id} className="border rounded-lg p-4 hover:shadow-lg">
              <h3 className="text-xl font-semibold mb-2">{resume.name}</h3>
              <p className="text-gray-600 mb-2">Versions: {resume.versions}</p>
              <p className="text-sm text-gray-500 mb-4">
                {new Date(resume.uploadedAt).toLocaleDateString()}
              </p>
              <button
                onClick={() => navigate(`/optimize/${resume.id}`)}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Optimize
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
