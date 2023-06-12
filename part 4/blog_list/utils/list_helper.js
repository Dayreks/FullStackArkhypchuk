const lodash = require('lodash')

const dummy = () => 1

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  const favorite = lodash.maxBy(blogs, 'likes')
  return favorite ? { title: favorite.title, author: favorite.author, likes: favorite.likes } : null
}

const mostBlogs = (blogs) => {
  const authors = lodash.countBy(blogs, 'author')
  const mostActiveAuthor = lodash.maxBy(lodash.toPairs(authors), lodash.last)
  return mostActiveAuthor ? { author: mostActiveAuthor[0], blogs: mostActiveAuthor[1] } : null
}

const mostLikes = (blogs) => {
  const authorLikes = lodash(blogs)
    .groupBy('author')
    .map((userBlogs, author) => ({
      author: author,
      likes: lodash.sumBy(userBlogs, 'likes')
    }))
    .value()

  return lodash.maxBy(authorLikes, 'likes')
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}
