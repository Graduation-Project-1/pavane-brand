import logo from './logo.svg';
import './App.css';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute/ProtectedRoute';
import Login from './pages/Login/Login'

function App() {

  const auth = useSelector((state) => state.auth);

  return <>
    <Routes>
      <Route path="/*" element={<ProtectedRoute />} />

      <Route
        path="/login"
        element={auth.AdminToken ? <Navigate to="/" /> : <Login />}
      />
    </Routes>
  </>
}

export default App;
