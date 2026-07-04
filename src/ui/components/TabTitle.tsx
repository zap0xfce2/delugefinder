import { useEffect } from "react";

export function TabTitle() {
  useEffect(() => {
    process.stdout.write("\x1b]0;delugefinder\x07");
    if (process.platform === "win32") process.title = "delugefinder";
  }, []);

  return null;
}
