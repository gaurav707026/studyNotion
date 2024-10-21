import './App.css';
import {Routes, Route} from "react-router-dom";
import Home from './pages/Home';
import Loginpage from './pages/Loginpage';
import Signuppage from './pages/Signuppage';

function App() {

  return (
    <div className='w-screen min-h-screen bg-richblack-900 flex flex-col font-inter'>
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/login' element={<Loginpage/>}/>
        <Route path='/signup' element={<Signuppage/> }/>
      </Routes>
    </div>
  )
}

export default App
