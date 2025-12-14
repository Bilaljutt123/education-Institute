import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, User, ArrowRight, Tag, Clock, TrendingUp } from 'lucide-react';
import Carousel from './Carousel';

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  featured?: boolean;
}

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const slides = [
    {
      image: '/images/hero_library_study_1765725147090.png',
      title: 'News & Articles',
      description: 'Stay updated with the latest happenings, achievements, and stories from our vibrant academic community.',
    },
    {
      image: '/images/hero_lecture_hall_1765725170900.png',
      title: 'Faculty Insights',
      description: 'Read about groundbreaking research and expert opinions from our distinguished faculty members.',
    },
    {
      image: '/images/hero_campus_modern_1765725127334.png',
      title: 'Student Life',
      description: 'Discover the exciting events, clubs, and activities that make our campus life unique.',
    }
  ];

  // Mock blog data - In production, fetch from backend
  const blogPosts: BlogPost[] = [
    {
      id: 1,
      title: "Annual Science Fair 2024: A Spectacular Display of Innovation",
      excerpt: "Our students showcased groundbreaking projects at this year's Science Fair, demonstrating creativity and scientific excellence across various disciplines.",
      author: "Dr. Sarah Johnson",
      date: "2024-11-20",
      category: "Events",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop",
      readTime: "5 min read",
      featured: true
    },
    {
      id: 2,
      title: "New Computer Science Lab Opens: State-of-the-Art Technology",
      excerpt: "We're excited to announce the opening of our new Computer Science lab, equipped with cutting-edge technology to enhance student learning experiences.",
      author: "Prof. Michael Chen",
      date: "2024-11-18",
      category: "Facilities",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=500&fit=crop",
      readTime: "4 min read",
      featured: true
    },
    {
      id: 3,
      title: "Student Spotlight: Meet Our National Scholarship Winners",
      excerpt: "Three of our exceptional students have been awarded prestigious national scholarships. Learn about their inspiring journeys and achievements.",
      author: "Emma Williams",
      date: "2024-11-15",
      category: "Students",
      image: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=500&fit=crop",
      readTime: "6 min read"
    },
    {
      id: 4,
      title: "Workshop Series: Industry Experts Share Career Insights",
      excerpt: "Our monthly workshop series continues with sessions led by industry leaders, providing students with valuable career guidance and networking opportunities.",
      author: "Dr. Robert Martinez",
      date: "2024-11-12",
      category: "Workshops",
      image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=500&fit=crop",
      readTime: "3 min read"
    },
    {
      id: 5,
      title: "Community Outreach: Students Volunteer at Local Children's Hospital",
      excerpt: "Our community service program made a difference this month, with students volunteering their time to bring joy to young patients at the local children's hospital.",
      author: "Jennifer Davis",
      date: "2024-11-10",
      category: "Community",
      image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800&h=500&fit=crop",
      readTime: "4 min read"
    },
    {
      id: 6,
      title: "Research Breakthrough: Faculty Published in Top Journal",
      excerpt: "Our faculty's groundbreaking research on renewable energy has been published in one of the world's leading scientific journals.",
      author: "Dr. Amanda Lee",
      date: "2024-11-08",
      category: "Research",
      image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&h=500&fit=crop",
      readTime: "7 min read"
    },
    {
      id: 7,
      title: "Sports Championship: Basketball Team Wins Regional Title",
      excerpt: "Congratulations to our basketball team for their incredible victory at the regional championship, showcasing teamwork and athletic excellence.",
      author: "Coach James Wilson",
      date: "2024-11-05",
      category: "Sports",
      image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&h=500&fit=crop",
      readTime: "3 min read"
    },
    {
      id: 8,
      title: "Cultural Festival: Celebrating Diversity and Unity",
      excerpt: "Our annual cultural festival brought together students from diverse backgrounds to celebrate traditions, music, and cuisine from around the world.",
      author: "Maria Garcia",
      date: "2024-11-01",
      category: "Events",
      image: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&h=500&fit=crop",
      readTime: "5 min read"
    }
  ];

  const categories = ['all', 'Events', 'Facilities', 'Students', 'Workshops', 'Community', 'Research', 'Sports'];

  const filteredPosts = selectedCategory === 'all' 
    ? blogPosts 
    : blogPosts.filter(post => post.category === selectedCategory);

  const featuredPosts = blogPosts.filter(post => post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <Carousel slides={slides} />

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-yellow-100 rounded">
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Featured Stories</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <div 
                  key={post.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-200"
                >
                  <div className="relative overflow-hidden h-64">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                        FEATURED
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
                      <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-12">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter by Category</h3>
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2.5 rounded-full font-medium transition-all ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* All Posts Grid */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">All Articles</h2>
          {filteredPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <div 
                  key={post.id}
                  className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-200 hover:border-blue-400"
                >
                  <div className="relative overflow-hidden h-48">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 mb-3 text-sm">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium text-xs">
                        <Tag className="w-3 h-3" />
                        {post.category}
                      </span>
                      <span className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 text-xs text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-3 h-3" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">No articles found in this category.</p>
            </div>
          )}
        </div>

        {/* CTA Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Want to Learn More About Our Institute?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Discover our programs, facilities, and vibrant student life. Join our community of learners and achievers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/register"
              className="px-8 py-4 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center justify-center gap-2 shadow-lg"
            >
              Apply Now
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link 
              to="/"
              className="px-8 py-4 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all border-2 border-white/30"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
