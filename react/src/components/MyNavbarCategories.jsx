import { Link } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';

function MyNavbarCategories({ categories }) {
  return (
    <>
      {categories && categories.length > 0
        ? categories.map((cat) => (
            <NavDropdown.Item key={cat.id} as={Link} to={`/category/${cat.slug}`}>
              {cat.name}
            </NavDropdown.Item>
          ))
        : <NavDropdown.Item disabled>無分類資料</NavDropdown.Item>
      }
    </>
  );
}

export default MyNavbarCategories;
