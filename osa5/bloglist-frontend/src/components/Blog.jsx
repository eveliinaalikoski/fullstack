import { useState } from "react"

const Blog = ({ blog, handleLike }) => {
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
          likes {blog.likes} <button onClick={() => handleLike(blog)}>like</button>
        </div>
        <div>{blog.user[0].username}</div>
      </div>
      }
    </div>
  )
}

export default Blog