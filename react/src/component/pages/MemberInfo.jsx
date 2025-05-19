import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MemberInfo() {
  const [member, setMember] = useState(null);

  // useEffect(() => {
  //   axios.get('/api/members/me') // 假設 API 可取得目前登入會員
  //     .then(res => setMember(res.data))
  //     .catch(err => console.error(err));
  // }, []);

   useEffect(() => {    //假資料 上面才是
    // 模擬從伺服器取回資料（延遲 1 秒）
    setTimeout(() => {
      setMember({
        username: 'john123',
        fullName: '張允豪',
        email: 'john@example.com',
        phone: '0912-345-678',
        address: '台中市西屯區中港路123號',
      });
    }, 1000);
  }, []);

  if (!member) return <div>載入中...</div>;

  return (
    <div>
      <h1>會員個人資料</h1>
      <p>帳號：{member.username}</p>
      <p>姓名：{member.fullName}</p>
      <p>Email：{member.email}</p>
      <p>電話：{member.phone}</p>
      <p>地址：{member.address}</p>
      <button onClick={() => alert('開啟編輯功能')}>編輯資料</button>
    </div>
  );
}

export default MemberInfo;
