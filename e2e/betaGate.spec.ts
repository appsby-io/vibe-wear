import { test, expect } from '@playwright/test';

test.describe('Beta Gate Modal', () => {
  test.beforeEach(async ({ page }) => {
    // Set beta gate feature to enabled
    await page.addInitScript(() => {
      localStorage.setItem('design-counter', JSON.stringify({ state: { count: 0 }, version: 0 }));
      localStorage.setItem('cookieConsent', 'accepted');
    });
    
    await page.goto('/');
  });

  test('should show beta gate modal after 3 design generations', async ({ page }) => {
    // Generate 3 designs
    for (let i = 0; i < 3; i++) {
      await page.fill('textarea[placeholder*="Try:"]', `Test design ${i + 1}`);
      await page.click('button:has-text("Generate Design")');
      
      // Wait for generation to complete
      await page.waitForSelector('text=Creating Design...', { state: 'hidden', timeout: 30000 });
    }

    // Beta gate modal should appear
    await expect(page.locator('text=This is just beta 🚀')).toBeVisible();
  });

  test('should show beta gate modal when clicking add to cart', async ({ page }) => {
    // Generate one design first
    await page.fill('textarea[placeholder*="Try:"]', 'Test design for cart');
    await page.click('button:has-text("Generate Design")');
    
    // Wait for generation to complete
    await page.waitForSelector('text=Creating Design...', { state: 'hidden', timeout: 30000 });
    
    // Click add to cart
    await page.click('button:has-text("Add to Cart")');
    
    // Beta gate modal should appear
    await expect(page.locator('text=This is just beta 🚀')).toBeVisible();
  });

  test('should allow email submission and track sign_up event', async ({ page }) => {
    // Set up analytics tracking spy
    await page.addInitScript(() => {
      window.gaEvents = [];
      window.gtag = (...args) => {
        window.gaEvents.push(args);
      };
    });

    // Trigger beta gate modal
    await page.fill('textarea[placeholder*="Try:"]', 'Test design');
    await page.click('button:has-text("Generate Design")');
    await page.waitForSelector('text=Creating Design...', { state: 'hidden', timeout: 30000 });
    await page.click('button:has-text("Add to Cart")');
    
    // Fill email and submit
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button:has-text("Join Waitlist")');
    
    // Should show success message
    await expect(page.locator('text=Thanks! Check your inbox')).toBeVisible();
    
    // Check that sign_up event was tracked
    const gaEvents = await page.evaluate(() => window.gaEvents);
    const signUpEvent = gaEvents.find(event => 
      event[0] === 'event' && event[1] === 'sign_up'
    );
    expect(signUpEvent).toBeTruthy();
    expect(signUpEvent[2]).toMatchObject({ method: 'beta_modal' });
  });

  test('should allow continuing anyway', async ({ page }) => {
    // Trigger beta gate modal
    await page.fill('textarea[placeholder*="Try:"]', 'Test design');
    await page.click('button:has-text("Generate Design")');
    await page.waitForSelector('text=Creating Design...', { state: 'hidden', timeout: 30000 });
    await page.click('button:has-text("Add to Cart")');
    
    // Click continue anyway
    await page.click('button:has-text("Continue Anyway")');
    
    // Modal should close and item should be added to cart
    await expect(page.locator('text=This is just beta 🚀')).not.toBeVisible();
    
    // Cart should have 1 item
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toHaveText('1');
  });

  test('should track design generation events', async ({ page }) => {
    // Set up analytics tracking spy
    await page.addInitScript(() => {
      window.gaEvents = [];
      window.gtag = (...args) => {
        window.gaEvents.push(args);
      };
    });

    // Select a style first
    await page.click('[data-testid="style-realistic"]');
    
    // Generate a design
    await page.fill('textarea[placeholder*="Try:"]', 'Beautiful sunset landscape');
    await page.click('button:has-text("Generate Design")');
    
    // Wait for generation to complete
    await page.waitForSelector('text=Creating Design...', { state: 'hidden', timeout: 30000 });
    
    // Check that generate_design event was tracked
    const gaEvents = await page.evaluate(() => window.gaEvents);
    const generateEvent = gaEvents.find(event => 
      event[0] === 'event' && event[1] === 'generate_design'
    );
    expect(generateEvent).toBeTruthy();
    expect(generateEvent[2]).toMatchObject({
      prompt_length: 'Beautiful sunset landscape'.length,
      style_id: 'realistic'
    });
  });

  test('should track style selection events', async ({ page }) => {
    // Set up analytics tracking spy
    await page.addInitScript(() => {
      window.gaEvents = [];
      window.gtag = (...args) => {
        window.gaEvents.push(args);
      };
    });

    // Click on a style
    await page.click('[data-testid="style-cyberpunk"]');
    
    // Check that select_item event was tracked
    const gaEvents = await page.evaluate(() => window.gaEvents);
    const selectEvent = gaEvents.find(event => 
      event[0] === 'event' && event[1] === 'select_item'
    );
    expect(selectEvent).toBeTruthy();
    expect(selectEvent[2]).toMatchObject({
      item_id: 'cyberpunk',
      item_name: 'cyberpunk'
    });
  });
});