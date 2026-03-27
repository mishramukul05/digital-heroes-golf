import { Link } from 'react-router-dom';
import { ArrowRight, Target, Heart, Globe, Trophy, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-emerald-500/30 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-900 -z-10"></div>
        
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-emerald-400 text-sm font-medium mb-4"
          >
            <Globe size={16} />
            <span>Play for a Purpose</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight"
          >
            Impact Through <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Every Score.
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
          >
            A modern platform for players who want more than just a leaderboard. 
            Track your performance, compete in monthly draws, and seamlessly fund 
            global environmental and social initiatives with your subscription.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center justify-center gap-2 hover:-translate-y-1 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900 group"
            >
              Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all duration-300 flex items-center justify-center hover:-translate-y-1 hover:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              View Dashboard
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-slate-900/50 px-6 border-t border-slate-800/50 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[1px] bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent"></div>
        <div className="max-w-6xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How The Platform Works</h2>
            <p className="text-slate-400">Three simple steps to connect your game with global impact.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-blue-500/50 transition-colors duration-300 hover:shadow-xl hover:shadow-blue-500/10 group cursor-default"
            >
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500/20 transition-colors duration-300">
                <Heart className="text-blue-400 group-hover:scale-110 transition-transform duration-300" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">1. Subscribe & Support</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                Join the platform for a small monthly fee. A mandatory <span className="text-blue-400 font-semibold relative inline-block after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-blue-500/30">10%</span> of your subscription goes directly to verified charity partners.
              </p>
            </motion.div>

            {/* Step 2 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-emerald-500/50 transition-colors duration-300 hover:shadow-xl hover:shadow-emerald-500/10 group cursor-default"
            >
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-emerald-500/20 transition-colors duration-300">
                <Target className="text-emerald-400 group-hover:scale-110 transition-transform duration-300" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">2. Log Your Scores</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                Enter your Stableford scores after you play. We automatically maintain your rolling 5-score history for the algorithmic draw.
              </p>
            </motion.div>

            {/* Step 3 */}
            <motion.div 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="bg-slate-800/40 backdrop-blur-sm p-8 rounded-3xl border border-slate-700/50 hover:border-amber-500/50 transition-colors duration-300 hover:shadow-xl hover:shadow-amber-500/10 group cursor-default"
            >
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500/20 transition-colors duration-300">
                <Trophy className="text-amber-400 group-hover:scale-110 transition-transform duration-300" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">3. Win the Draw</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                At the end of the month, our engine runs a draw. Match your scores to the winning numbers to claim your share of the prize pool.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-blue-900/10 -z-10"></div>
        <div className="absolute bottom-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-blue-900/20 via-slate-900 to-transparent -z-10"></div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center bg-slate-800/40 backdrop-blur-lg border border-slate-700/50 p-12 md:p-16 rounded-3xl shadow-2xl relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/0 via-emerald-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
          
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">Ready to Make a Difference?</h2>
          <p className="text-slate-400 mb-10 max-w-xl mx-auto text-lg md:text-xl">
            Join a community of players dedicated to improving their game and improving the world.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold text-lg rounded-2xl transition-all duration-300 shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)] focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900 group"
            >
              Create Your Account <Sparkles className="ml-3 w-5 h-5 group-hover:rotate-12 transition-transform duration-300" />
            </Link>
          </motion.div>
        </motion.div>
      </section>

    </div>
  );
};

export default Home;