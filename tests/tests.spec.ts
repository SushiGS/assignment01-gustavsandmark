import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { login } from "./helper";

const CREATED_ROOM_NUMBER = faker.number.int({ min: 1, max: 5 }).toString();
const CREATED_ROOM_FLOOR = faker.number.int({ min: 1, max: 5 }).toString();

const EDITED_ROOM_NUMBER = faker.number.int({ min: 6, max: 10 }).toString();
const EDITED_ROOM_FLOOR = faker.number.int({ min: 6, max: 10 }).toString();

test.beforeEach(async ({ page }) => {
    await login(page);
});

test("Logout", async ({ page }) => {
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForURL("http://localhost:3000/login");
    await expect(page.getByRole("link", { name: "Tester Hotel" })).toBeVisible();
});

test('View all "View"', async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(1) > a").click();
    await expect(page.getByText("Rooms")).toBeVisible();
    await page.getByRole("link", { name: "Back" }).click();
    await expect(page.getByRole("heading", { name: "Tester Hotel Overview" })).toBeVisible();

    await page.locator("#app > div > div > div:nth-child(2) > a").click();
    await expect(page.getByText("Clients")).toBeVisible();
    await page.getByRole("link", { name: "Back" }).click();
    await expect(page.getByRole("heading", { name: "Tester Hotel Overview" })).toBeVisible();

    await page.locator("#app > div > div > div:nth-child(3) > a").click();
    await expect(page.getByText("Bills")).toBeVisible();
    await page.getByRole("link", { name: "Back" }).click();
    await expect(page.getByRole("heading", { name: "Tester Hotel Overview" })).toBeVisible();

    await page.locator("#app > div > div > div:nth-child(4) > a").click();
    await expect(page.getByText("Reservations")).toBeVisible();
    await page.getByRole("link", { name: "Back" }).click();
    await expect(page.getByRole("heading", { name: "Tester Hotel Overview" })).toBeVisible();
});

test("Create room without filling anything, should recive errors", async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(1) > a").click();
    await expect(page.getByText("Rooms")).toBeVisible();
    await page.getByRole("link", { name: "Create Room" }).click();
    await expect(page.getByText("New Room")).toBeVisible();

    await page.locator("#app > div > div.actions > a.btn.blue").click();

    await expect(page.getByText("Room number must be set")).toBeVisible();
    await expect(page.getByText("Floor must be set")).toBeVisible();
    await expect(page.getByText("Price must be a whole number")).toBeVisible();
});

test("Make a new reservation without filling in start & end date, should recive errors", async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(4) > a").click();
    await expect(page.getByText("Reservations")).toBeVisible();
    await page.getByRole("link", { name: "Create Reservation" }).click();
    await expect(page.getByText("New Reservation")).toBeVisible();

    const dropdown1 = page.locator("select").nth(0);
    await dropdown1.selectOption({ value: "1" });

    const dropdown2 = page.locator("select").nth(1);
    await dropdown2.selectOption({ value: "1" });

    const dropdown3 = page.locator("select").nth(2);
    await dropdown3.selectOption({ value: "1" });

    await page.locator("#app > div > div.actions > a.btn.blue").click();

    await expect(page.getByText("Start date must be set")).toBeVisible();
    await expect(page.getByText("End date must be set")).toBeVisible();
});

test("Create a Bill wihtout any inputs, should recive errors ", async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(3) > a").click();
    await expect(page.getByText("Bills")).toBeVisible();
    await page.locator("#app > div > h2 > a").click();
    await expect(page.getByText("New Bill")).toBeVisible();

    await page.locator("#app > div > div.actions > a.btn.blue").click();
    await expect(page.getByText("Value must be a whole number")).toBeVisible();
});

