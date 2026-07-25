// Fixed preset avatars — no upload/storage needed for this, users just
// pick one of these. Keys are stored on users.avatar_key; add a new
// preset by adding an entry here + a matching public/images/avatars/*.svg.
export const AVATAR_PRESETS = [
  { key: "sunrise", label: "Sunrise", src: "/images/avatars/sunrise.svg" },
  { key: "wave", label: "Wave", src: "/images/avatars/wave.svg" },
  { key: "leaf", label: "Leaf", src: "/images/avatars/leaf.svg" },
  { key: "bolt", label: "Bolt", src: "/images/avatars/bolt.svg" },
  { key: "orbit", label: "Orbit", src: "/images/avatars/orbit.svg" },
  { key: "bloom", label: "Bloom", src: "/images/avatars/bloom.svg" },
  { key: "comet", label: "Comet", src: "/images/avatars/comet.svg" },
  { key: "prism", label: "Prism", src: "/images/avatars/prism.svg" },
] as const;

export type AvatarKey = (typeof AVATAR_PRESETS)[number]["key"];

const AVATAR_BY_KEY = new Map<string, (typeof AVATAR_PRESETS)[number]>(
  AVATAR_PRESETS.map((preset) => [preset.key, preset]),
);

export function isAvatarKey(value: string): value is AvatarKey {
  return AVATAR_BY_KEY.has(value);
}

/** Falls back to the first preset for an unset/unrecognized key. */
export function getAvatarSrc(key: string | null | undefined): string {
  return (key ? AVATAR_BY_KEY.get(key)?.src : undefined) ?? AVATAR_PRESETS[0].src;
}
