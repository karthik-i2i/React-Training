import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import './App.css'
import Login from './components/Login/Login'
import UserForm from './components/user-form/UserForm'
import Dashboard from './components/dashboard/Dashboard'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/user-form' element={<UserForm />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </Router>
  )
}

export default App
