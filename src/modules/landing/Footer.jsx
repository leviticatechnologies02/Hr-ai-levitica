import React from "react";
import { FiMail, FiLinkedin, FiTwitter, FiInstagram, FiSend, FiChevronRight } from 'react-icons/fi';
import { Link } from "react-router-dom";

function Footer() {
  const footerLinks = {
    discover: ['Products', 'Trials', 'Services', 'Industries', 'Case studies', 'Financing'],
    connect: ['Engage Consulting', 'Support', 'Find a partner', 'Developers', 'Business Partners'],
    about: ['Careers', 'Latest news', 'Investor relations', 'Corporate responsibility', 'About us'],
    follow: [
      { name: 'LinkedIn', icon: FiLinkedin, url: '#' },
      { name: 'X', icon: FiTwitter, url: '#' },
      { name: 'Instagram', icon: FiInstagram, url: '#' },
      { name: 'Subscription Center', icon: null, url: '#' }
    ]
  };

  const bottomLinks = ['Contact', 'Privacy', 'Terms of use', 'Accessibility', 'Cookie Preferences'];

  return (
    <footer className="bg-darkmode text-white pt-12 pb-6 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <div className="mb-4">
              <img 
                src="/assets/images/leviticalogo.png" 
                alt="Levitica Logo" 
                className="h-14 w-auto rounded-xl mb-3"
              />
              <p className="text-white text-sm leading-relaxed">
                Automate repetitive recruiting tasks and focus on great conversations. 
                Our recruiter dashboard gives you full visibility from job posting to offer.
              </p>
            </div>
          </div>

          {/* Discover Links */}
          <div>
            <h6 className="font-semibold text-white mb-4 text-lg tracking-wider">Discover</h6>
            <ul className="space-y-2 pl-0 mb-0 list-none">
              {footerLinks.discover.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to="#"
                    className="text-white hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block no-underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect with us Links */}
          <div>
            <h6 className="font-semibold text-white mb-4 text-lg tracking-wider">Connect with us</h6>
            <ul className="space-y-2 pl-0 mb-0 list-none">
              {footerLinks.connect.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to="#"
                    className="text-white hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block no-underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h6 className="font-semibold text-white mb-4 text-lg tracking-wider">About</h6>
            <ul className="space-y-2 pl-0 mb-0 list-none">
              {footerLinks.about.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to="#"
                    className="text-white hover:text-primary text-sm transition-all duration-300 hover:translate-x-1 inline-block no-underline"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow Links */}
          <div>
            <h6 className="font-semibold text-white mb-4 text-lg tracking-wider">Follow</h6>
            <ul className="space-y-2 pl-0 mb-0 list-none">
              {footerLinks.follow.map((item, idx) => (
                <li key={idx}>
                  <Link
                    to={item.url}
                    className="text-white hover:text-primary  text-sm transition-all duration-300 hover:translate-x-1 inline-flex items-center gap-2 no-underline"
                  >
                    {item.icon && <item.icon className="h-4 w-4" />}
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-dark_border/30 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white text-sm">
              © 2025 AI Recruitment. All Rights Reserved
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {bottomLinks.map((link, idx) => (
                <Link
                  key={idx}
                  to="#"
                  className="text-white hover:text-primary text-sm transition-colors duration-300 no-underline"
                >
                  {link}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;