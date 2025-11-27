import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, Library, Clock, CheckCircle, ArrowRight, GraduationCap, Star } from 'lucide-react';

const LandingPage = () => {
  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with years of practical experience.',
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Engage with peers and instructors in real-time collaborative sessions.',
    },
    {
      icon: Award,
      title: 'Certified Programs',
      description: 'Earn recognized certifications that boost your career prospects.',
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Access resources and support to accelerate your professional journey.',
    },
    {
      icon: Library,
      title: 'Rich Resources',
      description: 'Comprehensive study materials, videos, and practice exercises.',
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with 24/7 access to course content.',
    },
  ];

  const stats = [
    { number: '50K+', label: 'Active Students', icon: Users },
    { number: '200+', label: 'Expert Instructors', icon: GraduationCap },
    { number: '500+', label: 'Courses Available', icon: BookOpen },
    { number: '95%', label: 'Success Rate', icon: Star },
  ];

  const benefits = [
    'Access to premium course content',
    'Live interactive sessions',
    'Personalized learning paths',
    'Industry-recognized certifications',
    'Career counseling and support',
    'Lifetime access to course materials',
  ];

  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-600 rounded px-6 py-2 mb-8 border border-blue-500">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span className="text-sm font-medium">Enrollment Now Open</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Transform Your Future<br />Through Education
            </h1>
            
            <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
              Join thousands of students worldwide in pursuing excellence. Access world-class courses, 
              expert instructors, and a vibrant learning community.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/register"
                className="px-8 py-4 bg-white text-blue-700 rounded font-semibold text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center gap-2"
              >
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                to="/login"
                className="px-8 py-4 bg-blue-600 border-2 border-blue-500 rounded font-semibold text-lg hover:bg-blue-800 transition-all duration-300"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-6 rounded bg-gray-50 border border-gray-200"
              >
                <stat.icon className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                <div className="text-4xl font-bold text-blue-700 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience education designed for the modern learner with cutting-edge tools and methodologies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-8 rounded bg-white border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all duration-300"
              >
                <div className="inline-flex p-4 rounded bg-blue-600 mb-6">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-2xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-700 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Everything You Need to Succeed
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Our comprehensive platform provides all the tools and resources you need to achieve your educational goals.
              </p>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-lg text-white">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded overflow-hidden shadow-lg bg-blue-600 border border-blue-500">
                <div className="aspect-square p-8 flex items-center justify-center">
                  <div className="text-center">
                    <GraduationCap className="w-32 h-32 mx-auto mb-6 text-white" />
                    <h3 className="text-3xl font-bold text-white mb-4">Ready to Begin?</h3>
                    <p className="text-lg text-blue-100 mb-8">Join our community of learners today</p>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-700 rounded font-semibold hover:bg-gray-100 transition-all duration-300"
                    >
                      Enroll Now
                      <ArrowRight className="w-5 h-5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Start Your Learning Journey Today
          </h2>
          <p className="text-xl text-gray-600 mb-10">
            Join thousands of students who have transformed their careers through our platform.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="px-8 py-4 bg-blue-600 text-white rounded font-semibold text-lg hover:bg-blue-700 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Create Free Account
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
