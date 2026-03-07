import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { authAPI } from '../services/api';
import Button from '../components/Button';
import Card from '../components/Card';
import Input from '../components/Input';
import Badge from '../components/Badge';

export default function SignupPage({ onSignup }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    calculatePasswordStrength(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authAPI.signup(name, email, password);
      onSignup(response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
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

  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-accent-500'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-50 via-white to-primary-50 flex items-center justify-center p-4">
      {/* Decorative elements */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-accent-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute -bottom-32 left-10 w-72 h-72 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-extrabold bg-gradient-to-r from-accent-600 to-primary-600 bg-clip-text text-transparent mb-3">
            Create Account
          </h1>
          <p className="text-neutral-600 text-lg">Start optimizing your resume today</p>
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
            {/* Name Input */}
            <motion.div variants={itemVariants}>
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                fullWidth
              />
            </motion.div>

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
              />
            </motion.div>

            {/* Password Input */}
            <motion.div variants={itemVariants}>
              <Input
                label="Password"
                type="password"
                value={password}
                onChange={handlePasswordChange}
                placeholder="••••••••"
                required
                fullWidth
                hint="Minimum 8 characters, including uppercase, numbers, and symbols"
              />

              {/* Password Strength */}
              {password && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3 space-y-2"
                >
                  <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-full transition-colors ${
                          i < passwordStrength ? strengthColors[i] : 'bg-neutral-200'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm font-semibold text-neutral-600">
                    Strength:{' '}
                    <Badge variant={passwordStrength > 2 ? 'success' : 'warning'} size="sm">
                      {strengthLabels[passwordStrength] || 'Create password'}
                    </Badge>
                  </p>
                </motion.div>
              )}
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div variants={itemVariants}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-neutral-300 mt-1"
                  required
                />
                <span className="text-sm text-neutral-600">
                  I agree to the{' '}
                  <button type="button" className="text-primary-600 hover:underline font-semibold">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-primary-600 hover:underline font-semibold">
                    Privacy Policy
                  </button>
                </span>
              </label>
            </motion.div>

            {/* Submit Button */}
            <motion.div variants={itemVariants}>
              <Button
                type="submit"
                variant="success"
                size="lg"
                fullWidth
                loading={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </motion.div>
          </form>

          {/* Sign In Link */}
          <motion.div variants={itemVariants} className="mt-6 text-center">
            <p className="text-neutral-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-primary-600 hover:text-primary-700 font-semibold transition"
              >
                Sign In
              </button>
            </p>
          </motion.div>
        </Card>
      </motion.div>
    </div>
  );
}