// Side effects
test("Create room", async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(1) > a").click();
    await expect(page.getByText("Rooms")).toBeVisible();
    await page.getByRole("link", { name: "Create Room" }).click();
    await expect(page.getByText("New Room")).toBeVisible();
    const dropdownSelector = page.locator("select").first();
    await dropdownSelector.selectOption({ value: "twin" });

    await page
        .locator("div")
        .filter({ hasText: /^Number$/ })
        .getByRole("spinbutton")
        .fill(CREATED_ROOM_NUMBER);

    await page
        .locator("div")
        .filter({ hasText: /^Floor$/ })
        .getByRole("spinbutton")
        .fill(CREATED_ROOM_FLOOR);

    await page.locator(".checkbox").click();
    const checkboxLocator = page.locator(".checkbox");
    await checkboxLocator.waitFor({ state: "visible", timeout: 10000 });
    const checkmarkLocator = page.getByText("✓");
    await expect(checkmarkLocator).toBeVisible();

    const mockedPrice = faker.number.int({ min: 1000, max: 10000 }).toString();
    await page
        .locator("div")
        .filter({ hasText: /^Price$/ })
        .getByRole("spinbutton")
        .fill(mockedPrice);

    await page.locator("#app > div > div:nth-child(2) > div:nth-child(6) > select > option:nth-child(1)").click();
    await page.locator("#app > div > div:nth-child(2) > div:nth-child(6) > select > option:nth-child(2)").click({ modifiers: ["Control"] });
    await page.locator("#app > div > div:nth-child(2) > div:nth-child(6) > select > option:nth-child(3)").click({ modifiers: ["Control"] });
    await page.locator("#app > div > div:nth-child(2) > div:nth-child(6) > select > option:nth-child(4)").click({ modifiers: ["Control"] });

    await page.locator("#app > div > div.actions > a.btn.blue").click();
    await expect(page.getByText(`Floor ${CREATED_ROOM_FLOOR}, Room`)).toBeVisible();
});

test("Edit room", async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(1) > a").click();
    await expect(page.getByText("Rooms")).toBeVisible();
    await page.locator("#app > div > div.rooms > div:nth-child(1) > div.action > img").click();
    await page.locator("#app > div > div.rooms > div:nth-child(1) > div.menu > a:nth-child(1)").click();
    await expect(page.getByText("Room: 1")).toBeVisible();

    const dropdownSelector = page.locator("select").first();
    await dropdownSelector.selectOption({ value: "twin" });

    const mockedPrice = faker.number.int({ min: 1000, max: 1000000 }).toString();

    await page
        .locator("div")
        .filter({ hasText: /^Number$/ })
        .getByRole("spinbutton")
        .fill(EDITED_ROOM_NUMBER);

    await page
        .locator("div")
        .filter({ hasText: /^Floor$/ })
        .getByRole("spinbutton")
        .fill(EDITED_ROOM_FLOOR);

    await page
        .locator("div")
        .filter({ hasText: /^Price$/ })
        .getByRole("spinbutton")
        .fill(mockedPrice);

    await page.locator("#app > div > div.actions > a.btn.blue").click();
    await expect(page.getByText(`Floor ${EDITED_ROOM_FLOOR}, Room ${EDITED_ROOM_NUMBER}`)).toBeVisible();
    await expect(page.getByText(`Price: ${mockedPrice}kr`)).toBeVisible();
});

test("Edit a room and put price as 0, should recive error ", async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(1) > a").click();
    await expect(page.getByText("Rooms")).toBeVisible();
    await page.locator("#app > div > div.rooms > div:nth-child(1) > div.action > img").click();
    await page.locator("#app > div > div.rooms > div:nth-child(1) > div.menu > a:nth-child(1)").click();
    await expect(page.getByText("Room: 1")).toBeVisible();

    const dropdownSelector = page.locator("select").first();
    await dropdownSelector.selectOption({ value: "twin" });

    await page
        .locator("div")
        .filter({ hasText: /^Number$/ })
        .getByRole("spinbutton")
        .fill(EDITED_ROOM_NUMBER);

    await page
        .locator("div")
        .filter({ hasText: /^Floor$/ })
        .getByRole("spinbutton")
        .fill(EDITED_ROOM_FLOOR);

    await page
        .locator("div")
        .filter({ hasText: /^Price$/ })
        .getByRole("spinbutton")
        .fill("0");

    await page.locator("#app > div > div.actions > a.btn.blue").click();
    await expect(page.getByText("Price must be greater than 0")).toBeVisible();
});

