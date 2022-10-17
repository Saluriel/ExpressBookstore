process.env.NODE_ENV = "test";

const request = require("supertest");
const app = require('../app');
const db = require("../db");
const Book = require("../models/book");
const jsonschema = require("jsonschema")
const bookSchema = require("../schemas/bookSchema.json");

beforeEach(async function () {
    const book = {
        book: {
            isbn: "0691161518",
            amazon_url: "http://a.co/eobPtX2",
            author: "Matthew Lane",
            language: "english",
            pages: 264,
            publisher: "Princeton University Press",
            title: "Power-Up: Unlocking Hidden Math in Video Games",
            year: 2017
        }
    }
    const newBook = await Book.create(book)
})

afterEach(async function () {
    await db.query(`DELETE FROM books`)
})


describe("GET /books", function () {
    test("Returns a list of books", async function () {
        const resp = await request(app).get(`/books`)
        expect(resp.statusCode).toBe(200);
        expect(resp.body.books[0].language).toEqual("english")
    })
})

describe("GET /books/:id", function () {
    test("Returns one book that matches the id", async function () {
        const resp = await request(app).get(`/books/0691161518`)
        expect(resp.statusCode).toBe(200);
        expect(resp.body.book.language).toEqual("english")
    })
    test("Returns an error if the book does not exist", async function () {
        const resp = await request(app).get(`/books/000`)
        expect(resp.statusCode).toBe(404)
    })
})

describe("POST /books", function () {
    test("Creates a new book", async function () {
        const resp = await request(app)
            .post(`/books`)
            .send({
                book: {
                    isbn: "12345678",
                    amazon_url: "http://heresalink.com",
                    author: "ME!!!!!!!",
                    language: "eldritch",
                    pages: 8,
                    publisher: "Did it in my backyard",
                    title: "Unlocking the eldritch secrets of your own backyard",
                    year: 2022
                }
            })
        expect(resp.statusCode).toBe(201);
        expect(resp.body.book.isbn).toEqual("12345678")
    })
    test("Shows an error when there is missing information", async function () {
        const resp = await request(app)
            .post(`/books`)
            .send({
                book: {
                    amazon_url: "http://heresalink.com",
                    author: "ME!!!!!!!",
                    language: "eldritch",
                    pages: 8,
                    publisher: "Did it in my backyard",
                    title: "Unlocking the eldritch secrets of your own backyard",
                    year: 2022
                }
            })
        expect(resp.statusCode).toBe(400);
    })
    test("Shows an error when information is not in the expected format", async function () {
        const resp = await request(app)
            .post(`/books`)
            .send({
                book: {
                    isbn: 12345,
                    amazon_url: "http://heresalink.com",
                    author: "ME!!!!!!!",
                    language: "eldritch",
                    pages: 8,
                    publisher: "Did it in my backyard",
                    title: "Unlocking the eldritch secrets of your own backyard",
                    year: 2022
                }
            })
        expect(resp.statusCode).toBe(400);
    })
})

describe("PUT /books/:id", function () {
    test("Updates a single book", async function () {
        const resp = await request(app)
            .put(`/books/0691161518`)
            .send({
                book: {
                    isbn: "0691161518",
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Matthew Lane",
                    language: "french",
                    pages: 264,
                    publisher: "Princeton University Press",
                    title: "Power-Up: Unlocking Hidden Math in Video Games",
                    year: 2017
                }
            })
        expect(resp.statusCode).toBe(200);
        expect(resp.body.book.language).toEqual("french")
    })
    test("Returns an error if there is missing data", async function () {
        const resp = await request(app)
            .put(`/books/0691161518`)
            .send({
                book: {
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Matthew Lane",
                    language: "french",
                    pages: 264,
                    publisher: "Princeton University Press",
                    title: "Power-Up: Unlocking Hidden Math in Video Games",
                    year: 2017
                }
            })
        expect(resp.statusCode).toBe(400);
    })
    test("Returns an error if data is in the wrong format", async function () {
        const resp = await request(app)
            .put(`/books/0691161518`)
            .send({
                book: {
                    isbn: 12345,
                    amazon_url: "http://a.co/eobPtX2",
                    author: "Matthew Lane",
                    language: "french",
                    pages: 264,
                    publisher: "Princeton University Press",
                    title: "Power-Up: Unlocking Hidden Math in Video Games",
                    year: 2017
                }
            })
        expect(resp.statusCode).toBe(400);
    })
})

describe("DELETE /books/:id", function () {
    test("Deletes a book by id", async function () {
        const resp = await request(app)
            .delete(`/books/0691161518`)

        expect(resp.statusCode).toBe(200)
        expect(resp.body).toEqual({ message: 'Book deleted' })
    })
    test("Throws an error if the book does not exist", async function () {
        const resp = await request(app)
            .delete(`/books/00000`)

        expect(resp.statusCode).toBe(404)

    })
})
