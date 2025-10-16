import { Link } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      {/* Background Images */}
      <div className="hero-background">
        <div className="hero-bg-image"></div>
        <div className="hero-overlay"></div>
      </div>
      
      <div className="hero-container">
        <div className="hero-content">
          {/* Restaurant Name */}
          <h1 className="hero-title">
            Sagar Garrie
          </h1>
          
          {/* Tagline */}
          <p className="hero-tagline">
            Authentic Flavors, Unforgettable Experiences
          </p>
          
          {/* Subtitle */}
          <p className="hero-subtitle">
            Discover the finest culinary traditions crafted with passion and served with love. 
            Join us for an extraordinary dining experience that will delight your senses.
          </p>
          
          {/* CTA Buttons */}
          <div className="hero-buttons">
            <Link
              to="/book-table"
              className="btn btn-primary hero-btn-primary"
            >
              Book a Table
            </Link>
            
            <Link
              to="/menu"
              className="btn btn-secondary hero-btn-secondary"
            >
              View Menu
            </Link>
          </div>
          
          {/* Decorative Elements */}
          <div className="hero-features">
            <div className="hero-feature">
              <svg className="hero-feature-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="hero-feature-text">Premium Location</span>
            </div>
            
            <div className="hero-feature">
              <svg className="hero-feature-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span className="hero-feature-text">Made with Love</span>
            </div>
            
            <div className="hero-feature">
              <svg className="hero-feature-icon" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="hero-feature-text">Quality Assured</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="hero-scroll">
        <svg className="hero-scroll-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};

export default Hero;
