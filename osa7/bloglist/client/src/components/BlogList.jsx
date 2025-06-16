import Toggable from './Toggable';
import BlogForm from './BlogForm';
import Blog from './Blog';
import { ListGroup } from 'react-bootstrap';

const BlogList = ({ blogs, addBlog, blogFormRef }) => {
  return (
    <div>
      <Toggable buttonLabel="create a new blog" ref={blogFormRef}>
        <BlogForm createBlog={addBlog} />
      </Toggable>

      <h2>blogs</h2>
      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog key={blog.id} blog={blog} />
        ))}
    </div>
  );
};

export default BlogList;
