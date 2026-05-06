import { useEffect, useState } from 'react';
import { createGame, deleteGame, fetchGames, updateGame } from '../services/gamesApi.js';

const initialForm = {
  title: '',
  genre: '',
  rating: '',
  price: '',
  release_date: '',
  description: '',
  developer: '',
  image_url: '',
  requirements_os: '',
  requirements_ram: '',
  requirements_gpu: '',
};

const toGamePayload = (form) => ({
  title: form.title.trim(),
  genre: form.genre.trim(),
  rating: form.rating === '' ? null : Number(form.rating),
  price: form.price === '' ? null : Number(form.price),
  release_date: form.release_date || null,
  description: form.description.trim(),
  developer: form.developer.trim(),
  image_url: form.image_url.trim(),
  requirements: {
    os: form.requirements_os.trim(),
    ram: form.requirements_ram.trim(),
    gpu: form.requirements_gpu.trim(),
  },
});

function ManageGamesPage() {
  const [games, setGames] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loadGames = async ({ clearStatus = true } = {}) => {
    setIsLoading(true);

    if (clearStatus) {
      setStatus('');
    }

    try {
      const loadedGames = await fetchGames();
      setGames(loadedGames);
    } catch (error) {
      setStatus(`Не вдалося отримати ігри: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadGames();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleEdit = (game) => {
    setEditingId(game.id);
    setForm({
      title: game.title || '',
      genre: game.genre || '',
      rating: game.rating ?? '',
      price: game.price ?? '',
      release_date: game.release_date || game.releaseDate || '',
      description: game.description || '',
      developer: game.developer || '',
      image_url: game.image_url || game.image || '',
      requirements_os: game.requirements?.os || '',
      requirements_ram: game.requirements?.ram || '',
      requirements_gpu: game.requirements?.gpu || '',
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setStatus('Назва гри обовʼязкова.');
      return;
    }

    try {
      const payload = toGamePayload(form);

      if (editingId) {
        await updateGame(editingId, payload);
        await loadGames({ clearStatus: false });
        setStatus('Гру оновлено через PUT /api/games/:id.');
      } else {
        await createGame(payload);
        await loadGames({ clearStatus: false });
        setStatus('Гру додано через POST /api/games.');
      }

      resetForm();
    } catch (error) {
      setStatus(`Помилка збереження: ${error.message}`);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteGame(id);
      await loadGames({ clearStatus: false });
      setStatus('Гру видалено через DELETE /api/games/:id.');
    } catch (error) {
      setStatus(`Помилка видалення: ${error.message}`);
    }
  };

  return (
    <section className="page">
      <div className="page-heading">
        <p className="eyebrow">Database CRUD</p>
        <h1>Керування іграми</h1>
        <p>
        На цій сторінці ви можете переглянути усі ігри, відредагувати інформацію про них, або зовсім видалити.
        </p>
      </div>

      <form className="crud-form" onSubmit={handleSubmit}>
        <label className="control-group">
          <span>Назва</span>
          <input className="input" name="title" value={form.title} onChange={handleChange} />
        </label>

        <label className="control-group">
          <span>Жанр</span>
          <input className="input" name="genre" value={form.genre} onChange={handleChange} />
        </label>

        <label className="control-group">
          <span>Рейтинг</span>
          <input
            className="input"
            type="number"
            min="0"
            max="10"
            step="0.1"
            name="rating"
            value={form.rating}
            onChange={handleChange}
          />
        </label>

        <label className="control-group">
          <span>Ціна</span>
          <input
            className="input"
            type="number"
            min="0"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </label>

        <label className="control-group">
          <span>Дата виходу</span>
          <input
            className="input"
            type="date"
            name="release_date"
            value={form.release_date}
            onChange={handleChange}
          />
        </label>

        <label className="control-group">
          <span>Розробник</span>
          <input
            className="input"
            name="developer"
            value={form.developer}
            onChange={handleChange}
          />
        </label>

        <label className="control-group crud-form__wide">
          <span>URL картинки</span>
          <input
            className="input"
            name="image_url"
            placeholder="/images/doom.svg"
            value={form.image_url}
            onChange={handleChange}
          />
        </label>

        <label className="control-group crud-form__wide">
          <span>Опис</span>
          <textarea
            className="input textarea"
            name="description"
            value={form.description}
            onChange={handleChange}
          />
        </label>

        <section className="requirements-fields crud-form__wide">
          <h2>Системні вимоги</h2>

          <label className="control-group">
            <span>OS</span>
            <input
              className="input"
              name="requirements_os"
              placeholder="Windows 10"
              value={form.requirements_os}
              onChange={handleChange}
            />
          </label>

          <label className="control-group">
            <span>RAM</span>
            <input
              className="input"
              name="requirements_ram"
              placeholder="8GB"
              value={form.requirements_ram}
              onChange={handleChange}
            />
          </label>

          <label className="control-group">
            <span>GPU</span>
            <input
              className="input"
              name="requirements_gpu"
              placeholder="GTX 1060"
              value={form.requirements_gpu}
              onChange={handleChange}
            />
          </label>
        </section>

        <div className="crud-actions">
          <button className="button" type="submit">
            {editingId ? 'Оновити гру' : 'Додати гру'}
          </button>
          {editingId && (
            <button className="button button--secondary" type="button" onClick={resetForm}>
              Скасувати
            </button>
          )}
        </div>
      </form>

      {status && <div className="form-message">{status}</div>}

      <div className="crud-panel">
        <div className="catalog-summary">
          <span>{isLoading ? 'Завантаження з БД...' : `Усі ігри: ${games.length}`}</span>
          <button className="button button--secondary" type="button" onClick={loadGames}>
            Оновити список
          </button>
        </div>

        <div className="crud-list">
          {games.map((game) => (
            <article className="crud-item" key={game.id}>
              <div>
                <h2>{game.title}</h2>
                <p>
                  {game.genre || 'Без жанру'} · Rating {game.rating ?? 'N/A'} ·{' '}
                  {game.price === 0 ? 'Free to Play' : `${game.price ?? 0} грн`}
                </p>
              </div>

              <div className="crud-actions">
                <button className="button button--secondary" type="button" onClick={() => handleEdit(game)}>
                  Редагувати
                </button>
                <button className="button button--danger" type="button" onClick={() => handleDelete(game.id)}>
                  Видалити
                </button>
              </div>
            </article>
          ))}

          {!isLoading && games.length === 0 && (
            <div className="empty-state">У базі поки немає ігор. Додай перший запис через форму.</div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ManageGamesPage;
