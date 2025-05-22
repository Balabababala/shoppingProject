import { useEffect } from "react";



  useEffect(() => {
    fetch("http://localhost:8080/userinfo")
      .then(resp => resp.json())
      .then(data => {
      })
      .catch(error => console.error("未獲取使用者資料", error));
  }, []);


function UserData() {
return (
    <div className="container py-5">
        <form onSubmit={handleSubmit}>
            <label>使用者名稱：</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />

            <label>帳號（email）：</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />

            <label>新密碼：</label>
            <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />

            <button type="submit">更新資訊</button>
        </form>
    </div>
  );
}

export default UserData;