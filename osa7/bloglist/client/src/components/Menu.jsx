import { Link } from 'react-router-dom';
import LoggedInUser from './LoggedInUser';
import { Navbar, Nav } from 'react-bootstrap';

const Menu = ({ user, handleLogout }) => {
  return (
    <Navbar collapseOnSelect expand="lg" bg="light" variant="light">
      <Navbar.Toggle aria-controls="responsive-navbar-nav" />
      <Navbar.Collapse id="responsive-navbar-nav">
        <Nav className="mr-auto">
          <Link className="navlink" to={'/'}>
            Blogs
          </Link>
          <Link className="navlink" to={'/users'}>
            users
          </Link>
          {user && <LoggedInUser user={user} handleLogout={handleLogout} />}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Menu;
