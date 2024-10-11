import { expect, Page } from "@playwright/test";

export class ClientsPage {
    page: Page;
    url = "http://localhost:3000/clients";

    constructor(page: Page) {
        this.page = page;
    }

    async goTo() {
        await this.page.locator("#app > div > div > div:nth-child(2) > a").click();
        await expect(this.page.getByText("Clients")).toBeVisible();
    }

    async createClient() {
        await this.page.locator("#app > div > h2 > a").click();
        // await this.page.getByRole("link", { name: "Create Client" }).click();
        await expect(this.page.getByText("New Client")).toBeVisible();
    }
    async saveClient() {
        await this.page.locator("#app > div > div.actions > a.btn.blue").click();
        await expect(this.page.getByText('Clients')).toBeVisible();
    }

    async goBackFromClientsRoom() {
        await this.page.getByRole("link", { name: "Back" }).click();
        await expect(this.page.getByText('Tester Hotel Overview')).toBeVisible();
    }

    async setClientName(name: string) {
        await this.page.locator("div")
        .filter({ hasText: /^Name$/ })
        .getByRole("textbox")
        .fill(name);
    }

    async setClientPhoneNumber(phoneNumber: string) {
        await this.page
        .locator("div")
        .filter({ hasText: /^Telephone$/ })
        .getByRole("textbox")
        .fill(phoneNumber);
    }

    async setClientEmail(email: string) {
        await this.page.locator('input[type="email"]').fill(email);
    }



    
}




