import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { useMovies } from '@/hooks/useMovies';
import { Link } from 'react-router-dom';
import { type Movie } from '@/lib/supabase';
import DatabaseSetupChecker from '@/components/DatabaseSetupChecker';
import {
  Film,
  Star,
  Clock,
  Calendar,
  Play,
  Plus,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const Home = () => {
  const { user, profile } = useAuth();
  const { movies, loading, deleteMovie } = useMovies();
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [movieToDelete, setMovieToDelete] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    const result = await deleteMovie(id);
    if (result.error) {
      toast.error('Failed to delete movie');
    } else {
      toast.success('Movie deleted successfully');
      setDeleteDialogOpen(false);
      setMovieToDelete(null);
    }
  };

  // Hero section with featured movies
  const [currentHero, setCurrentHero] = useState(0);

  const featuredMovies = movies.slice(0, 3);
  const hasFeatured = featuredMovies.length > 0;

  const nextHero = () => {
    if (!hasFeatured) return;
    setCurrentHero((prev) => (prev + 1) % featuredMovies.length);
  };

  const prevHero = () => {
    if (!hasFeatured) return;
    setCurrentHero((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#071F35]">
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-[#F58021]/20"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#F58021] animate-spin"></div>
          </div>
          <span className="text-white/70">Loading movies...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071F35]">
      {/* Database Setup Checker for Admins */}
      {profile?.role === 'admin' && (
        <div className="container mx-auto px-4 py-8">
          <DatabaseSetupChecker />
          {/* Debug Info for Admin */}
          <div className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10">
            <h3 className="text-white font-semibold mb-2">Admin Debug Info</h3>
            <p className="text-white/70 text-sm">
              User ID: {user?.id}<br />
              Email: {user?.email}<br />
              Profile Role: {profile?.role}<br />
              User Metadata Role: {user?.user_metadata?.role}<br />
              Full Name: {profile?.full_name}
            </p>
            <div className="mt-2">
              <Link to="/add-movie">
                <Button className="bg-[#F58021] hover:bg-[#F58021]/90 text-white">
                  Test Add Movie Page
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {featuredMovies.length > 0 && (
        <section className="relative h-screen min-h-[600px] overflow-hidden">
          {/* Background Image with Parallax Effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentHero}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="absolute inset-0"
            >
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                  backgroundImage: `url(${featuredMovies[currentHero]?.backdrop_url || featuredMovies[currentHero]?.poster_url})`
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F35] via-[#071F35]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071F35]/80 to-transparent" />

          {/* Film Grain Effect */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`
            }}
          />

          {/* Hero Content */}
          <div className="relative h-full flex items-end pb-20 md:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentHero}
                  initial={{ y: 100, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-2xl"
                >
                  {/* Badge */}
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex items-center gap-2 mb-4"
                  >
                    <Badge className="bg-[#F58021]/20 text-[#F58021] border-[#F58021]/30">
                      Featured
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-white/70">
                      {featuredMovies[currentHero]?.genre?.[0] || 'Movie'}
                    </Badge>
                  </motion.div>

                  {/* Title */}
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
                    {featuredMovies[currentHero]?.title}
                  </h1>

                  {/* Rating & Info */}
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Star className="w-4 h-4 text-[#F58021] fill-[#F58021]" />
                      <span className="text-white font-medium">
                        {featuredMovies[currentHero]?.rating || 'N/A'}
                      </span>
                    </div>
                    {featuredMovies[currentHero]?.duration && (
                      <div className="flex items-center gap-1 text-white/70">
                        <Clock className="w-4 h-4" />
                        <span>{featuredMovies[currentHero]?.duration} min</span>
                      </div>
                    )}
                    {featuredMovies[currentHero]?.release_date && (
                      <div className="flex items-center gap-1 text-white/70">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(featuredMovies[currentHero]?.release_date).getFullYear()}</span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-white/70 text-lg mb-8 line-clamp-3 max-w-xl">
                    {featuredMovies[currentHero]?.description}
                  </p>

                  {/* CTA Buttons */}
                  <div className="flex flex-wrap gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMovie(featuredMovies[currentHero])}
                      className="flex items-center gap-2 px-6 py-3 bg-[#F58021] hover:bg-[#F58021]/90 text-white font-medium rounded-xl shadow-lg shadow-[#F58021]/30 transition-colors"
                    >
                      <Play className="w-5 h-5" />
                      Watch Trailer
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedMovie(featuredMovies[currentHero])}
                      className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl backdrop-blur-sm transition-colors"
                    >
                      <Film className="w-5 h-5" />
                      View Details
                    </motion.button>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Hero Navigation */}
              {featuredMovies.length > 1 && (
                <div className="absolute bottom-8 right-4 sm:right-6 lg:right-8 flex items-center gap-4">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={prevHero}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-6 h-6 text-white" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={nextHero}
                    className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-6 h-6 text-white" />
                  </motion.button>
                </div>
              )}

              {/* Hero Indicators */}
              {featuredMovies.length > 1 && (
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
                  {featuredMovies.map((_, index) => (
                    <motion.button
                      key={index}
                      onClick={() => setCurrentHero(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${index === currentHero
                        ? 'w-8 bg-[#F58021]'
                        : 'w-1.5 bg-white/30 hover:bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Movies Grid Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-12"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
                All Movies
              </h2>
              <p className="text-white/60">
                Discover our collection of {movies.length} amazing movies
              </p>
            </div>
            {profile?.role === 'admin' && (
              <Link to="/add-movie">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button className="bg-[#F58021] hover:bg-[#F58021]/90 text-white shadow-lg shadow-[#F58021]/30">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Movie
                  </Button>
                </motion.div>
              </Link>
            )}
          </motion.div>

          {/* Movies Grid */}
          {movies.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {movies.map((movie, index) => (
                <motion.div
                  key={movie.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.1,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  viewport={{ once: true }}
                  className="group relative"
                >
                  {/* Movie Card */}
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    className="relative bg-[#0d2d4a] rounded-2xl overflow-hidden shadow-xl shadow-black/30 border border-white/5"
                  >
                    {/* Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden">
                      <motion.img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-full h-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6 }}
                      />

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071F35] via-transparent to-transparent opacity-80" />

                      {/* Admin Actions */}
                      {profile?.role === 'admin' && (
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toast.info('Edit feature coming soon!');
                            }}
                            className="w-8 h-8 rounded-lg bg-[#071F35]/80 backdrop-blur-sm flex items-center justify-center hover:bg-[#F58021] transition-colors"
                          >
                            <Edit2 className="w-4 h-4 text-white" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              setMovieToDelete(movie.id);
                              setDeleteDialogOpen(true);
                            }}
                            className="w-8 h-8 rounded-lg bg-[#071F35]/80 backdrop-blur-sm flex items-center justify-center hover:bg-red-500 transition-colors"
                          >
                            <Trash2 className="w-4 h-4 text-white" />
                          </motion.button>
                        </div>
                      )}

                      {/* Play Button */}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedMovie(movie)}
                        className="absolute bottom-4 left-4 w-12 h-12 rounded-full bg-[#F58021] flex items-center justify-center shadow-lg shadow-[#F58021]/50 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Play className="w-5 h-5 text-white ml-0.5" />
                      </motion.button>

                      {/* Rating */}
                      <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
                        <Star className="w-4 h-4 text-[#F58021] fill-[#F58021]" />
                        <span className="text-white text-sm font-medium">{movie.rating || 'N/A'}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-[#F58021] transition-colors">
                        {movie.title}
                      </h3>

                      {/* Genres */}
                      {movie.genre && movie.genre.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {movie.genre.slice(0, 2).map((g) => (
                            <span
                              key={g}
                              className="text-xs px-2 py-0.5 bg-white/10 text-white/70 rounded-full"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Year & Duration */}
                      <div className="flex items-center gap-3 text-white/50 text-sm">
                        {movie.release_date && (
                          <span>{new Date(movie.release_date).getFullYear()}</span>
                        )}
                        {movie.duration && (
                          <>
                            <span>•</span>
                            <span>{movie.duration} min</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white/5 flex items-center justify-center">
                <Film className="w-12 h-12 text-white/30" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">No movies yet</h3>
              <p className="text-white/60 mb-6">
                {profile?.role === 'admin'
                  ? 'Add your first movie to get started'
                  : 'Check back later for amazing movies'}
              </p>
              {profile?.role === 'admin' && (
                <Link to="/add-movie">
                  <Button className="bg-[#F58021] hover:bg-[#F58021]/90 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Movie
                  </Button>
                </Link>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* Movie Details Dialog */}
      <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
        <DialogContent className="max-w-3xl bg-[#071F35] border-[#F58021]/20 max-h-[90vh] overflow-y-auto">
          {selectedMovie && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">
                  {selectedMovie.title}
                </DialogTitle>
                <DialogDescription className="text-white/70">
                  Movie details and information
                </DialogDescription>
              </DialogHeader>

              <div className="mt-4 space-y-4">
                {/* Backdrop */}
                {selectedMovie.backdrop_url && (
                  <div className="relative aspect-video rounded-xl overflow-hidden">
                    <img
                      src={selectedMovie.backdrop_url}
                      alt={selectedMovie.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071F35] to-transparent" />

                    {/* Play button on backdrop */}
                    {selectedMovie.trailer_url && (
                      <motion.a
                        href={selectedMovie.trailer_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.1 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <div className="w-16 h-16 rounded-full bg-[#F58021] flex items-center justify-center shadow-lg shadow-[#F58021]/50">
                          <Play className="w-8 h-8 text-white ml-1" />
                        </div>
                      </motion.a>
                    )}
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {selectedMovie.rating && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center gap-1 text-[#F58021] mb-1">
                        <Star className="w-4 h-4 fill-[#F58021]" />
                        <span className="font-semibold">Rating</span>
                      </div>
                      <p className="text-white text-lg">{selectedMovie.rating}/10</p>
                    </div>
                  )}
                  {selectedMovie.release_date && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center gap-1 text-[#F58021] mb-1">
                        <Calendar className="w-4 h-4" />
                        <span className="font-semibold">Release</span>
                      </div>
                      <p className="text-white text-lg">
                        {new Date(selectedMovie.release_date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  )}
                  {selectedMovie.duration && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center gap-1 text-[#F58021] mb-1">
                        <Clock className="w-4 h-4" />
                        <span className="font-semibold">Duration</span>
                      </div>
                      <p className="text-white text-lg">{selectedMovie.duration} min</p>
                    </div>
                  )}
                  {selectedMovie.director && (
                    <div className="bg-white/5 rounded-lg p-3 border border-white/10">
                      <div className="flex items-center gap-1 text-[#F58021] mb-1">
                        <Film className="w-4 h-4" />
                        <span className="font-semibold">Director</span>
                      </div>
                      <p className="text-white text-lg">{selectedMovie.director}</p>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {selectedMovie.genre && selectedMovie.genre.length > 0 && (
                  <div>
                    <h4 className="text-[#F58021] font-semibold mb-2">Genres</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedMovie.genre.map((g: string) => (
                        <Badge
                          key={g}
                          variant="outline"
                          className="border-[#F58021]/30 text-white/80"
                        >
                          {g}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Description */}
                <div>
                  <h4 className="text-[#F58021] font-semibold mb-2">Description</h4>
                  <p className="text-white/70 leading-relaxed">
                    {selectedMovie.description}
                  </p>
                </div>

                {/* Cast */}
                {selectedMovie.cast && selectedMovie.cast.length > 0 && (
                  <div>
                    <h4 className="text-[#F58021] font-semibold mb-2">Cast</h4>
                    <p className="text-white/70">
                      {selectedMovie.cast.join(', ')}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="bg-[#071F35] border-[#F58021]/20">
          <DialogHeader>
            <DialogTitle className="text-white">Delete Movie</DialogTitle>
            <DialogDescription className="text-white/70">
              Confirm movie deletion
            </DialogDescription>
          </DialogHeader>
          <p className="text-white/70">
            Are you sure you want to delete this movie? This action cannot be undone.
          </p>
          <div className="flex gap-3 mt-4">
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
              className="flex-1 border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={() => movieToDelete && handleDelete(movieToDelete)}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Home;
