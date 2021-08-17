const express = require(`express`);
const request = require(`supertest`);
const category = require(`./category`);
const CategoryService = require(`../data-service/category`);
const {HttpCode} = require(`../../const`);
const mockData = require(`../../data/mocks-data-category.json`);

const app = express();
app.use(express.json());
category(app, new CategoryService(mockData));

describe(`Api returns category list`, () => {
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/categories`);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns 9 categories`, () => expect(response.body.length).toBe(9));
  test(`Category names are 'Разное', 'Кино', 'Музыка', 'Деревья', 'IT', 'Без рамки', 'Программирование', 'За жизнь', 'Желез'`, () => {
    expect(response.body).toEqual(expect.arrayContaining([`Разное`, `Кино`, `Музыка`, `Деревья`, `IT`, `Без рамки`, `Программирование`, `За жизнь`, `Желез`]));
  });
});
