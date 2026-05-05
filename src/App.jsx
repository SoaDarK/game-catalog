import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AuthPage from './pages/AuthPage.jsx';
import CatalogPage from './pages/CatalogPage.jsx';
import GamePage from './pages/GamePage.jsx';
import WishlistPage from './pages/WishlistPage.jsx';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="page-shell">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/game/:id" element={<GamePage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <WishlistPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
