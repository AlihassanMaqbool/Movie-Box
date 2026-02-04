import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Film, 
  Plus, 
  User, 
  LogOut, 
  Menu, 
  X,
  Home,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const Navbar = () => {
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  // console.log('Navbar - User:', user?.id, 'Profile:', profile, 'Role:', profile?.role);

  const navLinks = [
    { path: '/', label: 'Home', icon: Home },
    ...(profile?.role.trim() === 'admin' ? [{ path: '/add-movie', label: 'Add Movie', icon: Plus }] : []),
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#071F35]/95 backdrop-blur-lg shadow-lg shadow-black/20'
          : 'bg-gradient-to-b from-black/60 to-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.div
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="relative"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F58021] to-[#F58021]/60 flex items-center justify-center shadow-lg shadow-[#F58021]/30">
                <Film className="w-6 h-6 text-white" />
              </div>
            </motion.div>
            <span className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Movie<span className="text-[#F58021]">Box</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ path, label }) => (
              <Link key={path} to={path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span
                    className={`relative px-4 py-2 text-sm font-medium transition-colors ${
                      isActive(path)
                        ? 'text-[#F58021]'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {label}
                    {isActive(path) && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F58021] rounded-full"
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      />
                    )}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="flex items-center gap-3">
            {user && profile ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F58021]/10 hover:bg-[#F58021]/20 border border-[#F58021]/30 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F58021] to-[#F58021]/60 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-white">
                      {profile.full_name || profile.email.split('@')[0]}
                    </span>
                    <span className={`hidden sm:block text-xs px-2 py-0.5 rounded-full ${
                      profile.role === 'admin' 
                        ? 'bg-[#F58021] text-white' 
                        : 'bg-white/10 text-white/70'
                    }`}>
                      {profile.role}
                    </span>
                  </motion.button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  align="end" 
                  className="w-56 bg-[#071F35] border-[#F58021]/20"
                >
                  <DropdownMenuItem className="text-white/70" disabled>
                    <User className="mr-2 h-4 w-4" />
                    <span>{profile.email}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-[#F58021]/20" />
                  {profile.role === 'admin' && (
                    <DropdownMenuItem 
                      onClick={() => navigate('/add-movie')}
                      className="text-white hover:bg-[#F58021]/20 cursor-pointer"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Add Movie</span>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem 
                    onClick={handleSignOut}
                    className="text-red-400 hover:bg-red-500/20 cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden md:flex items-center gap-2">
                <Link to="/login">
                  <Button
                    variant="ghost"
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button className="bg-[#F58021] hover:bg-[#F58021]/90 text-white shadow-lg shadow-[#F58021]/30">
                      <UserPlus className="w-4 h-4 mr-2" />
                      Sign Up
                    </Button>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/10"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-[#071F35]/98 backdrop-blur-lg border-t border-[#F58021]/20"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive(path)
                      ? 'bg-[#F58021]/20 text-[#F58021]'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{label}</span>
                </Link>
              ))}
              
              {!user && (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    <LogIn className="w-5 h-5" />
                    <span className="font-medium">Login</span>
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#F58021] text-white"
                  >
                    <UserPlus className="w-5 h-5" />
                    <span className="font-medium">Sign Up</span>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
