"use client"
import React, { useState, useEffect } from 'react';
import { 
  Heart, Home, Search, Bell, MessageCircle, Menu, TrendingUp, Users, Shield, Bot,
  Sparkles, Hash, Camera, Mic, Video, MapPin, Calendar, Gift, Zap, Brain,
  Headphones, Moon, Sun, TreePine, Waves, Flame, Star, Award, Target,
  Clock, Eye, Share2, Bookmark, MoreHorizontal, ThumbsUp, MessageSquare,
  Play, Pause, SkipForward, Volume2, VolumeX, Wifi, WifiOff, Globe,
  Lightbulb, Coffee, Book, Music, Gamepad2, PaintBrush, Camera as CameraIcon,
  Compass, Flower2, Leaf, Rainbow, Sunrise, Mountain, CloudRain
} from 'lucide-react';

const SambandhYog = () => {
  const [activeTab, setActiveTab] = useState("forYou");
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [currentMood, setCurrentMood] = useState("peaceful");
  const [isPlayingAmbient, setIsPlayingAmbient] = useState(false);
  const [voiceRecording, setVoiceRecording] = useState(false);
  const [liveStreamActive, setLiveStreamActive] = useState(false);
  const [mindfulnessStreak, setMindfulnessStreak] = useState(12);
  const [currentChallenge, setCurrentChallenge] = useState("gratitude");
  const [energyLevel, setEnergyLevel] = useState(78);
  const [connectionScore, setConnectionScore] = useState(94);

  const moods = [
    { name: "peaceful", color: "from-blue-400 to-blue-600", emoji: "🕊️" },
    { name: "grateful", color: "from-yellow-400 to-orange-500", emoji: "🙏" },
    { name: "energetic", color: "from-red-400 to-pink-500", emoji: "⚡" },
    { name: "thoughtful", color: "from-purple-400 to-indigo-500", emoji: "💭" },
    { name: "joyful", color: "from-green-400 to-teal-500", emoji: "😊" }
  ];

  const ambientSounds = [
    { name: "Forest", icon: TreePine, color: "text-green-500" },
    { name: "Ocean", icon: Waves, color: "text-blue-500" },
    { name: "Rain", icon: CloudRain, color: "text-gray-500" },
    { name: "Fire", icon: Flame, color: "text-orange-500" }
  ];

  const challenges = [
    { id: "gratitude", name: "Daily Gratitude", progress: 85, participants: "2.4K" },
    { id: "kindness", name: "Random Acts", progress: 62, participants: "1.8K" },
    { id: "mindful", name: "Mindful Moments", progress: 73, participants: "3.1K" },
    { id: "connect", name: "Deep Connections", progress: 91, participants: "1.2K" }
  ];

  const posts = [
    {
      id: 1,
      author: "Priya Mindful",
      username: "@priya_yoga",
      avatar: "/api/placeholder/40/40",
      time: "2h",
      mood: "grateful",
      content: "Just witnessed the most beautiful sunrise during my morning meditation. The way the light slowly painted the sky reminded me that every day is a fresh canvas. What small beauty did you notice today? 🌅",
      image: "/api/placeholder/400/250",
      tags: ["#mindfulness", "#gratitude", "#sunrise"],
      reactions: { hearts: 234, insights: 45, support: 78, inspired: 156 },
      voiceNote: true,
      location: "Mumbai, India",
      positivityScore: 96,
      energyBoost: 12,
      comments: 23,
      shares: 8,
      bookmarks: 34,
      liveReactions: ["🌅", "💝", "🙏", "✨"]
    },
    {
      id: 2,
      author: "Rohan Peace",
      username: "@rohan_peace",
      avatar: "/api/placeholder/40/40",
      time: "4h",
      mood: "thoughtful",
      content: "Started a 30-day digital detox challenge today. Already feeling more present with my family. Who wants to join me? Let's rediscover the joy of real conversations! 📱→💬",
      tags: ["#digitaldetox", "#presence", "#family"],
      reactions: { hearts: 189, insights: 67, support: 123, inspired: 89 },
      poll: {
        question: "What's your biggest digital distraction?",
        options: [
          { text: "Social Media", votes: 45 },
          { text: "News Apps", votes: 23 },
          { text: "Gaming", votes: 18 },
          { text: "Work Emails", votes: 34 }
        ]
      },
      positivityScore: 91,
      energyBoost: 8,
      comments: 45,
      shares: 12,
      bookmarks: 67
    }
  ];

  const stories = [
    { id: 1, author: "You", avatar: "/api/placeholder/60/60", isOwn: true, gradient: "from-purple-400 to-pink-500" },
    { id: 2, author: "Meditation Monday", avatar: "/api/placeholder/60/60", isLive: true, gradient: "from-green-400 to-teal-500" },
    { id: 3, author: "Gratitude Circle", avatar: "/api/placeholder/60/60", gradient: "from-yellow-400 to-orange-500" },
    { id: 4, author: "Kindness Warriors", avatar: "/api/placeholder/60/60", gradient: "from-blue-400 to-purple-500" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Main Header with Enhanced Features */}
      <header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-gray-200/50 shadow-lg">
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto">
          {/* Logo with Animation */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-all duration-300">
              <Heart className="w-7 h-7 text-white animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-xl bg-gradient-to-r from-primary-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                SambandhYog
              </h1>
              <p className="text-xs text-gray-500">Mindful Connections</p>
            </div>
          </div>
          
          {/* Enhanced Search with AI */}
          <div className="flex-1 max-w-lg mx-4">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Brain className="absolute right-12 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Ask AI anything positive..." 
                className="w-full pl-12 pr-16 py-3 bg-gray-100/80 border-0 rounded-2xl focus:ring-2 focus:ring-primary-300 focus:bg-white backdrop-blur-sm transition-all duration-300"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg">
                <Sparkles className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
          
          {/* Navigation with Live Indicators */}
          <div className="flex items-center gap-3">
            <button className="p-2.5 rounded-xl hover:bg-gray-100/80 relative group transition-all duration-300">
              <Home className="w-6 h-6 text-gray-700 group-hover:text-primary-500" />
            </button>
            <button className="p-2.5 rounded-xl hover:bg-gray-100/80 relative group">
              <MessageCircle className="w-6 h-6 text-gray-700 group-hover:text-primary-500" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-bounce">3</span>
            </button>
            <button className="p-2.5 rounded-xl hover:bg-gray-100/80 relative group">
              <Bell className="w-6 h-6 text-gray-700 group-hover:text-primary-500" />
              <span className="absolute -top-1 -right-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center pulse">7</span>
            </button>
            <div className="relative">
              <img 
                src="/api/placeholder/40/40" 
                alt="Profile" 
                className="w-10 h-10 rounded-xl object-cover border-3 border-white shadow-lg cursor-pointer hover:scale-110 transition-transform duration-300"
              />
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r ${moods.find(m => m.name === currentMood)?.color} rounded-full border-2 border-white`}>
                <span className="text-xs">{moods.find(m => m.name === currentMood)?.emoji}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mood & Ambient Bar */}
        <div className="px-4 pb-3 max-w-7xl mx-auto">
          <div className="flex items-center justify-between bg-white/60 rounded-2xl p-3 backdrop-blur-sm">
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-gray-600">Mood:</span>
              <div className="flex gap-2">
                {moods.map((mood) => (
                  <button
                    key={mood.name}
                    onClick={() => setCurrentMood(mood.name)}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      currentMood === mood.name 
                        ? `bg-gradient-to-r ${mood.color} text-white scale-110 shadow-lg` 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{mood.emoji}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-gray-600">Ambience:</span>
              <div className="flex gap-2">
                {ambientSounds.map((sound) => (
                  <button
                    key={sound.name}
                    onClick={() => setIsPlayingAmbient(!isPlayingAmbient)}
                    className={`p-2 rounded-xl transition-all duration-300 ${
                      isPlayingAmbient ? 'bg-green-100 text-green-600' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <sound.icon className={`w-4 h-4 ${sound.color}`} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Enhanced Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          {/* Enhanced Profile Card */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="text-center">
              <div className="relative inline-block">
                <img 
                  src="/api/placeholder/80/80" 
                  alt="Profile" 
                  className="w-20 h-20 rounded-2xl mx-auto object-cover border-4 border-white shadow-xl"
                />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-gradient-to-r from-green-400 to-teal-500 rounded-full border-3 border-white flex items-center justify-center">
                  <Zap className="w-4 h-4 text-white" />
                </div>
              </div>
              <h2 className="font-bold text-xl mt-4 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Aarav Sharma</h2>
              <p className="text-gray-600 text-sm">@aarav_mindful</p>
              <div className="bg-gradient-to-r from-primary-50 to-purple-50 rounded-2xl p-3 mt-4">
                <div className="text-sm text-gray-600 mb-2">Mindfulness Streak</div>
                <div className="flex items-center justify-center gap-2">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <span className="font-bold text-2xl text-orange-600">{mindfulnessStreak}</span>
                  <span className="text-gray-600">days</span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-lg">128</div>
                  <div className="text-xs text-gray-600">Posts</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-lg">2.4K</div>
                  <div className="text-xs text-gray-600">Connections</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-gray-900 text-lg">{energyLevel}%</div>
                  <div className="text-xs text-gray-600">Energy</div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Insights & Challenges */}
          <div className="bg-gradient-to-br from-purple-500 via-primary-500 to-blue-500 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-7 h-7" />
              <div>
                <h3 className="font-bold text-lg">AI Insights</h3>
                <p className="text-sm opacity-90">Your wellness journey</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="bg-white/20 rounded-2xl p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Connection Score</span>
                  <span className="font-bold">{connectionScore}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full transition-all duration-1000" style={{width: `${connectionScore}%`}}></div>
                </div>
              </div>
              <button className="w-full bg-white/20 hover:bg-white/30 rounded-2xl p-3 text-left transition-all duration-300">
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5" />
                  <div>
                    <div className="font-medium">Daily Challenge</div>
                    <div className="text-sm opacity-90">Gratitude Journal</div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Live Challenges */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-5 shadow-xl border border-white/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
              <Award className="w-5 h-5 text-yellow-500" />
              Active Challenges
            </h3>
            <div className="space-y-3">
              {challenges.map((challenge) => (
                <div key={challenge.id} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{challenge.name}</span>
                    <span className="text-primary-500 text-xs font-medium">{challenge.participants} joined</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-1000" 
                      style={{width: `${challenge.progress}%`}}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-600">{challenge.progress}% complete</div>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Enhanced Main Feed */}
        <main className="lg:col-span-6 space-y-6">
          {/* Revolutionary Create Post */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-6 shadow-xl border border-white/50">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative">
                <img 
                  src="/api/placeholder/50/50" 
                  alt="Profile" 
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-lg"
                />
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-green-400 to-teal-500 rounded-full border-2 border-white">
                  <span className="text-xs">✨</span>
                </div>
              </div>
              <button 
                onClick={() => document.getElementById('postInput')?.focus()}
                className="flex-1 text-left p-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl hover:from-gray-200 hover:to-gray-300 text-gray-500 transition-all duration-300"
              >
                Share your positive energy with the world...
              </button>
            </div>
            
            {/* Enhanced Creation Tools */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <button 
                onClick={() => setVoiceRecording(!voiceRecording)}
                className={`flex items-center gap-2 p-3 rounded-2xl transition-all duration-300 ${
                  voiceRecording ? 'bg-red-100 text-red-600' : 'bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200'
                }`}
              >
                <Mic className="w-5 h-5" />
                <span className="text-sm font-medium">Voice Note</span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-green-50 to-green-100 text-green-600 hover:from-green-100 hover:to-green-200 rounded-2xl transition-all duration-300">
                <Video className="w-5 h-5" />
                <span className="text-sm font-medium">Live Stream</span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-600 hover:from-purple-100 hover:to-purple-200 rounded-2xl transition-all duration-300">
                <MapPin className="w-5 h-5" />
                <span className="text-sm font-medium">Location</span>
              </button>
              <button className="flex items-center gap-2 p-3 bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-600 hover:from-yellow-100 hover:to-yellow-200 rounded-2xl transition-all duration-300">
                <Calendar className="w-5 h-5" />
                <span className="text-sm font-medium">Event</span>
              </button>
            </div>

            {/* Mood & Energy Selector */}
            <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-3">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">Energy Boost:</span>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map((level) => (
                    <button key={level} className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center opacity-30 hover:opacity-100 transition-all duration-300">
                      <Zap className="w-4 h-4 text-white" />
                    </button>
                  ))}
                </div>
              </div>
              <button className="px-4 py-2 bg-gradient-to-r from-primary-500 to-purple-500 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300">
                Share Positivity
              </button>
            </div>
          </div>

          {/* Enhanced Stories with Live Features */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-4 shadow-xl border border-white/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-gray-800">Live Stories</h3>
              <button className="text-primary-500 text-sm font-medium">View All</button>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {stories.map((story) => (
                <div key={story.id} className="flex-shrink-0 text-center">
                  <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-r ${story.gradient} p-1 shadow-lg`}>
                    <img 
                      src={story.avatar} 
                      alt={story.author}
                      className="w-full h-full rounded-xl object-cover border-2 border-white"
                    />
                    {story.isLive && (
                      <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        LIVE
                      </div>
                    )}
                    {story.isOwn && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center">
                        <span className="text-xs font-bold">+</span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs mt-2 font-medium">{story.author}</p>
                </div>
              ))}
            </div>
          </div>

          {/* AI-Powered Feed Filter */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-1 shadow-xl border border-white/50">
            <div className="flex items-center">
              <button 
                className={`flex-1 py-3 px-4 text-center rounded-2xl transition-all duration-300 ${
                  activeTab === 'forYou' 
                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('forYou')}
              >
                <div className="flex items-center justify-center gap-2">
                  <Brain className="w-4 h-4" />
                  AI For You
                </div>
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center rounded-2xl transition-all duration-300 ${
                  activeTab === 'following' 
                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('following')}
              >
                Following
              </button>
              <button 
                className={`flex-1 py-3 px-4 text-center rounded-2xl transition-all duration-300 ${
                  activeTab === 'trending' 
                    ? 'bg-gradient-to-r from-primary-500 to-purple-500 text-white font-medium shadow-lg' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('trending')}
              >
                <div className="flex items-center justify-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending
                </div>
              </button>
            </div>
          </div>

          {/* Revolutionary Posts */}
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl transition-all duration-500">
                {/* Post Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <img 
                          src={post.avatar} 
                          alt={post.author}
                          className="w-12 h-12 rounded-2xl object-cover border-2 border-white shadow-lg"
                        />
                        <div className={`absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r ${moods.find(m => m.name === post.mood)?.color} rounded-full border-2 border-white flex items-center justify-center`}>
                          <span className="text-xs">{moods.find(m => m.name === post.mood)?.emoji}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-gray-900">{post.author}</h3>
                          <span className="text-gray-500 text-sm">{post.username}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500 text-sm">{post.time}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          {post.location && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                              <MapPin className="w-3 h-3" />
                              <span>{post.location}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1 bg-green-100 text-green-600 px-2 py-1 rounded-full text-xs">
                            <Sparkles className="w-3 h-3" />
                            <span>+{post.energyBoost} Energy</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-green-400 to-teal-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        {post.positivityScore}% Positive
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="px-6 pb-4">
                  <p className="text-gray-800 leading-relaxed mb-3">{post.content}</p>
                  
                  {/* Voice Note Player */}
                  {post.voiceNote && (
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-4 mb-4">
                      <div className="flex items-center gap-3">
                        <button className="p-2 bg-blue-100 hover:bg-blue-200 rounded-xl transition-colors">
                          <Play className="w-4 h-4 text-blue-600" />
                        </button>
                        <div className="flex-1">
                          <div className="w-full bg-blue-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-500 mt-1">
                            <span>0:23</span>
                            <span>0:52</span>
                          </div>
                        </div>
                        <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                          <Volume2 className="w-4 h-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Poll Component */}
                  {post.poll && (
                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-4 mb-4">
                      <h4 className="font-medium mb-3">{post.poll.question}</h4>
                      <div className="space-y-2">
                        {post.poll.options.map((option, index) => (
                          <button key={index} className="w-full text-left p-3 bg-white/60 hover:bg-white/80 rounded-xl transition-colors">
                            <div className="flex justify-between items-center">
                              <span className="text-sm">{option.text}</span>
                              <span className="text-xs text-gray-500">{option.votes} votes</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                              <div 
                                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 rounded-full transition-all duration-500" 
                                style={{width: `${(option.votes / 120) * 100}%`}}
                              ></div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {post.tags && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.map((tag, index) => (
                        <button key={index} className="bg-blue-100 hover:bg-blue-200 text-blue-600 px-3 py-1 rounded-full text-sm transition-colors">
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Image */}
                {post.image && (
                  <div className="relative">
                    <img 
                      src={post.image} 
                      alt="Post content"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute top-4 right-4 flex gap-2">
                      {post.liveReactions && post.liveReactions.map((emoji, index) => (
                        <span key={index} className="text-2xl animate-bounce" style={{animationDelay: `${index * 0.2}s`}}>
                          {emoji}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Enhanced Reactions */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1">
                        <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">❤️</div>
                        <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-white text-xs">💡</div>
                        <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">🤝</div>
                        <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-xs">✨</div>
                      </div>
                      <span className="text-sm text-gray-600 ml-2">
                        {Object.values(post.reactions).reduce((a, b) => a + b, 0)} people reacted
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>{post.comments} comments</span>
                      <span>{post.shares} shares</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex gap-2">
                      <button className="flex items-center gap-2 px-4 py-2 hover:bg-red-50 rounded-xl transition-colors group">
                        <Heart className="w-5 h-5 text-gray-500 group-hover:text-red-500 group-hover:fill-red-500" />
                        <span className="text-sm text-gray-600 group-hover:text-red-500">Love</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 hover:bg-yellow-50 rounded-xl transition-colors group">
                        <Lightbulb className="w-5 h-5 text-gray-500 group-hover:text-yellow-500" />
                        <span className="text-sm text-gray-600 group-hover:text-yellow-500">Insight</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 hover:bg-green-50 rounded-xl transition-colors group">
                        <Users className="w-5 h-5 text-gray-500 group-hover:text-green-500" />
                        <span className="text-sm text-gray-600 group-hover:text-green-500">Support</span>
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 hover:bg-purple-50 rounded-xl transition-colors group">
                        <Sparkles className="w-5 h-5 text-gray-500 group-hover:text-purple-500" />
                        <span className="text-sm text-gray-600 group-hover:text-purple-500">Inspired</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <MessageSquare className="w-5 h-5 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Share2 className="w-5 h-5 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
                        <Bookmark className="w-5 h-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Enhanced Right Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6">
          {/* Live Activity Feed */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-5 shadow-xl border border-white/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
              <Zap className="w-5 h-5 text-yellow-500" />
              Live Activity
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">Maya shared a gratitude moment</p>
                  <p className="text-xs text-gray-500">2 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">Mindfulness group went live</p>
                  <p className="text-xs text-gray-500">5 minutes ago</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl">
                <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-800">Raj completed daily challenge</p>
                  <p className="text-xs text-gray-500">8 minutes ago</p>
                </div>
              </div>
            </div>
          </div>

          {/* Trending Topics */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-5 shadow-xl border border-white/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
              <TrendingUp className="w-5 h-5 text-primary-500" />
              Trending Topics
            </h3>
            <div className="space-y-3">
              {['#GratitudePractice', '#MindfulMoments', '#DigitalDetox', '#KindnessMatters', '#InnerPeace'].map((topic, index) => (
                <button key={topic} className="w-full text-left p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-primary-600">{topic}</span>
                    <span className="text-xs text-gray-500">{Math.floor(Math.random() * 10) + 1}K posts</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Trending in Wellness</p>
                </button>
              ))}
            </div>
          </div>

          {/* Suggested Connections */}
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-5 shadow-xl border border-white/50">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-gray-800">
              <Users className="w-5 h-5 text-primary-500" />
              Mindful Connections
            </h3>
            <div className="space-y-3">
              {[
                { name: "Dr. Seema Wellness", username: "@seema_mindful", mutual: 12 },
                { name: "Yoga with Arjun", username: "@arjun_yoga", mutual: 8 },
                { name: "Meditation Circle", username: "@meditation_circle", mutual: 15 }
              ].map((user) => (
                <div key={user.username} className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                  <img 
                    src="/api/placeholder/40/40" 
                    alt={user.name}
                    className="w-10 h-10 rounded-xl object-cover border-2 border-white shadow-md"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900">{user.name}</h4>
                    <p className="text-xs text-gray-500">{user.mutual} mutual connections</p>
                  </div>
                  <button className="px-3 py-1 bg-gradient-to-r from-primary-500 to-purple-500 text-white text-sm rounded-lg hover:shadow-lg transition-all duration-300">
                    Connect
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Inspiration */}
          <div className="bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600 rounded-3xl p-6 text-white shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <Sunrise className="w-7 h-7" />
              <div>
                <h3 className="font-bold text-lg">Daily Inspiration</h3>
                <p className="text-sm opacity-90">Your moment of zen</p>
              </div>
            </div>
            <blockquote className="text-sm leading-relaxed mb-4 opacity-95">
              "The present moment is the only time over which we have dominion. Peace is not simply the absence of violence; it is the cultivation of understanding."
            </blockquote>
            <p className="text-xs opacity-80">— Thich Nhat Hanh</p>
            <button className="w-full mt-4 bg-white/20 hover:bg-white/30 rounded-2xl p-3 transition-all duration-300">
              <span className="text-sm font-medium">Reflect on This</span>
            </button>
          </div>
        </aside>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-200/50 p-4">
        <div className="flex justify-around">
          <button className="flex flex-col items-center gap-1 p-2">
            <Home className="w-6 h-6 text-primary-500" />
            <span className="text-xs text-primary-500 font-medium">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <Search className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Explore</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 relative">
            <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 p-2 relative">
            <MessageCircle className="w-6 h-6 text-gray-400" />
            <span className="text-xs text-gray-400">Connect</span>
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
          </button>
          <button className="flex flex-col items-center gap-1 p-2">
            <div className="w-6 h-6 rounded-lg overflow-hidden">
              <img src="/api/placeholder/24/24" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-gray-400">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SambandhYog;