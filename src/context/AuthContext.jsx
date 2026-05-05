import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const USERS_KEY = 'game-catalog-users';
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
  const [users, setUsers] = useState(() => readFromStorage(USERS_KEY, []));
  const [currentUser, setCurrentUser] = useState(() => readFromStorage(CURRENT_USER_KEY, null));

  const value = useMemo(() => {
    const persistUsers = (nextUsers) => {
      setUsers(nextUsers);
      localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    };

    const persistCurrentUser = (user) => {
      setCurrentUser(user);

      if (user) {
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return;
      }

      localStorage.removeItem(CURRENT_USER_KEY);
    };

    const register = ({ firstName, lastName, email, password }) => {
      const normalizedEmail = email.trim().toLowerCase();
      const exists = users.some((user) => user.email === normalizedEmail);

      if (exists) {
        return { ok: false, message: 'Користувач з такою поштою вже існує.' };
      }

      const newUser = {
        id: Date.now(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: normalizedEmail,
        password,
      };
      const publicUser = {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
      };

      persistUsers([...users, newUser]);
      persistCurrentUser(publicUser);

      return { ok: true };
    };

    const login = ({ email, password }) => {
      const normalizedEmail = email.trim().toLowerCase();
      const foundUser = users.find(
        (user) => user.email === normalizedEmail && user.password === password,
      );

      if (!foundUser) {
        return { ok: false, message: 'Невірна електронна пошта або пароль.' };
      }

      persistCurrentUser({
        id: foundUser.id,
        firstName: foundUser.firstName,
        lastName: foundUser.lastName,
        email: foundUser.email,
      });

      return { ok: true };
    };

    const logout = () => {
      persistCurrentUser(null);
    };

    return {
      currentUser,
      isAuthenticated: Boolean(currentUser),
      register,
      login,
      logout,
    };
  }, [currentUser, users]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};
