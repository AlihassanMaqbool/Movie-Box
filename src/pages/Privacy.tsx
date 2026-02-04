import { motion } from 'framer-motion';
import { Shield, Eye, Lock, AlertCircle } from 'lucide-react';

const Privacy = () => {
  const sections = [
    {
      icon: Eye,
      title: 'Information We Collect',
      content: [
        'Account information (name, email, password)',
        'Movie preferences and ratings',
        'Browsing history and interactions',
        'Device information and IP address',
        'Analytics data for service improvement'
      ]
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: [
        'Provide and improve our services',
        'Personalize your experience',
        'Send important updates and notifications',
        'Prevent fraud and enhance security',
        'Comply with legal requirements'
      ]
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: [
        'Industry-standard encryption for all data',
        'Regular security audits and updates',
        'Limited access to personal information',
        'Secure authentication mechanisms',
        'Compliance with GDPR and privacy standards'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#071F35] pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20">
        <div className="absolute inset-0">
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
            className="absolute top-40 left-10 w-96 h-96 bg-[#F58021]/10 rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              Privacy <span className="text-[#F58021]">Policy</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              We take your privacy seriously. Here's how we protect your data.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-6 mb-12"
        >
          <div className="flex gap-3">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-white mb-2">Last Updated: January 25, 2026</h3>
              <p className="text-white/70">
                This privacy policy outlines how MovieBox collects, uses, and protects your personal information.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main Sections */}
        <div className="space-y-12">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-lg bg-[#F58021]/20 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-[#F58021]" />
                  </div>
                  <h2 className="text-2xl font-bold text-white pt-2">{section.title}</h2>
                </div>
                <ul className="space-y-3 ml-16">
                  {section.content.map((item, idx) => (
                    <li key={idx} className="text-white/70 flex items-start gap-3">
                      <span className="text-[#F58021] font-bold flex-shrink-0">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 space-y-8"
        >
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Cookies and Tracking</h3>
            <p className="text-white/70 mb-4">
              We use cookies to enhance your browsing experience and analyze how users interact with our platform.
              You can control cookie preferences through your browser settings.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Third-Party Services</h3>
            <p className="text-white/70 mb-4">
              MovieBox may use third-party services for analytics and payment processing. These services have their 
              own privacy policies, and we encourage you to review them.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Your Rights</h3>
            <p className="text-white/70 mb-4">
              You have the right to access, modify, or delete your personal information. 
              Contact us at privacy@moviebox.com to exercise these rights.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Changes to This Policy</h3>
            <p className="text-white/70 mb-4">
              We may update this privacy policy from time to time. Changes will be posted on this page, 
              and we'll notify you of any significant updates via email.
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Contact Us</h3>
            <p className="text-white/70 mb-2">
              If you have questions about this privacy policy or our practices, please contact us at:
            </p>
            <p className="text-[#F58021] font-semibold">privacy@moviebox.com</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Privacy;