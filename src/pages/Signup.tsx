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
  User,
  Eye,
  EyeOff,
  Loader2,
  ArrowRight,
  Shield,
  Sparkles,
  Check
} from 'lucide-react';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/lib/supabase';

const Signup = () => {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user' as 'user' | 'admin',
    agreeTerms: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await supabase.auth.resend({
      type: 'signup',
      email: formData.email,
    });


    if (!formData.fullName || !formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (!formData.agreeTerms) {
      toast.error('Please agree to the terms and conditions');
      return;
    }

    setIsLoading(true);

    const { error } = await signUp(
      formData.email,
      formData.password,
      formData.fullName,
      formData.role
    );

    setIsLoading(false);

    if (error) {
      toast.error(error.message || 'Signup failed');
      return;
    }

    // ✅ CORRECT MESSAGE FOR EMAIL CONFIRMATION
    toast.success(
      'Account created! Please check your email to confirm your account.'
    );

    // ❗ User ko login page par bhejo
    navigate('/login');
  };


  return (
    <div className="min-h-screen bg-[#071F35] relative overflow-hidden flex items-center py-8">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Gradient orbs */}
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute top-40 right-10 w-96 h-96 bg-[#F58021]/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute bottom-40 left-10 w-80 h-80 bg-[#F58021]/5 rounded-full blur-3xl"
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
          {/* Left Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F58021] to-[#F58021]/60 flex items-center justify-center">
                  <Film className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  Movie<span className="text-[#F58021]">Box</span>
                </span>
              </Link>

              <div className="space-y-2 mb-8">
                <h2 className="text-3xl font-bold text-white">Create Account</h2>
                <p className="text-white/60">
                  Already have an account?{' '}
                  <Link to="/login" className="text-[#F58021] hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-white/80">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="pl-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                    />
                  </div>
                </div>

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

                {/* Role Selection */}
                <div className="space-y-2">
                  <Label htmlFor="role" className="text-white/80">
                    Account Type
                  </Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as 'user' | 'admin' })}
                  >
                    <SelectTrigger className="h-12 bg-white/5 border-white/10 text-white focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl">
                      <SelectValue placeholder="Select account type" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#071F35] border-white/10">
                      <SelectItem value="user" className="text-white hover:bg-white/10 focus:bg-white/10">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>User - Browse Movies</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="admin" className="text-white hover:bg-white/10 focus:bg-white/10">
                        <div className="flex items-center gap-2">
                          <Shield className="w-4 h-4" />
                          <span>Admin - Manage Movies</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-white/40 text-sm">
                    {formData.role === 'admin'
                      ? 'Admins can add, edit, and delete movies'
                      : 'Users can browse and view movies'}
                  </p>
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

                {/* Confirm Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-white/80">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-11 pr-11 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms & Conditions */}
                <div className="flex items-start gap-3">
                  <Checkbox
                    id="terms"
                    checked={formData.agreeTerms}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, agreeTerms: checked as boolean })
                    }
                    className="mt-1 border-white/20 data-[state=checked]:bg-[#F58021] data-[state=checked]:border-[#F58021]"
                  />
                  <Label htmlFor="terms" className="text-white/60 text-sm leading-relaxed">
                    I agree to the{' '}
                    <button
                      type="button"
                      onClick={() => toast.info('Terms and conditions coming soon!')}
                      className="text-[#F58021] hover:underline"
                    >
                      Terms of Service
                    </button>{' '}
                    and{' '}
                    <button
                      type="button"
                      onClick={() => toast.info('Privacy policy coming soon!')}
                      className="text-[#F58021] hover:underline"
                    >
                      Privacy Policy
                    </button>
                  </Label>
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
                        Create Account
                        <ArrowRight className="w-5 h-5 ml-2" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </div>
          </motion.div>

          {/* Right Side - Brand (Desktop) */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:block"
          >
            <div className="space-y-8">
              {/* Tagline */}
              <div className="space-y-4">
                <h1 className="text-5xl font-bold text-white leading-tight">
                  Join the
                  <span className="text-[#F58021]"> movie</span>
                  <br />revolution
                </h1>
                <p className="text-xl text-white/60 max-w-md">
                  Create your account today and start exploring our vast collection of cinematic masterpieces.
                </p>
              </div>

              {/* Features */}
              <div className="space-y-4">
                {[
                  { icon: Sparkles, title: 'Personalized Recommendations', desc: 'Get movie suggestions tailored to your taste' },
                  { icon: Film, title: 'HD Streaming', desc: 'Watch movies in crystal clear quality' },
                  { icon: Shield, title: 'Secure Account', desc: 'Your data is protected with industry-standard security' },
                ].map(({ icon: Icon, title, desc }, index) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#F58021]/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-[#F58021]" />
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{title}</h3>
                      <p className="text-white/50 text-sm">{desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Role Info */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[#F58021]" />
                  Choose Your Role
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F58021]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#F58021]" />
                    </div>
                    <div>
                      <p className="text-white font-medium">User</p>
                      <p className="text-white/50 text-sm">Browse and discover movies</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-[#F58021]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-[#F58021]" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Admin</p>
                      <p className="text-white/50 text-sm">Manage movie collection</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
