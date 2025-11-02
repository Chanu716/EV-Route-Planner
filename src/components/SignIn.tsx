import React, { useState } from 'react';
import { Car, Mail, Lock, Github } from 'lucide-react';
import { FcGoogle } from 'react-icons/fc';

interface SignInProps {
  onSignIn: (email: string, password: string) => void;
  onClose?: () => void;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!email) {
      setEmailError('Email is required');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePassword = (password: string): boolean => {
    if (!password) {
      setPasswordError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError('Password must contain at least one uppercase letter');
      return false;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError('Password must contain at least one lowercase letter');
      return false;
    }
    if (!/[0-9]/.test(password)) {
      setPasswordError('Password must contain at least one number');
      return false;
    }
    if (!/[!@#$%^&*]/.test(password)) {
      setPasswordError('Password must contain at least one special character (!@#$%^&*)');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);

    if (isEmailValid && isPasswordValid) {
      try {
        await onSignIn(email, password);
      } catch (error) {
        console.error('Sign in error:', error);
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4" onClick={(e) => {
      if (e.target === e.currentTarget && onClose) {
        onClose();
      }
    }}>
      <div className="w-full max-w-md">
        <div className="glassmorphism rounded-2xl p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <Car className="h-10 w-10 text-white" />
            <span className="ml-2 text-2xl font-bold text-white">ChargeFlow</span>
          </div>

          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-white text-center mb-2">Welcome Back</h2>
              <p className="text-white/60 text-center">Sign in to continue to ChargeFlow</p>
            </div>

            <div className="space-y-4">
              <div className="relative mb-6">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (emailError) validateEmail(e.target.value);
                  }}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border ${emailError ? 'border-red-500' : 'border-white/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30`}
                  required
                />
                {emailError && (
                  <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                    {emailError}
                  </div>
                )}
              </div>

              <div className="relative mb-6">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-white/60" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (passwordError) validatePassword(e.target.value);
                  }}
                  className={`w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 border ${passwordError ? 'border-red-500' : 'border-white/20'} text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30`}
                  required
                />
                {passwordError && (
                  <div className="absolute -bottom-6 left-0 text-red-500 text-sm">
                    {passwordError}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  className="h-4 w-4 rounded border-white/20 bg-white/10 text-teal-500 focus:ring-2 focus:ring-teal-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-white/60">
                  Remember me
                </label>
              </div>
              <a href="#" className="text-sm text-teal-500 hover:text-teal-400">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full glassmorphism text-white py-3 rounded-xl hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              Sign In
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/20"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-[#0F172A] text-white/60">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
              >
                <FcGoogle className="h-5 w-5" />
                <span className="ml-2 text-white">Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center py-2 px-4 rounded-xl border border-white/20 hover:bg-white/10 transition-colors"
              >
                <Github className="h-5 w-5 text-white" />
                <span className="ml-2 text-white">GitHub</span>
              </button>
            </div>

            <p className="text-center text-white/60">
              Don't have an account?{' '}
              <a href="#" className="text-teal-500 hover:text-teal-400">
                Sign up
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
