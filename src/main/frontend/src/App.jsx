import './App.css'
import { Route, Routes } from 'react-router-dom';
import Header from './pages/header';
import Home from './pages/home';

function App() {

  return (
    <>
      <Header />
      <Routes>
        {/* Main page */}
        <Route path='/' Component={Home}></Route>

        {/* Login & Register */}
        <Route path='/login' Component={""}></Route>
        <Route path='/regist' Component={""}></Route>

        {/* User Page */}
        <Route></Route>

        {/* Item Page */}
        <Route></Route>

      </Routes>
    </>
  )
}

export default App
