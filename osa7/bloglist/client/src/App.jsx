import { useState, useEffect, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import blogService from './services/blogs';
import ErrorMessage from './components/ErrorMessage';
import Notification from './components/Notification';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import UserList from './components/UserList';
import BlogList from './components/BlogList';
import User from './components/User';
import BlogView from './components/BlogView';
import Menu from './components/Menu';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const [notification, setNotification] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogappUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
      setNotification('login successful');
      setTimeout(() => setNotification(null), 5000);
    } catch (exception) {
      setErrorMessage('wrong username or password');
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogappUser');
    setUser(null);
    setBlogs([]);
    setNotification('logout successful');
    setTimeout(() => setNotification(null), 5000);
  };

  const addBlog = async (newBlog) => {
    blogFormRef.current.toggleVisibility();
    const { title, author, url } = newBlog;

    if (!title || !author || !url) {
      setErrorMessage('all fields are required');
      setTimeout(() => setErrorMessage(null), 5000);
      return;
    }

    try {
      const newBlog = await blogService.create({
        title,
        author,
        url,
      });
      setBlogs(blogs.concat(newBlog));
      setNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`);
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setErrorMessage('creating blog failed');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleLike = async (blog) => {
    const likedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };

    try {
      const updatedBlog = await blogService.like(likedBlog);
      setBlogs(blogs.map((b) => (b.id !== blog.id ? b : updatedBlog)));
      setNotification('liked a blog');
      setTimeout(() => setNotification(null), 5000);
    } catch (error) {
      setErrorMessage('failed giving a like');
      setTimeout(() => setErrorMessage(null), 5000);
    }
  };

  const handleDeletion = async (blog) => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      try {
        await blogService.deletion(blog.id);
        setBlogs(blogs.filter((b) => b.id !== blog.id));
        setNotification(`removed blog ${blog.title} by ${blog.author}`);
        setTimeout(() => setNotification(null), 5000);
      } catch (error) {
        setErrorMessage('failed removing a blog');
        setTimeout(() => setErrorMessage(null), 5000);
      }
    }
  };

  useEffect(() => {
    if (user) {
      blogService.getAll().then((blogs) => setBlogs(blogs));
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const loginForm = () => {
    return (
      <div>
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      </div>
    );
  };

  return (
    <div className="container">
      <Menu user={user} handleLogout={handleLogout} />
      <h1>BlogApp</h1>
      <Notification message={notification} />
      <ErrorMessage message={errorMessage} />

      {!user && loginForm()}

      {user && (
        <div>
          <Routes>
            <Route
              path="/"
              element={
                <BlogList
                  blogs={blogs}
                  addBlog={addBlog}
                  blogFormRef={blogFormRef}
                />
              }
            />
            <Route
              path="/blogs/:id"
              element={
                <BlogView
                  blogs={blogs}
                  handleLike={handleLike}
                  handleDeletion={handleDeletion}
                  user={user}
                />
              }
            />
            <Route path="/users" element={<UserList />} />
            <Route path="/users/:id" element={<User />} />
          </Routes>
        </div>
      )}
    </div>
  );
};

export default App;
