import React from 'react';
import { useTheme } from '@/theme/ThemeContext';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      className={className}
      title={theme === 'dark' ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-brand-navy transition-transform hover:-rotate-12" />
      )}
    </Button>
  );
};

