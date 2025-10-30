// Navigation header component
import { Link, useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getLinkClass = (path: string) => {
    const baseClass = "px-4 py-2 rounded-md font-medium transition-colors";
    if (isActive(path)) {
      return `${baseClass} bg-[#00b8a3] text-white`;
    }
    return `${baseClass} text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700`;
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md mb-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                LeetCode Pomodoro
              </h1>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                Learning Companion
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-2">
            <Link to="/" className={getLinkClass('/')}>
              🏠 Home
            </Link>
            <Link to="/library" className={getLinkClass('/library')}>
              📚 Library
            </Link>
            <Link to="/stats" className={getLinkClass('/stats')}>
              📊 Stats
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
