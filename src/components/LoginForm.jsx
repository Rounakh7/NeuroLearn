import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useTheme } from "../contexts/ThemeContext";

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { signInEmail, signUpEmail, signInGoogle } = useAuth();
  const { theme, darkMode } = useTheme();

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!email || !password) {
      return setError("Please fill in all fields");
    }

    try {
      setError("");
      setLoading(true);
      
      if (isSignUp) {
        await signUpEmail(email, password);
      } else {
        await signInEmail(email, password);
      }
    } catch (error) {
      setError("Failed to " + (isSignUp ? "create account" : "sign in"));
      console.error(error);
    }
    
    setLoading(false);
  }

  async function handleGoogleSignIn() {
    try {
      setError("");
      setLoading(true);
      await signInGoogle();
    } catch (error) {
      setError("Failed to sign in with Google");
      console.error(error);
    }
    setLoading(false);
  }

  return (
    <div className={`min-vh-100 d-flex align-items-center ${theme.bg}`}>
      {/* Background Pattern */}
      <div className="position-absolute w-100 h-100 overflow-hidden">
        <div className="geometric-pattern"></div>
      </div>

      <div className="container position-relative">
        <div className="row justify-content-center">
          <div className="col-xl-10 col-lg-12">
            <div className="row g-0 shadow-lg rounded-4 overflow-hidden modern-card">
              
              {/* Left Panel - Brand & Features */}
              <div className="col-lg-6 d-none d-lg-flex">
                <div className="brand-panel p-5 d-flex flex-column justify-content-center">
                  <div className="brand-header mb-5">
                    <div className="brand-logo mb-3">
                      <div className="logo-circle">
                        <span className="logo-icon">🧠</span>
                      </div>
                      <div className="brand-text">
                        <h1 className="brand-name mb-1">CogniBridge</h1>
                        <p className="brand-tagline mb-0">ABA Therapy Platform</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="brand-content">
                    <h2 className="brand-title mb-4">
                      Empowering Growth Through
                      <span className="highlight-text"> Evidence-Based Therapy</span>
                    </h2>
                    
                    <p className="brand-description mb-5">
                      Transform lives with our comprehensive ABA therapy platform, 
                      designed for individuals with autism and their support networks.
                    </p>
                    
                    <div className="feature-grid">
                      <div className="feature-card">
                        <div className="feature-icon-wrapper">
                          <i className="fas fa-brain feature-icon"></i>
                        </div>
                        <div className="feature-content">
                          <h6 className="feature-title">Personalized Learning</h6>
                          <p className="feature-desc">Tailored programs for individual needs</p>
                        </div>
                      </div>
                      
                      <div className="feature-card">
                        <div className="feature-icon-wrapper">
                          <i className="fas fa-chart-line feature-icon"></i>
                        </div>
                        <div className="feature-content">
                          <h6 className="feature-title">Progress Tracking</h6>
                          <p className="feature-desc">Real-time analytics and insights</p>
                        </div>
                      </div>
                      
                      <div className="feature-card">
                        <div className="feature-icon-wrapper">
                          <i className="fas fa-users feature-icon"></i>
                        </div>
                        <div className="feature-content">
                          <h6 className="feature-title">Family Support</h6>
                          <p className="feature-desc">Collaborative care approach</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Panel - Login Form */}
              <div className="col-lg-6">
                <div className={`login-panel p-5 h-100 d-flex flex-column justify-content-center ${theme.bgSecondary}`}>
                  
                  {/* Mobile Brand Header */}
                  <div className="mobile-brand d-lg-none text-center mb-4">
                    <div className="mobile-logo-circle mb-3">
                      <span className="mobile-logo-icon">🧠</span>
                    </div>
                    <h3 className={`mobile-brand-name mb-1 ${theme.text}`}>CogniBridge</h3>
                    <p className={`mobile-brand-tagline ${theme.textMuted}`}>ABA Therapy Platform</p>
                  </div>

                  <div className="form-header text-center mb-4">
                    <h2 className={`form-title mb-2 ${theme.text}`}>
                      {isSignUp ? "Join CogniBridge" : "Welcome Back"}
                    </h2>
                    <p className={`form-subtitle ${theme.textMuted}`}>
                      {isSignUp 
                        ? "Create your account to get started" 
                        : "Sign in to access your dashboard"
                      }
                    </p>
                  </div>

                  {error && (
                    <div className="alert alert-danger modern-alert mb-4" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="modern-form">
                    <div className="form-group mb-4">
                      <label htmlFor="email" className={`form-label modern-label ${theme.text}`}>
                        Email Address
                      </label>
                      <div className="input-wrapper">
                        <i className="fas fa-envelope input-icon"></i>
                        <input
                          type="email"
                          className={`form-control modern-input ${theme.formControl}`}
                          id="email"
                          placeholder="Enter your email address"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group mb-4">
                      <label htmlFor="password" className={`form-label modern-label ${theme.text}`}>
                        Password
                      </label>
                      <div className="input-wrapper">
                        <i className="fas fa-lock input-icon"></i>
                        <input
                          type={showPassword ? "text" : "password"}
                          className={`form-control modern-input ${theme.formControl}`}
                          id="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          className="password-toggle"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                        </button>
                      </div>
                    </div>

                    <button
                      disabled={loading}
                      className="btn modern-btn-primary w-100 mb-4"
                      type="submit"
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          {isSignUp ? "Creating Account..." : "Signing In..."}
                        </>
                      ) : (
                        <>
                          <i className={`fas ${isSignUp ? 'fa-user-plus' : 'fa-sign-in-alt'} me-2`}></i>
                          {isSignUp ? "Create Account" : "Sign In"}
                        </>
                      )}
                    </button>
                  </form>

                  <div className="divider-wrapper mb-4">
                    <div className="divider-line"></div>
                    <span className={`divider-text ${theme.textMuted}`}>or continue with</span>
                    <div className="divider-line"></div>
                  </div>

                  <button
                    disabled={loading}
                    className="btn modern-btn-google w-100 mb-4"
                    onClick={handleGoogleSignIn}
                  >
                    <svg className="google-icon me-2" viewBox="0 0 24 24" width="20" height="20">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </button>

                  <div className="text-center">
                    <button
                      className={`btn btn-link modern-link ${theme.text}`}
                      onClick={() => setIsSignUp(!isSignUp)}
                    >
                      {isSignUp
                        ? "Already have an account? Sign In"
                        : "Don't have an account? Sign Up"}
                    </button>
                  </div>

                  {/* Trust Badges */}
                  <div className="trust-badges mt-4 pt-4">
                    <div className="row text-center g-3">
                      <div className="col-4">
                        <div className="trust-badge">
                          <i className="fas fa-shield-alt trust-icon text-success"></i>
                          <small className={`trust-label ${theme.textMuted}`}>Secure</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="trust-badge">
                          <i className="fas fa-certificate trust-icon text-primary"></i>
                          <small className={`trust-label ${theme.textMuted}`}>Certified</small>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="trust-badge">
                          <i className="fas fa-heart trust-icon text-danger"></i>
                          <small className={`trust-label ${theme.textMuted}`}>Trusted</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern CSS Styles */}
      <style dangerouslySetInnerHTML={{
        __html: `
        /* Geometric Background Pattern */
        .geometric-pattern {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          opacity: 0.05;
        }

        .geometric-pattern::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(circle at 25% 25%, rgba(120, 73, 73, 0.1) 2px, transparent 2px),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 2px, transparent 2px);
          background-size: 50px 50px;
          animation: float 20s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }

        /* Modern Card Design */
        .modern-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 
            0 25px 50px -12px rgba(0, 0, 0, 0.25),
            0 0 0 1px rgba(255, 255, 255, 0.1);
        }

        /* Brand Panel */
        .brand-panel {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .brand-panel::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="50" cy="50" r="1" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>') repeat;
          opacity: 0.3;
        }

        .brand-logo {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .logo-circle {
          width: 60px;
          height: 60px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(10px);
          border: 2px solid rgba(255, 255, 255, 0.3);
        }

        .logo-icon {
          font-size: 1.5rem;
        }

        .brand-name {
          font-size: 2rem;
          font-weight: 700;
          margin: 0;
          background: linear-gradient(45deg, #ffffff, #f8f9fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .brand-tagline {
          font-size: 1.1rem;
          opacity: 0.9;
          margin: 0;
          font-weight: 300;
        }
        `
      }} />
    </div>
  );
}

export default LoginForm;
