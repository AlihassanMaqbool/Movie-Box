import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useMovies } from '@/hooks/useMovies';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Film, 
  Plus, 
  Upload,
  X,
  ArrowLeft,
  Loader2,
  Calendar,
  Clock,
  Star,
  Link as LinkIcon,
  User,
  Clapperboard,
  Shield
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
// import { supabase } from '@/lib/supabase';

const AddMovie = () => {
  const navigate = useNavigate();
  const { addMovie } = useMovies();
  const [isLoading, setIsLoading] = useState(false);
  const [genres, setGenres] = useState<string[]>([]);
  const [currentGenre, setCurrentGenre] = useState('');
  const [cast, setCast] = useState<string[]>([]);
  const [currentCast, setCurrentCast] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    poster_url: '',
    backdrop_url: '',
    release_date: '',
    rating: '',
    duration: '',
    director: '',
    trailer_url: '',
  });

  const addGenre = () => {
    if (currentGenre.trim() && !genres.includes(currentGenre.trim())) {
      setGenres([...genres, currentGenre.trim()]);
      setCurrentGenre('');
    }
  };

  const removeGenre = (genre: string) => {
    setGenres(genres.filter(g => g !== genre));
  };

  const addCast = () => {
    if (currentCast.trim() && !cast.includes(currentCast.trim())) {
      setCast([...cast, currentCast.trim()]);
      setCurrentCast('');
    }
  };

  const removeCast = (member: string) => {
    setCast(cast.filter(c => c !== member));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.title || !formData.description || !formData.poster_url) {
      toast.error('Please fill in all required fields (Title, Description, Poster URL)');
      return;
    }

    if (formData.rating && (parseFloat(formData.rating) < 0 || parseFloat(formData.rating) > 10)) {
      toast.error('Rating must be between 0 and 10');
      return;
    }

    setIsLoading(true);

    const movieData = {
      title: formData.title,
      description: formData.description,
      poster_url: formData.poster_url,
      backdrop_url: formData.backdrop_url || null,
      release_date: formData.release_date || null,
      rating: formData.rating ? parseFloat(formData.rating) : null,
      genre: genres.length > 0 ? genres : null,
      duration: formData.duration ? parseInt(formData.duration) : null,
      director: formData.director || null,
      cast: cast.length > 0 ? cast : null,
      trailer_url: formData.trailer_url || null,
    };

    const { error } = await addMovie(movieData);

    if (error) {
      toast.error(error);
    } else {
      toast.success('Movie added successfully!');
      navigate('/');
    }

    setIsLoading(false);
  };


