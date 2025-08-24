import { MoonStar } from "~/lib/icons/MoonStar";
import { Sun } from "~/lib/icons/Sun";
import { useThemePersistence } from "~/hooks/useThemePersistence";
import { cn } from "~/lib/utils";
import { Button } from "@/components/ui/";

export function ThemeToggle() {
  const { isDarkColorScheme, setTheme } = useThemePersistence();

  type Theme = "light" | "dark";
  const toggleTheme = (theme: Theme) => {
    setTheme(theme);
  };

  if (!isDarkColorScheme) {
    return (
      <Button
        variant={"ghost"}
        onPress={() => toggleTheme("dark")}
        // className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 ms-6"
      >
        <MoonStar className="text-blue-500" size={23} strokeWidth={2} />
      </Button>
    );
  }

  return (
    <Button
      onPress={() => toggleTheme("light")}
      variant={"ghost"}
      // className="web:ring-offset-background web:transition-colors web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 ms-6"
    >
      <Sun
        className="text-yellow-500"
        size={23}
        strokeWidth={2}
        color={"#FFD700"}
      />
    </Button>
  );
}
