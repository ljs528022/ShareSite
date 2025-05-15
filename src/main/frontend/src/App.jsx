import { Route, Routes } from 'react-router-dom';
import Home from './pages/home';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/user/login';
import Register from './pages/user/register';
import { UserProvider } from './services/UserContext';
import { ToastProvider } from './util/ToastContext';
import ItemWrite from './pages/item/itemWrite';
import ItemDetail from './pages/item/itemDetail';
import ItemSearch from './pages/item/itemSearch';
import UserPage from './pages/user/userPage';
import ItemModify from './pages/item/itemModify';

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
            <Route path='/user/:userKey' Component={UserPage}></Route>

            {/* Item Page */}
            <Route path='/product/write' Component={ItemWrite}></Route>
            <Route path='/product/:itemKey' Component={ItemDetail}></Route>
            <Route path='/product/modify/:itemKey' Component={ItemModify}></Route>

            {/* Item Search */}
            <Route path='/search' Component={ItemSearch}></Route>

          </Routes>
          <Footer />
        </UserProvider>
      </ToastProvider>
    </>
  )
}

export default App;
