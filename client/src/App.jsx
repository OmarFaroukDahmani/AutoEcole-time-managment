import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Admin from './pages/Admin'
import Test from "./pages/Test"
import Student from "./pages/Student"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/sign-up' element={<Signup/>} />
          <Route path='/admin' element={<Admin/>} />
          <Route path="/test" element={<Test/>}/>
          <Route path="/student" element={<Student/>}/>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
