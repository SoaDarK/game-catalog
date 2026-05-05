import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { games } from '../data/games.js';

const formatPrice = (price) => (price === 0 ? 'Free to Play' : `${price} грн`);

function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const game = games.find((item) => item.id === Number(id));
  const { canUseWishlist, isInWishlist, toggleWishlist } = useWishlist();

  if (!game) {
    return (
      <section className="page empty-state">
        <h1>Гру не знайдено</h1>
        <p>Можливо, цей запис буде доступний після підключення API.</p>
        <Link className="button button--link" to="/">
          Повернутися до каталогу
        </Link>
      </section>
    );
  }

  const isSaved = isInWishlist(game.id);
  const handleWishlistClick = () => {
    if (!canUseWishlist) {
      navigate('/auth', {
        state: {
          from: location.pathname,
          message: 'Увійдіть або зареєструйтеся, щоб додати гру у Wishlist.',
        },
      });
      return;
    }

    toggleWishlist(game);
  };

  return (
    <section className="page game-details">
      <Link className="back-link" to="/">
        Назад до каталогу
      </Link>

      <div className="details-layout">
        <div>
          <img className="details-cover" src={game.image} alt={game.title} />
          <div className="screenshots">
            {game.screenshots.map((screenshot) => (
              <img key={screenshot} src={screenshot} alt={`${game.title} screenshot`} />
            ))}
          </div>
        </div>

        <article className="details-panel">
          <p className="eyebrow">{game.genre}</p>
          <h1>{game.title}</h1>
          <p className="details-description">{game.description}</p>

          <div className="details-stats">
            <div>
              <span>Рейтинг</span>
              <strong>{game.rating}</strong>
            </div>
            <div>
              <span>Ціна</span>
              <strong>{formatPrice(game.price)}</strong>
            </div>
            <div>
              <span>Дата виходу</span>
              <strong>{new Date(game.releaseDate).toLocaleDateString('uk-UA')}</strong>
            </div>
            <div>
              <span>Розробник</span>
              <strong>{game.developer}</strong>
            </div>
          </div>

          <section className="requirements">
            <h2>Системні вимоги</h2>
            <dl>
              <div>
                <dt>OS</dt>
                <dd>{game.requirements.os}</dd>
              </div>
              <div>
                <dt>RAM</dt>
                <dd>{game.requirements.ram}</dd>
              </div>
              <div>
                <dt>GPU</dt>
                <dd>{game.requirements.gpu}</dd>
              </div>
            </dl>
          </section>

          <button
            className={isSaved ? 'button button--saved button--wide' : 'button button--wide'}
            type="button"
            onClick={handleWishlistClick}
          >
            {!canUseWishlist
              ? 'Увійдіть, щоб додати у Wishlist'
              : isSaved
                ? 'Видалити з Wishlist'
                : 'Додати до Wishlist'}
          </button>
        </article>
      </div>
    </section>
  );
}

export default GamePage;
