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

describe("User Flow", () => {
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
});