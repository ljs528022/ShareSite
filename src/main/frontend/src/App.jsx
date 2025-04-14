import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/user/login';
import Register from './pages/user/register';
import { UserProvider } from './services/UserContext';
import { useEffect, useState } from 'react';

function App() {

  //현재 로그인한 유저
  const [ currentUser, setCurrentUser ] = useState(null);

  return (
    <>
      <UserProvider>
        <Header user={currentUser}/>
        <Routes>

          {/* Main page */}
          <Route path='/home' Component={Home}></Route>

          {/* Login & Register */}
          <Route path='/user/login' Component={Login}></Route>
          <Route path='/user/register' Component={Register}></Route>

          {/* User Page */}
          <Route></Route>

          {/* Item Page */}
          <Route></Route>

        </Routes>
        <Footer />
      </UserProvider>
    </>
  )
}

export default App;
