import { BrowseRrouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'


function App() {

  return (
    <>
      <BrowseRrouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='sign-up' element={<Signup/>} />
          <Route path='admin' element={<Admin/>} />
        </Routes>
      </BrowseRrouter>

    </>
  )
}

export default App
