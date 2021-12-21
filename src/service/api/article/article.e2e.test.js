const request = require(`supertest`);
const article = require(`./article`);
const ArticleService = require(`../../data-service/article`);
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
      comments: [{text: `Планируете записать видосик на эту тему?`}],
    },
    {
      title: `Лучшие рок-музыканты 20-века`,
      photo: `skyscraper@2x.jpg`,
      announcement: `Это один из лучших рок-музыкантов.`,
      fullText: `Альбом стал настоящим открытием года. Мощные гитарные рифы и скоростные соло-партии не дадут заскучать`,
      comments: [{text: `Это где ж такие красоты?`}],
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

const mockDb = new Sequelize(`sqlite::memory:`, {logging: false});

const createApi = async () => {
  const app = express();
  app.use(express.json());
  await fillDb(mockDb, mockData);
  article(app, new ArticleService(mockDb), new CommentService(mockDb));
  return app;
};

let app = null;
let response = null;
let articleService = null;

describe(`Article`, () => {
  describe(`API returns a list of articles`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/articles`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns list of 2 articles`, async () => {
      response = await request(app).get(`/articles`);
      expect(response.body.length).toBe(2);
    });
    test(`First article id is 1`, async () => {
      response = await request(app).get(`/articles`);
      expect(response.body[0].id).toBe(1);
    });
  });

  describe(`API returns an article by id`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/articles/1`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Article title is "Ёлки. История деревьев"`, async () => {
      response = await request(app).get(`/articles/1`);
      expect(response.body.title).toBe(`Ёлки. История деревьев`);
    });
  });

  describe(`API creates an article`, () => {
    const newArticle = {
      announcement: `Announce of new article`,
      categories: [1],
      fullText: `Full text of new article`,
      title: `New article`,
    };

    beforeEach(async () => {
      app = await createApi();
    });
    test(`Status code 201`, async () => {
      response = await request(app).post(`/articles`).send(newArticle);
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
    test(`Article is created`, async () => {
      articleService = new ArticleService(mockDb);
      response = await request(app).post(`/articles`).send(newArticle);
      const result = await articleService.findOne(response.body.id);
      expect(result.dataValues.title).toEqual(response.body.title);
    });
  });

  describe(`API refuses to create an article`, () => {
    const newArticle = {
      announcement: `Announce of new article`,
      categories: [1],
      fullText: `Full text of new article`,
      title: `New article`,
    };


    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 400 if one of required property is missed`, async () => {
      for (const key of Object.keys(newArticle)) {
        const invalidArticle = {...newArticle};
        delete invalidArticle[key];

        response = await request(app).post(`/articles`).send(newArticle);
        await request(app)
          .post(`/articles`)
          .send(invalidArticle)
          .expect(HttpCode.BAD_REQUEST);
      }
    });
  });

  describe(`API changes an article`, () => {
    const newArticle = {
      announcement: `Announce of new article`,
      categories: [1],
      fullText: `Full text of new article`,
      title: `New article`,
    };

    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 200`, async () => {
      response = await request(app).put(`/articles/1`).send(newArticle);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Article is changed`, async () => {
      response = await request(app).put(`/articles/1`).send(newArticle);

      await request(app)
        .get(`/articles/1`)
        // eslint-disable-next-line max-nested-callbacks
        .expect((res) => expect(res.body.title).toBe(`New article`));
    });
  });

  describe(`API refuses to change an article`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 404 if article doesn't exist`, () => {
      const newArticle = {
        announcement: `Announce of new article`,
        categories: [1],
        fullText: `Full text of new article`,
        title: `New article`,
      };

      return request(app)
        .put(`/articles/NOT_VALID_ID`)
        .send(newArticle)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`Status code 400 if article is passed with invalid data`, () => {
      const invalidArticle = {
        announcement: `Announce of new article`,
        categories: [1],
        fullText: `Full text of new article`,
      };

      return request(app)
        .put(`/articles/1`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API deletes existed article by ID`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 200`, async () => {
      response = await request(app).delete(`/articles/1`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Artcile is deleted`, async () => {
      articleService = new ArticleService(mockDb);
      response = await request(app).delete(`/articles/1`);
      const result = await articleService.findOne(response.body.id);

      expect(result).toBe(null);
    });
  });

  describe(`API refuses to delete an article`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`API refuses to delete non-existed article`, () => {
      return request(app)
        .delete(`/articles/NOT_EXISTED_ID`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API returns a list of comments of an article`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/articles/1/comments`);

      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns 1 comment`, async () => {
      response = await request(app).get(`/articles/1/comments`);
      expect(response.body.length).toBe(1);
    });
    test(`First comment text is "Планируете записать видосик на эту тему?"`, async () => {
      response = await request(app).get(`/articles/1/comments`);
      expect(response.body[0].text).toBe(`Планируете записать видосик на эту тему?`);
    });
  });

  describe(`API creates a comment with valid data`, () => {
    const newComment = {text: `Text of new comment`};

    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 201`, async () => {
      response = await request(app).post(`/articles/1/comments`).send(newComment);
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
    test(`Returns created comment`, async () => {
      response = await request(app).post(`/articles/1/comments`).send(newComment);
      expect(response.body).toEqual(expect.objectContaining(newComment));
    });
    test(`Comments length is changed`, async () => {
      response = await request(app).post(`/articles/1/comments`).send(newComment);

      request(app)
        .get(`/articles/1/comments`)
        // eslint-disable-next-line max-nested-callbacks
        .expect((res) => expect(res.body.length).toBe(2));
    });
  });

  describe(`API refuses to create a comment`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`If article doesn't exist`, async () => {
      await request(app)
        .post(`/articles/NO_ARTICLE/comments`)
        .send({text: `Valid comment`})
        .expect(HttpCode.NOT_FOUND);
    });
    test(`If comment's data is invalid`, () => {
      return request(app)
        .post(`/articles/1/comments`)
        .send({})
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API deletes a comment`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`Status code 200`, async () => {
      response = await request(app).delete(`/articles/1/comments/1`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Comments length is decreased`, async () => {
      response = await request(app).delete(`/articles/1/comments/1`);

      await request(app)
        .get(`/articles/1/comments`)
        // eslint-disable-next-line max-nested-callbacks
        .expect((res) => expect(res.body.length).toBe(0));
    });
  });

  describe(`API refuses to delete a comment`, () => {
    beforeEach(async () => {
      app = await createApi();
    });

    test(`If comment doesn't exist`, () => request(app)
      .delete(`/articles/1/comments/COMMENT_DOESNT_EXIST`)
      .expect(HttpCode.NOT_FOUND)
    );
    test(`If article doesn't exist`, () => request(app)
      .delete(`/articles/ARTICLE_DOESNT_EXIST/comments/comment_id`)
      .expect(HttpCode.NOT_FOUND)
    );
  });
});
