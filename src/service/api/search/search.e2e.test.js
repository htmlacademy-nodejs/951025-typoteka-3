const request = require(`supertest`);
const search = require(`./search`);
const SearchService = require(`../../data-service/search`);
// const createApi = require(`../../helpers/create-api`);
const {HttpCode} = require(`../../../const`);
const {Sequelize} = require(`sequelize`);
const express = require(`express`);
const fillDb = require(`../../lib/fill-db`);

const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});

const mockData = {
  articles: [
    {
      title: `Ёлки. История деревьев`,
      photo: `skyscraper@2x.jpg`,
      announcement: `Первая большая ёлка была установлена только в 1938 году.`,
      fullText: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
    }
  ],
  categories: [
    `Деревья`,
    `Музыка`,
    `Кино`
  ],
  users: [
    {
      email: `jackson@example.com`,
      firstName: `Michael`,
      lastName: `Jackson`,
      passwordHash: `ha21nskz83jsnjcxdnqi9123bb1123b12`,
      avatar: `avatar-1.png`,
    },
    {
      email: `williams@example.com`,
      firstName: `Tony`,
      lastName: `Williams`,
      passwordHash: `ha21nskz83jsnjcxdnqi9123bb1123b12`,
      avatar: `avatar-2.png`,
    },
  ]
};

const createApi = async () => {
  const app = express();
  app.use(express.json());
  await fillDb(mockDb, mockData);
  search(app, new SearchService(mockDb));
  return app;
};

let app = null;
let response = null;

describe(`Search`, () => {
  describe(`API returns article based on query`, () => {
    beforeEach(async () => {
      app = await createApi();
    });
    test(`Status code 200`, async () => {
      response = await request(app).get(`/search`).query({
        query: `Ёлки. История деревьев`,
      });

      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns one article`, async () => {
      response = await request(app).get(`/search`).query({
        query: `Ёлки. История деревьев`,
      });

      expect(response.body.length).toBe(1);
    });
    test(`The article id is correct`, async () => {
      response = await request(app).get(`/search`).query({
        query: `Ёлки. История деревьев`,
      });

      expect(response.body[0].id).toBe(1);
    });
  });

  describe(`API refuses to return offer`, () => {
    beforeEach(async () => {
      app = await createApi();
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
