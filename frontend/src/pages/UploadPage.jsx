import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { resumeAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Badge from '../components/Badge';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [name, setName] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelection(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (selectedFile) => {
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(selectedFile.type)) {
      setError('Invalid file type. Please upload PDF, DOCX, or TXT');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File too large. Maximum size is 10MB');
      return;
    }

    setFile(selectedFile);
    setName(selectedFile.name.replace(/\.[^/.]+$/, ''));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file');
      return;
    }

    setUploading(true);
    try {
      await resumeAPI.uploadResume(file, name || file.name);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const getFileIcon = (type) => {
    if (type.includes('pdf')) return '📄';
    if (type.includes('word')) return '📝';
    return '📋';
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-600 hover:text-primary-700 font-semibold mb-4 flex items-center gap-2"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-5xl font-extrabold text-neutral-900 mb-3">Upload Resume</h1>
          <p className="text-xl text-neutral-600">
            Upload your resume to get started with AI optimization
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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload Area */}
          <Card variant="elevated">
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-300 hover:border-primary-400'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt"
                className="hidden"
              />

              {!file ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-6xl mb-4">📤</p>
                  <h3 className="text-2xl font-bold text-neutral-900 mb-2">
                    Drop your resume here
                  </h3>
                  <p className="text-neutral-600 mb-6">
                    or click to browse files
                  </p>
                  <Button
                    type="button"
                    variant="primary"
                    size="lg"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Choose File
                  </Button>
                  <p className="text-sm text-neutral-500 mt-4">
                    Supported: PDF, DOCX, TXT • Max 10MB
                  </p>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-4 p-4 bg-white rounded-lg border border-neutral-200"
                >
                  <p className="text-4xl">{getFileIcon(file.type)}</p>
                  <div className="flex-1 text-left">
                    <p className="font-semibold text-neutral-900">{file.name}</p>
                    <p className="text-sm text-neutral-500">
                      {formatFileSize(file.size)} • {file.type.split('/')[1].toUpperCase()}
                    </p>
                  </div>
                  <Badge variant="success">✓ Ready</Badge>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-red-500 hover:text-red-700 font-bold text-xl"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </div>
          </Card>

          {/* Resume Name */}
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card variant="elevated">
                <Input
                  label="Resume Name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Software Engineer Resume 2026"
                  fullWidth
                  hint="Give your resume a descriptive name for easy reference"
                />
              </Card>
            </motion.div>
          )}

          {/* Submit Button */}
          {file && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                type="submit"
                variant="success"
                size="xl"
                fullWidth
                loading={uploading}
              >
                {uploading ? 'Uploading...' : '✨ Upload Resume'}
              </Button>
            </motion.div>
          )}
        </form>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-3 gap-4 mt-12"
        >
          <Card variant="outlined" className="text-center">
            <p className="text-3xl mb-2">🔒</p>
            <h4 className="font-bold text-neutral-900">Secure</h4>
            <p className="text-sm text-neutral-600">Your data is encrypted</p>
          </Card>
          <Card variant="outlined" className="text-center">
            <p className="text-3xl mb-2">⚡</p>
            <h4 className="font-bold text-neutral-900">Fast</h4>
            <p className="text-sm text-neutral-600">Upload in seconds</p>
          </Card>
          <Card variant="outlined" className="text-center">
            <p className="text-3xl mb-2">✨</p>
            <h4 className="font-bold text-neutral-900">AI-Powered</h4>
            <p className="text-sm text-neutral-600">Smart optimization</p>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
