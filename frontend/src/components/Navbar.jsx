import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onLogout }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Upload', icon: '📤', path: '/upload' },
  ];

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200 shadow-soft"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-accent-600 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:shadow-lg transition-shadow">
              ✨
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-extrabold bg-gradient-to-r from-primary-600 to-accent-600 bg-clip-text text-transparent">
                Resume AI
              </h1>
              <p className="text-xs text-neutral-500">Optimize with AI</p>
            </div>
          </motion.button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <motion.button
                key={item.path}
                whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                onClick={() => navigate(item.path)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-neutral-700 hover:text-primary-600 transition-colors font-semibold"
              >
                <span>{item.icon}</span>
                {item.label}
              </motion.button>
            ))}
          </div>

          {/* Desktop Logout Button */}
          <div className="hidden md:flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-semibold transition-colors"
            >
              🚪 Logout
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors"
          >
            <span className="text-2xl">{isOpen ? '✕' : '☰'}</span>
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden bg-neutral-50 border-t border-neutral-200"
            >
              <div className="px-4 py-4 space-y-2">
                {navItems.map((item) => (
                  <motion.button
                    key={item.path}
                    whileHover={{ x: 5 }}
                    onClick={() => {
                      navigate(item.path);
                      setIsOpen(false);
                    }}
                    className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-primary-100 hover:text-primary-700 transition-colors font-semibold"
                  >
                    <span>{item.icon}</span>
                    {item.label}
                  </motion.button>
                ))}
                <motion.button
                  whileHover={{ x: 5 }}
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors font-semibold"
                >
                  🚪 Logout
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  );
}
