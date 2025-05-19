const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)

const helper = require('./test_helper')

const Blog = require('../models/blog')

beforeEach(async () => {
	await Blog.deleteMany({})
	await Blog.insertMany(helper.initialBlogs)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')

	assert.strictEqual(response.body.length, helper.initialBlogs.length)
})

test('indentifying field for blogs is id', async () => {
	const response = await api.get('/api/blogs')

	for (const blog of response.body) {
		assert.ok(blog.id)
		assert.strictEqual(blog._id, undefined)
	}
})
describe('addition of a new blog', () => {
	test('a valid blog can be added', async () => {
		const newBlog = {
			id: "5a422b3a1b54a676234d17f9",
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
			likes: 12,
	  }
	
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
	
		const response = await api.get('/api/blogs')
		const titles = response.body.map(r => r.title)
	
		assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
		assert(titles.includes(newBlog.title))
	})
	
	test('if not given a value, field likes gets value zero', async () => {
		const newBlog = {
			id: "5a422b3a1b54a676234d17f9",
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
	  }
	
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(201)
			.expect('Content-Type', /application\/json/)
	
		const response = await api.get('/api/blogs')
		const likes = response.body.map(r => r.likes)
	
		assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
		assert(likes.includes(0))
	})
	
	test('can not add a blog without title', async () => {
		const newBlog = {
			id: "5a422b3a1b54a676234d17f9",
			author: "Edsger W. Dijkstra",
			url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
			likes: 12,
	  }
	
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
	
		const response = await api.get('/api/blogs')
	
		assert.strictEqual(response.body.length, helper.initialBlogs.length)
	})
	
	test('can not add a blog without url', async () => {
		const newBlog = {
			id: "5a422b3a1b54a676234d17f9",
			title: "Canonical string reduction",
			author: "Edsger W. Dijkstra",
			likes: 12,
	  }
	
		await api
			.post('/api/blogs')
			.send(newBlog)
			.expect(400)
	
		const response = await api.get('/api/blogs')
	
		assert.strictEqual(response.body.length, helper.initialBlogs.length)
	})	
})

describe('deletion of a blog', () => {
	test('succeeds with status code 204 if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToDelete = blogsAtStart[0]

		await api
			.delete(`/api/blogs/${blogToDelete.id}`)
			.expect(204)
		
		const blogsAtEnd = await helper.blogsInDb()
		const ids = blogsAtEnd.map(n => n.id)
		
		assert(!ids.includes(blogToDelete.id))
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length-1)
	})

	test('fails with status code 400 if id is invalid', async () => {
		const invalidId = '5a422a851b54a676234d17f7'

		await api
			.delete(`/api/blogs/${invalidId}`)
			.expect(400)
		
		const blogsAtEnd = await helper.blogsInDb()
		
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
	})
})

describe('edition of a blog', () => {
	test('succeeds if id is valid', async () => {
		const blogsAtStart = await helper.blogsInDb()
		const blogToUpdate = blogsAtStart[0]

		const updatedBlog = { likes: 12 }

		await api
			.put(`/api/blogs/${blogToUpdate.id}`)
			.send(updatedBlog)
			.expect(200)
		
		const blogsAtEnd = await helper.blogsInDb()
		const likes = blogsAtEnd.map(n => n.likes)

		assert(!likes.includes(blogToUpdate.likes))
		assert(likes.includes(updatedBlog.likes))
	})

	test('fails with status code 400 if id is invalid', async () => {
		const invalidId = '5a422a851b54a676234d17f7'
		const updatedBlog = { likes: 12 }

		await api
			.put(`/api/blogs/${invalidId}`)
			.send(updatedBlog)
			.expect(400)
		
		const blogsAtEnd = await helper.blogsInDb()
		const likes = blogsAtEnd.map(n => n.likes)

		assert(!likes.includes(updatedBlog.likes))
		assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
	})
})

after(async () => {
  await mongoose.connection.close()
})