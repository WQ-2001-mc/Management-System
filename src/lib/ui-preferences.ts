export const themeStorageKey = "nexus-theme";
export const sidebarStorageKey = "nexus-sidebar-collapsed";

export type ThemePreference = "light" | "dark";

export function parseThemePreference(value: string | null): ThemePreference | null {
  return value === "light" || value === "dark" ? value : null;
}

export function parseCollapsedPreference(value: string | null) {
  if (value === "true") return true;
  if (value === "false") return false;
  return null;
}

