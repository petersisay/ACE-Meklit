import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Universal ScrollToTop component
 * Ensures that every route transition, page navigation, or link click
 * across the entire application starts immediately from the top of the page.
 */
const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    // Instantly scroll window and root document to the very top (0, 0)
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [pathname, search]);

  return null;
};

export default ScrollToTop;
