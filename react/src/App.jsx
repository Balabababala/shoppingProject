import { useState } from 'react';
import MyNavbar from './component/myNavbar'

function App() {
  const [mainContent, setMainContent] = useState("歡迎來到首頁");


  return (
    <>
      <MyNavbar onChangeContent={setMainContent} />
      <main>
      <h1>{mainContent}</h1>
      </main>
    </>
  )
}


export default App
