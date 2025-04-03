import './App.css'
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/home';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/user/login';
import Register from './pages/user/register';
import { getData } from './services/api';

function App() {

  const [ user, setUser ] = useState();

  // if(user == null || undefined) {
    
  // }

  return (
    <>
      <Header />
      <Routes>
        {/* Main page */}
        <Route path='/home' Component={Home}></Route>

        {/* Login & Register */}
        <Route path='/user/login' Component={Login}></Route>
        <Route path='/user/regist' Component={Register}></Route>

        {/* User Page */}
        <Route></Route>

        {/* Item Page */}
        <Route></Route>

      </Routes>
      <Footer />
    </>
  )
}

export default App
