const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')

const helper = require('./test_helper')

const Blog = require('../models/blog')
const User = require('../models/user')

let token

describe('when there is initially some notes saved', () => {
	beforeEach(async () => {
		await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secretpassword', 10)
    const user = new User({ username: 'tokenuser', passwordHash })
    await user.save()

		const loginUser = await api
			.post('/api/login')
			.send({ username:'tokenuser', password: 'secretpassword'})
		
		token = loginUser.body.token

		await Blog.deleteMany({})
		const initialBlogsWithUser = helper.initialBlogs.map(blog => new Blog({ ...blog, user: user.id }))
		await Blog.insertMany(initialBlogsWithUser)
	})

	test('blogs are returned as json', async () => {
		await api
			.get('/api/blogs')
			.set({ 'Authorization': `Bearer ${token}` })
			.expect(200)
			.expect('Content-Type', /application\/json/)
	})

	test('all blogs are returned', async () => {
		const response = await api
			.get('/api/blogs')
			.set({ 'Authorization': `Bearer ${token}` })

		assert.strictEqual(response.body.length, helper.initialBlogs.length)
	})

	test('indentifying field for blogs is id', async () => {
		const response = await api
			.get('/api/blogs')
			.set({ 'Authorization': `Bearer ${token}` })

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
				.set({ 'Authorization': `Bearer ${token}` })
				.send(newBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)
		
			const response = await api
				.get('/api/blogs')
				.set({ 'Authorization': `Bearer ${token}` })

			const titles = response.body.map(r => r.title)
		
			assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
			assert(titles.includes(newBlog.title))
		})

		test('fails with status code 401 if there is no token', async () => {
			const newBlog = {
				id: "5a422b3a1b54a676234d17f9",
				title: "Canonical string reduction",
				author: "Edsger W. Dijkstra",
				url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
				likes: 12,
			}
		
			const result = await api
				.post('/api/blogs')
				.send(newBlog)
				.expect(401)
				.expect('Content-Type', /application\/json/)

			const blogsAtEnd = await helper.blogsInDb()
			
			assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
			assert(result.body.error.includes('token not found'))
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
				.set({ 'Authorization': `Bearer ${token}` })
				.send(newBlog)
				.expect(201)
				.expect('Content-Type', /application\/json/)
		
			const response = await api
				.get('/api/blogs')
				.set({ 'Authorization': `Bearer ${token}` })

			const likes = response.body.map(r => r.likes)
		
			assert.strictEqual(response.body.length, helper.initialBlogs.length+1)
			assert(likes.includes(0))
		})
		
		test('fails with status code 400 if there is no title', async () => {
			const newBlog = {
				id: "5a422b3a1b54a676234d17f9",
				author: "Edsger W. Dijkstra",
				url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
				likes: 12,
			}
		
			await api
				.post('/api/blogs')
				.set({ 'Authorization': `Bearer ${token}` })
				.send(newBlog)
				.expect(400)
		
			const response = await api
				.get('/api/blogs')
				.set({ 'Authorization': `Bearer ${token}` })
		
			assert.strictEqual(response.body.length, helper.initialBlogs.length)
		})
		
		test('fails with status code 400 if there is no url', async () => {
			const newBlog = {
				id: "5a422b3a1b54a676234d17f9",
				title: "Canonical string reduction",
				author: "Edsger W. Dijkstra",
				likes: 12,
			}
		
			await api
				.post('/api/blogs')
				.set({ 'Authorization': `Bearer ${token}` })
				.send(newBlog)
				.expect(400)
		
			const response = await api
				.get('/api/blogs')
				.set({ 'Authorization': `Bearer ${token}` })
		
			assert.strictEqual(response.body.length, helper.initialBlogs.length)
		})	
	})

	describe('deletion of a blog', () => {
		test('succeeds with status code 204 if id is valid', async () => {
			const blogsAtStart = await helper.blogsInDb()
			const blogToDelete = blogsAtStart[0]

			await api
				.delete(`/api/blogs/${blogToDelete.id}`)
				.set({ 'Authorization': `Bearer ${token}` })
				.expect(204)
			
			const blogsAtEnd = await helper.blogsInDb()
			const ids = blogsAtEnd.map(n => n.id)
			
			assert(!ids.includes(blogToDelete.id))
			assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length-1)
		})

		test('fails with status code 400 if id is invalid', async () => {
			const invalidId = '5a422a851b54a676234d17f7'

			const result = await api
				.delete(`/api/blogs/${invalidId}`)
				.set({ 'Authorization': `Bearer ${token}` })
				.expect(404)
			
			const blogsAtEnd = await helper.blogsInDb()
			
			assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
			assert(result.body.error.includes('could not find blog'))
		})
	})

	describe('edition of a blog', () => {
		test('succeeds if id is valid', async () => {
			const blogsAtStart = await helper.blogsInDb()
			const blogToUpdate = blogsAtStart[0]

			const updatedBlog = { likes: 12 }

			await api
				.put(`/api/blogs/${blogToUpdate.id}`)
				.set({ 'Authorization': `Bearer ${token}` })
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
				.set({ 'Authorization': `Bearer ${token}` })
				.send(updatedBlog)
				.expect(400)
			
			const blogsAtEnd = await helper.blogsInDb()
			const likes = blogsAtEnd.map(n => n.likes)

			assert(!likes.includes(updatedBlog.likes))
			assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
		})
	})
})

