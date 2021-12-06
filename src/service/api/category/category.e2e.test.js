const request = require(`supertest`);
const category = require(`./category`);
const CategoryService = require(`../../data-service/category`);
// const createApi = require(`../../helpers/create-api`);
const {HttpCode} = require(`../../../const`);
const {Sequelize} = require(`sequelize`);
const express = require(`express`);
const fillDb = require(`../../lib/fill-db`);

const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});

const mockData = {
  articles: [
    {
      title: `Самый лучший музыкальный альбом этого года`,
      photo: `skyscraper@2x.jpg`,
      announcement: `Достичь успеха помогут ежедневные повторения`,
      fullText: `Золотое сечение — соотношение двух величин, гармоническая пропорция`,
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
  category(app, new CategoryService(mockDb));
  return app;
};

let app = null;
let response = null;

describe(`Category`, () => {
  describe(`Api returns category list`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/categories`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns 3 categories`, async () => {
      response = await request(app).get(`/categories`);
      expect(response.body.length).toBe(3);
    });
    test(`Category names are 'Деревья', 'Музыка', 'Кино'`, async () => {
      response = await request(app).get(`/categories`);
      // eslint-disable-next-line max-nested-callbacks
      expect(response.body.map((item) => item.name)).toEqual(expect.arrayContaining([`Деревья`, `Музыка`, `Кино`]));
    });
  });
});
