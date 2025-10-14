import { test, expect } from '@playwright/test';

const OLD_COMPANY_NAME = /proper\s*rentals?/gi;
const PAGES_TO_CHECK = ['/', '/fleet', '/about', '/contact'];

test.describe('Brand Name Verification', () => {
  PAGES_TO_CHECK.forEach(page => {
    test(`should not contain old company name on ${page}`, async ({ page: browserPage }) => {
      await browserPage.goto(page);
      
      // Wait for content to load
      await browserPage.waitForLoadState('networkidle');
      
      // Get all text content
      const pageContent = await browserPage.textContent('body');
      
      // Check for old company name
      const matches = pageContent?.match(OLD_COMPANY_NAME);
      
      if (matches) {
        throw new Error(`Found old company name "${matches[0]}" on page ${page}`);
      }
      
      // Also check page title
      const pageTitle = await browserPage.title();
      expect(pageTitle.toLowerCase()).not.toContain('proper rental');
      
      // Check meta tags
      const metaDescription = await browserPage.getAttribute('meta[name="description"]', 'content');
      if (metaDescription) {
        expect(metaDescription.toLowerCase()).not.toContain('proper rental');
      }
      
      // Check OG tags
      const ogTitle = await browserPage.getAttribute('meta[property="og:title"]', 'content');
      if (ogTitle) {
        expect(ogTitle.toLowerCase()).not.toContain('proper rental');
      }
      
      const ogDescription = await browserPage.getAttribute('meta[property="og:description"]', 'content');
      if (ogDescription) {
        expect(ogDescription.toLowerCase()).not.toContain('proper rental');
      }
    });
  });
  
  test('should display correct new company name', async ({ page }) => {
    await page.goto('/');
    
    // Check that Top Tier Rental appears
    await expect(page.locator('text=Top Tier Rental').first()).toBeVisible();
    
    // Check page title contains Top Tier Rental
    const title = await page.title();
    expect(title).toContain('Top Tier Rental');
  });
});
