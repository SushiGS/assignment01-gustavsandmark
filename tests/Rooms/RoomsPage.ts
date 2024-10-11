import { expect, Locator, Page } from "@playwright/test";

export class RoomsPage {
    page: Page;
    url = "http://localhost:3000/rooms";
    createRoomLocator: Locator;
    editOrDeleteContextMenyLocator: Locator;
    editRoomButtonLocator: Locator;
    deleteRoomButtonLocator: Locator;
    logoutLocator: Locator;
    goBackLocator: Locator;

    constructor(page: Page) {
        this.page = page;
        this.createRoomLocator = this.page.locator('#app > div > h2 > a');
        this.editOrDeleteContextMenyLocator = this.page.locator("img").first();
        this.editRoomButtonLocator = this.page.locator("a:nth-child(1)").first();
        this.deleteRoomButtonLocator = this.page.locator("a:nth-child(2)").first();
        this.logoutLocator = this.page.getByRole('button', {name: 'Logout'});
        this.goBackLocator = this.page.getByRole('button', {name: 'Back'});

    }

    async goTo() {
        await this.page.goto(this.url);
        await expect(this.page.getByText("Rooms")).toBeVisible();
    }

    async goToCreateRoom() {
        await this.createRoomLocator.click();
        await expect(this.page.getByRole('heading', { name: 'New Room' })).toBeVisible();
    }

    async goBackFromRoomsRoom() {
        await this.goBackLocator.click();
        await expect(this.page.getByText('Tester Hotel Overview')).toBeVisible();
    }

    async goToRoomEdit() {
        await this.editOrDeleteContextMenyLocator.click();
        await this.editRoomButtonLocator.click();
        await expect(this.page.getByText("Room")).toBeVisible();
    }

    async deleteRoom() {
        const rooms = this.page.locator('div.rooms');
        const firstRoom = rooms.locator('div.room').first();
        const titleText = await firstRoom.locator('h3').innerText();

        await expect(rooms.getByText(titleText)).toHaveCount(1);

        await firstRoom.locator(this.editOrDeleteContextMenyLocator).click();
        await firstRoom.locator(this.deleteRoomButtonLocator).click();
        await expect(rooms.getByText(titleText)).toHaveCount(0);
    }

    async performLogout() {
        await this.logoutLocator.click();
        await expect(this.page.getByRole('heading', { name: 'Login' })).toBeVisible();
    }


    // async saveEditChanges(floor: string, room: string, price: string) {
    //     await this.page.locator("#app > div > div.actions > a.btn.blue").click();
    //     await expect(this.page.getByText(`Floor ${floor}, Room ${room}`)).toBeVisible();
    //     await expect(this.page.getByText(`Price: ${price}kr`)).toBeVisible();
    // }

    // async setCategory(category: "double" | "single" | "twin") {
    //     const dropdownSelector = this.page.locator("select").first();
    //     await dropdownSelector.selectOption({ value: category });
    // }

    // async setRoomNumber(number: string) {
    //     await this.page
    //         .locator("div")
    //         .filter({ hasText: /^Number$/ })
    //         .getByRole("spinbutton")
    //         .fill(number);
    // }

    // async setFloor(floor: string) {
    //     await this.page
    //         .locator("div")
    //         .filter({ hasText: /^Floor$/ })
    //         .getByRole("spinbutton")
    //         .fill(floor);
    // }

    // async setAvailability(available: boolean) {
    //     if (!available) return;

    //     await this.page.locator(".checkbox").click();
    //     const checkboxLocator = this.page.locator(".checkbox");
    //     await checkboxLocator.waitFor({ state: "visible", timeout: 10000 });
    //     const checkmarkLocator = this.page.getByText("✓");
    //     await expect(checkmarkLocator).toBeVisible();
    // }

    // async setPrice(price: string) {
    //     await this.page
    //         .locator("div")
    //         .filter({ hasText: /^Price$/ })
    //         .getByRole("spinbutton")
    //         .fill(price);
    // }

    // async selectFeatures(features: number[]) {
    //     for (const feature of features) {
    //         const url = `option:nth-child(${feature})`;
    //         const label = this.page.locator('label', { hasText: 'Features ' });
    //         const parent = await label.locator('..');
    //         const select = await parent.locator('select');
    //         const isFirstIndex = features.indexOf(feature) === 0;
    //         await select.locator(url).click({ modifiers: isFirstIndex ? undefined : ["Control"] });
    //     }
    // }

    // async goToRoomCreation() {
    //     await this.page.getByRole("link", { name: "Create Room" }).click();
    //     await expect(this.page.getByText("New Room")).toBeVisible();
    // }

    // async createRoom(room: string, floor:string) {
    //     await this.page.locator("#app > div > div.actions > a.btn.blue").click();
    //     await expect(this.page.getByText(`Floor ${floor}, Room ${room}`)).toBeVisible();
    // }

    // async createRoomWithErrors() {
    //     await this.page.locator("#app > div > div.actions > a.btn.blue").click();
    //     await expect(this.page.getByText("Room number must be set")).toBeVisible();
    //     await expect(this.page.getByText("Floor must be set")).toBeVisible();
    //     await expect(this.page.getByText("Price must be a whole number")).toBeVisible();
    // }

    // async editRoomWithError() {
    //     await this.page.locator("#app > div > div.actions > a.btn.blue").click();
    //     await expect(this.page.getByText("Price must be greater than 0")).toBeVisible();
    // }

}