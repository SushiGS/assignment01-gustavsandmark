import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { RoomsPage } from "./RoomsPage";
import { ClientsPage } from "./ClientsPage";
import { BillsPage } from "./BillsPage";
import { ReservationsPage } from "./ReservationsPage";

const CREATED_ROOM_NUMBER = faker.number.int({ min: 1, max: 5 }).toString();
const CREATED_ROOM_FLOOR = faker.number.int({ min: 1, max: 5 }).toString();

const EDITED_ROOM_NUMBER = faker.number.int({ min: 6, max: 10 }).toString();
const EDITED_ROOM_FLOOR = faker.number.int({ min: 6, max: 10 }).toString();

const RANDOM_PRICE = faker.number.int({ min: 100, max: 1000 }).toString();
const UNIQUE1_RANDOM_PRICE = faker.number.int({ min: 100, max: 1000 }).toString();
const UNIQUE2_RANDOM_PRICE = faker.number.int({ min: 100, max: 1000 }).toString();

const CREATED_USER_FULL_NAME = faker.person.fullName.toString();
const CREATED_USER_MAIL = faker.internet.email().toString();
const CREATED_USER_PHONE_NUMBER = faker.phone.number.toString();

test.beforeEach(async ({ page }) => {
   await page.goto('http://localhost:3000');
   expect(page.url()).toBe('http://localhost:3000/login');
   await expect(page.getByRole('link', { name: 'Tester Hotel' })).toBeVisible();
   await page.locator('input[type="text"]').fill('tester01');
   await page.locator('input[type="password"]').fill('GteteqbQQgSr88SwNExUQv2ydb7xuf8c');
   await page.getByRole('button', { name: 'Login' }).click();

   await expect(page.getByRole('heading', { name: 'Tester Hotel Overview' })).toBeVisible();

});

test("Logout", async ({ page }) => {
    await page.getByRole("button", { name: "Logout" }).click();
    await page.waitForURL("http://localhost:3000/login");
    await expect(page.getByRole("link", { name: "Tester Hotel" })).toBeVisible();
});

test('View all "View"', async ({ page }) => {
    const roomspage = new RoomsPage(page);
    await roomspage.goTo();
    await roomspage.goBackFromRoomsRoom();

    const clientspage = new ClientsPage(page);
    await clientspage.goTo();
    await clientspage.goBackFromClientsRoom();

    const billsPage = new BillsPage(page);
    await billsPage.goTo();
    await billsPage.goBackFromBillsRoom();

    const reservationpage = new ReservationsPage(page);
    await reservationpage.goTo();
    await reservationpage.goBackFromReservationsRoom();
});

test("Create room without filling anything, should recive errors", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    await roomsPage.goTo();
    await roomsPage.goToRoomCreation();
    await roomsPage.createRoomWithErrors();
});

test("Make a new reservation without filling in start & end date, should recive errors", async ({ page }) => {
    const reservationPage = new ReservationsPage(page);
    await reservationPage.goTo();
    await reservationPage.createReservation();
    await reservationPage.saveReservationWithErrors();
});

test("Create a Bill wihtout any inputs, should recive errors ", async ({ page }) => {
    const billspage = new BillsPage(page);
    await billspage.goTo();
    await billspage.crateBill();
    await billspage.createBillWithErrors();
});

test("Create room", async ({ page }) => {
     const roomsPage = new RoomsPage(page);
     await roomsPage.goTo();
     await roomsPage.goToRoomCreation();
     await roomsPage.setCategory('twin');
     await roomsPage.setRoomNumber(CREATED_ROOM_NUMBER);
     await roomsPage.setFloor(CREATED_ROOM_FLOOR);
     await roomsPage.setAvailability(true);
     await roomsPage.setPrice(UNIQUE1_RANDOM_PRICE);
     await roomsPage.selectFeatures([1,2,3,4]);
     await roomsPage.createRoom(CREATED_ROOM_NUMBER,CREATED_ROOM_FLOOR);
});

test("Edit room", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    await roomsPage.goTo();
    await roomsPage.goToRoomEdit();
    await roomsPage.setCategory('single');
    await roomsPage.setRoomNumber(EDITED_ROOM_NUMBER);
    await roomsPage.setFloor(EDITED_ROOM_FLOOR);
    await roomsPage.setPrice(UNIQUE2_RANDOM_PRICE);
    await roomsPage.selectFeatures([1,2,3,4]);
    await roomsPage.saveEditChanges(EDITED_ROOM_FLOOR,EDITED_ROOM_NUMBER,UNIQUE2_RANDOM_PRICE);
});

test("Edit a room and put price as 0, should recive error ", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    await roomsPage.goTo();
    await roomsPage.goToRoomEdit();
    await roomsPage.setPrice('0');
    await roomsPage.editRoomWithError();
});

test("Delete room", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    await roomsPage.goTo();
    await roomsPage.deleteRoom();
});

test('Create new client', async ({ page }) => {
    const clientsPage = new ClientsPage(page);
    await clientsPage.goTo();
    await clientsPage.createClient();
    await clientsPage.setClientName(CREATED_USER_FULL_NAME);
    await clientsPage.setClientEmail(CREATED_USER_MAIL);
    await clientsPage.setClientPhoneNumber(CREATED_USER_PHONE_NUMBER);
    await clientsPage.saveClient();
});

test("Create a Bill ", async ({ page }) => {
    const billsPage = new BillsPage(page);
    await billsPage.goTo();
    await billsPage.crateBill();
    await billsPage.setValuePrice(RANDOM_PRICE);
    await billsPage.setCheckboxAsPaid(true);
    await billsPage.saveCreatedBillAndCheckifCreated(RANDOM_PRICE);
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
