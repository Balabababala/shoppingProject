import React, { useContext, useEffect, useState } from 'react';
import { AdminAppContext } from '../contexts/AdminAppContext';
import { Modal, Button, Form } from 'react-bootstrap';
import '../css/AdminUserListPage.css';

const PAGE_SIZE = 5;

export default function AdminUserListPage() {
  const ROLE_ID_MAP = {
    ROLE_BUYER: 1,
    ROLE_SELLER: 2,
    ROLE_ADMIN: 3,
  };
  const ROLE_MAP = {
    ROLE_BUYER: '買家',
    ROLE_SELLER: '賣家',
    ROLE_ADMIN: '管理員',
  };

  const { API_BASE, adminUserData, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState(null);
  const [sortAsc, setSortAsc] = useState(true);
  const [roleChanges, setRoleChanges] = useState({});
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetUser, setResetUser] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const fetchUsers = async () => {
    if (!adminUserData) {
      addToastMessage('請先登入');
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/users`);
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.data) {
        setUsers(res.data);
        setCurrentPage(1);
        setRoleChanges({});
      } else {
        addToastMessage('取得使用者列表失敗');
      }
    } catch {
      addToastMessage('取得使用者列表時發生錯誤');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [adminUserData]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortBy(field);
      setSortAsc(true);
    }
    setCurrentPage(1);
  };

  // 啟用/停用使用者
  const toggleStatus = async (userId, isActive) => {
    try {
      const url = `${API_BASE}/admin/users/${userId}/${isActive ? 'inactive' : 'active'}`;
      const res = await fetchWithAuthCheck(url, { method: 'PUT' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage(isActive ? '停用成功' : '啟用成功');
        fetchUsers();
      } else {
        addToastMessage(isActive ? '停用失敗' : '啟用失敗');
      }
    } catch {
      addToastMessage('更新使用者狀態時發生錯誤');
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm('確定要刪除這位使用者嗎？此動作無法復原。')) return;
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/users/${userId}`, { method: 'DELETE' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage('刪除成功');
        fetchUsers();
      } else {
        addToastMessage('刪除失敗');
      }
    } catch {
      addToastMessage('刪除使用者時發生錯誤');
    }
  };

  const openResetModal = (user) => {
    setResetUser(user);
    setNewPassword('');
    setConfirmPassword('');
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setResetUser(null);
  };

  const submitResetPassword = async () => {
    if (!resetUser) return;
    if (!newPassword) {
      addToastMessage('請輸入新密碼');
      return;
    }
    if (newPassword !== confirmPassword) {
      addToastMessage('密碼與確認密碼不符');
      return;
    }
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/users/${resetUser.userId}/reset-password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newPassword }),
      });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage('密碼重設成功');
        closeResetModal();
      } else {
        addToastMessage('密碼重設失敗');
      }
    } catch {
      addToastMessage('重設密碼時發生錯誤');
    }
  };

 
  const updateUserRole = async (userId) => {
    const newRoleStr = roleChanges[userId];
    const newRoleId = ROLE_ID_MAP[newRoleStr];

    if (!newRoleId) {
      addToastMessage('請先選擇有效的角色');
      return;
    }

    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roleId: newRoleId }),
      });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage('角色更新成功');
        const updated = { ...roleChanges };
        delete updated[userId];
        setRoleChanges(updated);
        fetchUsers();
      } else {
        addToastMessage('角色更新失敗');
      }
    } catch {
      addToastMessage('更新角色時發生錯誤');
    }
  };
  const filteredUsers = users.filter(u => {
    const kw = searchKeyword.trim().toLowerCase();
    return !kw || u.username.toLowerCase().includes(kw);
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (!sortBy) return 0;
    let valA, valB;
    switch (sortBy) {
      case 'username':
        valA = a.username.toLowerCase();
        valB = b.username.toLowerCase();
        break;
      case 'roles':
        valA = ROLE_MAP[a.role] || '';
        valB = ROLE_MAP[b.role] || '';
        break;
      case 'status':
        valA = a.isActive ? 1 : 0;
        valB = b.isActive ? 1 : 0;
        break;
      default:
        return 0;
    }
    return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const totalPage = Math.max(1, Math.ceil(sortedUsers.length / PAGE_SIZE));
  const pageUsers = sortedUsers.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const renderUserRow = (u) => {
    const selectedRole = roleChanges[u.userId] ?? u.role;

    return (
      <div key={u.userId} className="user-row">
        <div>{u.username}</div>
        <div>
          <select
            value={selectedRole}
            onChange={(e) => setRoleChanges({
              ...roleChanges,
              [u.userId]: e.target.value,
            })}
          >
            {Object.entries(ROLE_MAP).map(([id, name]) => (
              <option key={id} value={id}>{name}</option>
            ))}
          </select>
          <button
            className="btn-change-role"
            onClick={() => updateUserRole(u.userId)}
            disabled={selectedRole === u.role}
          >
            變更角色
          </button>
        </div>
        <div className={u.isActive ? 'status-active' : 'status-inactive'}>
          {u.isActive ? '啟用中' : '停用中'}
        </div>
        <div className="action-buttons">
          <button
            className={u.isActive ? 'btn-off' : 'btn-on'}
            onClick={() => toggleStatus(u.userId, u.isActive)}
          >
            {u.isActive ? '停用' : '啟用'}
          </button>
          <button className="btn-delete" onClick={() => deleteUser(u.userId)}>刪除</button>
          <button className="btn-reset-password" onClick={() => openResetModal(u)}>重設密碼</button>
        </div>
      </div>
    );
  };

  if (loading) return <div className="loading">載入中...</div>;
  if (!adminUserData) return <div className="not-logged-in">請先登入才能管理使用者。</div>;

  return (
    <div className="admin-userlist">
      <h2>使用者管理</h2>

      <div className="userlist-controls">
        <input
          type="text"
          placeholder="搜尋帳號或名稱"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="userlist-header">
        <button onClick={() => handleSort('username')}>
          帳號 {sortBy === 'username' ? (sortAsc ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => handleSort('roles')}>
          角色 {sortBy === 'roles' ? (sortAsc ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => handleSort('status')}>
          狀態 {sortBy === 'status' ? (sortAsc ? '↑' : '↓') : ''}
        </button>
        <div>操作</div>
      </div>

      {pageUsers.length === 0 ? (
        <div className="no-users">找不到符合條件的使用者</div>
      ) : (
        pageUsers.map(renderUserRow)
      )}

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
          上一頁
        </button>
        <span>第 {currentPage} / 共 {totalPage} 頁</span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))} disabled={currentPage === totalPage}>
          下一頁
        </button>
      </div>

      {/* 重設密碼 Modal */}
      <Modal show={showResetModal} onHide={closeResetModal}>
        <Modal.Header closeButton>
          <Modal.Title>重設密碼 - {resetUser?.username}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formNewPassword">
              <Form.Label>新密碼</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formConfirmPassword">
              <Form.Label>確認密碼</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeResetModal}>取消</Button>
          <Button variant="primary" onClick={submitResetPassword}>送出</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
