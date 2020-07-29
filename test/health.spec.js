const request = require("supertest");
const app = require("../src/app");
describe("ooh health check", () => {
    it("Health Test", async (done) => {
        const res = await request(app).get(`${process.env.API_PREFIX}/health`).send();
        expect(res.statusCode).toEqual(200);
        done();
    });

    afterAll(async (done) => {
        await app.close;
        done();
    });

});