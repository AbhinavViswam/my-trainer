import { useColorScheme } from "react-native";
import { Home, Wallet } from "lucide-react-native";

type TabBarIconProps = {
  name: "home" | "payments";
  focused: boolean;
};

export default function TabBarIcon({ name, focused }: TabBarIconProps) {
  const isDark = useColorScheme() === "dark";

  const color = focused
    ? "#10b981"
    : isDark
    ? "#9ca3af"
    : "#6b7280";

  const size = 22;

  if (name === "home") {
    return <Home size={size} color={color} />;
  }

  if (name === "payments") {
    return <Wallet size={size} color={color} />;
  }

  return null;
}
