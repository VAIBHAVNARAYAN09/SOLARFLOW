import { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Simple wrapper around the NextThemesProvider
export function ThemeProvider({ 
  children, 
  ...props 
}: React.ComponentProps<typeof NextThemesProvider>) {
  const [mounted, setMounted] = useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent theme flash on load
    return <>{children}</>;
  }

  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  );
}

type ThemeContextType = {
  theme: string | undefined;
  setTheme: (theme: string) => void;
};

export const ThemeContext = createContext<ThemeContextType>({ 
  theme: "light", 
  setTheme: () => null 
});

export const useTheme = () => {
  return useContext(ThemeContext);
};