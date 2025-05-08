import { useState } from 'react';
import MyNavbar from './component/myNavbar'
import WelcomePage from './component/pages/WelcomePage'
function App() {
  const [mainContent, setMainContent] = useState(<WelcomePage/>);


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
