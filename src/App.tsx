import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { DesignView } from './components/DesignView';
import { CheckoutPage } from './components/CheckoutPage';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { ImprintPage } from './components/ImprintPage';
import { PrivacyPolicyPage } from './components/PrivacyPolicyPage';
import { TermsOfServicePage } from './components/TermsOfServicePage';
import { AdminPage } from './pages/admin';
import { ErrorDisplay } from './components/ErrorDisplay';
import { SnackbarNotification } from './components/SnackbarNotification';
import { CookieBanner } from './components/CookieBanner';
import { WaitlistModal } from './components/WaitlistModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { WaitlistSection } from './components/WaitlistSection';
import { useAppState } from './hooks/useAppState';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { useDesignCounter } from './store/useDesignCounter';
import { handleDesignGeneration } from './utils/designGeneration';
import { handleCheckoutFlow } from './utils/checkoutHandlers';
import { ga } from './lib/ga';
import { CheckoutForm, OrderSummary } from './types';

function App() {
  const {
    currentView,
    setCurrentView,
    productConfig,
    setProductConfig,
    designs,
    setDesigns,
    currentDesignIndex,
    setCurrentDesignIndex,
    isGenerating,
    setIsGenerating,
    selectedStyle,
    setSelectedStyle,
    generationError,
    setGenerationError,
    showSnackbar,
    setShowSnackbar,
    lastPrompt,
    setLastPrompt,
    orderData,
    setOrderData,
  } = useAppState();

  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
  } = useCart();

  const { toasts, showToast, removeToast } = useToast();
  const { count: designCount, increment: incrementDesignCount, shouldShowWaitlistModal, canGenerate } = useDesignCounter();
  const [showWaitlistModal, setShowWaitlistModal] = React.useState(false);

  // Initialize Google Analytics
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const measurementId = import.meta.env.VITE_GA_ID || import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XRSVNZRSFP';
    
    if (consent === 'accepted' && measurementId) {
      ga.initialize(measurementId);
    }
  }, []);

  // Check for survey completion
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('done') === '1') {
      ga.trackSurveyComplete();
      showToast('Thank you for completing the survey!', 'success');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [showToast]);

  const handleCookieAccept = () => {
    const measurementId = import.meta.env.VITE_GA_ID || import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XRSVNZRSFP';
    if (measurementId) {
      ga.initialize(measurementId);
    }
  };

  const handleCookieDecline = () => {
    // Analytics will not be initialized
    console.log('Analytics tracking declined');
  };


  const handleGenerate = async (prompt: string, styleOverride?: string, referenceImage?: File) => {
    // Check if user can still generate
    if (!canGenerate()) {
      setShowWaitlistModal(true);
      return;
    }

    // Track design generation
    ga.trackDesignGeneration(prompt.length, styleOverride || selectedStyle || undefined);
    
    const newIndex = await handleDesignGeneration(
      prompt,
      styleOverride,
      selectedStyle,
      productConfig,
      setIsGenerating,
      setGenerationError,
      setLastPrompt,
      setDesigns,
      designs,
      referenceImage
    );
    
    if (newIndex >= 0) {
      setCurrentDesignIndex(newIndex);
      incrementDesignCount();
      ga.updateDesignGenerationCount(designCount + 1);
      
      // Check if we should show waitlist modal after 3rd generation
      if (shouldShowWaitlistModal()) {
        // Show modal after a short delay to let the image appear first
        setTimeout(() => {
          setShowWaitlistModal(true);
        }, 1000);
      }
    } else {
      // Track generation error
      ga.trackGenerationError(generationError || 'Unknown error');
    }
  };

  const handleStyleSelect = (styleId: string) => {
    const newStyle = selectedStyle === styleId ? null : styleId;
    setSelectedStyle(newStyle);
    
    // Track style selection
    if (newStyle) {
      ga.trackStyleSelection(styleId, styleId.replace('-', ' '));
    }
  };

  const handleAddToCart = async () => {
    // Show waitlist modal instead of adding to cart
    setShowWaitlistModal(true);
  };

  const handleProceedToCheckout = () => {
    // Show waitlist modal instead of going to checkout
    setShowWaitlistModal(true);
  };

  const handleBackToDesign = () => {
    setCurrentView('design');
  };

  const handleProceedToPayment = async (form: CheckoutForm, orderSummary: OrderSummary) => {
    await handleCheckoutFlow(
      form,
      orderSummary,
      cartItems,
      setOrderData,
      clearCart,
      setCurrentView
    );
  };

  const handleBackToHome = () => {
    setCurrentView('design');
    setOrderData(null);
  };

  const handleLogoClick = () => {
    setCurrentView('design');
    setOrderData(null);
  };

  const handleImprintClick = () => {
    setCurrentView('imprint');
  };

  const handleBackFromImprint = () => {
    setCurrentView('design');
  };

  const handlePrivacyClick = () => {
    setCurrentView('privacy');
  };

  const handleBackFromPrivacy = () => {
    setCurrentView('design');
  };

  const handleTermsClick = () => {
    setCurrentView('terms');
  };

  const handleBackFromTerms = () => {
    setCurrentView('design');
  };

  const handleAdminClick = () => {
    setCurrentView('admin');
  };

  const handleBackFromAdmin = () => {
    setCurrentView('design');
  };

  const handleFeatureClick = () => {
    // Show waitlist modal for non-functional features
    setShowWaitlistModal(true);
  };

  const handleImageViewLarge = () => {
    ga.trackImageViewLarge();
  };

  const handleShowWaitlistModal = () => {
    setShowWaitlistModal(true);
  };

  // Common header props
  const headerProps = {
    cartCount: getCartCount(),
    onCartClick: handleProceedToCheckout,
    onLogoClick: handleLogoClick,
    onFeatureClick: handleFeatureClick,
  };

  // Common footer props
  const footerProps = {
    onImprintClick: handleImprintClick,
    onAdminClick: handleAdminClick,
    onPrivacyClick: handlePrivacyClick,
    onTermsClick: handleTermsClick,
    onFeatureClick: handleFeatureClick,
  };

  // Render based on current view
  if (currentView === 'admin') {
    return (
      <div className="min-h-screen bg-white font-source-sans">
        <AdminPage onBack={handleBackFromAdmin} />
      </div>
    );
  }

  if (currentView === 'imprint') {
    return (
      <div className="min-h-screen bg-white font-source-sans">
        <Header {...headerProps} />
        <ImprintPage onBack={handleBackFromImprint} />
      </div>
    );
  }

  if (currentView === 'privacy') {
    return (
      <div className="min-h-screen bg-white font-source-sans">
        <Header {...headerProps} />
        <PrivacyPolicyPage onBack={handleBackFromPrivacy} />
      </div>
    );
  }

  if (currentView === 'terms') {
    return (
      <div className="min-h-screen bg-white font-source-sans">
        <Header {...headerProps} />
        <TermsOfServicePage onBack={handleBackFromTerms} />
      </div>
    );
  }

  if (currentView === 'checkout') {
    return (
      <div className="min-h-screen bg-white font-source-sans">
        <Header {...headerProps} />
        <CheckoutPage
          cartItems={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onBack={handleBackToDesign}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
    );
  }

  if (currentView === 'success' && orderData) {
    return (
      <div className="min-h-screen bg-white font-source-sans">
        <Header {...headerProps} />
        <PaymentSuccessPage
          orderNumber={orderData.orderNumber}
          form={orderData.form}
          orderSummary={orderData.orderSummary}
          onBackToHome={handleBackToHome}
        />
      </div>
    );
  }

  // Default design view
  return (
    <div className="min-h-screen bg-white font-source-sans">
      <Header {...headerProps} />
      
      <DesignView
        productConfig={productConfig}
        onConfigChange={setProductConfig}
        onAddToCart={handleAddToCart}
        designs={designs}
        currentDesignIndex={currentDesignIndex}
        onDesignChange={(index) => {
          setCurrentDesignIndex(index);
          ga.trackSliderNavigation(index);
        }}
        isGenerating={isGenerating}
        lastPrompt={lastPrompt}
        selectedStyle={selectedStyle}
        onGenerate={handleGenerate}
        onStyleSelect={handleStyleSelect}
        onImageViewLarge={handleImageViewLarge}
        canGenerate={canGenerate()}
        onShowWaitlistModal={handleShowWaitlistModal}
      />

      {/* Waitlist Section - Only show on design view */}
      <WaitlistSection />

      <ErrorDisplay
        generationError={generationError}
        onClose={() => setGenerationError(null)}
      />

      <SnackbarNotification
        show={showSnackbar}
        onClose={() => setShowSnackbar(false)}
      />

      <Footer {...footerProps} />

      {/* Cookie Banner */}
      <CookieBanner
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />

      {/* Waitlist Modal */}
      <WaitlistModal
        isOpen={showWaitlistModal}
        onClose={() => setShowWaitlistModal(false)}
      />

      {/* Toast Notifications */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}

export default App;