import { motion } from 'framer-motion';
import { Film, Star, Users, Heart } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: Film,
      title: 'Movie Database',
      description: 'Browse and manage a comprehensive collection of movies with detailed information.'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with movie enthusiasts and share your passion for cinema.'
    },
    {
      icon: Star,
      title: 'Ratings & Reviews',
      description: 'Rate movies and read reviews from other users to find your next favorite film.'
    },
    {
      icon: Heart,
      title: 'Personalization',
      description: 'Save your favorite movies and get personalized recommendations.'
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
              About <span className="text-[#F58021]">MovieBox</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Your ultimate destination for discovering, sharing, and managing movies
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="grid md:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
            <p className="text-white/70 mb-4">
              MovieBox is dedicated to creating a comprehensive platform for movie enthusiasts worldwide. 
              We believe in making it easy for people to discover, organize, and share their favorite films.
            </p>
            <p className="text-white/70 mb-4">
              Whether you're a casual viewer or a film aficionado, MovieBox provides the tools and community 
              you need to enhance your movie-watching experience.
            </p>
            <p className="text-white/70">
              Our team is passionate about cinema and committed to continuously improving our platform 
              to serve the movie community better.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="bg-gradient-to-br from-[#F58021]/20 to-[#F58021]/5 rounded-2xl p-8 border border-[#F58021]/30"
          >
            <div className="text-center">
              <Film className="w-20 h-20 text-[#F58021] mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white">Powered by Passion</h3>
              <p className="text-white/60 mt-2">For the love of cinema</p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-white text-center mb-12">What We Offer</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-[#F58021]/50 transition-all"
              >
                <Icon className="w-8 h-8 text-[#F58021] mb-3" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-white/60">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-[#F58021]/10 to-transparent rounded-2xl p-8 border border-[#F58021]/20"
        >
          <h2 className="text-3xl font-bold text-white mb-6">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-[#F58021] mb-2">Passion</h3>
              <p className="text-white/70">We love movies and it shows in everything we do.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#F58021] mb-2">Quality</h3>
              <p className="text-white/70">We maintain high standards in our data and user experience.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[#F58021] mb-2">Community</h3>
              <p className="text-white/70">We believe in building a vibrant community of movie lovers.</p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default About;