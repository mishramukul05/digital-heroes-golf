import { Link } from 'react-router-dom';
import { ArrowRight, Target, Heart, Globe, Trophy, Sparkles } from 'lucide-react';

const Home = () => {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 font-sans selection:bg-emerald-500/30">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-emerald-900/20 via-slate-900 to-slate-900 -z-10"></div>
        
        <div className="max-w-6xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-emerald-400 text-sm font-medium mb-4">
            <Globe size={16} />
            <span>Play for a Purpose</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Impact Through <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Every Score.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            A modern platform for players who want more than just a leaderboard. 
            Track your performance, compete in monthly draws, and seamlessly fund 
            global environmental and social initiatives with your subscription.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-400 hover:to-blue-500 text-white font-semibold rounded-xl transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 hover:-translate-y-1 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900 group"
            >
              Get Started <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="/dashboard" 
              className="w-full sm:w-auto px-8 py-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold rounded-xl border border-slate-700 transition-all duration-300 flex items-center justify-center hover:-translate-y-1 hover:border-slate-500 focus:ring-2 focus:ring-slate-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900"
            >
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-slate-900 px-6 border-t border-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How The Platform Works</h2>
            <p className="text-slate-400">Three simple steps to connect your game with global impact.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:-translate-y-1 hover:border-slate-500 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 group cursor-default">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Heart className="text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">1. Subscribe & Support</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                Join the platform for a small monthly fee. A mandatory <span className="text-blue-400 font-semibold">10%</span> of your subscription goes directly to verified charity partners.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:-translate-y-1 hover:border-slate-500 transition-all duration-300 hover:shadow-xl hover:shadow-emerald-500/10 group cursor-default">
              <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">2. Log Your Scores</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                Enter your Stableford scores after you play. We automatically maintain your rolling 5-score history for the algorithmic draw.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:-translate-y-1 hover:border-slate-500 transition-all duration-300 hover:shadow-xl hover:shadow-amber-500/10 group cursor-default">
              <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Trophy className="text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">3. Win the Draw</h3>
              <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                At the end of the month, our engine runs a draw. Match your scores to the winning numbers to claim your share of the prize pool.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 to-blue-900/10 -z-10"></div>
        <div className="max-w-4xl mx-auto text-center bg-slate-800/50 backdrop-blur-md border border-slate-700 p-12 rounded-3xl shadow-2xl hover:border-slate-500 transition-all duration-500 hover:shadow-emerald-500/10">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Ready to Make a Difference?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto text-lg">
            Join a community of players dedicated to improving their game and improving the world.
          </p>
          <Link 
            to="/login" 
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:-translate-y-1 focus:ring-2 focus:ring-emerald-500 focus:outline-none focus:ring-offset-2 focus:ring-offset-slate-900 group"
          >
            Create Your Account <Sparkles className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Home;