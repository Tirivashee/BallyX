import { pluto } from "@/lib/site-config";

/**
 * Downloadable apps shown on /downloads. Every app currently has
 * `downloadReady: false` — there are no real installer files in the repo
 * yet, so the Download button renders as a disabled "Coming soon" state
 * rather than pretending to trigger a file that doesn't exist. Flip it
 * to `true` and point `downloadUrl` at a real file once one is hosted.
 *
 * Version/release date/file size are explicitly placeholder for all
 * three apps (see the {{...}} convention note in site-config.ts) — none
 * of these facts are confirmed anywhere yet, including for Pluto.
 *
 * `detailHref` is where the download card's "View details" link goes.
 * Pluto's already has a full marketing page — point it there instead of
 * duplicating that content at /downloads/pluto (the dynamic route still
 * redirects /downloads/pluto to /product too, for anyone who lands on
 * that URL directly). Mars and Venus get a generic detail page rendered
 * from `screenshots` below, since neither has a dedicated page yet.
 */
export type DownloadApp = {
  id: string;
  name: string;
  icon: string;
  tagline: string;
  description: string;
  version: string;
  releaseDate: string;
  platforms: string[];
  fileSize: string;
  downloadReady: boolean;
  downloadUrl?: string;
  detailHref: string;
  screenshots: { src: string; alt: string; caption: string }[];
};

export const downloads: DownloadApp[] = [
  {
    id: "pluto",
    name: pluto.name,
    icon: "/images/app-icons/pluto.png",
    tagline: pluto.tagline,
    description: pluto.subhead,
    version: "{{PLUTO_VERSION}}",
    releaseDate: "{{PLUTO_RELEASE_DATE}}",
    platforms: ["Windows 10/11"],
    fileSize: "{{PLUTO_FILE_SIZE}}",
    downloadReady: false,
    detailHref: "/product",
    screenshots: [],
  },
  {
    id: "mars",
    name: "Mars",
    icon: "/images/app-icons/mars.png",
    tagline: "{{MARS_TAGLINE}}",
    description: "{{MARS_DESCRIPTION}}",
    version: "{{MARS_VERSION}}",
    releaseDate: "{{MARS_RELEASE_DATE}}",
    platforms: ["{{MARS_PLATFORMS}}"],
    fileSize: "{{MARS_FILE_SIZE}}",
    downloadReady: false,
    detailHref: "/downloads/mars",
    screenshots: [
      {
        src: "/images/screenshots/mars-overview.svg",
        alt: "Placeholder screenshot of the Mars overview screen",
        caption: "Overview",
      },
      {
        src: "/images/screenshots/mars-detail.svg",
        alt: "Placeholder screenshot of a Mars detail view",
        caption: "Detail view",
      },
    ],
  },
  {
    id: "venus",
    name: "Venus",
    icon: "/images/app-icons/venus.png",
    tagline: "{{VENUS_TAGLINE}}",
    description: "{{VENUS_DESCRIPTION}}",
    version: "{{VENUS_VERSION}}",
    releaseDate: "{{VENUS_RELEASE_DATE}}",
    platforms: ["{{VENUS_PLATFORMS}}"],
    fileSize: "{{VENUS_FILE_SIZE}}",
    downloadReady: false,
    detailHref: "/downloads/venus",
    screenshots: [
      {
        src: "/images/screenshots/venus-overview.svg",
        alt: "Placeholder screenshot of the Venus overview screen",
        caption: "Overview",
      },
      {
        src: "/images/screenshots/venus-detail.svg",
        alt: "Placeholder screenshot of a Venus detail view",
        caption: "Detail view",
      },
    ],
  },
];
