import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Bot, Sparkles, FileText, Briefcase } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    {
      name: 'Products',
      dropdown: true,
      items: [
        {
          name: 'AI Recruiter',
          path: '/hrAutomation',
          icon: <Bot size={18} />,
          color: '#3B82F6',
          description: 'AI Recruiter helps you optimize and save your time assessing Applicants'
        },
        {
          name: 'CRM',
          path: '/crmlanding',
          icon: <Briefcase size={18} />,
          color: '#10B981',
          description: 'CRM helps you manage leads, deals, and customer relationships'
        },
        {
          name: 'Productivity',
          path: '/productivity',
          icon: <Sparkles size={18} />,
          color: '#F59E0B',
          description: 'Productivity boosts team efficiency with smart workflows'
        },
        {
          name: 'HRMS',
          path: '/human',
          icon: <FileText size={18} />,
          color: '#8B5CF6',
          description: 'HRMS manages payroll, attendance, leave, and employee lifecycle'
        }
      ]
    },
    { name: 'Pricing', path: '/pricing' },
    { name: 'Contact', path: '/contactpage' }
  ];

  const handleNavigation = (path) => {
    if (path.startsWith('#')) {
      const element = document.querySelector(path);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(path);
    }
    setIsOpen(false);
    setActiveDropdown(null);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white ${isScrolled ? 'shadow-lg py-2' : 'py-4'
        }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={() => setIsOpen(false)}
          >
            <img
              src="/assets/images/leviticalogo_removebg.png"
              alt="Logo"
              className="h-12 w-auto"
            />
          </Link>

          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link, index) => (
              <div key={index} className="relative">

                {link.dropdown ? (
                  <button
                    onClick={() =>
                      setActiveDropdown(activeDropdown === index ? null : index)
                    }
                    className="px-4 py-2 rounded-lg font-medium text-lg transition-all duration-300 flex items-center space-x-1 text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    <span>{link.name}</span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${activeDropdown === index ? "rotate-180" : ""
                        }`}
                    />
                  </button>
                ) : (
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className="px-4 py-2 rounded-lg font-medium text-lg transition-all duration-300 inline-block text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                  >
                    {link.name}
                  </button>
                )}

                {/* Dropdown Menu */}
                {link.dropdown && (
                  <div
                    className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl py-2 border border-gray-100 transform transition-all duration-300 origin-top
          ${activeDropdown === index
                        ? "opacity-100 scale-100 translate-y-0"
                        : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                      }`}
                  >
                    {link.items.map((item, itemIndex) => (
                      <button
                        key={itemIndex}
                        onClick={() => handleNavigation(item.path)}
                        className="flex items-start w-full text-left px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 group"
                      >
                        <div
                          className="p-1.5 rounded-lg mr-3 mt-1"
                          style={{ backgroundColor: `${item.color}15` }}
                        >
                          <span style={{ color: item.color }}>{item.icon}</span>
                        </div>

                        <div className="flex-1">
                          <span className="font-medium text-lg block">
                            {item.name}
                          </span>
                          <span className="text-sm text-gray-500 block leading-tight">
                            {item.description}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Desktop Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transform hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Sign up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors duration-300 text-gray-700 hover:bg-gray-100`}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <div
          className={`lg:hidden fixed inset-x-0 top-[72px] transition-all duration-300 ease-in-out bg-white/95 backdrop-blur-md shadow-md ${isOpen
              ? 'opacity-100 visible translate-y-0'
              : 'opacity-0 invisible -translate-y-4'
            }`}
        >
          <div className="container mx-auto px-4 py-4">
            {navLinks.map((link, index) => (
              <div key={index} className="mb-2">
                {link.dropdown ? (
                  <>
                    <button
                      onClick={() => setActiveDropdown(activeDropdown === index ? null : index)}
                      className="flex items-center justify-between w-full px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                    >
                      <span>{link.name}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${activeDropdown === index ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {/* Mobile Dropdown with descriptions */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${activeDropdown === index ? 'max-h-96 opacity-100 mt-2' : 'max-h-0 opacity-0'
                        }`}
                    >
                      {link.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          onClick={() => handleNavigation(item.path)}
                          className="flex items-start w-full text-left px-8 py-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                        >
                          <div
                            className="p-1 rounded-lg mr-3 mt-0.5"
                            style={{ backgroundColor: `${item.color}15` }}
                          >
                            <span style={{ color: item.color }}>
                              {item.icon}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium block">{item.name}</span>
                            <span className="text-xs text-gray-500 block">{item.description}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => handleNavigation(link.path)}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200"
                  >
                    {link.name}
                  </button>
                )}
              </div>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  navigate('/login');
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-center text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors duration-200 mb-2"
              >
                Log in
              </button>
              <button
                onClick={() => {
                  navigate('/signup');
                  setIsOpen(false);
                }}
                className="block w-full px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add styles for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
       
        .animate-fade-in {
          animation: fadeIn 0.2s ease-out forwards;
        }  
      `}</style>
    </nav>
  );
};

export default Navbar;