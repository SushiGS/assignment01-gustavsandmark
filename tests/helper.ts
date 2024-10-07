import { expect, Page } from "@playwright/test";


export async function login(page: Page): Promise<void>  {

   await page.goto('http://localhost:3000');
   expect(page.url()).toBe('http://localhost:3000/login');
   await expect(page.getByRole('link', { name: 'Tester Hotel' })).toBeVisible();
   await page.locator('input[type="text"]').fill('tester01');
   await page.locator('input[type="password"]').fill('GteteqbQQgSr88SwNExUQv2ydb7xuf8c');
   await page.getByRole('button', { name: 'Login' }).click();

   await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible();








}