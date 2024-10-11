import { expect, Locator, Page } from "@playwright/test";

export class CreateReservationsPage {
    page: Page;
    url = "http://localhost:3000/reservation/new";
    startDate: Locator;
    endDate: Locator;
    client: Locator;
    room: Locator;
    bill: Locator;
    saveButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.startDate = page.locator('input[placeholder="YYYY-MM-DD"]').first();
        this.endDate = page.locator('input[placeholder="YYYY-MM-DD"]').nth(1);
        this.client = page.locator('select').first();
        this.room = page.locator('select').nth(1);
        this.bill = page.locator('select').nth(2);
        this.saveButton = page.getByText('Save');
    }

    async goTo() {
        await this.page.goto(this.url);
        await expect(this.page.getByText("New Reservation")).toBeVisible();
    }

    async setStartDate(startDate: string) {
        this.startDate.fill(startDate);
    }

    async setEndDate(endDate:string) {
        this.endDate.fill(endDate);
    }

    async setClient(value: string) {
        this.client.selectOption({value});
    }

    async setRoom(value: string) {
        this.room.selectOption({value});
    }

    async setBill(value: string) {
        this.bill.selectOption({value});
    }

    async save() {
        await this.saveButton.click();
    }

    async saveReservationWithErrors() {
        await this.saveButton.click();
        await expect(this.page.getByText("Start date must be set")).toBeVisible();
        await expect(this.page.getByText("End date must be set")).toBeVisible();
    }
}