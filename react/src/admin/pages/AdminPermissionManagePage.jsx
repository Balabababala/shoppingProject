import React, { useContext, useEffect, useState } from 'react';
import { AdminAppContext } from '../contexts/AdminAppContext';
import { Modal, Button, Form } from 'react-bootstrap';

const PAGE_SIZE = 5;

export default function AdminPermissionManagePage() {
  const { API_BASE, adminUserData, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);

  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);

  // Modal 狀態（新增/編輯角色）
  const [showModal, setShowModal] = useState(false);
  const [editingRole, setEditingRole] = useState(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');

  // 取得角色列表
  const fetchRoles = async () => {
    if (!adminUserData) {
      addToastMessage('請先登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/roles`);
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.data) {
        setRoles(res.data);
        setCurrentPage(1);
      } else {
        addToastMessage('取得角色列表失敗');
      }
    } catch (error) {
      addToastMessage('取得角色列表時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, [adminUserData]);

  // 排序函式
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // 開啟新增角色 Modal
  const openAddModal = () => {
    setEditingRole(null);
    setRoleName('');
    setRoleDescription('');
    setShowModal(true);
  };

  // 開啟編輯角色 Modal
  const openEditModal = (role) => {
    setEditingRole(role);
    setRoleName(role.name);
    setRoleDescription(role.description || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingRole(null);
  };

  // 新增或更新角色送出
  const submitRole = async () => {
    if (!roleName.trim()) {
      addToastMessage('請輸入角色名稱');
      return;
    }
    const method = editingRole ? 'PUT' : 'POST';
    const url = editingRole
      ? `${API_BASE}/admin/roles/${editingRole.id}`
      : `${API_BASE}/admin/roles`;
    try {
      const res = await fetchWithAuthCheck(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: roleName.trim(), description: roleDescription.trim() }),
      });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage(editingRole ? '更新角色成功' : '新增角色成功');
        fetchRoles();
        closeModal();
      } else {
        addToastMessage(editingRole ? '更新角色失敗' : '新增角色失敗');
      }
    } catch {
      addToastMessage(editingRole ? '更新角色時發生錯誤' : '新增角色時發生錯誤');
    }
  };

  // 刪除角色
  const deleteRole = async (roleId) => {
    if (!window.confirm('確定要刪除這個角色嗎？此動作無法復原。')) return;
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/roles/${roleId}`, {
        method: 'DELETE',
      });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage('刪除角色成功');
        fetchRoles();
      } else {
        addToastMessage('刪除角色失敗');
      }
    } catch {
      addToastMessage('刪除角色時發生錯誤');
    }
  };

  // 搜尋、排序過濾
  const filteredRoles = roles.filter(r => {
    const kw = searchKeyword.trim().toLowerCase();
    if (!kw) return true;
    return r.name.toLowerCase().includes(kw) || (r.description && r.description.toLowerCase().includes(kw));
  });

  const sortedRoles = [...filteredRoles].sort((a, b) => {
    if (!sortBy) return 0;
    let valA, valB;
    switch (sortBy) {
      case 'name':
        valA = a.name.toLowerCase();
        valB = b.name.toLowerCase();
        break;
      case 'description':
        valA = (a.description || '').toLowerCase();
        valB = (b.description || '').toLowerCase();
        break;
      case 'created_at':
        valA = new Date(a.created_at);
        valB = new Date(b.created_at);
        break;
      default:
        return 0;
    }
    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  // 分頁計算
  const totalPage = Math.max(1, Math.ceil(sortedRoles.length / PAGE_SIZE));
  const pageRoles = sortedRoles.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (loading) return <div className="loading">載入中...</div>;
  if (!adminUserData) return <div className="not-logged-in">請先登入才能管理角色。</div>;

  return (
    <div className="admin-permission-manage">
      <h2>角色管理</h2>

      <div className="controls mb-3 d-flex align-items-center gap-2">
        <input
          type="text"
          placeholder="搜尋角色名稱或描述"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
          className="form-control w-auto"
        />
        <Button variant="primary" onClick={openAddModal}>新增角色</Button>
      </div>

      <div className="roles-header d-flex fw-bold mb-2">
        <button className="btn btn-link p-0 me-3" onClick={() => handleSort('name')}>
          角色名稱 {sortBy === 'name' ? (sortAsc ? '↑' : '↓') : ''}
        </button>
        <button className="btn btn-link p-0 me-3" onClick={() => handleSort('description')}>
          描述 {sortBy === 'description' ? (sortAsc ? '↑' : '↓') : ''}
        </button>
        <button className="btn btn-link p-0 me-3" onClick={() => handleSort('created_at')}>
          建立時間 {sortBy === 'created_at' ? (sortAsc ? '↑' : '↓') : ''}
        </button>
        <div style={{ minWidth: '160px' }}>操作</div>
      </div>

      {pageRoles.length === 0 ? (
        <div className="no-roles">找不到符合條件的角色</div>
      ) : (
        pageRoles.map(role => (
          <div key={role.id} className="role-row d-flex align-items-center mb-2">
            <div style={{ width: '200px' }}>{role.name}</div>
            <div style={{ flex: 1 }}>{role.description || '-'}</div>
            <div style={{ width: '160px' }}>{new Date(role.created_at).toLocaleString()}</div>
            <div style={{ width: '160px' }}>
              <Button variant="outline-primary" size="sm" onClick={() => openEditModal(role)} className="me-2">編輯</Button>
              <Button variant="outline-danger" size="sm" onClick={() => deleteRole(role.id)}>刪除</Button>
            </div>
          </div>
        ))
      )}

      <div className="pagination mt-3 d-flex justify-content-center align-items-center gap-3">
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => setCurrentPage(p => Math.max(1, p - 1))} 
          disabled={currentPage === 1}
        >
          上一頁
        </Button>
        <span>第 {currentPage} / 共 {totalPage} 頁</span>
        <Button 
          variant="secondary" 
          size="sm" 
          onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))} 
          disabled={currentPage === totalPage}
        >
          下一頁
        </Button>
      </div>

      {/* 新增/編輯角色 Modal */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>{editingRole ? '編輯角色' : '新增角色'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formRoleName">
              <Form.Label>角色名稱</Form.Label>
              <Form.Control
                type="text"
                value={roleName}
                onChange={e => setRoleName(e.target.value)}
                placeholder="請輸入角色名稱"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formRoleDescription">
              <Form.Label>描述</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={roleDescription}
                onChange={e => setRoleDescription(e.target.value)}
                placeholder="請輸入角色描述（選填）"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>取消</Button>
          <Button variant="primary" onClick={submitRole}>{editingRole ? '更新' : '新增'}</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
