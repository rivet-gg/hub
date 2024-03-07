import { test, expect } from '@playwright/test';

test('has login button', async ({ page }) => {
	await page.goto('./');

	await expect(page).toHaveTitle(/Rivet/);
	await expect(page.getByText('Register or Login', { exact: true })).toBeVisible();
});
