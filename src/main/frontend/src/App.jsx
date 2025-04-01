import './App.css'
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Home from './pages/home';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/user/login';
import Register from './pages/user/register';
import axios from 'axios';

function App() {

  const [ user, setUser ] = useState();

  // useEffect(() => {
  //   axios.get("http://localhost:8093")
  //   .catch(error => console.log('Error fetching data:', error));
  // }, []);

  return (
    <>
      <Header />
      <Routes>
        {/* Main page */}
        <Route path='/' Component={Home}></Route>

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
