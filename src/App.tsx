import React, { useEffect } from 'react';
import { Header } from './components/Header';
import { DesignView } from './components/DesignView';
import { CheckoutPage } from './components/CheckoutPage';
import { PaymentSuccessPage } from './components/PaymentSuccessPage';
import { ImprintPage } from './components/ImprintPage';
import { AdminPage } from './pages/admin';
import { ErrorDisplay } from './components/ErrorDisplay';
import { SnackbarNotification } from './components/SnackbarNotification';
import { CookieBanner } from './components/CookieBanner';
import { BetaGateModal } from './components/BetaGateModal';
import { Toast } from './components/Toast';
import { Footer } from './components/Footer';
import { WaitlistSection } from './components/WaitlistSection';
import { useAppState } from './hooks/useAppState';
import { useCart } from './hooks/useCart';
import { useToast } from './hooks/useToast';
import { useFeature } from './store/useFeature';
import { useDesignCounter } from './store/useDesignCounter';
import { handleDesignGeneration } from './utils/designGeneration';
import { handleAddToCartLogic } from './utils/cartHandlers';
import { handleCheckoutFlow } from './utils/checkoutHandlers';
import { ga } from './lib/ga';

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
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartCount,
  } = useCart();

  const { toasts, showToast, removeToast } = useToast();
  const betaGateEnabled = useFeature('betaGate');
  const { count: designCount, increment: incrementDesignCount } = useDesignCounter();
  const [showBetaGate, setShowBetaGate] = React.useState(false);

  // Initialize Google Analytics
  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    
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
    const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
    if (measurementId) {
      ga.initialize(measurementId);
    }
  };

  const handleCookieDecline = () => {
    // Analytics will not be initialized
    console.log('Analytics tracking declined');
  };

  const scrollToWaitlist = () => {
    const waitlistSection = document.getElementById('waitlist-section');
    if (waitlistSection) {
      waitlistSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleGenerate = async (prompt: string, styleOverride?: string, referenceImage?: File) => {
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
      
      // Check if we should show beta gate modal
      if (betaGateEnabled && designCount + 1 >= 3) {
        setShowBetaGate(true);
      }
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
    // Scroll to waitlist section instead of adding to cart
    scrollToWaitlist();
  };

  const handleProceedToCheckout = () => {
    // Scroll to waitlist section instead of going to checkout
    scrollToWaitlist();
  };

  const handleBackToDesign = () => {
    setCurrentView('design');
  };

  const handleProceedToPayment = async (form: any, orderSummary: any) => {
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

  const handleAdminClick = () => {
    setCurrentView('admin');
  };

  const handleBackFromAdmin = () => {
    setCurrentView('design');
  };

  const handleBetaGateContinue = () => {
    // Allow user to continue with their action
    if (cartItems.length === 0) {
      // They were trying to add to cart
      handleAddToCartLogic(
        designs,
        currentDesignIndex,
        productConfig,
        selectedStyle,
        addToCart,
        setShowSnackbar,
        setDesigns
      );
    }
  };

  // Common header props
  const headerProps = {
    cartCount: getCartCount(),
    onCartClick: handleProceedToCheckout,
    onLogoClick: handleLogoClick,
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

      <Footer onImprintClick={handleImprintClick} onAdminClick={handleAdminClick} />

      {/* Cookie Banner */}
      <CookieBanner
        onAccept={handleCookieAccept}
        onDecline={handleCookieDecline}
      />

      {/* Beta Gate Modal */}
      <BetaGateModal
        isOpen={showBetaGate}
        onClose={() => setShowBetaGate(false)}
        onContinueAnyway={handleBetaGateContinue}
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