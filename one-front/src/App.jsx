import './global/styles/index.scss'
import { Route, Routes } from "react-router-dom";
import { Header } from "./global/components/Header";
import { Footer } from "./global/components/Footer";
import { Home } from "./pages/Home";
import { Profile } from './pages/Profile';
import { Registration } from './pages/Registration';
import { Login } from './pages/Login';
import { Forgot } from './pages/Forgot';
import { useSelector } from 'react-redux';
import { Admin } from './pages/Admin';
import { RecoveryPass } from './pages/RecoveryPass';
import { EmailVerification } from './pages/EmailVerification';

const App = () => {

  const selector = useSelector(state => state)

  return (
    <>
      <Header />
      <main>
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/login' element={<Login />}/>
          <Route path='/registration' element={<Registration />}/>
          <Route path='/recovery' element={<RecoveryPass />}/>
          {
            selector.isAuth && (
              <>
                <Route path='/profile' element={<Profile />} />
                <Route path='/forgot/:id' element={<Forgot />}/>
                <Route path='/emailconfirm' element={<EmailVerification />} />
              </>
            )
          }
          {
            selector.status === 'admin' && (
              <>
                <Route path='/admin' element={<Admin />} />
              </>
            )
          }
        </Routes>
      </main>
      <Footer />
    </>
  )
}

export default App;