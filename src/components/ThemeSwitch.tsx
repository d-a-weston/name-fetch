import { useState, useEffect } from "react";

const lightTheme = "winter";
const darkTheme = "dark";

export const ThemeSwitch: React.FC = () => {
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    const newTheme = theme === lightTheme ? darkTheme : lightTheme;
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || lightTheme;
    setTheme(localTheme);
  }, []);

  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <>
      <button className="btn-ghost btn-square btn">
        <label className="swap-rotate swap h-12 w-12">
          <input
            type="checkbox"
            onChange={toggleTheme}
            checked={theme === lightTheme ? false : true}
          />
          <span role="img" aria-label="sun" className="swap-on text-2xl">
            ☀️
          </span>
          <span role="img" aria-label="moon" className="swap-off text-xl">
            ️🌙
          </span>
        </label>
      </button>
    </>
  );
};
