import ReactGA from 'react-ga4';

interface GAEventParams {
  [key: string]: string | number | boolean;
}

interface EcommerceItem {
  item_id: string;
  item_name: string;
  item_category?: string;
  price?: number;
  quantity?: number;
}

class GoogleAnalytics {
  private isInitialized = false;
  private measurementId: string | null = null;

  initialize(measurementId: string) {
    if (!measurementId || this.isInitialized) return;
    
    this.measurementId = measurementId;
    ReactGA.initialize(measurementId, {
      testMode: import.meta.env.DEV,
    });
    this.isInitialized = true;
    console.log('Google Analytics initialized with ID:', measurementId);
  }

  track(eventName: string, params?: GAEventParams) {
    if (!this.isInitialized) return;
    
    ReactGA.event(eventName, params);
    console.log('GA Event:', eventName, params);
  }

  // Custom events for VIBEWEAR
  trackDesignGeneration(promptLength: number, styleId?: string) {
    this.track('generate_design', {
      prompt_length: promptLength,
      style_id: styleId || 'none',
    });
  }

  trackStyleSelection(itemId: string, itemName: string) {
    this.track('select_item', {
      item_id: itemId,
      item_name: itemName,
      item_category: 'style',
    });
  }

  trackSliderNavigation(index: number) {
    this.track('view_item_list', {
      list_id: 'style-slider',
      index: index,
    });
  }

  trackAddToCart(items: EcommerceItem[]) {
    this.track('add_to_cart', {
      currency: 'USD',
      value: items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0),
      items: items,
    });
  }

  trackBeginCheckout() {
    this.track('begin_checkout');
  }

  trackSignUp(method: string = 'beta_modal') {
    this.track('sign_up', {
      method: method,
    });
  }

  trackSurveyOpen() {
    this.track('survey_open');
  }

  trackSurveyComplete() {
    this.track('survey_complete');
  }

  trackWaitlistModalShown() {
    this.track('waitlist_modal_shown');
  }

  trackWaitlistModalDismissed() {
    this.track('waitlist_modal_dismissed');
  }

  trackGenerationError(errorMessage: string) {
    this.track('generation_error', {
      error_message: errorMessage,
    });
  }

  trackImageViewLarge() {
    this.track('image_view_large');
  }

  trackFeatureClick(feature: string) {
    this.track('feature_click', {
      feature_name: feature,
    });
  }

  setUserProperty(propertyName: string, value: string | number | boolean) {
    if (!this.isInitialized) return;
    
    ReactGA.set({
      [propertyName]: value,
    });
  }

  updateDesignGenerationCount(count: number) {
    this.setUserProperty('design_generation_count', count);
  }

  pageView(path: string) {
    if (!this.isInitialized) return;
    
    ReactGA.send({ hitType: 'pageview', page: path });
  }
}

export const ga = new GoogleAnalytics();