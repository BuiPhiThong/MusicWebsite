import {Route, Routes} from 'react-router-dom'
import {Home, Public ,Login} from './pages/public';
import path from './ultils/path';
import { ListenPlaylist, SearchHome } from './components';
import FinalRegister from './pages/guest/FinalRegister';
import ResetPassword from './pages/guest/ResetPassword';
import { useSelector } from 'react-redux';
import './index.css'
import { ManagerAccount, Mylist, Profile } from './pages/private';
function App() {
  const { isDarkMode } = useSelector((state) => state.theme);
  return (
    <div className={`app ${isDarkMode ?"dark-mode" : ''}`}>
      <Routes>
          <Route path={path.PUBLIC} element={<Public/>}>
              <Route path={path.HOME} element={<Home/>}/>
              <Route path={path.LOGIN} element={<Login/>}/>
              <Route path={path.FinalRegister} element={<FinalRegister/>}/>
              <Route path={path.ResetPassword} element={<ResetPassword/>}/>
              <Route path={path.ManagerAccount} element={<ManagerAccount/>}/>
          </Route>
          <Route path={path.SEARCH} element={<SearchHome/>}/>
          <Route path={path.ListenPlaylist} element={<ListenPlaylist/>}/>
          <Route path={path.Profile} element={<Profile/>}/>
          <Route path={path.Mylist} element={<Mylist/>}/>
      </Routes>
    </div>
  );
}

export default App;
