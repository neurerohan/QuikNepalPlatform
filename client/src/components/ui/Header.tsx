import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [location] = useLocation();

  // Handle scroll event to change header appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Helper function to check if a link is active
  const isActive = (path: string) => {
    return location === path;
  };

  // Social media links
  const socialLinks = [
    { icon: 'ri-facebook-fill', label: 'Facebook', url: 'https://facebook.com/quiknepal' },
    { icon: 'ri-tiktok-fill', label: 'TikTok', url: 'https://tiktok.com/@quiknepal' },
    { icon: 'ri-twitter-x-fill', label: 'Twitter', url: 'https://twitter.com/quiknepal' }
  ];

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${
      isScrolled ? 'shadow-md backdrop-blur-lg bg-white/95' : 'bg-gradient-to-r from-[#57c84d] to-[#83d475]'
    }`}>
      {/* Top gradient border */}
      <div className="h-1 bg-gradient-to-r from-[#57c84d] via-[#65cc56] to-[#83d475] bg-[length:200%_100%] animate-gradient"></div>
      
      <div className="container mx-auto px-4 py-4 flex flex-wrap items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-3 group">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${
            isScrolled ? 'bg-gradient-to-r from-[#57c84d] to-[#83d475] shadow-sm' : 'bg-white/20 backdrop-blur-sm'
          }`}>
            <i className={`ri-leaf-line text-lg ${isScrolled ? 'text-white' : 'text-white'}`}></i>
          </div>
          <span className={`text-xl font-bold font-poppins transition-colors duration-300 group-hover:translate-x-0.5 transform ${
            isScrolled ? 'text-primary' : 'text-white'
          }`}>QuikNepal</span>
        </Link>
        
        {/* Center navigation for desktop */}
        <nav className="hidden md:flex items-center space-x-1 absolute left-1/2 transform -translate-x-1/2">
          {[
            { path: '/', label: '', icon: 'ri-home-5-line' }, // Home icon only
            { path: '/calendar', label: 'Calendar' },
            { path: '/nepali-date-converter', label: 'Converter' },
            { path: '/kalimati-vegetable-price', label: 'Vegetables' },
            { path: '/gold-and-silver-in-nepal', label: 'Metals' },
            { path: '/nepali-rashifal', label: 'Rashifal' },
            { path: '/foreign-currency-exchange', label: 'Forex' }
          ].map((item) => (
            <Link 
              key={item.path}
              href={item.path} 
              className={`font-medium px-4 py-2 rounded-lg transition-all duration-300 mx-0.5 flex items-center ${
                isActive(item.path)
                  ? isScrolled 
                    ? 'bg-primary-light/10 text-primary font-semibold' 
                    : 'bg-white/20 text-white font-semibold backdrop-blur-sm'
                  : isScrolled
                    ? 'text-neutral hover:bg-gray-50 hover:text-primary' 
                    : 'text-white/90 hover:text-white hover:bg-white/10'
              }`}
              aria-label={item.label || 'Home'}
            >
              {item.icon && <i className={`${item.icon} ${item.label ? 'mr-2' : ''}`}></i>}
              {item.label}
            </Link>
          ))}
        </nav>
        
        {/* Social links (desktop) */}
        <div className="hidden md:flex items-center space-x-2">
          {socialLinks.map((social, index) => (
            <a 
              key={index} 
              href={social.url} 
              aria-label={social.label}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                isScrolled 
                ? 'bg-primary text-white hover:bg-primary-dark' 
                : 'bg-white/20 text-white hover:bg-white/30'
              }`}
            >
              <i className={social.icon}></i>
            </a>
          ))}
        </div>
        
        {/* Mobile menu button */}
        <button 
          aria-label="Toggle Menu" 
          className={`md:hidden p-2.5 rounded-lg transition-colors duration-300 ${
            isScrolled ? 'text-neutral hover:bg-gray-100' : 'text-white hover:bg-white/10'
          }`}
          onClick={toggleMobileMenu}
        >
          <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl`}></i>
        </button>
      </div>
      
      {/* Mobile Menu - Enhanced with cooler Gen Z style */}
      <div 
        className={`${mobileMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'} 
          md:hidden w-full overflow-hidden transition-all duration-500 ease-smooth-out backdrop-blur-md ${
            isScrolled ? 'bg-white/95 border-t border-gray-100' : 'bg-gradient-to-r from-[#57c84d]/95 to-[#83d475]/95'
          }`}
      >
        <div className="container mx-auto px-4 pb-6 pt-4">
          {/* Mobile nav items with cool animations */}
          <nav className="grid grid-cols-2 gap-3 mb-6">
            {[
              { path: '/', label: 'Home', icon: 'ri-home-5-line' },
              { path: '/calendar', label: 'Calendar', icon: 'ri-calendar-line' },
              { path: '/nepali-date-converter', label: 'Converter', icon: 'ri-arrow-left-right-line' },
              { path: '/kalimati-vegetable-price', label: 'Vegetables', icon: 'ri-shopping-basket-line' },
              { path: '/gold-and-silver-in-nepal', label: 'Metals', icon: 'ri-coins-line' },
              { path: '/nepali-rashifal', label: 'Rashifal', icon: 'ri-star-line' },
              { path: '/foreign-currency-exchange', label: 'Forex', icon: 'ri-exchange-dollar-line' }
            ].map((item, index) => (
              <Link 
                key={item.path}
                href={item.path} 
                style={{ animationDelay: `${index * 0.05}s` }}
                className={`font-medium p-3 rounded-xl transition-all duration-300 flex items-center gap-3 
                  ${isActive(item.path)
                    ? isScrolled 
                      ? 'bg-primary text-white font-semibold shadow-md' 
                      : 'bg-white/20 text-white font-semibold backdrop-blur-sm'
                    : isScrolled
                      ? 'bg-gray-50 text-neutral hover:bg-gray-100 hover:text-primary' 
                      : 'bg-white/10 text-white/90 hover:bg-white/20 hover:text-white'
                  }
                  ${mobileMenuOpen ? 'animate-slideInUp' : ''}
                `}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isActive(item.path) 
                    ? isScrolled 
                      ? 'bg-white/20'
                      : 'bg-white/30' 
                    : isScrolled 
                      ? 'bg-primary/10'
                      : 'bg-white/10'
                }`}>
                  <i className={`${item.icon} text-lg`}></i>
                </div>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          {/* Social media in mobile view */}
          <div className="mt-4 flex justify-center space-x-4">
            <p className={`text-sm ${isScrolled ? 'text-gray-500' : 'text-white/80'}`}>
              Follow us:
            </p>
            {socialLinks.map((social, index) => (
              <a 
                key={index} 
                href={social.url} 
                aria-label={social.label}
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 ${
                  isScrolled 
                  ? 'bg-primary text-white hover:bg-primary-dark' 
                  : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <i className={social.icon}></i>
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
