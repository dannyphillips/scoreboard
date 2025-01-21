import { useTheme } from '../context/ThemeContext';

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        p-2 rounded-full transition-colors duration-200
        ${theme === 'light' 
          ? 'bg-scoreboard-light-sun text-scoreboard-light-tree' 
          : 'bg-scoreboard-dark-sun text-scoreboard-dark-bg'
        }
      `}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
}

export default ThemeToggle; 
