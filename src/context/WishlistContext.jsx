import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext(null);
const getStorageKey = (email) => `game-catalog-wishlist-${email}`;

const readStoredWishlist = (email) => {
  if (!email) {
    return [];
  }

  try {
    const storedValue = localStorage.getItem(getStorageKey(email));
    return storedValue ? JSON.parse(storedValue) : [];
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [wishlistState, setWishlistState] = useState(() => ({
    email: currentUser?.email ?? null,
    items: readStoredWishlist(currentUser?.email),
  }));
  const wishlist = wishlistState.items;

  useEffect(() => {
    setWishlistState({
      email: currentUser?.email ?? null,
      items: readStoredWishlist(currentUser?.email),
    });
  }, [currentUser?.email]);

  useEffect(() => {
    if (currentUser?.email && wishlistState.email === currentUser.email) {
      localStorage.setItem(getStorageKey(currentUser.email), JSON.stringify(wishlist));
    }
  }, [currentUser?.email, wishlist, wishlistState.email]);

  const value = useMemo(() => {
    const isInWishlist = (gameId) => wishlist.some((game) => game.id === gameId);

    const addToWishlist = (game) => {
      if (!isAuthenticated) {
        return false;
      }

      setWishlistState((currentState) => {
        if (currentState.items.some((item) => item.id === game.id)) {
          return currentState;
        }

        return { ...currentState, items: [...currentState.items, game] };
      });

      return true;
    };

    const removeFromWishlist = (gameId) => {
      setWishlistState((currentState) => ({
        ...currentState,
        items: currentState.items.filter((game) => game.id !== gameId),
      }));
    };

    const toggleWishlist = (game) => {
      if (!isAuthenticated) {
        return false;
      }

      if (isInWishlist(game.id)) {
        removeFromWishlist(game.id);
        return true;
      }

      return addToWishlist(game);
    };

    return {
      wishlist,
      wishlistCount: wishlist.length,
      canUseWishlist: isAuthenticated,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      toggleWishlist,
    };
  }, [isAuthenticated, wishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }

  return context;
};
