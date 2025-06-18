import React, { useContext, useEffect, useState } from 'react';
import { AdminAppContext } from '../contexts/AdminAppContext';
import { useNavigate } from 'react-router-dom';
import { Modal, Form, Button } from 'react-bootstrap';

const PAGE_SIZE = 10;

function AdminRecommendRulesPage() {
  const { API_BASE, adminUserData, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [currentRule, setCurrentRule] = useState({ id: null, name: '', type: '', weight: 0, active: false });
  const navigate = useNavigate();

  // 取得規則列表
  const fetchRules = async () => {
    if (!adminUserData) {
      setError('請先登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/recommend/rules`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        setError('身份驗證失效');
      } else if (res?.data) {
        setRules(res.data);
        setCurrentPage(1);
      } else {
        addToastMessage('取得規則失敗');
        setError('取得規則失敗');
      }
    } catch (e) {
      setError('取得規則時發生錯誤');
      addToastMessage('取得規則時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, [adminUserData]);

  // 排序處理
  const sortedRules = [...rules];
  if (sortBy) {
    sortedRules.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'active') {
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

  // 搜尋過濾
  const filteredRules = sortedRules.filter(r => {
    const kw = searchKeyword.trim().toLowerCase();
    return (
      kw === '' ||
      r.name?.toLowerCase().includes(kw) ||
      String(r.id).includes(kw)
    );
  });

  const totalPage = Math.max(1, Math.ceil(filteredRules.length / PAGE_SIZE));
  const pageRules = filteredRules.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // 開啟模態框（新增或編輯）
  const handleOpenModal = (rule = { id: null, name: '', type: '', weight: 0, active: false }) => {
    setCurrentRule(rule);
    setShowModal(true);
  };

  // 處理表單提交（新增或編輯）
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!adminUserData) {
      addToastMessage('請先登入');
      return;
    }
    const method = currentRule.id ? 'PUT' : 'POST';
    const urlRule = currentRule.id
      ? `${API_BASE}/admin/recommend/rules/${currentRule.id}`
      : `${API_BASE}/admin/recommend/rules`;

    try {
      const res = await fetchWithAuthCheck(urlRule, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentRule),
      });

      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        return;
      }

      if (res?.message) {
        addToastMessage(res.message);
        fetchRules();
        setShowModal(false);
        setCurrentRule({ id: null, name: '', type: '', weight: 0, active: false });
      } else {
        addToastMessage('操作失敗，請重試');
      }
    } catch (error) {
      addToastMessage('操作失敗：' + error.message);
    }
  };

  // 刪除規則
  const deleteRule = async (id) => {
    if (!window.confirm('確定要刪除此規則？')) return;
    if (!adminUserData) {
      addToastMessage('請先登入');
      return;
    }

    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/recommend/rules/${id}`, {
        method: 'DELETE',
        headers: { 'content-Type': 'application/json' },
      });

      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
        return;
      }

      if (res?.message) {
        addToastMessage(res.message);
        fetchRules();
      } else {
        addToastMessage('刪除規則失敗，請重試');
      }
    } catch (error) {
      addToastMessage('刪除規則失敗：' + error.message);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>載入中...</div>;
  if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;
  if (!adminUserData) return <div style={{ padding: 20 }}>請先登入才能管理規則</div>;

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: 'auto' }}>
      <h2 style={{ marginBottom: 20 }}>管理員推薦規則列表</h2>

      <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
        <button onClick={() => handleOpenModal()}>新增規則</button>
        <input
          type="text"
          placeholder="搜尋規則名稱或ID"
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

      {/* 表格標題列 */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '80px 2fr 150px 100px 100px 200px',
          fontWeight: 'bold',
          borderBottom: '2px solid #333',
          paddingBottom: 6,
          cursor: 'default',
        }}
      >
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('id')}
          aria-label="依規則ID排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('id'); }}
        >
          規則ID {sortBy === 'id' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('name')}
          aria-label="依規則名稱排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('name'); }}
        >
          規則名稱 {sortBy === 'name' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('type')}
          aria-label="依規則類型排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('type'); }}
        >
          規則類型 {sortBy === 'type' ? (sortAsc ? '▲' : '▼') : ''}
        </div>
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => handleSort('weight')}
          aria-label="依權重排序"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter') handleSort('weight'); }}
        >
          權重 {sortBy === 'weight' ? (sortAsc ? '▲' : '▼') : ''}
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

      {/* 規則列表 */}
      {pageRules.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 20, color: '#666' }}>尚無符合條件的規則</div>
      ) : (
        pageRules.map(r => (
          <div
            key={r.id}
            style={{
              display: 'grid',
              gridTemplateColumns: '80px 2fr 150px 100px 100px 200px',
              alignItems: 'center',
              borderBottom: '1px solid #eee',
              padding: '12px 0',
            }}
          >
            <div>{r.id}</div>
            <div style={{ cursor: 'pointer', color: '#007bff', textDecoration: 'underline' }}
                 onClick={() => handleOpenModal(r)}>
              {r.name}
            </div>
            <div>{r.type === 'Popularity' ? '熱門產品' : r.type === 'UserHistory' ? '用戶歷史' : '類別相關'}</div>
            <div>{r.weight.toFixed(1)}</div>
            <div style={{ color: r.active ? 'green' : 'gray', fontWeight: 'bold' }}>
              {r.active ? '啟用' : '停用'}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => handleOpenModal(r)}>編輯</button>
              <button onClick={() => deleteRule(r.id)}>刪除</button>
            </div>
          </div>
        ))
      )}

      {/* 分頁控制 */}
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          justifyContent: 'center',
          gap: 12,
          alignItems: 'center',
          fontSize: 14,
        }}
        aria-label="規則列表分頁"
      >
        <button
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          aria-disabled={currentPage === 1}
          aria-label="上一頁"
          style={{ padding: '6px 12px' }}
        >
          上一頁
        </button>
        <span>
          第 {currentPage} 頁 / 共 {totalPage} 頁
        </span>
        <button
          onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))}
          disabled={currentPage === totalPage}
          aria-disabled={currentPage === totalPage}
          aria-label="下一頁"
          style={{ padding: '6px 12px' }}
        >
          下一頁
        </button>
      </div>

      {/* 新增/編輯模態框 */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentRule.id ? '編輯規則' : '新增規則'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>規則名稱</Form.Label>
              <Form.Control
                type="text"
                value={currentRule.name}
                onChange={(e) => setCurrentRule({ ...currentRule, name: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>規則類型</Form.Label>
              <Form.Select
                value={currentRule.type}
                onChange={(e) => setCurrentRule({ ...currentRule, type: e.target.value })}
                required
              >
                <option value="">選擇類型</option>
                <option value="Popularity">熱門產品</option>
                <option value="UserHistory">用戶歷史</option>
                <option value="CategoryBased">類別相關</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>權重 (0-1)</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                min="0"
                max="1"
                value={currentRule.weight}
                onChange={(e) => setCurrentRule({ ...currentRule, weight: parseFloat(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="啟用規則"
                checked={currentRule.active}
                onChange={(e) => setCurrentRule({ ...currentRule, active: e.target.checked })}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              儲存
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}

export default AdminRecommendRulesPage;