useEffect(() => {
  // 1. AbortController کا استعمال کریں تاکہ ان ماؤنٹ ہونے پر ریکویسٹ کینسل ہو جائے
  const controller = new AbortController();

  const fetchData = async () => {
    try {
      const { data, error } = await supabase
        .from("movies") // آپ کی SQL اسکرپٹ کے مطابق ٹیبل کا نام
        .select("*")
        .abortSignal(controller.signal); // سگنل یہاں پاس کریں

      if (error) throw error;
      console.log("Movies loaded:", data);
      
    } catch (err: any) {
      // AbortError کو خاموشی سے ہینڈل کریں تاکہ کنسول میں لال ایرر نہ آئے
      if (err.name === 'AbortError') {
        console.log('Fetch aborted safely');
      } else {
        console.error('Supabase Error:', err.message);
      }
    }
  };

  fetchData();

  // Cleanup function: جب یوزر پیج چھوڑے گا تو ریکویسٹ خود بخود رک جائے گی
  return () => {
    controller.abort();
  };
}, []); // [] کا مطلب ہے یہ صرف پیج لوڈ ہونے پر ایک بار چلے گا
fetchDatabase();
async function fetchDatabase() {
  try {
    const { data, error } = await supabase
      .from('your_table')
      .select('*')
      
    if (error) throw error
    return data
  } catch (err) {
      console.error('Error:', err)
  }
}



  return (
    <div className="min-h-screen bg-[#071F35] relative overflow-hidden pt-20">
      {/* Background Effects */}
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
          className="absolute bottom-40 right-10 w-80 h-80 bg-[#F58021]/5 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8"
        >
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Movies</span>
          </button>
          <div className="flex items-center gap-2 bg-[#F58021]/10 px-4 py-2 rounded-full border border-[#F58021]/30">
            <Shield className="w-4 h-4 text-[#F58021]" />
            <span className="text-[#F58021] text-sm font-medium">Admin Panel</span>
          </div>
        </motion.div>

        {/* Form Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/10 shadow-2xl"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                <Clapperboard className="w-8 h-8 text-[#F58021]" />
                Add New Movie
              </h1>
              <p className="text-white/60">
                Fill in the details below to add a new movie to the collection
              </p>
            </div>
          </div>

          <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#F58021] flex items-center gap-2">
                <Film className="w-5 h-5" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Title */}
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-white/80">
                    Movie Title <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Enter movie title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                  />
                </div>

                {/* Director */}
                <div className="space-y-2">
                  <Label htmlFor="director" className="text-white/80 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Director
                  </Label>
                  <Input
                    id="director"
                    type="text"
                    placeholder="Enter director name"
                    value={formData.director}
                    onChange={(e) => setFormData({ ...formData, director: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                  />
                </div>

                {/* Release Date */}
                <div className="space-y-2">
                  <Label htmlFor="release_date" className="text-white/80 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Release Date
                  </Label>
                  <Input
                    id="release_date"
                    type="date"
                    value={formData.release_date}
                    onChange={(e) => setFormData({ ...formData, release_date: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                  />
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-white/80 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    Duration (minutes)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 120"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-2">
                  <Label htmlFor="rating" className="text-white/80 flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Rating (0-10)
                  </Label>
                  <Input
                    id="rating"
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="e.g., 8.5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                  />
                </div>

                {/* Trailer URL */}
                <div className="space-y-2">
                  <Label htmlFor="trailer_url" className="text-white/80 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4" />
                    Trailer URL
                  </Label>
                  <Input
                    id="trailer_url"
                    type="url"
                    placeholder="https://youtube.com/watch?v=..."
                    value={formData.trailer_url}
                    onChange={(e) => setFormData({ ...formData, trailer_url: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                  />
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-[#F58021] flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Images
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Poster URL */}
                <div className="space-y-2">
                  <Label htmlFor="poster_url" className="text-white/80">
                    Poster URL <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    id="poster_url"
                    type="url"
                    placeholder="https://image.tmdb.org/t/p/w500/..."
                    value={formData.poster_url}
                    onChange={(e) => setFormData({ ...formData, poster_url: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                  />
                  {formData.poster_url && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 aspect-[2/3] rounded-xl overflow-hidden border border-white/10"
                    >
                      <img
                        src={formData.poster_url}
                        alt="Poster preview"
                        className="w-full h-full object-cover"
                        onError={() => {
                          toast.error('Invalid poster URL');
                        }}
                      />
                    </motion.div>
                  )}
                </div>

                {/* Backdrop URL */}
                <div className="space-y-2">
                  <Label htmlFor="backdrop_url" className="text-white/80">
                    Backdrop URL
                  </Label>
                  <Input
                    id="backdrop_url"
                    type="url"
                    placeholder="https://image.tmdb.org/t/p/w1280/..."
                    value={formData.backdrop_url}
                    onChange={(e) => setFormData({ ...formData, backdrop_url: e.target.value })}
                    className="h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                  />
                  {formData.backdrop_url && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="mt-2 aspect-video rounded-xl overflow-hidden border border-white/10"
                    >
                      <img
                        src={formData.backdrop_url}
                        alt="Backdrop preview"
                        className="w-full h-full object-cover"
                        onError={() => toast.error('Invalid backdrop URL')}
                      />
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Genres Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#F58021] flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Genres
              </h2>

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add a genre (e.g., Action)"
                  value={currentGenre}
                  onChange={(e) => setCurrentGenre(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addGenre())}
                  className="flex-1 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                />
                <Button
                  type="button"
                  onClick={addGenre}
                  className="h-12 px-6 bg-[#F58021] hover:bg-[#F58021]/90 text-white rounded-xl"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <Badge
                    key={genre}
                    variant="outline"
                    className="bg-[#F58021]/10 border-[#F58021]/30 text-[#F58021] px-3 py-1.5 hover:bg-[#F58021]/20 cursor-default"
                  >
                    {genre}
                    <button
                      type="button"
                      onClick={() => removeGenre(genre)}
                      className="ml-2 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Cast Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#F58021] flex items-center gap-2">
                <User className="w-5 h-5" />
                Cast
              </h2>

              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Add a cast member"
                  value={currentCast}
                  onChange={(e) => setCurrentCast(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCast())}
                  className="flex-1 h-12 bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl"
                />
                <Button
                  type="button"
                  onClick={addCast}
                  className="h-12 px-6 bg-[#F58021] hover:bg-[#F58021]/90 text-white rounded-xl"
                >
                  <Plus className="w-5 h-5" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {cast.map((member) => (
                  <Badge
                    key={member}
                    variant="outline"
                    className="bg-white/5 border-white/10 text-white/80 px-3 py-1.5 hover:bg-white/10 cursor-default"
                  >
                    {member}
                    <button
                      type="button"
                      onClick={() => removeCast(member)}
                      className="ml-2 hover:text-red-400"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-[#F58021]">
                Description
              </h2>
              <Textarea
                id="description"
                placeholder="Enter movie description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={6}
                className="bg-white/5 border-white/10 text-white placeholder:text-white/40 focus:border-[#F58021] focus:ring-[#F58021]/20 rounded-xl resize-none"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  type="button"
                  onClick={() => navigate('/')}
                  variant="outline"
                  className="w-full h-14 bg-transparent border-white/20 text-white hover:bg-white/10 rounded-xl"
                >
                  Cancel
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1"
              >
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-14 bg-[#F58021] hover:bg-[#F58021]/90 text-white font-semibold rounded-xl shadow-lg shadow-[#F58021]/30 disabled:opacity-50"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Add Movie
                    </>
                  )}
                </Button>
              </motion.div>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default AddMovie;
