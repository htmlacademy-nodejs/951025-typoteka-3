const request = require(`supertest`);
const category = require(`./category`);
const CategoryService = require(`../data-service/category`);
const createApi = require(`../helpers/create-api`);
const {HttpCode} = require(`../../const`);
const mockData = require(`../../data/mocks-data-category.json`);

let app = null;
let response = null;
let categoryService = null;

describe(`Api returns category list`, () => {
  beforeEach(async () => {
    categoryService = new CategoryService(mockData);
    app = createApi(category, [categoryService]);
  });

  test(`Returns status code 200`, async () => {
    response = await request(app).get(`/categories`);
    expect(response.statusCode).toBe(HttpCode.OK);
  });
  test(`Returns 9 categories`, async () => {
    response = await request(app).get(`/categories`);
    expect(response.body.length).toBe(9);
  });
  test(`Category names are 'Разное', 'Кино', 'Музыка', 'Деревья', 'IT', 'Без рамки', 'Программирование', 'За жизнь', 'Желез'`, async () => {
    response = await request(app).get(`/categories`);
    expect(response.body).toEqual(expect.arrayContaining([`Разное`, `Кино`, `Музыка`, `Деревья`, `IT`, `Без рамки`, `Программирование`, `За жизнь`, `Желез`]));
  });
});
