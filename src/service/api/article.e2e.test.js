const express = require(`express`);
const request = require(`supertest`);
const article = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const {HttpCode} = require(`../../const`);
const mockData = require(`../../data/mocks-data-article.json`);

const createApi = () => {
  const app = express();
  const clonedData = JSON.parse(JSON.stringify(mockData));
  app.use(express.json());
  article(app, new ArticleService(clonedData), new CommentService());
  return app;
};

describe(`API returns a list of articles`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles`);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns list of 5 articles`, () => expect(response.body.length).toBe(5));
  test(`First article id is "01xn1AFn"`, () => expect(response.body[0].id).toBe(`01xn1AFn`));
});

describe(`API returns an article by id`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .get(`/articles/yWcosm8S`);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Article title is "Учим HTML и CSS"`, () => expect(response.body.title).toBe(`Учим HTML и CSS`));
});

describe(`API creates an article with valid data`, () => {
  const newArticle = {
    announce: [`Announce of new article`],
    category: [`Category`],
    createdDate: String(new Date()),
    fullText: [`Full text of new article`],
    title: `New article`,
  };

  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .post(`/articles`)
      .send(newArticle);
  });
  test(`Returns status code 201`, () => expect(response.statusCode).toBe(HttpCode.CREATED));
  test(`Returns created article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Articles length is changed`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(6))
  );
});

describe(`API doesn't create an article with invalid data`, () => {
  const newArticle = {
    announce: [`Announce of new article`],
    category: [`Category`],
    createdDate: String(new Date()),
    fullText: [`Full text of new article`],
    title: `New article`,
  };

  const app = createApi();

  test(`Without any required keys response status code is 400`, async () => {
    for (const key of Object.keys(newArticle)) {
      const invalidArticle = {...newArticle};
      delete invalidArticle[key];

      await request(app)
        .post(`/articles`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    }
  });
});

describe(`API changes existed article if data is valid`, () => {
  const newArticle = {
    announce: [`Announce of new article`],
    category: [`Category`],
    createdDate: String(new Date()),
    fullText: [`Full text of new article`],
    title: `New article`,
  };

  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .put(`/articles/01xn1AFn`)
      .send(newArticle);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns changed article`, () => expect(response.body).toEqual(expect.objectContaining(newArticle)));
  test(`Article is changed`, () => request(app)
    .get(`/articles/01xn1AFn`)
    .expect((res) => expect(res.body.title).toBe(`New article`)));
});

describe(`API doesn't change an article: negative scenarios`, () => {
  const newArticle = {
    announce: [`Announce of new article`],
    category: [`Category`],
    createdDate: String(new Date()),
    fullText: [`Full text of new article`],
    title: `New article`,
  };

  const invalidArticle = {
    announce: [`Announce of new article`],
    category: [`Category`],
    createdDate: String(new Date()),
    fullText: [`Full text of new article`],
  };

  const app = createApi();

  test(`Returns status code 404 if article doesn't exist`, () => {
    return request(app)
      .put(`/articles/NOT_VALID_ID`)
      .send(newArticle)
      .expect(HttpCode.NOT_FOUND);
  });

  test(`Returns status code 400 if article is passed with invalid data`, () => {
    return request(app)
      .put(`/articles/01xn1AFn`)
      .send(invalidArticle)
      .expect(HttpCode.BAD_REQUEST);
  });
});

describe(`API deletes existed article by ID`, () => {
  const app = createApi();
  let response;

  beforeAll(async () => {
    response = await request(app)
      .delete(`/articles/cJSlxmmC`);
  });

  test(`Returns status code 200`, () => expect(response.statusCode).toBe(HttpCode.OK));
  test(`Returns deleted article`, () => expect(response.body.id).toBe(`cJSlxmmC`));
  test(`Artciles' length is 4 now`, () => request(app)
    .get(`/articles`)
    .expect((res) => expect(res.body.length).toBe(4))
  );
});

test(`API refuses to delete non-existed article`, () => {
  const app = createApi();

  return request(app)
    .delete(`/articles/NOT_EXISTED_ID`)
    .expect(HttpCode.NOT_FOUND);
});

