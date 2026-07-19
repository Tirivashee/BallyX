import { brand } from "@/lib/site-config";

/** Builds a wa.me click-to-chat link with an optional custom prefilled message. */
export function getWhatsAppLink(message?: string) {
  const text = encodeURIComponent(message ?? brand.whatsapp.defaultMessage);
  return `https://wa.me/${brand.whatsapp.number}?text=${text}`;
}
