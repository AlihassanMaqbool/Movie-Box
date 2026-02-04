
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Film, Github, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Twitter, href: 'https://x.com/home', label: 'Twitter' },
    { icon: Instagram, href: 'https://www.instagram.com/', label: 'Instagram' },
    { icon: Github, href: 'https://github.com/', label: 'GitHub' },
    { icon: Mail, href: 'https://mail.com/', label: 'Email' },
  ];

  const footerLinks = [
    { label: 'Home', href: '/' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Privacy', href: '/privacy' },
  ];

  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      className="relative bg-[#071F35] border-t border-[#F58021]/20"
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#F58021] to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#F58021] to-[#F58021]/60 flex items-center justify-center shadow-lg shadow-[#F58021]/30">
                <Film className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Movie<span className="text-[#F58021]">Box</span>
              </span>
            </Link>
            <p className="text-white/60 text-sm max-w-xs">
              Discover and explore the best movies. Your ultimate destination for cinematic entertainment.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Quick Links</h4>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-white/60 hover:text-[#F58021] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Links */}
          <div className="space-y-4">
            <h4 className="text-white font-semibold">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map(({ icon: Icon, href, label }) => (
                <motion.a
                  key={label}
                  href={href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-lg bg-white/5 hover:bg-[#F58021]/20 border border-white/10 hover:border-[#F58021]/50 flex items-center justify-center transition-colors group"
                  aria-label={label}
                >
                  <Icon className="w-5 h-5 text-white/60 group-hover:text-[#F58021] transition-colors" />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {currentYear} MovieBox. All rights reserved.
          </p>
          <p className="text-white/40 text-sm">
            Made with <span className="text-[#F58021]">❤</span> for movie lovers
          </p>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;
