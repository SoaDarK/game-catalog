import { createContext, useContext, useMemo, useState } from 'react';
import { deleteUser, loginUser, registerUser } from '../services/usersApi.js';

const AuthContext = createContext(null);
const CURRENT_USER_KEY = 'game-catalog-current-user';

const readFromStorage = (key, fallbackValue) => {
  try {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallbackValue;
  } catch {
    return fallbackValue;
  }
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readFromStorage(CURRENT_USER_KEY, null));

  const value = useMemo(() => {
    const persistCurrentUser = (user) => {
      setCurrentUser(user);

      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return;
      }

      localStorage.removeItem(CURRENT_USER_KEY);
    };

    const register = async (form) => {
      try {
        const user = await registerUser({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        });
        persistCurrentUser(user);

        return { ok: true };
      } catch (error) {
        return { ok: false, message: error.message };
      }
    };

    const login = async (credentials) => {
      try {
        const user = await loginUser(credentials);
        persistCurrentUser(user);

        return { ok: true };
      } catch (error) {
        return { ok: false, message: error.message };
      }
    };

    const logout = () => {
      persistCurrentUser(null);
    };

    const deleteAccount = async () => {
      if (!currentUser?.id) {
        return { ok: false, message: 'Немає активного користувача.' };
      }

      try {
        await deleteUser(currentUser.id);
        persistCurrentUser(null);

        return { ok: true };
      } catch (error) {
        return { ok: false, message: error.message };
      }
    };

    return {
      currentUser,
      isAuthenticated: Boolean(currentUser),
      register,
      login,
      logout,
      deleteAccount,
    };
  }, [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
