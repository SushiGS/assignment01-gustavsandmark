import { expect, Locator, Page } from "@playwright/test";

export class CreateClientPage {
    page: Page;
    url = "http://localhost:3000/client/new";
    clientName: Locator;
    clientEmail: Locator;
    clientNumber: Locator;
    createButton: Locator;


    constructor(page: Page) {
        this.page = page;
        this.clientName = page.locator("div")
            .filter({ hasText: /^Name$/ })
            .getByRole("textbox");
        this.clientNumber = page
            .locator("div")
            .filter({ hasText: /^Telephone$/ })
            .getByRole("textbox")

        this.clientEmail = page.locator('input[type="email"]')
        this.createButton = page.locator("#app > div > div.actions > a.btn.blue")
    }

    async goTo() {
        await this.page.goto(this.url);
        await expect(this.page.getByText("New Client")).toBeVisible();
    }

    async createClient() {
        await this.createButton.click();
        await expect(this.page.getByText('Clients')).toBeVisible();
    }

    async setClientName(name: string) {
        await this.clientName
            .fill(name);
    }

    async setClientPhoneNumber(phoneNumber: string) {
        await this.clientNumber
            .fill(phoneNumber);
    }

    async setClientEmail(email: string) {
        await this.clientEmail.fill(email);
    }
}




