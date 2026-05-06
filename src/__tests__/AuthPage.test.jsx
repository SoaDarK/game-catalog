import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from '../pages/AuthPage.jsx';

const mockRegister = jest.fn();
const mockLogin = jest.fn();
const mockLogout = jest.fn();
const mockDeleteAccount = jest.fn();

jest.mock('../context/AuthContext.jsx', () => ({
  useAuth: () => ({
    currentUser: null,
    deleteAccount: mockDeleteAccount,
    isAuthenticated: false,
    login: mockLogin,
    logout: mockLogout,
    register: mockRegister,
  }),
}));

describe('AuthPage', () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockLogin.mockReset();
    mockLogout.mockReset();
    mockDeleteAccount.mockReset();
  });

  test('validates required registration fields and password length', async () => {
    const user = userEvent.setup();

    render(
      <MemoryRouter>
        <AuthPage />
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Реєстрація' }));
    await user.click(screen.getByRole('button', { name: 'Зареєструватися' }));

    expect(screen.getByText("Введіть ім'я.")).toBeInTheDocument();
    expect(screen.getByText('Введіть прізвище.')).toBeInTheDocument();
    expect(screen.getByText('Введіть електронну пошту.')).toBeInTheDocument();
    expect(screen.getByText('Введіть пароль.')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();

    await user.type(screen.getByLabelText("Ім'я"), 'Ivan');
    await user.type(screen.getByLabelText('Прізвище'), 'Petrenko');
    await user.type(screen.getByLabelText('Електронна пошта'), 'bad-email');
    await user.type(screen.getByLabelText('Пароль'), '123');
    await user.click(screen.getByRole('button', { name: 'Зареєструватися' }));

    expect(screen.getByText('Введіть коректну електронну пошту.')).toBeInTheDocument();
    expect(screen.getByText('Пароль має містити щонайменше 6 символів.')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });
});
