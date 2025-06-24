window.global = window;
import { Route, Routes, useLocation } from 'react-router-dom';
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
import PaymentPage from './components/PaymentPage';
import Report from './pages/report';
import SearchPrice from './pages/searchPrice';
import WriteReport from './components/WriteReport';
import WithdrawComplete from './pages/user/withdrawComplete';


function App() {

  const location = useLocation();

  const hideLayoutPaths = ['/mock-payment'];

  const hideLayout = hideLayoutPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <ToastProvider>
        <UserProvider>
          {!hideLayout && <Header />}

          <Routes>
            {/* Main page */}
            <Route path='/home' Component={Home} />

            {/* Login & Register */}
            <Route path='/user/login' Component={Login} />
            <Route path='/user/register' Component={Register} />

            {/* User Page */}
            <Route path='/user/:userKey' Component={UserPage} />

            {/* Item Page */}
            <Route path='/product/write' Component={ItemWrite} />
            <Route path='/product/:itemKey' Component={ItemDetail} />
            <Route path='/product/modify/:itemKey' Component={ItemModify} />

            {/* Item Search */}
            <Route path='/search' Component={ItemSearch} />

            {/* Payment */}
            <Route path='/mock-payment/:orderId' Component={PaymentPage} />

            {/* Search Price Page */}
            <Route path='/search/price' Component={SearchPrice}/>

            {/* Report Page */}
            <Route path='/report/write' Component={WriteReport}/>
            <Route path='/report' Component={Report}/>

            {/* Deactivate Confirm Page */}
            <Route path='/withdraw-complete' Component={WithdrawComplete}/>

          </Routes>
          {!hideLayout && <Footer />}
        </UserProvider>
      </ToastProvider>
    </>
  )
}

export default App;
