import { Link } from 'wouter';

const Footer = () => {
  return (
    <footer className="text-white relative overflow-hidden">
      {/* Wave pattern at top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden">
        <svg className="relative block w-full h-10 md:h-16 transform rotate-180" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C172,20,295,50,321.39,56.44Z" 
            className="fill-white"
          />
        </svg>
      </div>
      
      {/* Gradient background with animation */}
      <div className="bg-gradient-to-r from-[#57c84d] to-[#83d475] pt-20 pb-8 relative z-10">
        {/* Animated background elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        </div>
        
        {/* Floating decorative icons */}
        <div className="absolute top-20 right-10 text-white/10 text-5xl">
          <i className="ri-leaf-line"></i>
        </div>
        <div className="absolute bottom-20 left-10 text-white/10 text-4xl">
          <i className="ri-calendar-2-line"></i>
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="md:col-span-4">
              <div className="flex items-center space-x-3 mb-5 group">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300">
                  <i className="ri-leaf-line text-2xl text-white"></i>
                </div>
                <div>
                  <span className="text-2xl font-bold font-poppins block">QuikNepal</span>
                  <span className="text-white/70 text-xs">Your Nepali Information Hub</span>
                </div>
              </div>
              <p className="text-white/90 mb-6 leading-relaxed">
                Your comprehensive resource for essential Nepali information, providing accurate and culturally relevant data for everyday needs.
              </p>
              
              {/* Newsletter subscription */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                <h5 className="font-medium mb-3 text-white flex items-center">
                  <i className="ri-mail-line mr-2"></i> Stay Updated
                </h5>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Your email" 
                    className="bg-white/20 border-0 rounded-l-lg w-full px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-1 focus:ring-white/30"
                  />
                  <button className="bg-white text-primary font-medium px-4 rounded-r-lg hover:bg-white/90 transition-colors">
                    <i className="ri-send-plane-fill"></i>
                  </button>
                </div>
              </div>
            </div>
            
            {/* Quick Links */}
            <div className="md:col-span-2 md:col-start-6">
              <h4 className="text-lg font-semibold mb-5 flex items-center">
                <i className="ri-links-line mr-2 p-1.5 bg-white/10 rounded-md"></i>
                Quick Links
              </h4>
              <ul className="space-y-3">
                {[
                  { path: '/', label: 'Home' },
                  { path: '/calendar', label: 'Calendar' },
                  { path: '/nepali-date-converter', label: 'Date Converter' },
                  { path: '/kalimati-vegetable-price', label: 'Vegetable Rates' }
                ].map((item, i) => (
                  <li key={i}>
                    <Link 
                      href={item.path} 
                      className="text-white/80 hover:text-white transition-colors flex items-center group"
                    >
                      <i className="ri-arrow-right-s-line mr-1 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Resources */}
            <div className="md:col-span-2">
              <h4 className="text-lg font-semibold mb-5 flex items-center">
                <i className="ri-award-line mr-2 p-1.5 bg-white/10 rounded-md"></i>
                Resources
              </h4>
              <ul className="space-y-3">
                {[
                  { path: '/gold-and-silver-in-nepal', label: 'Metal Prices' },
                  { path: '/nepali-rashifal', label: 'Rashifal' },
                  { path: '/foreign-currency-exchange', label: 'Forex Rates' },
                  { path: '/api', label: 'API Access' }
                ].map((item, i) => (
                  <li key={i}>
                    <Link 
                      href={item.path} 
                      className="text-white/80 hover:text-white transition-colors flex items-center group"
                    >
                      <i className="ri-arrow-right-s-line mr-1 opacity-0 group-hover:opacity-100 transition-opacity"></i>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            {/* Connect With Us */}
            <div className="md:col-span-3">
              <h4 className="text-lg font-semibold mb-5 flex items-center">
                <i className="ri-chat-smile-2-line mr-2 p-1.5 bg-white/10 rounded-md"></i>
                Connect With Us
              </h4>
              
              <div className="flex space-x-3 mb-5">
                {[
                  { platform: 'facebook', url: 'https://facebook.com/quiknepal' },
                  { platform: 'twitter', url: 'https://twitter.com/quiknepal' },
                  { platform: 'instagram', url: 'https://instagram.com/quiknepal' }
                ].map((item, i) => (
                  <a 
                    key={i}
                    href={item.url} 
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.platform}
                    className="w-11 h-11 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors hover:scale-110 transform duration-300 border border-white/10"
                  >
                    <i className={`ri-${item.platform}-fill text-lg`}></i>
                  </a>
                ))}
              </div>
              
              <p className="text-white/90 flex items-center mb-2">
                <i className="ri-mail-line mr-2"></i>
                <span>info@quiknepal.com</span>
              </p>
              
              <p className="text-white/90 flex items-center">
                <i className="ri-map-pin-line mr-2"></i>
                <span>Kathmandu, Nepal</span>
              </p>
            </div>
          </div>
          
          {/* Footer bottom */}
          <div className="border-t border-white/20 pt-6 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/80 mb-4 md:mb-0">
              © {new Date().getFullYear()} QuikNepal. All rights reserved.
            </p>
            
            <div className="flex space-x-5 text-white/70 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">FAQ</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
