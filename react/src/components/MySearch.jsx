import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

function MySearch() {
  return (
    <Form className="d-flex">
      <InputGroup>
        <Form.Control
          type="search"
          placeholder="搜尋商品"
          className="me-2"
          aria-label="Search"
        />
        <Button variant="outline-success">搜尋</Button>
      </InputGroup>
    </Form>
  );
}

export default MySearch;