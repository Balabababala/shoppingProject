import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';

function MySearch() {
  const [keyword, setKeyword] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const trimmed = keyword.trim();
    if (trimmed) {
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // 防止表單自動提交刷新頁面
      handleSearch();
    }
  };

  return (
    
    <Form className="d-flex" onSubmit={e => e.preventDefault()}>
      <InputGroup>
        <Form.Control
          type="search"
          placeholder="搜尋商品"
          className="me-2"
          aria-label="Search"
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <Button variant="outline-success" onClick={handleSearch}>
          搜尋
        </Button>
      </InputGroup>
    </Form>
  );
}

export default MySearch;
