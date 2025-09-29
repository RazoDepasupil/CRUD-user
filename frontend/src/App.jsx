import React from 'react';
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import Register from './pages/register.jsx';
import Login from './pages/Login.jsx';
import Logout from './pages/Logout.jsx';
import UserDashboard from './pages/UserDashboard.jsx';


const App = ()=> {


  return (
    <div className='border-4 border-indigo-500 min-h-screen flex items-center justify-center bg-linear-to-br from-[#9985f3] via-[#c7b7fc] to-[#f4ecfe]'>
      <Router>
        <Routes>
          <Route path="/" element={<Login/>}/>
          <Route path="/Register" element={<Register/>}/>
          <Route path="/Logout" element={<Logout/>}/>
          <Route path="/Dashboard" element={<UserDashboard/>}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App
