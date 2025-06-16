const LoggedInUser = ({ user, handleLogout }) => {
  return (
    <span className="navtext">
      {user.username} logged in <button onClick={handleLogout}>logout</button>
    </span>
  );
};

export default LoggedInUser;
