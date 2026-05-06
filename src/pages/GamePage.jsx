import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { fetchGame, fetchGames } from '../services/gamesApi.js';

const formatPrice = (price) => (price === 0 ? 'Free to Play' : `${price} грн`);

function GamePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [game, setGame] = useState(null);
  const [relatedGames, setRelatedGames] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');
  const { canUseWishlist, isInWishlist, toggleWishlist } = useWishlist();

  useEffect(() => {
    const loadGame = async () => {
      setIsLoading(true);
      setApiError('');

      try {
        const loadedGame = await fetchGame(id);
        const loadedGames = await fetchGames();
        const gamesInSameGenre = loadedGames
          .filter(
            (candidate) =>
              candidate.genre === loadedGame.genre && String(candidate.id) !== String(loadedGame.id),
          )
          .slice(0, 3);

        setGame(loadedGame);
        setRelatedGames(gamesInSameGenre);
      } catch (error) {
        setApiError(`Не вдалося завантажити гру з API: ${error.message}`);
        setGame(null);
        setRelatedGames([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadGame();
  }, [id]);

  if (isLoading) {
    return <section className="page empty-state">Завантаження гри з бази даних...</section>;
  }

  if (!game) {
    return (
      <section className="page empty-state">
        <h1>Гру не знайдено</h1>
        <p>{apiError || 'Можливо, такого запису немає в базі даних.'}</p>
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
          {relatedGames.length > 0 && (
            <section className="related-games" aria-labelledby="related-games-title">
              <h2 id="related-games-title">Схожі ігри</h2>
              <div className="related-games__grid">
                {relatedGames.map((relatedGame) => (
                  <Link
                    className="related-game"
                    key={relatedGame.id}
                    to={`/game/${relatedGame.id}`}
                    aria-label={`Відкрити ${relatedGame.title}`}
                  >
                    <img src={relatedGame.image} alt={relatedGame.title} />
                    <span>{relatedGame.title}</span>
                  </Link>
                ))}
              </div>
            </section>
          )}
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
