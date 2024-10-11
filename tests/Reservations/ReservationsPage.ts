import { expect, Page } from "@playwright/test";

export class ReservationsPage {
    page: Page;
    url = "http://localhost:3000/reservations";

    constructor(page: Page) {
        this.page = page;
    }

    async goTo() {
        await this.page.goto(this.url);
        await expect(this.page.getByText("Reservations")).toBeVisible();
    }

    async goBackFromReservationsRoom() {
        await this.page.getByRole("link", { name: "Back" }).click();
        await expect(this.page.getByText('Tester Hotel Overview')).toBeVisible();
    }

    async createReservation() {
        await this.page.locator("#app > div > h2 > a").click();
        await expect(this.page.getByText("Reservations")).toBeVisible();
    }

    async saveReservationWithErrors() {
        await this.page.locator("#app > div > div.actions > a.btn.blue").click();
        await expect(this.page.getByText("Start date must be set")).toBeVisible();
        await expect(this.page.getByText("End date must be set")).toBeVisible();
    }
}