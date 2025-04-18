import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/user/login';
import Register from './pages/user/register';
import { UserProvider } from './services/UserContext';
import { ToastProvider } from './components/ToastContext';
import ItemWrite from './pages/item/itemWrite';

function App() {

  return (
    <>
      <ToastProvider>
        <UserProvider>
          <Header />
          <Routes>

            {/* Main page */}
            <Route path='/home' Component={Home}></Route>

            {/* Login & Register */}
            <Route path='/user/login' Component={Login}></Route>
            <Route path='/user/register' Component={Register}></Route>

            {/* User Page */}
            <Route></Route>

            {/* Item Page */}
            <Route path='/product/write' Component={ItemWrite}></Route>

          </Routes>
          <Footer />
        </UserProvider>
      </ToastProvider>
    </>
  )
}

export default App;