test("Delete room", async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(1) > a").click();
    await expect(page.getByText("Rooms")).toBeVisible();

    await page.locator("#app > div > div.rooms > div:nth-child(1) > div.action > img").click();
    await page.locator("#app > div > div.rooms > div:nth-child(1) > div.menu > a:nth-child(2)").click();

    await expect(page.getByText("Room 101")).not.toBeVisible();
});

test('Create new client and check if Clients "Number count" is changed ', async ({ page }) => {
    const specificDiv = page.locator("div").filter({ hasText: /^ClientsNumber: 2View$/ });
    const initialCountText = await specificDiv.textContent();
    const initialCount = parseInt(initialCountText?.match(/\d+/)?.[0] || "0", 10);

    console.log("Initial number count:", initialCount);

    await page.locator("#app > div > div > div:nth-child(2) > a").click();
    await page.getByRole("link", { name: "Create Client" }).click();

    await expect(page.getByText("New Client")).toBeVisible();

    const fullName = faker.person.fullName();
    const userEmail = faker.internet.email();
    const userPhoneNo = faker.phone.number();

    await page
        .locator("div")
        .filter({ hasText: /^Name$/ })
        .getByRole("textbox")
        .fill(fullName);
    await page.locator('input[type="email"]').fill(userEmail);
    await page
        .locator("div")
        .filter({ hasText: /^Telephone$/ })
        .getByRole("textbox")
        .fill(userPhoneNo);
    await page.getByText("Save").click();

    const element = page.locator("#app > div > div.clients > div:nth-last-child(1)");
    await expect(element).toContainText(fullName);
    await expect(element).toContainText(userEmail);
    await expect(element).toContainText(userPhoneNo);

    await page.getByRole("link", { name: "Back" }).click();

    const newCountDiv = page.locator("div").filter({ hasText: /^ClientsNumber: 3View$/ });
    const newCountText = await newCountDiv.textContent();
    const newCount = parseInt(newCountText?.match(/\d+/)?.[0] || "0", 10);

    console.log("New number count:", newCount);

    expect(newCount).toBe(initialCount + 1);
});

test("Create a Bill ", async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(3) > a").click();
    await expect(page.getByText("Bills")).toBeVisible();
    await page.locator("#app > div > h2 > a").click();
    await expect(page.getByText("New Bill")).toBeVisible();

    const numberRandom = faker.number.int({ min: 100, max: 1000 });
    const spinbuttonLocator = page.locator('input[type="number"]');
    await spinbuttonLocator.waitFor({ state: "visible", timeout: 10000 });
    await spinbuttonLocator.fill(numberRandom.toString());

    await page.locator(".checkbox").click();
    const checkboxLocator = page.locator(".checkbox");
    await checkboxLocator.waitFor({ state: "visible", timeout: 10000 });
    const checkmarkLocator = page.getByText("✓");
    await expect(checkmarkLocator).toBeVisible();

    await page.locator("#app > div > div.actions > a.btn.blue").click();
    await expect(page.getByText(`Value: ${numberRandom}`)).toBeVisible();
});

test.skip("Make a reservation using same input as the existing one, should recive error", async ({ page }) => {
    await page.locator("#app > div > div > div:nth-child(4) > a").click();
    await expect(page.getByText("Reservations")).toBeVisible();
    await page.getByRole("link", { name: "Create Reservation" }).click();
    await expect(page.getByText("New Reservation")).toBeVisible();

    const startDateInput = page.locator('input[placeholder="YYYY-MM-DD"]').nth(0);
    await startDateInput.fill("2020-04-01");

    const endDateInput = page.locator('input[placeholder="YYYY-MM-DD"]').nth(1);
    await endDateInput.fill("2020-04-04");

    const dropdown1 = page.locator("select").nth(0);
    await dropdown1.selectOption({ value: "1" });

    const dropdown2 = page.locator("select").nth(1);
    await dropdown2.selectOption({ value: "1" });

    const dropdown3 = page.locator("select").nth(2);
    await dropdown3.selectOption({ value: "1" });

    await page.locator("#app > div > div.actions > a.btn.blue").click();

    await expect(page.getByText("This reservation has already been created")).toBeVisible();

    //Skapade detta test och låter det få error för jag tycker att man ska få felmedelande om man skapar en reservation med samma input som en annan.
});
