import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

function Navbar() {
  const { wishlistCount } = useWishlist();
  const { currentUser, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <NavLink className="brand" to="/">
        GameCatalog
      </NavLink>

      <nav className="nav-links" aria-label="Головна навігація">
        <NavLink to="/" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
          Каталог
        </NavLink>
        <NavLink
          to="/wishlist"
          className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
        >
          Wishlist
          <span className="wishlist-badge" aria-label={`Ігор у Wishlist: ${wishlistCount}`}>
            {wishlistCount}
          </span>
        </NavLink>
        {isAuthenticated ? (
          <div className="nav-user">
            <span>{currentUser.firstName}</span>
            <button className="nav-button" type="button" onClick={logout}>
              Вийти
            </button>
          </div>
        ) : (
          <NavLink
            to="/auth"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Логін / Реєстрація
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
