
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { UserProvider, useUserHook } from './hooks/userUserHook';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import NavBar from './components/NavBar';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import Admin from './components/Admin';
import Expense from './components/Expense';

const defaultTheme = createTheme();

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <ThemeProvider theme={defaultTheme}>
          <NavBar />
          <Routes>
            <Route path={'/register'} element={<Register />} />
            <Route path={'/login'} element={<Login />} />
            <Route element={<ProtectedRoute />}>
              <Route path={'/expense'} element={<Expense />} />
              <Route path={'/admin'} element={<Admin />} />
              <Route path={'/'} element={<Home />} />
            </Route>
          </Routes>
          {/* Footer */}
        </ThemeProvider>
      </UserProvider>
    </BrowserRouter>
  );
}

function ProtectedRoute({children}) {
  const userHook = useUserHook()
  if(!userHook.isAuthenticated()) {
    return <Navigate to='/login' replace />
  }
  return <Outlet />
}

export default App;