describe('when there is initially some users saved', () => {
	beforeEach(async () => {
		await User.deleteMany({})

    const passwordHash = await bcrypt.hash('secretpassword', 10)
    const user = new User({ username: 'initial', passwordHash })

    await user.save()
	})

	describe('creation of a user', () => {
		test('succeeds with status code 200 if info is valid', async () => {
			const usersAtStart = await helper.usersInDb()

			const newUser = {
				username: 'pumpulinen',
				name: 'pumpuli',
				password: 'salainenpumpuli'
			}

			await api
				.post('/api/users')
				.send(newUser)
				.expect(201)
				.expect('Content-Type', /application\/json/)
			
			const usersAtEnd = await helper.usersInDb()
			const usernames = usersAtEnd.map(u => u.username)

			assert.strictEqual(usersAtEnd.length, usersAtStart.length+1)
			assert(usernames.includes(newUser.username))
		})

		test('fails with status code 401 if username is is too short', async () => {
			const usersAtStart = await helper.usersInDb()

			const newUser = {
				username: 'pu',
				name: 'pumpuli',
				password: 'salainenpumpuli'
			}

			const result = await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
				.expect('Content-Type', /application\/json/)
			
			const usersAtEnd = await helper.usersInDb()

			assert.strictEqual(usersAtEnd.length, usersAtStart.length)
			assert(result.body.error.includes('User validation failed'))
		})

		test('fails with status code 401 if password is too short', async () => {
			const usersAtStart = await helper.usersInDb()

			const newUser = {
				username: 'pumpulinen',
				name: 'pumpuli',
				password: 'sa'
			}

			const result = await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
				.expect('Content-Type', /application\/json/)
			
			const usersAtEnd = await helper.usersInDb()

			assert.strictEqual(usersAtEnd.length, usersAtStart.length)
			assert(result.body.error.includes('password needs to be at least 3 characters long'))
		})

		test('fails with status code 401 if username is already taken', async () => {
			const usersAtStart = await helper.usersInDb()

			const newUser = {
				username: 'initial',
				name: 'initial',
				password: 'secretpassword'
			}

			const result = await api
				.post('/api/users')
				.send(newUser)
				.expect(400)
				.expect('Content-Type', /application\/json/)
			
			const usersAtEnd = await helper.usersInDb()

			assert.strictEqual(usersAtEnd.length, usersAtStart.length)
			assert(result.body.error.includes('expected `username` to be unique'))
		})
	})

})

after(async () => {
	await User.deleteMany({})
  await mongoose.connection.close()
})