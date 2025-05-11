import { NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function MyNavbarCategories({ categories }) {
  return (
    <>
      {categories.map((category) => (
        <NavDropdown.Item key={category.id} as={Link} to={`/category/${category.id}`}>
          {category.name}
        </NavDropdown.Item>
      ))}
    </>
  );
}

export default MyNavbarCategories;
