/**
 * Bouwt de URL van een offline-pakketmanifest op basis van het basispad van de
 * app (`import.meta.env.BASE_URL`, altijd met slash aan het eind). Lokaal is dat
 * `/offline/…`, op GitHub Pages `/Game-Wereld/offline/…`. Een hardgecodeerd
 * `/offline/…` werkte alleen op een domein-root en brak de download op Pages
 * ("Offlinepakketmanifest kon niet worden geladen").
 */
export const resolveOfflineManifestUrl = (fileName: string): string =>
  `${import.meta.env.BASE_URL}offline/${fileName}`;
