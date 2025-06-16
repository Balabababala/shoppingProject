import React, { useContext, useEffect, useState } from 'react';
import { AdminAppContext } from '../contexts/AdminAppContext';
import { useNavigate } from 'react-router-dom';
import '../css/AdminUserListPage.css';  // 可自訂樣式

const PAGE_SIZE = 5;

export default function AdminUserListPage() {
  const { API_BASE, userData, fetchWithAuthCheck, addToastMessage } = useContext(AdminAppContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [sortBy, setSortBy] = useState(null); // 'username', 'name', 'status'
  const [sortAsc, setSortAsc] = useState(true);
  const navigate = useNavigate();

  // 取得使用者清單
  const fetchUsers = async () => {
    if (!userData) {
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
  }, [userData]);

  // 排序
  const sortedUsers = [...users];
  if (sortBy) {
    sortedUsers.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      if (sortBy === 'status') {
        valA = valA === 'ACTIVE' ? 1 : 0;
        valB = valB === 'ACTIVE' ? 1 : 0;
      }
      if (typeof valA === 'string') {
        return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      } else {
        return sortAsc ? valA - valB : valB - valA;
      }
    });
  }

  // 搜尋過濾（帳號 username 或名稱 name）
  const filtered = sortedUsers.filter(u => {
    const kw = searchKeyword.trim().toLowerCase();
    return kw === '' || u.username?.toLowerCase().includes(kw) || u.name?.toLowerCase().includes(kw);
  });

  const totalPage = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageUsers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  // 切換排序欄位
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
  const toggleStatus = async (id, status) => {
    if (!userData) {
      addToastMessage('請先登入');
      return;
    }
    const newStatus = status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    const url = `${API_BASE}/admin/users/${id}/${newStatus === 'ACTIVE' ? 'active' : 'unactive'}`;
    try {
      const res = await fetchWithAuthCheck(url, { method: 'PUT' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage(`使用者已${newStatus === 'ACTIVE' ? '啟用' : '停用'}`);
        fetchUsers();
      } else {
        addToastMessage('使用者狀態變更失敗');
      }
    } catch {
      addToastMessage('變更使用者狀態時發生錯誤');
    }
  };

  // 刪除使用者
  const deleteUser = async (id) => {
    if (!window.confirm('確定要刪除此使用者？')) return;
    if (!userData) {
      addToastMessage('請先登入');
      return;
    }
    try {
      const res = await fetchWithAuthCheck(`${API_BASE}/admin/users/${id}`, { method: 'DELETE' });
      if (res?.authError) {
        addToastMessage('身份驗證失效，請重新登入');
      } else if (res?.message?.includes('成功')) {
        addToastMessage('使用者已刪除');
        fetchUsers();
      } else {
        addToastMessage('刪除使用者失敗');
      }
    } catch {
      addToastMessage('刪除使用者時發生錯誤');
    }
  };

  if (loading) return <div className="loading">載入中...</div>;
  if (!userData) return <div className="not-logged-in">請先登入才能管理使用者。</div>;

  return (
    <div className="admin-userlist-container">
      <h2 className="admin-userlist-header">使用者管理</h2>

      <div className="top-actions">
        <button className="btn-new-user" onClick={() => navigate('/admin/users/new')}>
          新增使用者
        </button>
        <input
          className="search-input"
          type="text"
          placeholder="搜尋使用者帳號或名稱"
          value={searchKeyword}
          onChange={(e) => {
            setSearchKeyword(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="user-header">
        <button onClick={() => handleSort('username')}>
          帳號 {sortBy === 'username' ? (sortAsc ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => handleSort('name')}>
          名稱 {sortBy === 'name' ? (sortAsc ? '↑' : '↓') : ''}
        </button>
        <button onClick={() => handleSort('status')}>
          狀態 {sortBy === 'status' ? (sortAsc ? '↑' : '↓') : ''}
        </button>
        <div>操作</div>
      </div>

      {pageUsers.length === 0 ? (
        <div className="no-users">尚無符合條件的使用者</div>
      ) : (
        pageUsers.map((u) => (
          <div key={u.id} className="user-row">
            <div>{u.username}</div>
            <div>{u.name}</div>
            <div className={u.status === 'ACTIVE' ? 'status-active' : 'status-inactive'}>
              {u.status === 'ACTIVE' ? '啟用中' : '停用中'}
            </div>
            <div className="action-btns">
              <button
                className={u.status === 'ACTIVE' ? 'btn-status off' : 'btn-status on'}
                onClick={() => toggleStatus(u.id, u.status)}
              >
                {u.status === 'ACTIVE' ? '停用' : '啟用'}
              </button>
              <button className="btn-delete" onClick={() => deleteUser(u.id)}>
                刪除
              </button>
              <button className="btn-edit" onClick={() => navigate(`/admin/users/edit/${u.id}`)}>
                編輯
              </button>
            </div>
          </div>
        ))
      )}

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
          上一頁
        </button>
        <span>
          第 {currentPage} 頁 / 共 {totalPage} 頁
        </span>
        <button onClick={() => setCurrentPage(p => Math.min(totalPage, p + 1))} disabled={currentPage === totalPage}>
          下一頁
        </button>
      </div>
    </div>
  );
}
