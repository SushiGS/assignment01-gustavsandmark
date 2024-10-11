import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { RoomsPage } from "./Rooms/RoomsPage";
import { LoginPage } from "./Login/LoginPage";
import { OverviewPage } from "./Overview/OverviewPage";
import { CreateRoomsPage } from "./Rooms/CreateRoomPage";
import { EditRoomsPage } from "./Rooms/EditRoomPage";
import { CreateClientPage } from "./Clients/CreateClientPage";
import { CreateBillsPage } from "./Bills/CreateBillsPage";
import { CreateReservationsPage } from "./Reservations/CreateReservationsPage";

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

test('Can navigate to RoomsPage', async ({ page }) => {
    const overviewPage = new OverviewPage(page);
    await overviewPage.goToRooms();
});

test('Can navigate to ClientPage', async ({ page }) => {
    const overviewPage = new OverviewPage(page);
    await overviewPage.goToClients();
});

test('Can navigate to BillsPage', async ({ page }) => {
    const overviewPage = new OverviewPage(page);
    await overviewPage.goToBills();
});

test('Can navigate to ReservationPage', async ({ page }) => {
    const overviewPage = new OverviewPage(page);
    await overviewPage.goToReservations();
});

test("Create room without filling anything, should recive errors", async ({ page }) => {
    const createRoomPage = new CreateRoomsPage(page);
    await createRoomPage.goTo();
    await createRoomPage.createRoomWithErrors();
});

test("Make a new reservation without filling in start & end date, should recive errors", async ({ page }) => {
    const createReservationPage = new CreateReservationsPage(page);
    await createReservationPage.goTo();
    await createReservationPage.saveReservationWithErrors();
});

test("Create a Bill wihtout any inputs, should recive errors ", async ({ page }) => {
    const createBillspage = new CreateBillsPage(page);
    await createBillspage.goTo();
    await createBillspage.createBillWithErrors();
});

test("Create room", async ({ page }) => {
     const createRoomPage = new CreateRoomsPage(page);
     await createRoomPage.goTo();
     await createRoomPage.setCategory('twin');
     await createRoomPage.setRoomNumber(CREATED_ROOM_NUMBER);
     await createRoomPage.setFloor(CREATED_ROOM_FLOOR);
     await createRoomPage.setAvailability(true);
     await createRoomPage.setPrice(UNIQUE1_RANDOM_PRICE);
     await createRoomPage.selectFeatures([1,2,3,4]);
     await createRoomPage.saveCreatedRoom(CREATED_ROOM_NUMBER,CREATED_ROOM_FLOOR);
});

test("Edit room", async ({ page }) => {
    const editRoomPage = new EditRoomsPage(page);
    await editRoomPage.goTo()
    await editRoomPage.setCategory('single');
    await editRoomPage.setRoomNumber(EDITED_ROOM_NUMBER);
    await editRoomPage.setFloor(EDITED_ROOM_FLOOR);
    await editRoomPage.setPrice(UNIQUE2_RANDOM_PRICE);
    await editRoomPage.selectFeatures([1,2,3,4]);
    await editRoomPage.saveEditChanges(EDITED_ROOM_FLOOR,EDITED_ROOM_NUMBER,UNIQUE2_RANDOM_PRICE);
});

test("Edit a room and put price as 0, should recive error ", async ({ page }) => {
    const editRoomPage = new EditRoomsPage(page);
    await editRoomPage.goTo();
    await editRoomPage.setPrice('0');
    await editRoomPage.editRoomWithError();
});

test("Delete room", async ({ page }) => {
    const roomsPage = new RoomsPage(page);
    await roomsPage.goTo();
    await roomsPage.deleteRoom();
});

test('Create new client', async ({ page }) => {
    const createClientPage = new CreateClientPage(page);
    await createClientPage.goTo();
    await createClientPage.setClientName(CREATED_USER_FULL_NAME);
    await createClientPage.setClientEmail(CREATED_USER_MAIL);
    await createClientPage.setClientPhoneNumber(CREATED_USER_PHONE_NUMBER);
    await createClientPage.createClient();
});

test("Create a Bill ", async ({ page }) => {
    const createBillsPage = new CreateBillsPage(page);
    await createBillsPage.goTo();
    await createBillsPage.setValuePrice(RANDOM_PRICE);
    await createBillsPage.setCheckboxAsPaid(true);
    await createBillsPage.createBill(RANDOM_PRICE);
});

test.skip("Make a reservation using same input as the existing one, should recive error", async ({ page }) => {
    const createReservationPage = new CreateReservationsPage(page)
    await createReservationPage.goTo();
    await createReservationPage.setStartDate("2020-04-01")
    await createReservationPage.setEndDate('2020-04-04');
    await createReservationPage.setClient('1');
    await createReservationPage.setRoom('1');
    await createReservationPage.setBill('1');
    await createReservationPage.save();

    await expect(page.getByText("This reservation has already been created")).toBeVisible();
    //Skapade detta test och låter det få error för jag tycker att man ska få felmedelande om man skapar en reservation med samma input som en annan.
});
