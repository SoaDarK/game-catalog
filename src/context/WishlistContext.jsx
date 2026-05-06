import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import { addWishlistItem, deleteWishlistItem, fetchWishlist } from '../services/wishlistApi.js';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { currentUser, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const loadWishlist = async () => {
      if (!currentUser?.id) {
        setWishlist([]);
        return;
      }

      try {
        const loadedWishlist = await fetchWishlist(currentUser.id);
        setWishlist(loadedWishlist);
      } catch {
        setWishlist([]);
      }
    };

    loadWishlist();
  }, [currentUser?.id]);

  const value = useMemo(() => {
    const isInWishlist = (gameId) => wishlist.some((game) => game.id === gameId);

    const addToWishlist = async (game) => {
      if (!isAuthenticated || !currentUser?.id) {
        return false;
      }

      if (isInWishlist(game.id)) {
        return true;
      }

      const savedGame = await addWishlistItem(currentUser.id, game.id);
      setWishlist((currentWishlist) => [...currentWishlist, savedGame]);

      return true;
    };

    const removeFromWishlist = async (gameId) => {
      if (!currentUser?.id) {
        return false;
      }

      await deleteWishlistItem(currentUser.id, gameId);
      setWishlist((currentWishlist) => currentWishlist.filter((game) => game.id !== gameId));

      return true;
    };

    const toggleWishlist = async (game) => {
      if (!isAuthenticated || !currentUser?.id) {
        return false;
      }

      if (isInWishlist(game.id)) {
        return removeFromWishlist(game.id);
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
  }, [currentUser?.id, isAuthenticated, wishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export const useWishlist = () => {
  const context = useContext(WishlistContext);

  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider');
  }

  return context;
};
