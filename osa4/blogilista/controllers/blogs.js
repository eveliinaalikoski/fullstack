blogsRouter = require('express').Router()
const { response } = require('../app')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog.find({})
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const { title, author, url, likes } = request.body

	if (!title || !url) {
		return response.status(400).json({ error: 'title and url are required fields' })
	}

	const blog = new Blog({ title, author, url, likes })

	const savedBlog = await blog.save()
	response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
	const deletion = await Blog.findByIdAndDelete(request.params.id)

	if (deletion) {
		response.status(204).end()
	} else {
		response.status(400).end()
	}
})

blogsRouter.put('/:id', async (request, response) => {
	const { title, author, url, likes } = request.body

	const updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id,
		{ title, author, url, likes },
		{ new: true }
	)

	if (updatedBlog) {
		response.json(updatedBlog)
	} else {
		response.status(400).end()
	}
})

module.exports = blogsRouter