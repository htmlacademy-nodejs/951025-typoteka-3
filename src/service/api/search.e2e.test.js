const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const SearchService = require(`../data-service/search`);
const {HttpCode} = require(`../../const`);
const mockData = require(`../../data/mock-data-search.json`);

const createApi = (services) => {
  const app = express();
  app.use(express.json());
  search(app, ...services);
  return app;
};

let app = null;
let response = null;
let searchService = null;

describe(`Search`, () => {
  describe(`API returns article based on query`, () => {
    beforeEach(async () => {
      searchService = new SearchService(mockData);
      app = createApi([searchService]);
    });
    test(`Status code 200`, async () => {
      response = await request(app).get(`/search`).query({
        query: `Учим HTML и CSS`,
      });

      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns one article`, async () => {
      response = await request(app).get(`/search`).query({
        query: `Учим HTML и CSS`,
      });

      expect(response.body.length).toBe(1);
    });
    test(`The article id is correct`, async () => {
      response = await request(app).get(`/search`).query({
        query: `Учим HTML и CSS`,
      });

      expect(response.body[0].id).toBe(`fHqesx_R`);
    });
  });

  describe(`API refuses to return offer`, () => {
    beforeEach(async () => {
      searchService = new SearchService(mockData);
      app = createApi([searchService]);
    });
    test(`Status code 404 if article is not found`, (done) => {
      request(app).get(`/search`).query({
        query: `No article`,
      }).expect(HttpCode.NOT_FOUND, done);
    });
    test(`Status code 400 if query string is absent`, (done) => {
      request(app).get(`/search`)
        .expect(HttpCode.BAD_REQUEST, done);
    });
  });

});
