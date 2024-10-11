import { expect, Locator, Page } from "@playwright/test";

export class CreateBillsPage {
    page: Page;
    url = "http://localhost:3000/bill/new";
    createBillButton: Locator;
    valueInput: Locator;
    paidCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createBillButton = page.getByText('Save');
        this.valueInput = page.locator('input[type="number"]');
        this.paidCheckbox = page.locator(".checkbox");
    }

    async goTo() {
        await this.page.goto(this.url);
        await expect(this.page.getByText("New Bill")).toBeVisible();
    }

    async setValuePrice(price: string) {
        await this.valueInput.fill(price.toString());
    }

    async setCheckboxAsPaid(available: boolean) {
        if (!available) return;

        await this.paidCheckbox.click();
        await expect(this.paidCheckbox).toHaveText("✓");
    }

    async createBill(number: string) {
        await this.createBillButton.click();
        await expect(this.page.getByText(`Value: ${number}`)).toBeVisible();
    }

    async createBillWithErrors() {
        await this.createBillButton.click();
        await expect(this.page.getByText("Value must be a whole number")).toBeVisible();
    }
}