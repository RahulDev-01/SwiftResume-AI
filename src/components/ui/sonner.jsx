import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner";

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      style={
        {
          "--normal-bg": "#16a34a",
          "--normal-text": "#ffffff",
          "--normal-border": "#16a34a"
        }
      }
      {...props} />
  );
}

export { Toaster }
