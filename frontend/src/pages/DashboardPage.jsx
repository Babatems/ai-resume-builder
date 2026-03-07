import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { resumeAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Badge from '../components/Badge';

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-extrabold text-neutral-900 mb-3">My Resumes</h1>
          <p className="text-xl text-neutral-600">
            Upload and optimize your resumes for any job
          </p>
        </motion.div>

        {/* Action Bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex gap-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate('/upload')}
            className="gap-2"
          >
            ➕ Upload New Resume
          </Button>
          <Button variant="secondary" size="lg">
            📊 View Statistics
          </Button>
        </motion.div>

        {/* Content */}
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="inline-block">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full"
              />
            </div>
            <p className="mt-4 text-neutral-600 text-lg">Loading your resumes...</p>
          </motion.div>
        ) : resumes.length === 0 ? (
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            <Card variant="gradient" className="text-center py-16">
              <motion.div
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <p className="text-6xl mb-4">📄</p>
              </motion.div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">No resumes yet</h2>
              <p className="text-neutral-600 mb-6 text-lg">
                Upload your first resume to get started with AI optimization
              </p>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/upload')}
              >
                Upload Your First Resume
              </Button>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {resumes.map((resume) => (
              <motion.div
                key={resume.id}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="h-full"
              >
                <Card
                  variant="elevated"
                  hover
                  className="h-full flex flex-col justify-between"
                >
                  {/* Content */}
                  <div className="mb-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="text-xl font-bold text-neutral-900 flex-1">
                        {resume.name}
                      </h3>
                      <Badge variant="primary" size="sm">
                        {resume.versions} versions
                      </Badge>
                    </div>
                    <p className="text-sm text-neutral-500">
                      📅 {new Date(resume.uploadedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mb-6 p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider">
                        Versions
                      </p>
                      <p className="text-2xl font-bold text-primary-600">
                        {resume.versions}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-500 uppercase tracking-wider">
                        Status
                      </p>
                      <Badge variant="success" size="sm" className="mt-1">
                        Ready
                      </Badge>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Button
                      variant="primary"
                      size="md"
                      fullWidth
                      onClick={() => navigate(`/optimize/${resume.id}`)}
                    >
                      ✨ Optimize
                    </Button>
                    <Button
                      variant="secondary"
                      size="md"
                      onClick={() => {}}
                    >
                      ⋮
                    </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
