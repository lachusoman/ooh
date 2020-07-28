const request = require("supertest");
const app = require("../src/app");
const models = require("../src/models")
const { USER } = require("../src/constants/constants");
const user = {
    email_id: "user@ooh.com",
    password: "user123",
    first_name: "User",
    last_name: "U",
    user_type: USER,
    contact_no: "9999999999",
    dob: "1950-10-10",
    address: "NSW,Sydney"
}
const shop = {
    name: "Westfield",
    address: "Parramatta"
}

const asset = {
    name: "Board",
    dimension: "300*50",
    location: "Front",
    status: "active",
    shop_id: "1"
}

describe("User Flow", () => {
    beforeAll(async () => {
        await models.sequelize.sync();
    })
    afterAll(async () => {
        await models.sequelize.close();
        await app.close;
    });

    it("Login Failure::User not found", async () => {
        const res = await request(app)
            .post(`${process.env.API_PREFIX}/user/login`)
            .send({ "email_id": user.email_id, "password": user.password });
        expect(res.statusCode).toEqual(500);
        expect(res.text).toEqual("{\"error\":\"No such user or Incorrect Password\"}");
    });

    it("Create User", async () => {
        const res = await request(app)
            .post(`${process.env.API_PREFIX}/user`)
            .send(user);
        expect(res.statusCode).toEqual(201);
    });

    it("Login Success", async () => {
        const res = await request(app)
            .post(`${process.env.API_PREFIX}/user/login`)
            .send({ "email_id": user.email_id, "password": user.password });
        expect(res.statusCode).toEqual(200);
    });

    it("Create Shopping Centre", async () => {
        const res = await request(app)
            .post(`${process.env.API_PREFIX}/shop`)
            .send(shop);
        expect(res.statusCode).toEqual(201);
    });

    it("Create Shopping Centre", async () => {
        const res = await request(app)
            .post(`${process.env.API_PREFIX}/shop`)
            .send(shop);
        expect(res.statusCode).toEqual(201);
    });
});