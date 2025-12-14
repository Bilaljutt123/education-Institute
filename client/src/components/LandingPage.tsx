import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, TrendingUp, Library, Clock, CheckCircle, ArrowRight, GraduationCap, Star } from 'lucide-react';
import Carousel from './Carousel';

const LandingPage = () => {
  const slides = [
    {
      image: '/images/hero_campus_modern_1765725127334.png',
      title: 'Transform Your Future Through Education',
      description: 'Join thousands of students worldwide in pursuing excellence. Access world-class courses, expert instructors, and a vibrant learning community.',
      ctaText: 'Get Started Free',
      ctaLink: '/register'
    },
    {
      image: '/images/hero_library_study_1765725147090.png',
      title: 'State-of-the-Art Facilities',
      description: 'Experience learning in a modern environment equipped with the latest technology and resources.',
      ctaText: 'Explore Campus',
      ctaLink: '/services'
    },
    {
      image: '/images/hero_lecture_hall_1765725170900.png',
      title: 'Learn from Industry Experts',
      description: 'Our faculty comprises world-renowned professors and industry leaders dedicated to your success.',
      ctaText: 'View Programs',
      ctaLink: '/services'
    }
  ];

  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with years of practical experience.',
      image: '/images/hero_lecture_hall_1765725170900.png'
    },
    {
      icon: Users,
      title: 'Interactive Learning',
      description: 'Engage with peers and instructors in real-time collaborative sessions.',
      image: '/images/dept_business_1765725208181.png'
    },
    {
      icon: Award,
      title: 'Certified Programs',
      description: 'Earn recognized certifications that boost your career prospects.',
      image: '/images/hero_campus_modern_1765725127334.png'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Access resources and support to accelerate your professional journey.',
      image: '/images/dept_business_1765725208181.png'
    },
    {
      icon: Library,
      title: 'Rich Resources',
      description: 'Comprehensive study materials, videos, and practice exercises.',
      image: '/images/hero_library_study_1765725147090.png'
    },
    {
      icon: Clock,
      title: 'Flexible Schedule',
      description: 'Learn at your own pace with 24/7 access to course content.',
      image: '/images/dept_computer_science_1765725187474.png'
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
      {/* Hero Carousel */}
      <Carousel slides={slides} />

      {/* Stats Section */}
      <section className="py-20 bg-white relative -mt-20 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 bg-white rounded-xl shadow-xl p-8 border border-gray-100">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center p-4"
              >
                <stat.icon className="w-10 h-10 mx-auto mb-3 text-blue-600" />
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-500 font-medium text-sm uppercase tracking-wide">{stat.label}</div>
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
                className="group rounded-xl bg-white border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300"
              >
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={feature.image} 
                    alt={feature.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="p-2 bg-blue-600 rounded-lg inline-flex mb-2">
                      <feature.icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-bold mb-3 text-gray-900 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-blue-900 text-white relative overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="/images/hero_library_study_1765725147090.png" 
            alt="Background" 
            className="w-full h-full object-cover opacity-10"
          />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
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
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img 
                  src="/images/hero_campus_modern_1765725127334.png" 
                  alt="Campus Life" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 to-transparent flex items-end p-8">
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-2">Ready to Begin?</h3>
                    <p className="text-blue-100 mb-6">Join our community of learners today</p>
                    <Link
                      to="/register"
                      className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-900 rounded-lg font-bold hover:bg-blue-50 transition-all duration-300"
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
            
            <Link
              to="/blog"
              className="px-8 py-4 bg-white text-blue-600 border-2 border-blue-600 rounded font-semibold text-lg hover:bg-blue-50 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              Read Our Blog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
