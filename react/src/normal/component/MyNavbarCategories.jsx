import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';  // 正確導入 NavDropdown

function MyNavbarCategories({ categories }) {
  return (
    <>
      {categories.map((cat) => (
        <NavDropdown.Item key={cat.id} as={Link} to={`/product/${cat.id}`}>
          {cat.name}
        </NavDropdown.Item>
      ))}
    </>
  );
}

export default MyNavbarCategories;