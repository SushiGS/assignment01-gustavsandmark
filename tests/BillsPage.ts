import { expect, Page } from "@playwright/test";

export class BillsPage {
    page: Page;
    url = "http://localhost:3000/bills";

    constructor(page: Page) {
        this.page = page;
    }

    async goTo() {
        await this.page.goto(this.url);
        await expect(this.page.getByText("Bills")).toBeVisible();
    }

    async goBackFromBillsRoom() {
        await this.page.getByRole("link", { name: "Back" }).click();
        await expect(this.page.getByText('Tester Hotel Overview')).toBeVisible();
    }

    async crateBill() {
        await this.page.locator("#app > div > h2 > a").click();
        await expect(this.page.getByText("New Bill")).toBeVisible();
    }

    async setValuePrice(price: string) {
        const spinbuttonLocator = this.page.locator('input[type="number"]');
        await spinbuttonLocator.waitFor({ state: "visible", timeout: 10000 });
        await spinbuttonLocator.fill(price.toString());
    }

    async setCheckboxAsPaid(available: boolean) {
        if (!available) return;

        await this.page.locator(".checkbox").click();
        const checkboxLocator = this.page.locator(".checkbox");
        await checkboxLocator.waitFor({ state: "visible", timeout: 10000 });
        const checkmarkLocator = this.page.getByText("✓");
        await expect(checkmarkLocator).toBeVisible();
    }

    async saveCreatedBillAndCheckifCreated(number: string) {
        await this.page.locator("#app > div > div.actions > a.btn.blue").click();
        await expect(this.page.getByText(`Value: ${number}`)).toBeVisible();
    }

    async createBillWithErrors() {
        await this.page.locator("#app > div > div.actions > a.btn.blue").click();
        await expect(this.page.getByText("Value must be a whole number")).toBeVisible();
    }
}