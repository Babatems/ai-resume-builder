import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Badge from '../components/Badge';

export default function OptimizePage() {
  const { resumeId } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedResult, setOptimizedResult] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState('split');

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-600 hover:text-primary-700 font-semibold mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-5xl font-extrabold text-neutral-900 mb-3">
            Optimize Resume
          </h1>
          <p className="text-xl text-neutral-600">
            Paste a job description and watch AI rewrite your resume to match
          </p>
        </motion.div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6"
            >
              <Card variant="outlined" className="border-red-500 bg-red-50">
                <p className="text-red-700 font-semibold">⚠️ {error}</p>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* View Mode Toggle */}
        {optimizedResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex gap-2"
          >
            <Button
              variant={viewMode === 'split' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('split')}
            >
              📊 Split View
            </Button>
            <Button
              variant={viewMode === 'original' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('original')}
            >
              📄 Original
            </Button>
            <Button
              variant={viewMode === 'optimized' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setViewMode('optimized')}
            >
              ✨ Optimized
            </Button>
          </motion.div>
        )}

        {/* Content Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`grid gap-6 ${
            optimizedResult && viewMode === 'split' ? 'lg:grid-cols-2' : 'lg:grid-cols-1'
          }`}
        >
          {/* Job Description Input */}
          {(!optimizedResult || viewMode === 'split') && (
            <motion.div variants={itemVariants}>
              <Card variant="elevated">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  📋 Job Description
                </h2>
                <form onSubmit={handleOptimize} className="space-y-4">
                  <textarea
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    placeholder="Paste the full job description here..."
                    className="w-full h-96 px-4 py-3 border-2 border-neutral-300 rounded-lg focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-none font-mono text-sm"
                    required
                  />
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={optimizing}
                  >
                    {optimizing ? '⏳ Analyzing & Optimizing...' : '⚡ Optimize Resume'}
                  </Button>
                </form>
              </Card>
            </motion.div>
          )}

          {/* Results Panel */}
          {optimizedResult && (viewMode === 'split' || viewMode === 'optimized') && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card variant="elevated" className="border-l-4 border-accent-500">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-neutral-900">
                    ✨ Optimized Resume
                  </h2>
                  <Badge variant="success">Complete</Badge>
                </div>

                {/* Optimized Content */}
                <div className="bg-neutral-50 p-4 rounded-lg max-h-96 overflow-y-auto mb-4 border border-neutral-200">
                  <p className="whitespace-pre-wrap text-sm text-neutral-800 font-mono leading-relaxed">
                    {optimizedResult.content}
                  </p>
                </div>

                {/* Keywords */}
                {optimizedResult.keywords && optimizedResult.keywords.length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-neutral-900 mb-3">
                      🎯 Matched Keywords ({optimizedResult.keywords.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {optimizedResult.keywords.map((keyword, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: idx * 0.05 }}
                        >
                          <Badge variant="primary" size="md">
                            {keyword}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-neutral-200">
                  <Button variant="success" size="md" fullWidth>
                    ⬇️ Download PDF
                  </Button>
                  <Button variant="secondary" size="md" fullWidth>
                    💾 Save Version
                  </Button>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Original Resume View */}
          {optimizedResult && (viewMode === 'split' || viewMode === 'original') && (
            <motion.div
              variants={itemVariants}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <Card variant="elevated" className="border-l-4 border-neutral-400">
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">
                  📄 Original Resume
                </h2>

                <div className="bg-neutral-50 p-4 rounded-lg max-h-96 overflow-y-auto border border-neutral-200">
                  <p className="whitespace-pre-wrap text-sm text-neutral-800 font-mono leading-relaxed">
                    {resume?.content}
                  </p>
                </div>
              </Card>
            </motion.div>
          )}
        </motion.div>

        {/* Empty State */}
        {!optimizedResult && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-12"
          >
            <Card variant="gradient" className="text-center py-16">
              <p className="text-6xl mb-4">🚀</p>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">
                Ready to optimize?
              </h2>
              <p className="text-neutral-600 mb-6 text-lg max-w-md mx-auto">
                Paste a job description above and our AI will rewrite your resume to perfectly match the role.
              </p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
}
