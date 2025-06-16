import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import userService from '../services/user';

const User = () => {
  const [user, setUser] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    userService.getUserById(id).then((res) => setUser(res));
  }, [id]);

  if (!user) {
    return null;
  }

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default User;
