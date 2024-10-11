import { expect, Locator, Page } from "@playwright/test";

export class OverviewPage {
    page: Page;
    url = "http://localhost:3000";
    viewRoomsLocator: Locator;
    viewClientsLocator: Locator; 
    viewBillsLocator: Locator;
    viewReservationsLocator: Locator;
    logoutLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.viewRoomsLocator = this.page.locator('#app > div > div > div:nth-child(1) > a');
        this.viewClientsLocator = this.page.locator('#app > div > div > div:nth-child(2) > a');
        this.viewBillsLocator = this.page.locator('#app > div > div > div:nth-child(3) > a');
        this.viewReservationsLocator = this.page.locator('#app > div > div > div:nth-child(4) > a');
        this.logoutLocator = this.page.getByRole('button', {name: 'Logout'});
    }

    async goToRooms() {
        await this.viewRoomsLocator.click();
        await expect(this.page.getByRole('heading', { name: 'Rooms' })).toBeVisible();
    }

    async goToClients() {
        await this.viewClientsLocator.click();
        await expect(this.page.getByRole('heading', { name: 'Clients' })).toBeVisible();
    }

    async goToBills() {
        await this.viewBillsLocator.click();
        await expect(this.page.getByRole('heading', { name: 'Bills' })).toBeVisible();
    }

    async goToReservations() {
        await this.viewReservationsLocator.click();
        await expect(this.page.getByRole('heading', { name: 'Reservations' })).toBeVisible();
    }

    async performLogout() {
        await this.logoutLocator.click();
        await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
    }
}