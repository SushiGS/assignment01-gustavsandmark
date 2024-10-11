import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { RoomsPage } from "./Rooms/RoomsPage";
import { ClientsPage } from "./Clients/ClientsPage";
import { BillsPage } from "./Bills/BillsPage";
import { ReservationsPage } from "./Reservations/ReservationsPage";
import { LoginPage } from "./Login/LoginPage";
import { OverviewPage } from "./Overview/OverviewPage";
import { CreateRoomsPage } from "./Rooms/CreateRoomPage";
import { EditRoomsPage } from "./Rooms/EditRoomPage";

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
   const loginPage = new LoginPage(page);
   await loginPage.goToLoginpage();
   await loginPage.performLogin('tester01', 'GteteqbQQgSr88SwNExUQv2ydb7xuf8c');

});

test("Logout", async ({ page }) => {
    const logout = new OverviewPage(page);
    await logout.performLogout();
});

test('View all "View"', async ({ page }) => {
    const overviewPage = new OverviewPage(page);
    const roomsPage = new RoomsPage(page);
    await overviewPage.goToRooms();
    await roomsPage.goBackFromRoomsRoom();

    // const overviewPagea = new OverviewPage(page);
    // await overviewPagea.goToClients();
    // await clickClientsPage.goBackFromClientsRoom();

    // const overviewPagae = new OverviewPage(page);
    // await overviewPage.goToBills();
    // await clickBillsPage.goBackFromBillsRoom();

    // const overviewPage = new OverviewPage(page);
    // await overviewPage.goToReservations();
    // await clickReservationpage.goBackFromReservationsRoom();
});

test("Create room without filling anything, should recive errors", async ({ page }) => {
    const overviewPage = new OverviewPage(page);
    const roomsPage = new RoomsPage(page);
    const createRoomPage = new CreateRoomsPage(page);
    await overviewPage.goToRooms();
    await roomsPage.goToRoomCreation();
    await createRoomPage.createRoomWithErrors();
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
     const overviewPage = new OverviewPage(page);
     const roomsPage = new RoomsPage(page);
     const createRoomPage = new CreateRoomsPage(page);
     await overviewPage.goToRooms();
     await roomsPage.goToCreateRoom();
     await createRoomPage.setCategory('twin');
     await createRoomPage.setRoomNumber(CREATED_ROOM_NUMBER);
     await createRoomPage.setFloor(CREATED_ROOM_FLOOR);
     await createRoomPage.setAvailability(true);
     await createRoomPage.setPrice(UNIQUE1_RANDOM_PRICE);
     await createRoomPage.selectFeatures([1,2,3,4]);
     await createRoomPage.saveCreatedRoom(CREATED_ROOM_NUMBER,CREATED_ROOM_FLOOR);
});

test("Edit room", async ({ page }) => {
    const overviewPage = new OverviewPage(page);
    const roomsPage = new RoomsPage(page);
    const editRoomPage = new EditRoomsPage(page);
    await overviewPage.goToRooms();
    await roomsPage.goToRoomEdit();
    await editRoomPage.setCategory('single');
    await editRoomPage.setRoomNumber(EDITED_ROOM_NUMBER);
    await editRoomPage.setFloor(EDITED_ROOM_FLOOR);
    await editRoomPage.setPrice(UNIQUE2_RANDOM_PRICE);
    await editRoomPage.selectFeatures([1,2,3,4]);
    await editRoomPage.saveEditChanges(EDITED_ROOM_FLOOR,EDITED_ROOM_NUMBER,UNIQUE2_RANDOM_PRICE);
});

test("Edit a room and put price as 0, should recive error ", async ({ page }) => {
    const overviewPage = new OverviewPage(page);
    const roomsPage = new RoomsPage(page);
    const editRoomPage = new EditRoomsPage(page);
    await overviewPage.goToRooms();
    await roomsPage.goToRoomEdit();
    await editRoomPage.setPrice('0');
    await editRoomPage.editRoomWithError();
});

test("Delete room", async ({ page }) => {
    const overviewPage = new OverviewPage(page);
    const roomsPage = new RoomsPage(page);
    await overviewPage.goToRooms();
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
