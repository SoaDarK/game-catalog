import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';

const formatPrice = (price) => (price === 0 ? 'Free to Play' : `${price} грн`);

function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Saved games</p>
        <h1>Wishlist</h1>
        <p>Тут зібрані усі ваші улюблені ігри.</p>
      </div>

      {wishlist.length > 0 ? (
        <div className="wishlist-list">
          {wishlist.map((game) => (
            <article className="wishlist-item" key={game.id}>
              <Link to={`/game/${game.id}`} className="wishlist-item__main">
                <img src={game.image} alt={game.title} />
                <div>
                  <p>{game.genre}</p>
                  <h2>{game.title}</h2>
                  <span>
                    Rating {game.rating} · {formatPrice(game.price)}
                  </span>
                </div>
              </Link>

              <button
                className="button button--danger"
                type="button"
                onClick={() => removeFromWishlist(game.id)}
              >
                Видалити
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <h2>Wishlist порожній</h2>
          <p>Додай ігри з каталогу, щоб швидко повернутися до них пізніше.</p>
          <Link className="button button--link" to="/">
            Перейти до каталогу
          </Link>
        </div>
      )}
    </section>
  );
}

export default WishlistPage;
