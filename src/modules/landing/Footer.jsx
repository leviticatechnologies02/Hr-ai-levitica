import React from "react";

function Footer() {
  return (
    <>
      {/* Footer */}
      <footer className='py-4 py-md-5 border-top text-white px-3' style={{ background: '#1a1a1a' }}>
        <div className='container'>
          <div className='row g-4 g-md-5 mb-4 mb-md-5'>

            {/* Logo and Description */}
            <div className='col-lg-3 col-md-6'>
              <div className='mb-4'>
                <h5 className='fw-bold text-white mb-3'>
                  <span style={{ color: '#3B82F6' }}>AI</span> Recruitment
                </h5>
                <p className='text-white small lh-lg'>
                  Automate repetitive recruiting tasks and focus on great conversations. Our recruiter dashboard gives you full visibility from job posting to offer.
                </p>
              </div>

              <div className='d-flex gap-2'>
                <input
                  type='email'
                  className='form-control form-control-sm'
                  placeholder='Enter your email'
                  style={{ backgroundColor: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                />

                <button
                  className='btn btn-primary btn-sm'
                  style={{
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(13, 110, 253, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Subscribe
                </button>
              </div>
            </div>

            {/* Discover */}
            <div className='col-lg-2 col-md-6'>
              <h6 className='fw-bold text-white mb-3'>Discover</h6>
              <ul className='list-unstyled'>
                {['Products', 'Trials', 'Services', 'Industries', 'Case studies', 'Financing'].map((item, idx) => (
                  <li key={idx} className='mb-2'>
                    <a
                      href='#'
                      className='text-white text-decoration-none small'
                      style={{
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Connect with us */}
            <div className='col-lg-2 col-md-6'>
              <h6 className='fw-bold text-white mb-3'>Connect with us</h6>
              <ul className='list-unstyled'>
                {['Engage Consulting', 'Support', 'Find a partner', 'Developers', 'Business Partners'].map((item, idx) => (
                  <li key={idx} className='mb-2'>
                    <a
                      href='#'
                      className='text-white text-decoration-none small'
                      style={{
                        transition: 'all 0.3s ease',
                        display: 'inline-block'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.color = '#3B82F6';
                        e.currentTarget.style.transform = 'translateX(5px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.color = 'white';
                        e.currentTarget.style.transform = 'translateX(0)';
                      }}
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learn about */}
            <div className='col-lg-2 col-md-6'>
              <h6 className='fw-bold text-white mb-3'>Learn about</h6>
              <ul className='list-unstyled'>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Artificial Intelligence</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Machine learning</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Generative AI</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Responsible AI</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Cybersecurity</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Business analytics</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Quantum computing</a></li>
              </ul>
            </div>

            {/* About */}
            <div className='col-lg-2 col-md-6'>
              <h6 className='fw-bold text-white mb-3'>About</h6>
              <ul className='list-unstyled'>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Careers</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Latest news</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Investor relations</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Corporate responsibility</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>About us</a></li>
              </ul>
            </div>

            {/* Follow */}
            <div className='col-lg-1 col-md-6'>
              <h6 className='fw-bold text-white mb-3'>Follow</h6>
              <ul className='list-unstyled'>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>LinkedIn</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>X</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Instagram</a></li>
                <li className='mb-2'><a href='#' className='text-white text-decoration-none small'>Subscription Center</a></li>
              </ul>
            </div>

          </div>

          {/* Footer Bottom */}
          <div className='border-top pt-4' style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
            <div className='row align-items-center'>
              <div className='col-md-6'>
                <p className='text-white small mb-0'>© 2025 AI Recruitment. All Rights Reserved</p>
              </div>

              <div className='col-md-6 d-flex justify-content-md-end gap-3 mt-3 mt-md-0'>
                <a href='#' className='text-white text-decoration-none small'>Contact</a>
                <a href='#' className='text-white text-decoration-none small'>Privacy</a>
                <a href='#' className='text-white text-decoration-none small'>Terms of use</a>
                <a href='#' className='text-white text-decoration-none small'>Accessibility</a>
                <a href='#' className='text-white text-decoration-none small'>Cookie Preferences</a>
              </div>
            </div>
          </div>

        </div>
      </footer>
    </>
  );
}

export default Footer;