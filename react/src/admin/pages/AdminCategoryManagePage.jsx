import React, { useContext, useEffect, useState } from 'react';
import { AdminAppContext } from '../contexts/AdminAppContext';
import { Container, Table, Button, Form, Modal, Spinner, Row, Col } from 'react-bootstrap';
import Select from 'react-select';

export default function AdminCategoryManagePage() {
  const { fetchWithAuthCheck, addToastMessage, API_BASE } = useContext(AdminAppContext);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // 新增分類欄位
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryParentId, setNewCategoryParentId] = useState(null);
  const [adding, setAdding] = useState(false);

  // 編輯分類欄位
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategorySlug, setEditCategorySlug] = useState('');
  const [editCategoryParentId, setEditCategoryParentId] = useState(null);
  const [editing, setEditing] = useState(false);

  // 分頁設定
  const pageSize = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // 取得分類資料
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/categories`);
      if (res?.data) {
        setCategories(res.data);
        setCurrentPage(1); // 取得新資料後回到第一頁
      } else {
        addToastMessage('載入分類資料失敗');
      }
    } catch (error) {
      addToastMessage('載入分類資料錯誤');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 計算總頁數
  const totalPages = Math.ceil(categories.length / pageSize);

  // 取得當前頁的分類清單
  const currentItems = categories.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // 分頁控制函式
  const goToPage = (page) => {
    if (page < 1) page = 1;
    else if (page > totalPages) page = totalPages;
    setCurrentPage(page);
  };

  // react-select options (排除自己時會在編輯時用)
  const parentOptionsForNew = categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }));

  const parentOptionsForEdit = categories
    .filter((c) => c.id !== editCategoryId) // 編輯時排除自己
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }));

  // react-select value 物件
  const selectedNewParentOption =
    parentOptionsForNew.find((opt) => opt.value === newCategoryParentId) || null;

  const selectedEditParentOption =
    parentOptionsForEdit.find((opt) => opt.value === editCategoryParentId) || null;

  // 新增分類
  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    const slug = newCategorySlug.trim();

    if (!name) {
      addToastMessage('請輸入分類名稱');
      return;
    }
    if (!slug) {
      addToastMessage('請輸入 slug');
      return;
    }

    setAdding(true);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          parentId: newCategoryParentId ? Number(newCategoryParentId) : null,
        }),
      });

      if (res?.message?.includes('成功')) {
        addToastMessage('新增分類成功');
        setNewCategoryName('');
        setNewCategorySlug('');
        setNewCategoryParentId(null);
        fetchCategories();
        setCurrentPage(1); // 新增成功回第一頁
      } else {
        addToastMessage(res?.message || '新增分類失敗');
      }
    } catch (error) {
      addToastMessage('新增分類時發生錯誤');
      console.error(error);
    } finally {
      setAdding(false);
    }
  };

  // 刪除分類
  const handleDeleteCategory = async (id) => {
    if (!window.confirm('確定要刪除此分類嗎？')) return;

    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/categories/${id}`, {
        method: 'DELETE',
      });

      if (res?.message?.includes('成功')) {
        addToastMessage('刪除分類成功');
        fetchCategories();
        setCurrentPage(1); // 刪除成功回第一頁
      } else {
        addToastMessage(res?.message || '刪除分類失敗');
      }
    } catch (error) {
      addToastMessage('刪除分類時發生錯誤');
      console.error(error);
    }
  };

  // 打開編輯 Modal 並帶入欄位
  const openEditModal = (category) => {
    setEditCategoryId(category.id);
    setEditCategoryName(category.name);
    setEditCategorySlug(category.slug || '');
    setEditCategoryParentId(category.parentId || null);
    setShowEditModal(true);
  };

  // 編輯分類
  const handleEditCategory = async () => {
    const name = editCategoryName.trim();
    const slug = editCategorySlug.trim();

    if (!name) {
      addToastMessage('請輸入分類名稱');
      return;
    }
    if (!slug) {
      addToastMessage('請輸入 slug');
      return;
    }

    setEditing(true);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/categories/${editCategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          slug,
          parentId: editCategoryParentId ? Number(editCategoryParentId) : null,
        }),
      });

      if (res?.message?.includes('成功')) {
        addToastMessage('修改分類成功');
        setShowEditModal(false);
        fetchCategories();
        setCurrentPage(1); // 修改成功回第一頁
      } else {
        addToastMessage(res?.message || '修改分類失敗');
      }
    } catch (error) {
      addToastMessage('修改分類時發生錯誤');
      console.error(error);
    } finally {
      setEditing(false);
    }
  };

  return (
    <Container className="my-4">
      <h2 className="mb-4">商品分類管理 (管理員)</h2>

      {/* 新增分類表單 */}
      <Form className="mb-3">
        <Row className="align-items-center">
          <Col xs={4} md={3} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              placeholder="分類名稱"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
          </Col>
          <Col xs={4} md={3} className="mb-2 mb-md-0">
            <Form.Control
              type="text"
              placeholder="slug"
              value={newCategorySlug}
              onChange={(e) => setNewCategorySlug(e.target.value)}
            />
          </Col>
          <Col xs={4} md={3} className="mb-2 mb-md-0">
            {/* react-select 父分類 */}
            <Select
              options={parentOptionsForNew}
              value={selectedNewParentOption}
              onChange={(selectedOption) =>
                setNewCategoryParentId(selectedOption ? selectedOption.value : null)
              }
              isClearable
              placeholder="請選擇父分類"
            />
          </Col>
          <Col xs="auto">
            <Button variant="primary" onClick={handleAddCategory} disabled={adding}>
              {adding ? '新增中...' : '新增'}
            </Button>
          </Col>
        </Row>
      </Form>

      {/* 顯示列表 */}
      {loading ? (
        <div className="text-center py-4">
          <Spinner animation="border" /> 載入中...
        </div>
      ) : (
        <>
          <Table bordered hover>
            <thead>
              <tr>
                <th>ID</th>
                <th>分類名稱</th>
                <th>slug</th>
                <th>父分類</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center">
                    沒有分類資料
                  </td>
                </tr>
              ) : (
                currentItems.map((cat) => (
                  <tr key={cat.id}>
                    <td>{cat.id}</td>
                    <td>{cat.name}</td>
                    <td>{cat.slug}</td>
                    <td>{cat.parentName || '—'}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openEditModal(cat)}
                        className="me-2"
                      >
                        編輯
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCategory(cat.id)}
                      >
                        刪除
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>

          {/* 分頁按鈕 */}
          <div className="d-flex justify-content-center align-items-center my-3">
            <Button
              variant="outline-primary"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => goToPage(currentPage - 1)}
              className="me-2"
            >
              上一頁
            </Button>

            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={pageNum === currentPage ? 'primary' : 'outline-primary'}
                  size="sm"
                  className="me-1"
                  onClick={() => goToPage(pageNum)}
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline-primary"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => goToPage(currentPage + 1)}
              className="ms-2"
            >
              下一頁
            </Button>
          </div>
        </>
      )}

      {/* 編輯分類 Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>修改分類</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>分類名稱</Form.Label>
            <Form.Control
              type="text"
              value={editCategoryName}
              onChange={(e) => setEditCategoryName(e.target.value)}
              placeholder="分類名稱"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>slug</Form.Label>
            <Form.Control
              type="text"
              value={editCategorySlug}
              onChange={(e) => setEditCategorySlug(e.target.value)}
              placeholder="slug"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>父分類</Form.Label>
            <Select
              options={parentOptionsForEdit}
              value={selectedEditParentOption}
              onChange={(selectedOption) =>
                setEditCategoryParentId(selectedOption ? selectedOption.value : null)
              }
              isClearable
              placeholder="請選擇父分類"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={handleEditCategory} disabled={editing}>
            {editing ? '儲存中...' : '儲存'}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
