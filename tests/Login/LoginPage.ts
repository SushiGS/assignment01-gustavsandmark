import { expect, Locator, Page } from "@playwright/test";

export class LoginPage {
    page: Page;
    url = "http://localhost:3000/login";
    usernameLocator: Locator;
    passwordLocator: Locator; 
    loginLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.usernameLocator = this.page.locator('input[type="text"]');
        this.passwordLocator = this.page.locator('input[type="password"]');
        this.loginLocator = this.page.getByRole('button', {name: 'Login'});
    }

    async goToLoginpage() {
        await this.page.goto(this.url);
        expect(this.page.url()).toBe(this.url);
        await expect(this.page.getByRole('link', { name: 'Tester Hotel' })).toBeVisible();
    }

    async performLogin(username: string, password: string) {
        await this.usernameLocator.fill(username);
        await this.passwordLocator.fill(password);
        await this.loginLocator.click();
        await expect(this.page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible();
    }
}