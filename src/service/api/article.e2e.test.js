const request = require(`supertest`);
const article = require(`./article`);
const ArticleService = require(`../data-service/article`);
const CommentService = require(`../data-service/comment`);
const createApi = require(`../helpers/create-api`);
const {HttpCode} = require(`../../const`);
const mockData = require(`../../data/mocks-data-article.json`);

// new ArticleService(clonedData), new CommentService()

let app = null;
let clonedData = null;
let response = null;
let articleService = null;
let commentService = null;

describe(`Article`, () => {
  describe(`API returns a list of articles`, () => {
    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      app = createApi(article, [new ArticleService(clonedData), new CommentService()]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/articles`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns list of 5 articles`, async () => {
      response = await request(app).get(`/articles`);
      expect(response.body.length).toBe(5);
    });
    test(`First article id is "01xn1AFn"`, async () => {
      response = await request(app).get(`/articles`);
      expect(response.body[0].id).toBe(`01xn1AFn`);
    });
  });

  describe(`API returns an article by id`, () => {
    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      app = createApi(article, [new ArticleService(clonedData), new CommentService()]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/articles/yWcosm8S`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Article title is "Учим HTML и CSS"`, async () => {
      response = await request(app).get(`/articles/yWcosm8S`);
      expect(response.body.title).toBe(`Учим HTML и CSS`);
    });
  });

  describe(`API creates an article`, () => {
    const newArticle = {
      announce: [`Announce of new article`],
      category: [`Category`],
      createdDate: String(new Date()),
      fullText: [`Full text of new article`],
      title: `New article`,
    };

    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      articleService = new ArticleService(clonedData);
      commentService = new CommentService();
      app = createApi(article, [articleService, commentService]);
    });
    test(`Status code 201`, async () => {
      response = await request(app).post(`/articles`).send(newArticle);
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
    test(`Returns created article`, async () => {
      response = await request(app).post(`/articles`).send(newArticle);
      expect(response.body).toEqual(expect.objectContaining(newArticle));
    });
    test(`Article is created`, async () => {
      response = await request(app).post(`/articles`).send(newArticle);
      const result = articleService.getOne(response.body.id);
      expect(result).toMatchObject(response.body);
    });
  });

  describe(`API refuses to create an article`, () => {
    const newArticle = {
      announce: [`Announce of new article`],
      category: [`Category`],
      createdDate: String(new Date()),
      fullText: [`Full text of new article`],
      title: `New article`,
    };

    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      app = createApi(article, [new ArticleService(clonedData), new CommentService()]);
    });

    test(`Status code 400 if one of required property is missed`, async () => {
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

  describe(`API changes an article`, () => {
    const newArticle = {
      announce: [`Announce of new article`],
      category: [`Category`],
      createdDate: String(new Date()),
      fullText: [`Full text of new article`],
      title: `New article`,
    };


    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      articleService = new ArticleService(clonedData);
      commentService = new CommentService();
      app = createApi(article, [articleService, commentService]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).put(`/articles/01xn1AFn`).send(newArticle);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns changed article`, async () => {
      response = await request(app).put(`/articles/01xn1AFn`).send(newArticle);
      expect(response.body).toEqual(expect.objectContaining(newArticle));
    });
    test(`Article is changed`, async () => {
      response = await request(app).put(`/articles/01xn1AFn`).send(newArticle);
      const result = articleService.getOne(response.body.id);
      expect(result.title).toBe(`New article`);
    });
  });

  describe(`API refuses to change an article`, () => {
    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      app = createApi(article, [new ArticleService(clonedData), new CommentService()]);
    });

    test(`Status code 404 if article doesn't exist`, () => {
      const newArticle = {
        announce: [`Announce of new article`],
        category: [`Category`],
        createdDate: String(new Date()),
        fullText: [`Full text of new article`],
        title: `New article`,
      };

      return request(app)
        .put(`/articles/NOT_VALID_ID`)
        .send(newArticle)
        .expect(HttpCode.NOT_FOUND);
    });

    test(`Status code 400 if article is passed with invalid data`, () => {
      const invalidArticle = {
        announce: [`Announce of new article`],
        category: [`Category`],
        createdDate: String(new Date()),
        fullText: [`Full text of new article`],
      };

      return request(app)
        .put(`/articles/01xn1AFn`)
        .send(invalidArticle)
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API deletes existed article by ID`, () => {
    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      articleService = new ArticleService(clonedData);
      commentService = new CommentService();
      app = createApi(article, [articleService, commentService]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).delete(`/articles/cJSlxmmC`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns deleted article`, async () => {
      response = await request(app).delete(`/articles/cJSlxmmC`);
      expect(response.body.id).toBe(`cJSlxmmC`);
    });
    test(`Artcile is deleted`, async () => {
      response = await request(app).delete(`/articles/cJSlxmmC`);
      const result = articleService.getOne(response.body.id);
      expect(result).toBe(undefined);
    });
  });

  describe(`API refuses to delete an article`, () => {
    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      app = createApi(article, [new ArticleService(clonedData), new CommentService()]);
    });

    test(`API refuses to delete non-existed article`, () => {
      return request(app)
        .delete(`/articles/NOT_EXISTED_ID`)
        .expect(HttpCode.NOT_FOUND);
    });
  });

  describe(`API returns a list of comments of an article`, () => {
    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      articleService = new ArticleService(clonedData);
      commentService = new CommentService();
      app = createApi(article, [articleService, commentService]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).get(`/articles/-BfPw855/comments`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns 4 comments`, async () => {
      response = await request(app).get(`/articles/-BfPw855/comments`);
      expect(response.body.length).toBe(4);
    });
    test(`First comment id is "3ZZomiGu"`, async () => {
      response = await request(app).get(`/articles/-BfPw855/comments`);
      expect(response.body[0].id).toBe(`3ZZomiGu`);
    });
  });

  describe(`API creates a comment with valid data`, () => {
    const newComment = {text: `Text of new comment`};

    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      articleService = new ArticleService(clonedData);
      commentService = new CommentService();
      app = createApi(article, [articleService, commentService]);
    });

    test(`Status code 201`, async () => {
      response = await request(app).post(`/articles/-BfPw855/comments`).send(newComment);
      expect(response.statusCode).toBe(HttpCode.CREATED);
    });
    test(`Returns created comment`, async () => {
      response = await request(app).post(`/articles/-BfPw855/comments`).send(newComment);
      expect(response.body).toEqual(expect.objectContaining(newComment));
    });
  });

  describe(`API refuses to create a comment`, () => {
    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      app = createApi(article, [new ArticleService(clonedData), new CommentService()]);
    });

    test(`If article doesn't exist`, () => {
      return request(app)
        .post(`/articles/NO_ARTICLE/comments`)
        .send({text: `Valid comment`})
        .expect(HttpCode.NOT_FOUND);
    });
    test(`If comment's data is invalid`, () => {
      return request(app)
        .post(`/articles/-BfPw855/comments`)
        .send({})
        .expect(HttpCode.BAD_REQUEST);
    });
  });

  describe(`API deletes a comment`, () => {
    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      articleService = new ArticleService(clonedData);
      commentService = new CommentService();
      app = createApi(article, [articleService, commentService]);
    });

    test(`Status code 200`, async () => {
      response = await request(app).delete(`/articles/sHN0hMC9/comments/iAK-vQeJ`);
      expect(response.statusCode).toBe(HttpCode.OK);
    });
    test(`Returns deleted comment`, async () => {
      response = await request(app).delete(`/articles/sHN0hMC9/comments/iAK-vQeJ`);
      expect(response.body.id).toBe(`iAK-vQeJ`);
    });
  });

  describe(`API refuses to delete a comment`, () => {
    beforeEach(async () => {
      clonedData = JSON.parse(JSON.stringify(mockData));
      app = createApi(article, [new ArticleService(clonedData), new CommentService()]);
    });

    test(`If comment doesn't exist`, () => request(app)
      .delete(`/articles/sHN0hMC9/comments/COMMENT_DOESNT_EXIST`)
      .expect(HttpCode.NOT_FOUND)
    );
    test(`If article doesn't exist`, () => request(app)
      .delete(`/articles/ARTICLE_DOESNT_EXIST/comments/comment_id`)
      .expect(HttpCode.NOT_FOUND)
    );
  });
});
