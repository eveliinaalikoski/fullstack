import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, handleLike, user, handleDeletion }) => {
  const [visible, setVisible] = useState('')

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  return (
    <div className='blog'>
      <div>
        {blog.title} {blog.author}
        <button
          onClick={toggleVisibility}
        >
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && <div>
        <div>{blog.url}</div>
        <div>
          likes {blog.likes} <button id='like-button' onClick={() => handleLike(blog)}>like</button>
        </div>
        <div id='blog-owner'>{blog.user[0].username}</div>
        {blog.user[0].username === user.username && <div>
          <button id='delete-button' onClick={() => handleDeletion(blog)}>remove</button>
        </div>}
      </div>
      }
    </div>
  )
}

// Blog.propTypes = {
//   blog: PropTypes.object.isRequired,
//   handleLike: PropTypes.func.isRequired,
//   user: PropTypes.object.isRequired,
//   handleDeletion: PropTypes.func.isRequired
// }

export default Blog