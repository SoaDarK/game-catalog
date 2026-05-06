import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import CatalogPage from '../pages/CatalogPage.jsx';

jest.mock('../context/WishlistContext.jsx', () => ({
  useWishlist: () => ({
    canUseWishlist: false,
    isInWishlist: () => false,
    toggleWishlist: jest.fn(),
  }),
}));

const apiGames = [
  {
    id: 1,
    title: 'Cyberpunk 2077',
    genre: 'RPG',
    rating: '8.5',
    price: 599,
    release_date: '2020-12-10',
    image_url: '/images/cyberpunk.svg',
  },
  {
    id: 2,
    title: 'Doom Eternal',
    genre: 'Shooter',
    rating: '9.1',
    price: 499,
    release_date: '2020-03-20',
    image_url: '/images/doom.svg',
  },
];

describe('CatalogPage', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => apiGames,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders games loaded from server', async () => {
    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Завантаження ігор з бази даних...')).toBeInTheDocument();
    expect(await screen.findByText('Cyberpunk 2077')).toBeInTheDocument();
    expect(screen.getByText('Doom Eternal')).toBeInTheDocument();
    expect(screen.getByText('Показано 2 з 2 ігор')).toBeInTheDocument();
  });

  test('filters visible cards by search query', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <CatalogPage />
      </MemoryRouter>,
    );

    await screen.findByText('Cyberpunk 2077');
    await user.type(screen.getByPlaceholderText('Наприклад, Cyberpunk'), 'doom');

    await waitFor(() => {
      expect(screen.queryByText('Cyberpunk 2077')).not.toBeInTheDocument();
    });
    expect(screen.getByText('Doom Eternal')).toBeInTheDocument();
    expect(screen.getByText('Список відфільтровано')).toBeInTheDocument();
  });
});
