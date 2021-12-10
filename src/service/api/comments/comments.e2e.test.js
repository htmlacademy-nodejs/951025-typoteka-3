const request = require(`supertest`);
const comments = require(`./comments`);
const CommentService = require(`../../data-service/comment`);
const {HttpCode} = require(`../../../const`);
const {Sequelize} = require(`sequelize`);
const express = require(`express`);
const fillDb = require(`../../lib/fill-db`);

const mockData = {
  articles: [
    {
      title: `Ёлки. История деревьев`,
      photo: `skyscraper@2x.jpg`,
      announcement: `Первая большая ёлка была установлена только в 1938 году.`,
      fullText: `Ёлки — это не просто красивое дерево. Это прочная древесина.`,
      comments: [
        {text: `Планируете записать видосик на эту тему?`},
        {text: `Это где ж такие красоты?`},
      ],
    },
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

const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});

const createApi = async () => {
  const app = express();
  app.use(express.json());
  await fillDb(mockDb, mockData);
  comments(app, new CommentService(mockDb));
  return app;
};

let app = null;
let response = null;

describe(`Comments`, () => {
  describe(`API returns a list of comments`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/comments`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });

    test(`Comments lenght is 2`, async () => {
      response = await request(app).get(`/comments`);
      expect(response.body.length).toBe(2);
    });

    test(`Text of first comment is "Планируете записать видосик на эту тему?"`, async () => {
      response = await request(app).get(`/comments`);
      expect(response.body[0].text).toBe(`Планируете записать видосик на эту тему?`);
    });
  });
});
