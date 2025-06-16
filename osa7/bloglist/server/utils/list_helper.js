const dummy = (blogs) => {
	return 1
}

const totalLikes = (blogs) => {
	const reducer = (sum, blog) => {
		return sum + blog.likes
	}
	return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
	if (blogs.length === 0)
		return null

	const reducer = (favorite, current) => {
		return current.likes > favorite.likes ? current : favorite
	}
	return blogs.reduce(reducer)
}

const mostBlogs = (blogs) => {
	if (blogs.length === 0)
		return null

	const counts = {}

	for (const blog of blogs) {
		if (!counts[blog.author]) {
			counts[blog.author] = 0
		}
		counts[blog.author] += 1
	}

	let biggestAuthor = null
	let amountOfBlogs = 0

	for (const author in counts) {
		if (counts[author] > amountOfBlogs) {
			biggestAuthor = author
			amountOfBlogs = counts[author]
		}
	}
	
	return {author: biggestAuthor, blogs: amountOfBlogs}
}

const mostLikes = (blogs) => {
	if (blogs.length === 0)
		return null

	const likes = {}

	for (const blog of blogs) {
		if (!likes[blog.author]) {
			likes[blog.author] = 0
		}
		likes[blog.author] += blog.likes
	}

	let mostLikedAuthor = null
	let amountOfLikes = 0

	for (const author in likes) {
		if (likes[author] > amountOfLikes) {
			mostLikedAuthor = author
			amountOfLikes = likes[author]
		}
	}
	
	return {author: mostLikedAuthor, likes: amountOfLikes}
}

module.exports = {
  dummy,
	totalLikes,
	favoriteBlog,
	mostBlogs,
	mostLikes
}