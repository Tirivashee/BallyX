// BallyX invoice theme tokens. Single source of truth for both the on-screen
// preview (HTML/CSS) and the generated PDF (@react-pdf/renderer).

export const THEME = {
  ink: "#111111", // near-black brand ink
  text: "#1A1A1A", // body text
  muted: "#666666", // secondary text
  faint: "#8A8A8A", // footer / very light text
  headHint: "#777777", // key labels in the details table
  accent: "#FF4A1C", // BallyX orange
  accentSoft: "#FFF6F2", // orange-tinted callout background
  border: "#EEEEEE", // table row divider
  line: "#E5E5E5", // footer divider
  paper: "#FFFFFF",
} as const;

export type Theme = typeof THEME;
