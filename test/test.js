const request = require('supertest')
let server = require('../app');

describe('Homepage', () => {
    describe('/GET index', () => {
        it('should have a status of 200', (done) => {
            request(server).get("/").expect(200, done)
        });
    });

    describe("/GET single blog", () => {
        it("should have a status of 200 when fetching single blog", (done) => {
            request(server).get("/blog/701f59ce-05d2-4f59-9410-035fd35641fb").expect(200, done)
        })
    })

    describe("/GET search Blog", () => {
        it("should have a status of 200 when searching a blog", (done) => {
            request(server).get("/blog?search=title").expect(200, done)
        })
    })
})


describe('Authentication', () => {
    describe('/POST login', () => {
        it('should have a status of 302 when login', (done) => {
            request(server).post("/login").type('form').send({ email: "test@gmail.com", password: "12345" }).expect(302, done)
        });
    });

    describe('/POST signup', () => {
        it('should have a status of 302 when signup', (done) => {
            request(server).post("/signup").type('form').send({ firstname: "tests", lastname: "tests", username: "jheytim", email: "test@gmail.com", password: "12345" }).expect(302, done)
        });
    });
})