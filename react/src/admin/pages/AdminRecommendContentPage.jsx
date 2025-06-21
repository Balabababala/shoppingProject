import React, { useContext, useEffect, useState } from 'react';
import { AdminAppContext } from '../contexts/AdminAppContext';
import { Modal, Form, Button, Container } from 'react-bootstrap';
import Select from 'react-select';

const PAGE_SIZE = 20;

function AdminRecommendContentPage() {
  const { API_BASE, adminUserData, fetchWithAuthCheck, addToastMessage, handleLogout } = useContext(AdminAppContext);
  const [contents, setContents] = useState([]);
  const [products, setProducts] = useState([]);
  const [rules, setRules] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentContent, setCurrentContent] = useState({
    id: null,
    product: null,
    userId: null,
    ruleId: null,
    reason: '',
    score: 0.0,
    active: false,
  });

  const fetchData = async () => {
    if (!adminUserData) {
      setError('請先登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const contentRes = await fetchWithAuthCheck(`${API_BASE}/admin/recommend/content`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const productRes = await fetchWithAuthCheck(`${API_BASE}/admin/products`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const ruleRes = await fetchWithAuthCheck(`${API_BASE}/admin/recommend/rules`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const userRes = await fetchWithAuthCheck(`${API_BASE}/admin/users`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (contentRes?.authError || productRes?.authError || ruleRes?.authError || userRes?.authError) {
        handleLogout('身份驗證失效，請重新登入');
        setError('身份驗證失效');
        return;
      }

      if (contentRes?.data && productRes?.data && ruleRes?.data && userRes?.data) {
        setContents(contentRes.data);
        setProducts(productRes.data);
        setRules(ruleRes.data);
        setUsers(userRes.data);
        setCurrentPage(1);
      } else {
        setError('取得數據失敗');
        addToastMessage('取得數據失敗');
      }
    } catch (e) {
      console.error('Fetch data error:', e);
      setError('取得數據時發生錯誤');
      addToastMessage('取得數據時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [adminUserData]);

  const productOptions = products.map(product => ({
    value: product.id,
    label: product.name,
  }));

  const sortedContents = [...contents];
  if (sortBy) {
    sortedContents.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'productName' || sortBy === 'username' || sortBy === 'ruleName') {
        valA = valA || '';
        valB = valB || '';
      } else if (sortBy === 'active') {
        valA = valA ? 1 : 0;
        valB = valB ? 1 : 0;
      }
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return sortAsc ? valA - valB : valB - valA;
      }
    });
  }

  const filteredContents = sortedContents.filter(c => {
    const kw = searchKeyword.trim().toLowerCase();
    return (
      kw === '' ||
      (c.productName || '').toLowerCase().includes(kw) ||
      (c.username || '').toLowerCase().includes(kw) ||
      (c.reason || '').toLowerCase().includes(kw) ||
      String(c.id).includes(kw)
    );
  });

  const totalPage = Math.max(1, Math.ceil(filteredContents.length / PAGE_SIZE));
  const pageContents = filteredContents.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  const handleOpenModal = (contentInput = {
    id: null,
    product: null,
    userId: null,
    ruleId: null,
    reason: '',
    score: 0.0,
    active: false,
  }) => {
    const productId = contentInput.productId ?? contentInput.product?.value;
    const selectedProduct = productOptions.find(opt => opt.value === productId) || null;
    const newContent = {
      ...contentInput,
      product: selectedProduct,
      userId: contentInput.userId ? String(contentInput.userId) : '', // 確保與 Form.Select 一致
    };
    setCurrentContent(newContent);
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminUserData) {
      addToastMessage('請先登入');
      return;
    }
    if (!currentContent.product?.value || !currentContent.ruleId || currentContent.score < 0 || currentContent.score > 1) {
      addToastMessage('請選擇產品、規則，並確保分數在 0-1 之間');
      return;
    }
    const method = currentContent.id ? 'PUT' : 'POST';
    const url = currentContent.id
      ? `${API_BASE}/admin/recommend/content/${currentContent.id}`
      : `${API_BASE}/admin/recommend/content`;

    try {
      const payload = {
        id: currentContent.id ?? null,
        userId: currentContent.userId ? Number(currentContent.userId) : null, // 允許 null
        productId: currentContent.product?.value ? Number(currentContent.product.value) : null,
        ruleId: currentContent.ruleId ? Number(currentContent.ruleId) : null,
        reason: currentContent.reason?.trim() || null,
        score: Number(currentContent.score),
        active: Boolean(currentContent.active),
      };
      console.log('Sending payload:', payload); // 除錯用
      const res = await fetchWithAuthCheck(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res?.authError) {
        handleLogout('身份驗證失效，請重新登入');
        return;
      }

      if (res?.message) {
        addToastMessage(res.message);
        fetchData();
        setShowModal(false);
        setCurrentContent({
          id: null,
          product: null,
          userId: null,
          ruleId: null,
          reason: '',
          score: 0.0,
          active: false,
        });
      } else {
        addToastMessage(res?.error || '操作失敗，請重試');
      }
    } catch (error) {
      console.error('Submit error:', error);
      addToastMessage('操作失敗：' + error.message);
    }
  };

  const deleteContent = async (id) => {
    if (!window.confirm('確定要刪除此推薦內容？')) return;
    if (!adminUserData) {
      addToastMessage('請先登入');
      return;
    }
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/recommend/content/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res?.authError) {
        handleLogout('身份驗證失效，請重新登入');
        return;
      }

      if (res?.message) {
        addToastMessage(res.message);
        fetchData();
      } else {
        addToastMessage(res?.error || '刪除推薦內容失敗，請重試');
      }
    } catch (error) {
      console.error('Delete error:', error);
      addToastMessage('刪除推薦內容失敗：' + error.message);
    }
  };

  if (loading) return <div style={{ padding: 20, textAlign: 'center' }}>載入中...</div>;
  if (error) return <div style={{ padding: 20, color: 'red', textAlign: 'center' }}>{error}</div>;
  if (!adminUserData) return <div style={{ padding: 20, textAlign: 'center' }}>請先登入才能管理推薦內容</div>;

  return (
    <Container className="my-4">
      <h2 className="mb-4">管理員推薦內容列表</h2>

      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="primary" onClick={() => handleOpenModal()}>
          新增推薦內容
        </Button>
        <input
          type="text"
          placeholder="搜尋產品名稱、用戶名或推薦原因"
          value={searchKeyword}
          onChange={e => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          style={{
            flexGrow: 1,
            maxWidth: 300,
            padding: '6px 8px',
            borderRadius: 4,
            border: '1px solid #ccc',
            fontSize: 14,
          }}
        />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 2fr 1fr 1fr 2fr 100px 100px 200px',
          fontWeight: 'bold',
          borderBottom: '2px solid #333',
          paddingBottom: 6,
          cursor: 'default',
        }}
      >
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('id')}
          aria-label="依推薦ID排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('id'); }}
        >
          推薦ID {sortBy === 'id' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('productName')}
          aria-label="依產品名稱排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('productName'); }}
        >
          產品名稱 {sortBy === 'productName' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('username')}
          aria-label="依用戶名排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('username'); }}
        >
          用戶名 {sortBy === 'username' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('ruleName')}
          aria-label="依規則名稱排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('ruleName'); }}
        >
          規則名稱 {sortBy === 'ruleName' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div>推薦原因</div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('score')}
          aria-label="依推薦分數排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('score'); }}
        >
          推薦分數 {sortBy === 'score' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('active')}
          aria-label="依啟用狀態排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('active'); }}
        >
          啟用狀態 {sortBy === 'active' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div>操作</div>
      </div>

      {pageContents.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>尚無符合條件的推薦內容</div>
      ) : (
        pageContents.map(c => (
          <div
            key={c.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 2fr 1fr 1fr 2fr 100px 100px 200px',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              padding: '12px 0',
            }}
          >
            <div>{c.id}</div>
            <div
              style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
              onClick={() => handleOpenModal(c)}
            >
              {c.productName || '未知產品'}
            </div>
            <div>{c.username || '無用戶'}</div>
            <div>{c.ruleName || '未知規則'}</div>
            <div>{c.reason || '無原因'}</div>
            <div>{c.score.toFixed(2)}</div>
            <div style={{ color: c.active ? 'green' : 'gray', fontWeight: 'bold' }}>
              {c.active ? '啟用' : '停用'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleOpenModal(c)}>編輯</button>
              <button onClick={() => deleteContent(c.id)}>刪除</button>
            </div>
          </div>
        ))
      )}

      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          alignItems: 'center',
          fontSize: 14,
        }}
        aria-label="推薦內容列表分頁"
      >
        <Button
          variant="outline-primary"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          className="me-2"
        >
          上一頁
        </Button>
        {[...Array(totalPage)].map((_, i) => {
          const pageNum = i + 1;
          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? 'primary' : 'outline-primary'}
              size="sm"
              className="me-1"
              onClick={() => setCurrentPage(pageNum)}
            >
              {pageNum}
            </Button>
          );
        })}
        <Button
          variant="outline-primary"
          size="sm"
          disabled={currentPage === totalPage}
          onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))}
          className="ms-2"
        >
          下一頁
        </Button>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentContent.id ? '編輯推薦內容' : '新增推薦內容'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>選擇產品</Form.Label>
              <Select
                options={productOptions}
                value={currentContent.product}
                onChange={(selectedOption) => setCurrentContent({ ...currentContent, product: selectedOption })}
                isClearable
                placeholder="請選擇或搜尋產品"
                required
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: !currentContent.product && state.isFocused ? '#dc3545' : base.borderColor,
                    '&:hover': { borderColor: !currentContent.product ? '#dc3545' : base.borderColor },
                  }),
                }}
              />
              {!currentContent.product && (
                <div className="invalid-feedback d-block">請選擇產品</div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>選擇用戶（可選）</Form.Label>
              <Form.Select
                value={currentContent.userId || ''}
                onChange={(e) => setCurrentContent({ ...currentContent, userId: e.target.value })}
              >
                <option value="">無用戶</option>
                {users.map(u => (
                  <option key={u.userId} value={u.userId}>{u.username}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>選擇規則</Form.Label>
              <Form.Select
                value={currentContent.ruleId || ''}
                onChange={(e) => setCurrentContent({ ...currentContent, ruleId: e.target.value })}
                required
                isInvalid={!currentContent.ruleId}
              >
                <option value="">選擇規則</option>
                {rules.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                請選擇規則
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>推薦原因（可選）</Form.Label>
              <Form.Control
                type="text"
                value={currentContent.reason}
                onChange={(e) => setCurrentContent({ ...currentContent, reason: e.target.value })}
                maxLength={255}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>推薦分數 (0-1)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                min="0"
                max="1"
                value={currentContent.score}
                onChange={(e) => setCurrentContent({ ...currentContent, score: parseFloat(e.target.value) || 0 })}
                required
                isInvalid={currentContent.score < 0 || currentContent.score > 1}
              />
              <Form.Control.Feedback type="invalid">
                分數必須在 0-1 之間
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="啟用推薦"
                checked={currentContent.active}
                onChange={(e) => setCurrentContent({ ...currentContent, active: e.target.checked })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              儲存
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default AdminRecommendContentPage;