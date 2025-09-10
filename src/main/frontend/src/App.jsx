window.global = window;
import { UserProvider } from './services/UserContext';
import { ToastProvider } from './util/ToastContext';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './pages/home';
import Header from './pages/header';
import Footer from './pages/footer';
import Login from './pages/user/login';
import Signup from './pages/user/signup';
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
import SocialSignup from './pages/user/socialSignup';
import NaverCallback from './services/NaverCallback';
import KakaoCallback from './services/kakaoCallback';
import AdminApp from './AdminApp';
import Notice from './pages/notice/notice';
import NoticeDetail from './pages/notice/noticeDetail';
import GoogleCallback from './services/googleCallback';

function App() {

  const location = useLocation();

  const hideLayoutPaths = ['/mock-payment', '/admin'];

  const hideLayout = hideLayoutPaths.some(path =>
    location.pathname.startsWith(path)
  );

  return (
    <>
      <ToastProvider>
        <UserProvider>
          {!hideLayout && <Header />}

          <Routes>
            {/* 메인 페이지(홈) */}
            <Route path='/' Component={Home} />

            {/* 로그인 및 회원가입 */}
            <Route path='/user/login' Component={Login} />
            <Route path='/user/signup' Component={Signup} />

            {/* 소셜 로그인 */}
            <Route path='/oauth/naver/callback' Component={NaverCallback} />
            <Route path='/oauth/kakao/callback' Component={KakaoCallback} />
            <Route path='/oauth/login-success' Component={GoogleCallback}/>

            {/* 소셜 회원가입 */}
            <Route path='/user/signup/social' Component={SocialSignup} />

            {/* 유저 마이 페이지 */}
            <Route path='/user/:userKey' Component={UserPage} />

            {/* 상품 작성, 상세, 수정 페이지 */}
            <Route path='/product/write' Component={ItemWrite} />
            <Route path='/product/:itemKey' Component={ItemDetail} />
            <Route path='/product/modify/:itemKey' Component={ItemModify} />

            {/* 상품 검색 */}
            <Route path='/search' Component={ItemSearch} />

            {/* 결게 페이지 */}
            <Route path='/mock-payment/:orderId' Component={PaymentPage} />

            {/* 시세 조회 페이지 */}
            <Route path='/search/price' Component={SearchPrice}/>

            {/* 공지사항 페이지 */}
            <Route path='/notice' Component={Notice}/>
            <Route path='/notice/:noticeKey' Component={NoticeDetail} />

            {/* 신고 페이지 */}
            <Route path='/report/write' Component={WriteReport}/>
            <Route path='/report' Component={Report}/>

            {/* 회원 탈퇴 페이지 */}
            <Route path='/withdraw-complete' Component={WithdrawComplete}/>

            {/* 관리자 전용 */}
            <Route path='/admin/*' Component={AdminApp} />
          </Routes>
          {!hideLayout && <Footer />}
        </UserProvider>
      </ToastProvider>
    </>
  )
}

export default App;
