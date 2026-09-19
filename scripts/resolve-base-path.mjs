/**
 * Eén bron van waarheid voor het basispad van de app. Op GitHub Pages draait
 * de app onder `/Game-Wereld/`, lokaal onder `/`. Vite gebruikt dit als `base`
 * (en zet het in `import.meta.env.BASE_URL`); het offline-manifestscript
 * gebruikt het om asset-URL's te schrijven die overeenkomen met wat de app
 * tijdens het spelen echt opvraagt — anders kan de PWA-cache ze niet matchen
 * en faalt de download op Pages met "manifest kon niet worden geladen".
 *
 * Geeft altijd een pad met slash aan begin én eind terug.
 */
export const resolveBasePath = (env = process.env) => {
  const explicit = env.VITE_BASE_PATH;
  const raw =
    explicit ?? (env.GITHUB_PAGES === "true" || env.CI_PAGES === "true" ? "/Game-Wereld/" : "/");
  const withLeading = raw.startsWith("/") ? raw : `/${raw}`;
  return withLeading.endsWith("/") ? withLeading : `${withLeading}/`;
};
