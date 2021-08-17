const express = require(`express`);
const request = require(`supertest`);
const search = require(`./search`);
const SearchService = require(`../data-service/search`);
const {HttpCode} = require(`../../const`);
const mockData = require(`../../data/mock-data-search.json`);

const app = express();
app.use(express.json());
search(app, new SearchService(mockData));

describe(`API returns article based on search query`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/search`)
      .query({
        query: `Учим HTML и CSS`,
      });
  });
  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns only one article`, () => expect(response.body.length).toBe(1));
  test(`The article id is correct`, () => expect(response.body[0].id).toBe(`fHqesx_R`));
});

describe(`Negative API scenarios`, () => {
  test(`Status code 404 if article is not found`, (done) => {
    request(app)
      .get(`/search`)
      .query({
        query: `No article`,
      })
      .expect(HttpCode.NOT_FOUND, done);
  });
  test(`Status code 400 if query string is absent`, (done) => {
    request(app)
      .get(`/search`)
      .expect(HttpCode.BAD_REQUEST, done);
  });
});
