import { Route, Routes } from 'react-router-dom';
import Login from './login';
import Dashboard from './dashboard';
import ProtectedRoute from './ProtectedRoute';
import Settings from './settings';

function App() {
  return (
    <>
    
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/settings" element={<Settings/>}/>
      </Routes>
      
      </>
  
  );
}

export default App;
