import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Film, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader2,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    
    const { error } = await signIn(formData.email, formData.password);
    
    if (error) {
      toast.error(error.message || 'Login failed');
    } else {
      toast.success('Welcome back!');
      navigate('/');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#071F35] relative overflow-hidden flex items-center">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-20 left-10 w-96 h-96 bg-[#F58021]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-20 right-10 w-80 h-80 bg-[#F58021]/5 rounded-full blur-3xl"
        />

        {/* Film grain overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")` 
          }} 
        />
      </div>

      <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Brand */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="space-y-8">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-3 group">
                <motion.div
                  whileHover={{ rotate: 15, scale: 1.1 }}
                  className="relative"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#F58021] to-[#F58021]/60 flex items-center justify-center shadow-2xl shadow-[#F58021]/30">
                    <Film className="w-10 h-10 text-white" />
                  </div>
                </motion.div>
                <span className="text-4xl font-bold text-white tracking-tight">
                  Movie<span className="text-[#F58021]">Box</span>
                </span>
              </Link>

              {/* Tagline */}
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-white leading-tight">
                  Welcome back to the
                  <span className="text-[#F58021]"> cinema</span>
                </h1>
                <p className="text-xl text-white/60 max-w-md">
                  Dive back into your movie collection and discover new cinematic adventures.
                </p>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 max-w-md">
                {[
                  { icon: Sparkles, text: 'Curated Collection' },
                  { icon: Film, text: 'HD Streaming' },
                ].map(({ icon: Icon, text }, index) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center gap-3 bg-white/5 rounded-xl p-4 border border-white/10"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#F58021]/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-[#F58021]" />
                    </div>
                    <span className="text-white/80 font-medium">{text}</span>
                  </motion.div>
                ))}
              </div>

              {/* Stats */}
              <div className="flex gap-8 pt-4">
                {[
                  { value: '10K+', label: 'Movies' },
                  { value: '50K+', label: 'Users' },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-3xl font-bold text-[#F58021]">{stat.value}</div>
                    <div className="text-white/50">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
              {/* Mobile Logo */}
              <div className="flex items-center gap-2 mb-8 lg:hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F58021] to-[#F58021]/60 flex items-center justify-center">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Movie<span className="text-[#F58021]">Box</span>
                </span>
              </div>

              <div className="space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-white">Sign In</h2>
                <p className="text-white/60">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-[#F58021] hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Email Field */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white/80">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="pl-11 pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="remember"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, rememberMe: checked as boolean })
                      }
                      className="border-white/20 data-[state=checked]:bg-[#F58021] data-[state=checked]:border-[#F58021]"
                    />
                    <Label htmlFor="remember" className="text-white/60 text-sm">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info('Password reset coming soon!')}
                    className="text-[#F58021] hover:underline text-sm font-medium"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#F58021] hover:bg-[#F58021]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#F58021]/30 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Divider */}
              <div className="relative my-8">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-2 bg-[#071F35] text-white/40">OR</span>
                </div>
              </div>

              {/* Demo Credentials */}
              <div className="space-y-3">
                <p className="text-center text-white/50 text-sm">Demo Credentials</p>
                <div className="grid grid-cols-2 gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({
                        email: 'admin@moviebox.com',
                        password: 'admin123',
                        rememberMe: false,
                      });
                    }}
                    className="p-3 bg-[#F58021]/10 hover:bg-[#F58021]/20 border border-[#F58021]/30 rounded-xl text-left transition-colors"
                  >
                    <div className="text-[#F58021] font-medium text-sm">Admin</div>
                    <div className="text-white/60 text-xs">m.alihassanm.maqbool812@gmail.com</div>
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setFormData({
                        email: 'user@moviebox.com',
                        password: 'user123',
                        rememberMe: false,
                      });
                    }}
                    className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-colors"
                  >
                    <div className="text-white font-medium text-sm">User</div>
                    <div className="text-white/60 text-xs">user@moviebox.com</div>
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;
