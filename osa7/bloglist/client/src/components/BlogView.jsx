import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const BlogView = ({ blogs, handleLike, handleDeletion, user }) => {
  const { id } = useParams();
  const blog = blogs.find((b) => b.id === id);

  if (!blog) {
    return null;
  }

  return (
    <div>
      <h2>
        {blog.title} {blog.author}
      </h2>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes}{' '}
        <Button id="like-button" onClick={() => handleLike(blog)}>
          like
        </Button>
      </div>
      <div id="blog-owner">added by {blog.user[0].username}</div>
      {blog.user[0].username === user.username && (
        <div>
          <Button id="delete-button" onClick={() => handleDeletion(blog)}>
            remove
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogView;
