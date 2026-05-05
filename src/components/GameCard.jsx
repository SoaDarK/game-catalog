import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';

const formatPrice = (price) => (price === 0 ? 'Free to Play' : `${price} грн`);

function GameCard({ game }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { canUseWishlist, isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(game.id);

  const handleWishlistClick = (event) => {
    event.preventDefault();

    if (!canUseWishlist) {
      navigate('/auth', {
        state: {
          from: location.pathname,
          message: 'Увійдіть або зареєструйтеся, щоб додавати ігри у Wishlist.',
        },
      });
      return;
    }

    toggleWishlist(game);
  };

  return (
    <Link to={`/game/${game.id}`} className="game-card" aria-label={`Відкрити ${game.title}`}>
      <img className="game-card__image" src={game.image} alt={game.title} />
      <div className="game-card__content">
        <div>
          <p className="game-card__genre">{game.genre}</p>
          <h2>{game.title}</h2>
        </div>

        <div className="game-card__meta">
          <span>Rating {game.rating}</span>
          <strong>{formatPrice(game.price)}</strong>
        </div>

        <button
          className={isSaved ? 'button button--saved' : 'button'}
          type="button"
          onClick={handleWishlistClick}
        >
          {!canUseWishlist ? 'Увійдіть для Wishlist' : isSaved ? 'У Wishlist' : 'До Wishlist'}
        </button>
      </div>
    </Link>
  );
}

export default GameCard;
