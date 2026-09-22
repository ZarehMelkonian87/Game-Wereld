# 🔤 Woordverdeling — zone Speciale Woordenschat

> **Regel: elk woord hoort bij precies één game binnen de zone.** Geen enkel doelwoord komt in twee werelden voor. Zo oefent een kind in elke wereld écht nieuwe woorden, terwijl de plaatsbegrippen (in, op, naast, tussen …) juist overal terugkomen — dat is precies wat overdracht zichtbaar maakt.

| Veld                  | Waarde                    |
| :-------------------- | :------------------------ |
| **Laatst bijgewerkt** | 2026-09-22                |
| **Status**            | ✅ 101 woorden, 0 dubbele |

## Verdeling

| Game                            | Woorden | Lijst                                                                                                                                   |
| :------------------------------ | :-----: | :-------------------------------------------------------------------------------------------------------------------------------------- |
| **Magisch Strand-Avontuur**     |   12    | bal, boot, dolfijn, handdoek, krab, parasol, schelp, vlieger, vliegtuig, vuurtoren, zandkasteel, zon                                    |
| **Groot Circus-Avontuur**       |   19    | aap, acrobaat, ballon, beer, big, clown, eenwieler, hoepel, hond, kanon, kegel, kip, leeuw, muis, olifant, poes, trommel, vlag, zeehond |
| **Vrolijke Boerderij-Avontuur** |   14    | appel, eend, emmer, ezel, geit, hooibaal, koe, konijn, kruiwagen, paard, schaap, schuur, tractor, varken                                |
| **Zonnige Speeltuin-Avontuur**  |   14    | bank, bloem, boom, fiets, glijbaan, klimrek, schep, schommel, springtouw, step, vlinder, vogel, wip, zandbak                            |
| **Slimme School-Avontuur**      |   14    | boek, bord, gum, jas, kast, klok, lijm, liniaal, pen, potlood, rugzak, schaar, stoel, tafel                                             |
| **Stoere Ruimte-Avontuur**      |   14    | aarde, astronaut, helm, komeet, maan, marsmannetje, planeet, raket, robot, ruimtepak, satelliet, steen, ster, telescoop                 |
| **Wilde Dierentuin-Avontuur**   |   14    | flamingo, giraf, hek, krokodil, neushoorn, nijlpaard, palm, papegaai, pinguïn, schildpad, slang, tijger, voerbak, zebra                 |

## Hoe de verdeling tot stand kwam

Bij het uitwerken van de nieuwe werelden overlapten elf woorden, waarvan `bal` zelfs in vijf games stond. De volgorde waarin dat is opgelost:

1. **Magisch Strand-Avontuur wint altijd** — die game is uitgebracht en getest; daar verandert niets.
2. **Groot Circus-Avontuur** daarna, want de content staat al in code. Eén botsing: `bal` → **`kegel`** (jongleerkegel), doorgevoerd in `content.ts`, de aliassen, de vliegmodus, de sticker (`pin-sticker`) en alle documenten.
3. **De vijf ontwerpwerelden** pasten zich aan, want daar bestaat nog geen code:

| Wereld     | Was     | Wordt            | Reden                        |
| :--------- | :------ | :--------------- | :--------------------------- |
| Boerderij  | kip     | **geit**         | kip zit in het circus        |
| Boerderij  | hond    | **ezel**         | hond zit in het circus       |
| Boerderij  | kat     | **konijn**       | circus heeft al een poes     |
| Speeltuin  | bal     | **springtouw**   | bal is van het strand        |
| Speeltuin  | emmer   | **bloem**        | emmer hoort bij de boerderij |
| School     | bal     | **liniaal**      | bal is van het strand        |
| Ruimte     | zon     | **telescoop**    | zon is van het strand        |
| Ruimte     | vlag    | **ruimtepak**    | vlag zit in het circus       |
| Ruimte     | bal     | **marsmannetje** | bal is van het strand        |
| Dierentuin | leeuw   | **tijger**       | leeuw zit in het circus      |
| Dierentuin | olifant | **neushoorn**    | olifant zit in het circus    |
| Dierentuin | aap     | **flamingo**     | aap zit in het circus        |
| Dierentuin | beer    | **schildpad**    | beer zit in het circus       |
| Dierentuin | boom    | **palm**         | boom hoort bij de speeltuin  |
| Dierentuin | emmer   | **voerbak**      | emmer hoort bij de boerderij |

De vervangingen zijn zo gekozen dat het woordveld van de wereld klopt (een dierentuin zonder leeuw heeft nog altijd tijger, neushoorn en flamingo) en dat de moeilijkheidsopbouw blijft staan.

## Bij een nieuwe wereld

1. Zet de voorgenomen woordenlijst naast deze tabel.
2. Komt een woord al voor, kies dan een ander woord uit hetzelfde woordveld — verplaats het bestaande woord niet, tenzij de andere game nog geen code heeft.
3. Let ook op **synoniemen en varianten** van hetzelfde begrip (kat/poes, boom/palm): die tellen ook als dubbel.
4. Werk daarna deze tabel bij.

> **Plaatsbegrippen zijn juist wél overal gelijk** — in, op, boven, onder, links, rechts, midden, naast, tussen, dichtbij, ver weg. Dat is geen dubbeling maar het doel: hetzelfde begrip toepassen op nieuwe woorden.
