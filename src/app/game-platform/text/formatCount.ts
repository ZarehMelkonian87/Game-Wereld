/**
 * Getal + zelfstandig naamwoord in het juiste getal: "1 bestand", "3 bestanden".
 * Voorkomt "1 bestanden"-achtige fouten in de hele app.
 */
export const formatCount = (count: number, singular: string, plural: string): string =>
  `${count} ${count === 1 ? singular : plural}`;
