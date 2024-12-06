import {Route, Routes} from 'react-router-dom'
import {Home, Public ,Login} from './pages/public';
import path from './ultils/path';
import { SearchHome } from './components';
function App() {
  return (
    <div className="app">
      <Routes>
          <Route path={path.PUBLIC} element={<Public/>}>
              <Route path={path.HOME} element={<Home/>}/>
              <Route path={path.LOGIN} element={<Login/>}/>
          </Route>
          <Route path={path.SEARCH} element={<SearchHome/>}/>
      </Routes>
    </div>
  );
}

export default App;
