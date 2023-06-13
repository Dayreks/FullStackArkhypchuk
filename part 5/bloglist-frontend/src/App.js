import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import loginService from './services/login'
import blogService from './services/blogs'

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })
  const [message, setMessage] = useState(null)
  const [visible, setVisible] = useState(false)

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      blogService.setToken(user.token)
      setUser(user)
    }
  }, [])

  useEffect(() => {
    blogService
      .getAll().then(initialBlogs => {
        setBlogs(initialBlogs)
      })
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user))
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      handleMessage('wrong username or password')
    }
  }

  const handleLogout = () => {
    window.localStorage.clear()
  }

  const handleMessage = (text) => {
    setMessage(text)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const blogObject = {
      title: newBlog.title,
      author: newBlog.author,
      url: newBlog.url
    }
    try {
      setNewBlog(blogObject)
      const returnedObject = await blogService.create(blogObject, user.username)
      setBlogs(blogs.concat(returnedObject))
      setNewBlog({ title: '', author: '', url: '' })
      handleMessage(`a new blog ${returnedObject.title} by ${returnedObject.author} added`)
    } catch (exception) {
      alert(exception)
    }
  }

  if (user === null) {
    return (
      <>
        <h2>Log in to application</h2>
        <p><b>{message}</b></p>
        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" value={username} id="username" name="Username" onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type="password" value={password} id="password" name="Password" onChange={({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </>
    )
  }

  return (
    <>
      <h2>blogs</h2>
      <p><b>{message}</b></p>
      <div>{user.name} logged in <button type="button" onClick={handleLogout}>logout</button></div>
      <div style={hideWhenVisible}>
        <button type="button" onClick={() => setVisible(true)}>new note</button>
      </div>
      <div style={showWhenVisible}>
        <BlogForm handleSubmit={handleSubmit} newBlog={newBlog} setVisible={setVisible} setNewBlog={setNewBlog} />
      </div>
      {blogs.sort((a, b) => (a.likes > b.likes) ? -1 : 1).map(blog => <Blog key={blog.id} blog={blog} />)}
    </>
  )
}

export default App
