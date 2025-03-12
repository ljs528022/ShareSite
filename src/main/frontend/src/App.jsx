import './App.css'
import { Route, Routes } from 'react-router-dom';
import Header from './components/header';

function App() {

  return (
    <>
      <Header />
      <Routes>
        {/* Main page */}
        <Route></Route>

        {/* Login & Register */}
        <Route></Route>

        {/* User Page */}
        <Route></Route>

        {/* Item Page */}
        <Route></Route>

      </Routes>
    </>
  )
}

export default App
