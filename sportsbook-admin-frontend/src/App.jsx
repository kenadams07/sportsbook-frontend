import { useAuth } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';
import Login from './pages/Login';
import AppRoutes from './routes/AppRoutes';
import Layout from './components/Layout';
import './App.css';

function App() {
  const { isLoggedIn } = useAuth();

  return (
    <Router>
      <Layout>
        {isLoggedIn ? (
          <AppRoutes />
        ) : (
          <Login />
        )}
      </Layout>
    </Router>
  );
}

export default App;