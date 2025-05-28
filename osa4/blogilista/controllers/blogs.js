blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
	const blogs = await Blog
		.find({}).populate('user', { username: 1, name: 1 })
	response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
	const { title, author, url, likes } = request.body
	const user = request.user

	if (!title || !url) {
		return response.status(400).json({ error: 'title and url are required fields' })
	}

	const blog = new Blog({
		title,
		author,
		url,
		likes,
		user: user._id
	})

	let savedBlog = await blog.save()

	user.blogs = user.blogs.concat(savedBlog._id)
	await user.save()

	savedBlog = await savedBlog.populate('user', { username: 1, name: 1 })

	response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
	const user = request.user
	
	const blogToDelete = await Blog.findById(request.params.id)
	if (!blogToDelete) {
		return response.status(404).json({ error: 'could not find blog' })
	}

	if (blogToDelete.user.toString() !== user.id.toString()) {
		return response.status(403).json({ error: 'only creator of the blog can delete it' })
	}

	await Blog.findByIdAndDelete(request.params.id)
	response.status(204).end()
})

blogsRouter.put('/:id', async (request, response) => {
	const { title, author, url, likes } = request.body

	let updatedBlog = await Blog.findByIdAndUpdate(
		request.params.id,
		{ title, author, url, likes },
		{ new: true }
	)

	if (updatedBlog) {
		updatedBlog = await updatedBlog.populate('user', { username: 1, name: 1 })
		response.json(updatedBlog)
	} else {
		response.status(400).end()
	}
})

module.exports = blogsRouter