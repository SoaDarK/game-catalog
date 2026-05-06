import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const initialForm = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = (form, mode) => {
  const errors = {};

  if (mode === 'register' && !form.firstName.trim()) {
    errors.firstName = "Введіть ім'я.";
  }

  if (mode === 'register' && !form.lastName.trim()) {
    errors.lastName = 'Введіть прізвище.';
  }

  if (!form.email.trim()) {
    errors.email = 'Введіть електронну пошту.';
  } else if (!emailPattern.test(form.email.trim())) {
    errors.email = 'Введіть коректну електронну пошту.';
  }

  if (!form.password) {
    errors.password = 'Введіть пароль.';
  } else if (mode === 'register' && form.password.length < 6) {
    errors.password = 'Пароль має містити щонайменше 6 символів.';
  }

  return errors;
};

function AuthPage() {
  const { currentUser, deleteAccount, isAuthenticated, login, logout, register } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitMessage, setSubmitMessage] = useState(location.state?.message ?? '');

  const isRegisterMode = mode === 'register';
  const redirectPath = useMemo(() => location.state?.from || '/', [location.state?.from]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }));
    setSubmitMessage('');
  };

  const handleModeChange = (nextMode) => {
    setMode(nextMode);
    setForm(initialForm);
    setErrors({});
    setSubmitMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm(form, mode);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      setSubmitMessage('Перевірте поля форми перед відправленням.');
      return;
    }

    const result = isRegisterMode ? await register(form) : await login(form);

    if (!result.ok) {
      setSubmitMessage(result.message);
      return;
    }

    navigate(redirectPath, { replace: true });
  };

  const handleDeleteAccount = async () => {
    const result = await deleteAccount();

    if (!result.ok) {
      setSubmitMessage(result.message);
      return;
    }

    navigate('/', { replace: true });
  };

  if (isAuthenticated) {
    return (
      <section className="page auth-page">
        <div className="auth-card">
          <p className="eyebrow">Account</p>
          <h1>Ви вже увійшли</h1>
          <p>
            Активний користувач: {currentUser.firstName} {currentUser.lastName} ({currentUser.email})
          </p>
          <div className="auth-actions">
            <Link className="button button--link" to="/">
              До каталогу
            </Link>
            <button className="button button--danger" type="button" onClick={logout}>
              Вийти
            </button>
            <button className="button button--danger" type="button" onClick={handleDeleteAccount}>
              Видалити акаунт
            </button>
          </div>
          {submitMessage && <div className="form-message">{submitMessage}</div>}
        </div>
      </section>
    );
  }

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <p className="eyebrow">Platform access</p>
        <h1>{isRegisterMode ? 'Реєстрація' : 'Вхід'}</h1>
        <p>
          Перегляд каталогу відкритий для всіх. Щоб додавати ігри у Wishlist, увійдіть або
          створіть акаунт.
        </p>

        <div className="auth-tabs" role="tablist" aria-label="Перемикання форми">
          <button
            className={mode === 'login' ? 'auth-tab active' : 'auth-tab'}
            type="button"
            onClick={() => handleModeChange('login')}
          >
            Логін
          </button>
          <button
            className={mode === 'register' ? 'auth-tab active' : 'auth-tab'}
            type="button"
            onClick={() => handleModeChange('register')}
          >
            Реєстрація
          </button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {isRegisterMode && (
            <div className="auth-form__row">
              <label className="control-group">
                <span>Ім'я</span>
                <input
                  className="input"
                  type="text"
                  name="firstName"
                  aria-label="Ім'я"
                  value={form.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
                {errors.firstName && <small className="field-error">{errors.firstName}</small>}
              </label>

              <label className="control-group">
                <span>Прізвище</span>
                <input
                  className="input"
                  type="text"
                  name="lastName"
                  aria-label="Прізвище"
                  value={form.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
                {errors.lastName && <small className="field-error">{errors.lastName}</small>}
              </label>
            </div>
          )}

          <label className="control-group">
            <span>Електронна пошта</span>
            <input
              className="input"
              type="email"
              name="email"
              aria-label="Електронна пошта"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
            />
            {errors.email && <small className="field-error">{errors.email}</small>}
          </label>

          <label className="control-group">
            <span>Пароль</span>
            <input
              className="input"
              type="password"
              name="password"
              aria-label="Пароль"
              value={form.password}
              onChange={handleChange}
              autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
            />
            {errors.password && <small className="field-error">{errors.password}</small>}
          </label>

          {submitMessage && <div className="form-message">{submitMessage}</div>}

          <button className="button button--wide" type="submit">
            {isRegisterMode ? 'Зареєструватися' : 'Увійти'}
          </button>
        </form>
      </div>
    </section>
  );
}

export default AuthPage;
