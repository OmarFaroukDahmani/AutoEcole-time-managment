import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Login from './pages/Login'
import Admin from './pages/Admin'
import Student from "./pages/Student"
import Signup from "./pages/Signup"
import AddLesson from "./pages/AddLesson"
import Student_info from "./pages/Student_info"
import EditLesson from "./pages/EditLesson"


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
          <Route path="/admin/student_info/:id" element={<Student_info/>} />
          <Route path="/admin/edit_lesson/:id" element={<EditLesson/>} />
          <Route path="/admin/add-lesson/:id" element={<AddLesson/>}/>
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
