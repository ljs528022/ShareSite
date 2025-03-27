import './App.css'
import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/user/login';
import Register from './pages/user/register';

function App() {

  return (
    <>
      <Header />
      <Routes>
        {/* Main page */}
        <Route path='/' Component={Home}></Route>

        {/* Login & Register */}
        <Route path='/login' Component={Login}></Route>
        <Route path='/regist' Component={Register}></Route>

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
