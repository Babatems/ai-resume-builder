import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.signin(email, password);
      onLogin(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute -bottom-32 right-10 w-72 h-72 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent mb-3">
            AI Resume Builder
          </h1>
          <p className="text-neutral-600 text-lg">Sign in to optimize your resume</p>
        </motion.div>

        {/* Card */}
        <Card variant="elevated" className="backdrop-blur-sm bg-white/80">
          {/* Error Alert */}
          {error && (
            <motion.div
              variants={itemVariants}
              className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg"
            >
              <p className="text-red-700 font-semibold">⚠️ {error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <motion.div variants={itemVariants}>
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                fullWidth
                error={error ? 'Invalid credentials' : ''}
              />
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                fullWidth
              />
            </motion.div>

            {/* Remember & Forgot */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-neutral-300"
                />
                <span className="text-neutral-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-primary-600 hover:text-primary-700 font-semibold transition"
              >
                Forgot password?
              </button>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={loading}
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </Button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-neutral-600">Or continue with</span>
              </div>
            </motion.div>

            {/* Google Sign In */}
            <motion.div variants={itemVariants}>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                fullWidth
              >
                🔵 Google
              </Button>
            </motion.div>
          </form>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-neutral-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-primary-600 hover:text-primary-700 font-semibold transition"
              >
                Sign Up
              </button>
            </p>
          </motion.div>
        </Card>

        {/* Footer */}
        <motion.div variants={itemVariants} className="mt-6 text-center text-sm text-neutral-500">
          By signing in, you agree to our{' '}
          <button className="text-primary-600 hover:underline">Terms of Service</button> and{' '}
          <button className="text-primary-600 hover:underline">Privacy Policy</button>
        </motion.div>
      </motion.div>
    </div>
  );
}
