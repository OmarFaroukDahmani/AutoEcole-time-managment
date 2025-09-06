import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Student from "./pages/Student"
import Signup from "./pages/Signup"
import AddLesson from "./pages/AddLesson"


function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Login/>} />
          <Route path='/sign-up' element={<Signup/>} />
          <Route path='/admin' element={<Admin/>} />
          <Route path="/student" element={<Student/>}/>
          <Route path="/add-lesson" element={<AddLesson/>}/>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
