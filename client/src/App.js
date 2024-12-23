import {Route, Routes} from 'react-router-dom'
import {Home, Public ,Login} from './pages/public';
import path from './ultils/path';
import { ListenPlaylist, SearchHome } from './components';
import FinalRegister from './pages/user/FinalRegister';
function App() {
  return (
    <div className="app">
      <Routes>
          <Route path={path.PUBLIC} element={<Public/>}>
              <Route path={path.HOME} element={<Home/>}/>
              <Route path={path.LOGIN} element={<Login/>}/>
              <Route path={path.FinalRegister} element={<FinalRegister/>}/>
          </Route>
          <Route path={path.SEARCH} element={<SearchHome/>}/>
          <Route path={path.ListenPlaylist} element={<ListenPlaylist/>}/>
      </Routes>
    </div>
  );
}

export default App;
