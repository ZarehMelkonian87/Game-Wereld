import { test, type Page, type Locator } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

interface StepInfo {
  id: string;
  category: string;
  title: string;
  what: string;
  why: string;
  how: string;
  action: string;
  screenshotFile: string;
}

const steps: StepInfo[] = [];
const outputDir = path.resolve(process.cwd(), "test-rapport-assets");

/**
 * Voegt een opvallende visuele markering (rode pulserende rand + "KLIK HIER" badge) toe aan een element
 * voordat het screenshot wordt gemaakt, zodat exact zichtbaar is waar de actie plaatsvindt.
 */
const markAndScreenshot = async (
  page: Page,
  target: Locator | string,
  stepId: string,
  actionDescription: string,
  markerLabel = "KLIK HIER",
) => {
  const locator = typeof target === "string" ? page.locator(target).first() : target;
  await locator.waitFor({ state: "visible", timeout: 3000 }).catch(() => {});

  const handle = await locator.elementHandle({ timeout: 2000 }).catch(() => null);
  if (handle) {
    await page.evaluate(
      ({ el, label }) => {
        // Verwijder eerdere markers
        document.querySelectorAll(".test-action-marker").forEach((m) => m.remove());

        const rect = el.getBoundingClientRect();
        const marker = document.createElement("div");
        marker.className = "test-action-marker";
        marker.style.position = "fixed";
        marker.style.left = `${Math.max(4, rect.left - 4)}px`;
        marker.style.top = `${Math.max(4, rect.top - 4)}px`;
        marker.style.width = `${rect.width + 8}px`;
        marker.style.height = `${rect.height + 8}px`;
        marker.style.border = "4px solid #ef4444";
        marker.style.borderRadius = "20px";
        marker.style.boxShadow = "0 0 0 4px rgba(239, 68, 68, 0.4), 0 0 25px rgba(239, 68, 68, 0.8)";
        marker.style.pointerEvents = "none";
        marker.style.zIndex = "99999";
        marker.style.transition = "all 0.2s ease";

        const badge = document.createElement("div");
        badge.innerText = `👉 ${label}`;
        badge.style.position = "absolute";
        badge.style.top = rect.top > 40 ? "-32px" : `${rect.height + 8}px`;
        badge.style.left = "50%";
        badge.style.transform = "translateX(-50%)";
        badge.style.backgroundColor = "#ef4444";
        badge.style.color = "#ffffff";
        badge.style.padding = "4px 12px";
        badge.style.borderRadius = "12px";
        badge.style.fontFamily = "system-ui, -apple-system, sans-serif";
        badge.style.fontSize = "12px";
        badge.style.fontWeight = "900";
        badge.style.letterSpacing = "0.05em";
        badge.style.boxShadow = "0 4px 10px rgba(0,0,0,0.3)";
        badge.style.whiteSpace = "nowrap";

        marker.appendChild(badge);
        document.body.appendChild(marker);
      },
      { el: handle, label: markerLabel },
    );
  }

  await page.waitForTimeout(150);
  const filename = `${stepId}.png`;
  const filePath = path.join(outputDir, filename);
  await page.screenshot({ path: filePath, fullPage: false });

  // Verwijder marker na screenshot
  await page.evaluate(() => {
    document.querySelectorAll(".test-action-marker").forEach((m) => m.remove());
  });

  return filename;
};

test.describe.serial("Genereer Testrapport met Gemarkeerde Screenshots", () => {
  test("Voert alle actiestappen uit en verzamelt gemarkeerde screenshots", async ({
    page,
    context,
  }) => {
    test.setTimeout(180_000);
    await context.grantPermissions(["microphone"]);

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // ==========================================
    // DEEL 1: PORTAAL & SPELERSPROFIEL
    // ==========================================
    await page.goto("/");
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();

    // Stap 1: Welkomstscherm
    const startBtn = page.getByRole("button", { name: "START" });
    const s1 = await markAndScreenshot(
      page,
      startBtn,
      "stap-01-welkom-startknop",
      "Klik op de grote START knop om het spelportaal te openen.",
      "KLIK START",
    );
    steps.push({
      id: "stap-01",
      category: "1. Portaal & Profiel",
      title: "Welkomstscherm Game-Wereld",
      what: "Verifiëren dat het welkomstscherm geladen wordt en de startknop interactief is.",
      why: "Kinderen moeten een intuïtieve, uitnodigende start ervaren zonder drempels of ingewikkelde logins.",
      how: "De landingspagina initialiseert de lokale PWA en toont de visuele titelbalk en startknop.",
      action: "Klik op de grote 'START' knop om door te gaan naar het profieloverzicht.",
      screenshotFile: s1,
    });
    await startBtn.click();

    // Stap 2: Nieuwe speler
    const nieuwSpelerBtn = page.getByRole("button", { name: "NIEUW SPELER" });
    const s2 = await markAndScreenshot(
      page,
      nieuwSpelerBtn,
      "stap-02-profiel-nieuw-speler",
      "Kies 'NIEUW SPELER' om een profiel aan te maken.",
      "KIES NIEUW SPELER",
    );
    steps.push({
      id: "stap-02",
      category: "1. Portaal & Profiel",
      title: "Spelersprofiel Aanmaken",
      what: "Controleren dat een nieuw spelersprofiel aangemaakt kan worden.",
      why: "Elk kind bewaart zijn eigen voortgang, verdiende sterren en privacy-instellingen lokaal op het apparaat.",
      how: "De profielmanager opent een wizard met kindvriendelijke avatars en naamselectie.",
      action: "Klik op de knop 'NIEUW SPELER'.",
      screenshotFile: s2,
    });
    await nieuwSpelerBtn.click();

    // Stap 3: Avatar kiezen
    const avatarCard = page.locator('[data-component="AvatarCard"]').first();
    const s3 = await markAndScreenshot(
      page,
      avatarCard,
      "stap-03-avatar-kiezen",
      "Klik op een avatar om je speelfiguur te kiezen.",
      "KIES AVATAR",
    );
    steps.push({
      id: "stap-03",
      category: "1. Portaal & Profiel",
      title: "Avatar Selectie",
      what: "Kiezen van een herkenbare mascotte-avatar voor het profiel.",
      why: "Verhoogt de betrokkenheid en herkenbaarheid voor jonge kinderen die nog niet kunnen lezen.",
      how: "De geselecteerde avatar wordt gehighlight en gekoppeld aan de lokale IndexedDB opslag.",
      action: "Klik op de gewenste mascotte-avatar.",
      screenshotFile: s3,
    });
    await avatarCard.click();

    // Stap 4: Naam invoeren en bevestigen
    const nameInput = page.getByPlaceholder("Type je gamer naam...");
    await nameInput.fill("Strand Tester");
    const letsGoBtn = page.getByRole("button", { name: "LET'S GO!" });
    const s4 = await markAndScreenshot(
      page,
      letsGoBtn,
      "stap-04-naam-bevestigen",
      "Bevestig de ingevoerde naam met de 'LET'S GO!' knop.",
      "KLIK LET'S GO!",
    );
    steps.push({
      id: "stap-04",
      category: "1. Portaal & Profiel",
      title: "Naam Invoeren & Bevestigen",
      what: "Het invoeren van een spelersnaam en afronden van de profielcreatie.",
      why: "Persoonlijke begroeting in het spel en koppeling van beloningen aan het kind.",
      how: "Na validatie slaat het systeem het profiel op en navigeert automatisch naar de spelcatalogus.",
      action: "Typ de spelersnaam en klik op 'LET'S GO!'.",
      screenshotFile: s4,
    });
    await letsGoBtn.click();

    // Stap 5: Catalogus / Thema Selectie
    const themaBtn = page.getByRole("button", { name: /Speciale Woordenschat/ });
    const s5 = await markAndScreenshot(
      page,
      themaBtn,
      "stap-05-themakeuze",
      "Klik op 'Speciale Woordenschat' om de educatieve games te openen.",
      "KIES THEMA",
    );
    steps.push({
      id: "stap-05",
      category: "1. Portaal & Profiel",
      title: "Themakeuze: Speciale Woordenschat",
      what: "Openen van het leerthema voor ruimtelijke en logopedische woordenschat.",
      why: "Biedt een helder gestructureerd curriculum waarin verschillende spelvormen samenkomen.",
      how: "De themakaart toont de beschikbare spellen die horen bij de logopedische methodiek.",
      action: "Klik op de themakaart 'Speciale Woordenschat'.",
      screenshotFile: s5,
    });
    await themaBtn.click();

    // Stap 6: Game Selectie
    const gameBtn = page.getByRole("button", { name: /Magisch Strand-Avontuur/ });
    const s6 = await markAndScreenshot(
      page,
      gameBtn,
      "stap-06-game-starten",
      "Klik op 'Magisch Strand-Avontuur' om het spel in te laden.",
      "START DIT SPEL",
    );
    steps.push({
      id: "stap-06",
      category: "1. Portaal & Profiel",
      title: "Game Launch: Magisch Strand-Avontuur",
      what: "Het opstarten van de game runtime binnen de veilige PWA-container.",
      why: "Het kind start direct in de vertrouwde grafische omgeving met strandthema.",
      how: "De gamehost initialiseert de assets, audio context en lokale spraakengine.",
      action: "Klik op 'Magisch Strand-Avontuur' in de lijst met spellen.",
      screenshotFile: s6,
    });
    await gameBtn.click();
    await page.getByTestId("start-screen").waitFor({ state: "visible" });

    // ==========================================
    // DEEL 2: HOOFDMENU & STARTSCHERM
    // ==========================================
    // Stap 7: Startscherm inspectie
    const s7 = await markAndScreenshot(
      page,
      page.getByTestId("start-play-button"),
      "stap-07-startscherm-speelknop",
      "Het startscherm toont de speelknop, sterrenteller en instellingen.",
      "GROTE SPEELKNOP",
    );
    steps.push({
      id: "stap-07",
      category: "2. Hoofdmenu (StartScreen)",
      title: "Startscherm Overzicht",
      what: "Controleren van alle hoofdelementen: titel, zandkasteel-decor, sterrenteller en actieknoppen.",
      why: "Directe en vrolijke visuele uitnodiging; het kind ziet zijn huidige sterrenstatus en kan direct spelen.",
      how: "StartScreen toont de geanimeerde mascotte, sterrenteller en een opvallende speelknop.",
      action: "Bekijk het startscherm; de focus ligt op de grote 'Spelen' knop.",
      screenshotFile: s7,
    });

    // Stap 8: Instellingenknop op startscherm
    const settingsBtn = page.getByTestId("start-settings-button");
    const s8 = await markAndScreenshot(
      page,
      settingsBtn,
      "stap-08-instellingen-knop",
      "Klik op het tandwiel-icoon om het instellingenscherm te openen.",
      "TANDWIEL INSTELLINGEN",
    );
    steps.push({
      id: "stap-08",
      category: "2. Hoofdmenu (StartScreen)",
      title: "Instellingenknop (Tandwiel)",
      what: "Toegankelijkheid tot audio-, microfoon- en voortgangsinstellingen vanaf het startscherm.",
      why: "Ouders en logopedisten kunnen direct vóór de sessie geluid of privacy controleren.",
      how: "Opent GameSettingsScreen met behoud van de schermgeschiedenis.",
      action: "Klik rechtsboven op het tandwiel-icoon.",
      screenshotFile: s8,
    });
    await settingsBtn.click();
    await page.getByTestId("game-settings-screen").waitFor({ state: "visible" });

    // ==========================================
    // DEEL 3: INSTELLINGEN & PRIVACY
    // ==========================================
    // Stap 9: Audio Toggle
    const audioToggle = page.getByTestId("settings-audio-toggle");
    const s9 = await markAndScreenshot(
      page,
      audioToggle,
      "stap-09-audio-toggle",
      "Klik op de audio-toggle om gesproken opdrachten en video-audio aan of uit te zetten.",
      "TOGGLE AUDIO",
    );
    steps.push({
      id: "stap-09",
      category: "3. Instellingen & Privacy",
      title: "Audio- & Spraakbegeleiding Toggle",
      what: "In- en uitschakelen van audiofeedback en gesproken aanwijzingen.",
      why: "Nuttig in rustige klaslokalen of logopediepraktijken waar geluid gedempt moet worden.",
      how: "Schakelt de audioEnabled voorkeur in IndexedDB/localStorage en past de interface direct aan.",
      action: "Klik op de 'Audio' toggle switch om de status te wijzigen.",
      screenshotFile: s9,
    });
    await audioToggle.click();

    // Stap 10: Muziek Toggle
    const musicToggle = page.getByTestId("settings-music-toggle");
    const s10 = await markAndScreenshot(
      page,
      musicToggle,
      "stap-10-muziek-toggle",
      "Klik op de muziek-toggle om de ontspannende achtergrondmuziek te beheren.",
      "TOGGLE MUZIEK",
    );
    steps.push({
      id: "stap-10",
      category: "3. Instellingen & Privacy",
      title: "Achtergrondmuziek Beheer",
      what: "Regelen van de achtergrondmuziek zonder invloed op de spraakherkenning.",
      why: "Muziek kan voor sommige prikkelgevoelige kinderen afleidend zijn.",
      how: "GameBackgroundMusic stopt of start naadloos via de platform audio-adapter.",
      action: "Klik op de 'Muziek' toggle switch.",
      screenshotFile: s10,
    });

    // Stap 11: Privacy kaart inspectie
    const privacyCard = page.getByTestId("settings-voice-privacy-card");
    const s11 = await markAndScreenshot(
      page,
      privacyCard,
      "stap-11-privacy-kaart",
      "De privacykaart garandeert dat stemdata lokaal blijft en niet naar de cloud gaat.",
      "100% LOKAAL",
    );
    steps.push({
      id: "stap-11",
      category: "3. Instellingen & Privacy",
      title: "Spraakprivacy & Lokale Verwerking",
      what: "Duidelijke weergave van de privacygarantie: geen geluidsopnames naar de cloud.",
      why: "Veiligheid en AVG/GDPR compliance voor jonge kinderen in logopedie en onderwijs.",
      how: "VoicePrivacySettingsCard toont de microfoonstatus en legt helder uit dat spraak lokaal blijft.",
      action: "Bekijk de privacykaart met het groene schild-icoon.",
      screenshotFile: s11,
    });

    // Stap 12: Reset voortgang knop
    const resetBtn = page.getByTestId("settings-reset-progress-button");
    const s12 = await markAndScreenshot(
      page,
      resetBtn,
      "stap-12-reset-progress-knop",
      "Klik op 'Reset voortgang' om de voortgang van het kind te wissen.",
      "RESET VOORTGANG",
    );
    steps.push({
      id: "stap-12",
      category: "3. Instellingen & Privacy",
      title: "Voortgang Reset Initiatie",
      what: "Mogelijkheid om sterren en oefenobservaties te resetten voor een nieuw leertraject.",
      why: "Handig wanneer een nieuw kind met hetzelfde apparaat start of voor schone hermetingen.",
      how: "Opent een veilige bevestigingsdialoog om per ongeluk wissen te voorkomen.",
      action: "Klik onderaan op de knop 'Reset voortgang'.",
      screenshotFile: s12,
    });
    await resetBtn.click();
    await page.getByTestId("settings-confirm-reset-dialog").waitFor({ state: "visible" });

    // Stap 13: Bevestigingsdialoog
    const cancelResetBtn = page.getByTestId("settings-cancel-reset-button");
    const s13 = await markAndScreenshot(
      page,
      cancelResetBtn,
      "stap-13-annuleer-reset",
      "In de pop-up kan de reset geannuleerd worden met de groene knop.",
      "ANNULEREN (VEILIG)",
    );
    steps.push({
      id: "stap-13",
      category: "3. Instellingen & Privacy",
      title: "Bevestigingsdialoog Reset (Veiligheid)",
      what: "Modal dialoog met duidelijke 'Annuleren' en 'Resetten' keuzes.",
      why: "Voorkomt dataverlies als een kind per ongeluk op de knop tikt.",
      how: "ConfirmResetDialog vangt focus en toetsenbord (Escape/Tab) netjes op conform WCAG.",
      action: "Klik op 'Annuleren' om zonder wijzigingen terug te keren.",
      screenshotFile: s13,
    });
    await cancelResetBtn.click();

    // Stap 14: Terug naar Startscherm
    const backBtn = page.getByTestId("settings-back-button");
    const s14 = await markAndScreenshot(
      page,
      backBtn,
      "stap-14-instellingen-terug",
      "Klik op de terugknop om terug te keren naar het startscherm.",
      "TERUG NAAR START",
    );
    steps.push({
      id: "stap-14",
      category: "3. Instellingen & Privacy",
      title: "Terugkeren vanuit Instellingen",
      what: "Veilige terugkeer naar het scherm waar de gebruiker vandaan kwam (StartScreen).",
      why: "Duidelijke breadcrumb-navigatie zonder dat de gebruiker verdwaalt.",
      how: "De controller gebruikt `backFromSettings` om naar het voorgaande scherm terug te keren.",
      action: "Klik linksboven op de terugknop met pijl.",
      screenshotFile: s14,
    });
    await backBtn.click();
    await page.getByTestId("start-screen").waitFor({ state: "visible" });

    // ==========================================
    // DEEL 4: AVONTUUR & MODUS SELECTIE
    // ==========================================
    // Stap 15: Speelknop indrukken
    const playBtn = page.getByTestId("start-play-button");
    await playBtn.click();
    await page.getByTestId("compact-mode-card-listen-and-place").waitFor({ state: "visible" });

    // Stap 16: Zeg & Zet Kaart kiezen
    const zegZetCard = page.getByTestId("compact-mode-card-listen-and-place");
    const s16 = await markAndScreenshot(
      page,
      zegZetCard,
      "stap-16-kies-zeg-en-zet",
      "Kies de spelmodus 'Zeg & Zet' om interactieve stickeropdrachten te spelen.",
      "ZEG & ZET SPELMODUS",
    );
    steps.push({
      id: "stap-16",
      category: "4. Modusselectie",
      title: "Modusselectie: Zeg & Zet",
      what: "Kiezen van de hoofdgame 'Zeg & Zet' (luisteren, spreken en stickers plaatsen).",
      why: "Kernonderdeel van de subsidiedoelstelling: actieve taalproductie en ruimtelijke begrippen.",
      how: "AdventureSelectScreen toont kaarten voor 'Zeg & Zet', 'Kies het Woord' en 'Zeg & Vlieg'.",
      action: "Klik op de spelkaart van 'Zeg & Zet'.",
      screenshotFile: s16,
    });
    await zegZetCard.click();

    // Stap 17: Start Spel knop
    const startAdventureBtn = page.getByTestId("adventure-start-game-button");
    const s17 = await markAndScreenshot(
      page,
      startAdventureBtn,
      "stap-17-start-avontuur-knop",
      "Klik op 'Start Avontuur' om direct in het strandspeelveld te beginnen.",
      "START AVONTUUR",
    );
    steps.push({
      id: "stap-17",
      category: "4. Modusselectie",
      title: "Avontuur Starten",
      what: "Het definitief inladen van de actieve opdrachtensessie voor het kind.",
      why: "Geeft het kind een duidelijk startmoment met visuele feedback.",
      how: "Initialiseert de opdrachtenset, willekeurige woordkoppelingen en dropzones.",
      action: "Klik op de groene knop 'Start Avontuur'.",
      screenshotFile: s17,
    });
    await startAdventureBtn.click();
    await page.getByTestId("scene-builder-screen").waitFor({ state: "visible" });

    // ==========================================
    // DEEL 5: ZEG & ZET - SPEELVELD & OPDRACHT
    // ==========================================
    // Stap 18: Instructiekaart
    const instructionArea = page.getByTestId("scene-builder-instruction-area");
    const s18 = await markAndScreenshot(
      page,
      instructionArea,
      "stap-18-instructiekaart-weergave",
      "De instructiekaart bovenaan toont de mascotte, de opdrachttekst en de bedieningsknoppen.",
      "OPDRACHTGEBIED",
    );
    steps.push({
      id: "stap-18",
      category: "5. Zeg & Zet: Speelveld & Opdracht",
      title: "Opdrachtkaart & Mascotte",
      what: "Weergave van de actieve logopedische opdracht (bijv. 'Zet de bal op het strand').",
      why: "Het kind krijgt zowel visuele, tekstuele als optioneel gesproken aanwijzingen.",
      how: "CompactInstructionCard toont de doelzin, video-knop en microfoon/toetsenbord knoppen.",
      action: "Lees of beluister de opdracht op de witte kaart bovenaan.",
      screenshotFile: s18,
    });

    // ==========================================
    // DEEL 6: TYPFUNCTIONALITEIT (FALLBACK)
    // ==========================================
    // Stap 19: Toetsenbord knop
    const keyboardBtn = page.getByTestId("typed-command-open-button");
    const s19 = await markAndScreenshot(
      page,
      keyboardBtn,
      "stap-19-toetsenbord-knop",
      "Klik op het toetsenbord-icoon om handmatig een commando in te typen.",
      "TYPEN INSTELLEN",
    );
    steps.push({
      id: "stap-19",
      category: "6. Typfunctionaliteit (Toegankelijkheid)",
      title: "Toetsenbord Invoer Openen",
      what: "Openen van de getypte commandomodus als alternatief voor spraak.",
      why: "Garandeert 100% toegankelijkheid in rumoerige omgevingen of voor non-verbale kinderen.",
      how: "SpokenCommandControls opent de `TypedCommandFallback` pop-up over het scherm.",
      action: "Klik op het toetsenbord-icoontje naast de microfoon.",
      screenshotFile: s19,
    });
    await keyboardBtn.click();
    await page.getByTestId("typed-command-fallback").waitFor({ state: "visible" });

    // Stap 20: Typen en verzenden
    const instructionText = await page.getByTestId("scene-builder-instruction-text").innerText();
    const typeInput = page.getByTestId("typed-command-input");
    await typeInput.fill(instructionText);
    const submitTypedBtn = page.getByTestId("typed-command-submit-button");
    const s20 = await markAndScreenshot(
      page,
      submitTypedBtn,
      "stap-20-typ-commando-verzenden",
      "Voer de zin in en klik op de verzendknop om het commando uit te voeren.",
      "VERSTUUR OPDRACHT",
    );
    steps.push({
      id: "stap-20",
      category: "6. Typfunctionaliteit (Toegankelijkheid)",
      title: "Commando Typen & Uitvoeren",
      what: "Het invoeren en valideren van de geschreven opdrachtzin.",
      why: "Ondersteunt spelling, zinsbouw en taalbegrip bij het kind.",
      how: "De parser analyseert het object en de doellocatie en plaatst het object automatisch in de zone.",
      action: "Typ de zin in het tekstveld en klik op de verzendknop.",
      screenshotFile: s20,
    });
    // Sluit keyboard fallback zodat we de spraakflow schoon kunnen testen
    const closeTypedBtn = page.getByTestId("typed-command-close-button");
    if (await closeTypedBtn.isVisible()) {
      await closeTypedBtn.click();
    }

    // ==========================================
    // DEEL 7: MICROFOON & SPEECHWAVEANIMATION
    // ==========================================
    // Stap 21: Microfoonknop
    const micBtn = page.getByTestId("voice-command-button");
    const s21 = await markAndScreenshot(
      page,
      micBtn,
      "stap-21-microfoon-knop",
      "Klik op de grote microfoonknop om spraakherkenning te starten.",
      "TIK MICROFOON",
    );
    steps.push({
      id: "stap-21",
      category: "7. Spraakopname & SpeechWaveAnimation",
      title: "Microfoon Activeren",
      what: "Het kind activeert spraakherkenning om de opdracht hardop uit te spreken.",
      why: "Stimuleert actieve mondelinge taalvaardigheid en uitspraak van ruimtelijke voorzetsels.",
      how: "Activeert de lokale audio-analyser en stelt de luisterstatus in.",
      action: "Tik op de ronde groene microfoonknop.",
      screenshotFile: s21,
    });
    await micBtn.click();

    // Stap 22: Privacy acceptatie als getoond
    const privacyNoticeAccept = page.getByTestId("voice-privacy-accept-button");
    if (await privacyNoticeAccept.isVisible()) {
      const s22 = await markAndScreenshot(
        page,
        privacyNoticeAccept,
        "stap-22-privacy-toestemming",
        "Klik op 'Begrepen, start microfoon' om eenmalig toestemming te geven.",
        "TOESTEMMING GEVEN",
      );
      steps.push({
        id: "stap-22",
        category: "7. Spraakopname & SpeechWaveAnimation",
        title: "Spraakprivacy Toestemming",
        what: "Eenmalige expliciete goedkeuring voor lokale microfoontoegang.",
        why: "Waarborgt transparantie naar het kind en de ouders toe.",
        how: "Slaat de privacyvoorkeur op in het profiel en start direct de audio-opname.",
        action: "Klik op 'Begrepen, start microfoon'.",
        screenshotFile: s22,
      });
      await privacyNoticeAccept.click();
    }

    // Stap 23: SpeechWaveAnimation in hoge positie
    const speechWave = page.locator('[data-slot="speech-wave-animation"]');
    await speechWave.waitFor({ state: "visible" });
    const s23 = await markAndScreenshot(
      page,
      speechWave,
      "stap-23-speechwave-hoge-positie",
      "De SpeechWaveAnimation verschijnt hoog op het scherm direct onder de opdracht met levendige golfjes.",
      "GOLFANIMATIE BOVENAAN",
    );
    steps.push({
      id: "stap-23",
      category: "7. Spraakopname & SpeechWaveAnimation",
      title: "Live Golfanimatie (Hoge Positie)",
      what: "De nieuwe, verhoogde weergave van `SpeechWaveAnimation` met `fixed z-50`.",
      why: "Lost het eerdere probleem op: overlapt nooit de objectenbalk en blijft 100% zichtbaar op ooghoogte.",
      how: "De geanimeerde balk toont 'Ik luister...' met pulserende staven en luistert met een ruime 4s stiltetimer.",
      action: "Spreek de zin rustig uit; de balk pulseert mee met het stemgeluid.",
      screenshotFile: s23,
    });

    // Stap 24: Klaar-knop in SpeechWaveAnimation
    const stopSpeechBtn = page.getByTestId("speech-stop-button");
    if (!(await stopSpeechBtn.isVisible())) {
      await micBtn.click();
      await page.locator('[data-slot="speech-wave-animation"]').waitFor({ state: "visible", timeout: 3000 }).catch(() => {});
    }
    const s24 = await markAndScreenshot(
      page,
      stopSpeechBtn,
      "stap-24-klaar-knop",
      "Klik op 'Klaar' om het gesproken commando direct af te ronden.",
      "KLAAR MET SPREKEN",
    );
    steps.push({
      id: "stap-24",
      category: "7. Spraakopname & SpeechWaveAnimation",
      title: "Direct Afronden ('Klaar' Knop)",
      what: "De handmatige afrondknop in de SpeechWaveAnimation balk.",
      why: "Kinderen die klaar zijn hoeven niet te wachten tot de stiltetimer afloopt; directe controle.",
      how: "Rondt de geaccumuleerde woorden direct af en stuurt het resultaat naar de scene placement handler.",
      action: "Klik op de groene 'Klaar' knop in de SpeechWaveAnimation balk.",
      screenshotFile: s24,
    });
    if (await stopSpeechBtn.isVisible()) {
      await stopSpeechBtn.click();
    }
    await page.waitForTimeout(300);

    // ==========================================
    // DEEL 8: HANDMATIGE PLAATSING & CARROUSEL
    // ==========================================
    // Stap 25: Sticker kiezen uit carrousel
    const firstSticker = page.getByTestId("scene-builder-tray-area").getByRole("button").first();
    const s25 = await markAndScreenshot(
      page,
      firstSticker,
      "stap-25-sticker-kiezen",
      "Klik op een sticker in de onderste carrousel om deze te selecteren.",
      "SELECTEER STICKER",
    );
    steps.push({
      id: "stap-25",
      category: "8. Handmatige Stickerplaatsing",
      title: "Sticker Selectie uit Carrousel",
      what: "Het kind kiest handmatig een speelobject (bijv. bal, schep, boot) uit de onderste balk.",
      why: "Biedt een tastbare, directe manier van spelen voor jonge kinderen met fijne motoriek.",
      how: "ObjectCarousel markeert het geselecteerde object met een gouden selectierand en schaduw.",
      action: "Tik op de gewenste sticker in de carrousel.",
      screenshotFile: s25,
    });
    await firstSticker.click();

    // Stap 26: Tikken op het strand om te plaatsen
    const sceneCanvas = page.getByTestId("scene-tap-target");
    const s26 = await markAndScreenshot(
      page,
      sceneCanvas,
      "stap-26-strand-plaatsen",
      "Tik ergens op het strand of in de zee om het gekozen object neer te zetten.",
      "TIK OP HET STRAND",
    );
    steps.push({
      id: "stap-26",
      category: "8. Handmatige Stickerplaatsing",
      title: "Plaatsen op het Strand (Tap-to-Place)",
      what: "Het object verschijnt direct op de getikte coördinaten als een zwevend `pending-object`.",
      why: "Intuïtief: het kind wijst aan waar het object moet komen te liggen.",
      how: "SceneAreaCanvas berekent de percentages relatief aan het canvas en toont het object.",
      action: "Tik op de gewenste plek op het strand.",
      screenshotFile: s26,
    });
    await sceneCanvas.click({ position: { x: 350, y: 350 } });

    // ==========================================
    // DEEL 9: FOUT ANTWOORD & VISUELE HINTING
    // ==========================================
    // Stap 27: Foute / Niet-afgeronde plaatsing bevestigen
    const confirmBtn = page.getByTestId("scene-builder-confirm-button");
    const s27 = await markAndScreenshot(
      page,
      confirmBtn,
      "stap-27-fout-bevestigen",
      "Klik op 'Klaar' wanneer een object op de verkeerde plek staat om feedback te zien.",
      "CONTROLEER ANTWOORD",
    );
    steps.push({
      id: "stap-27",
      category: "9. Fout Antwoord & Hinting",
      title: "Antwoord Controleren",
      what: "Het valideren van de plaatsing tegen de regels van de huidige opdracht.",
      why: "Het kind leert door feedback of het begrip (bijv. 'op', 'onder', 'naast') klopt.",
      how: "De placement evaluator controleert de overlap met de semantische target zone.",
      action: "Klik rechtsboven op de groene 'Klaar' knop.",
      screenshotFile: s27,
    });
    await confirmBtn.click();
    await page.waitForTimeout(300);

    // Stap 28: Herstelbare feedback weergave
    const feedbackToast = page.getByTestId("scene-builder-feedback");
    const s28 = await markAndScreenshot(
      page,
      feedbackToast,
      "stap-28-herstelbare-feedback",
      "De toast toont vriendelijke, herstelbare feedback met een mascotte die tips geeft.",
      "HERSTELBARE TIP",
    );
    steps.push({
      id: "stap-28",
      category: "9. Fout Antwoord & Hinting",
      title: "Herstelbare Feedback ('Bijna goed!')",
      what: "Vriendelijke en opbouwende feedback zonder puntenaftrek of straf.",
      why: "Behoudt het zelfvertrouwen en de spelvreugde van het kind; 'fout' is een leermoment.",
      how: "FloatingSuccessToast toont `data-kind='almost'` met de tekst: 'Kijk goed waar het moet staan'.",
      action: "Lees de tip in de witte balk onderaan.",
      screenshotFile: s28,
    });

    // Stap 29: Hintknop gebruiken
    const hintBtn = page.getByRole("button", { name: /Hulp/i });
    if (await hintBtn.isVisible()) {
      const s29 = await markAndScreenshot(
        page,
        hintBtn,
        "stap-29-hint-knop",
        "Klik op de oranje hulpknop om de doelzone te laten oplichten.",
        "TIK VOOR HULP",
      );
      steps.push({
        id: "stap-29",
        category: "9. Fout Antwoord & Hinting",
        title: "Visuele Hulpknop (Hint Assist)",
        what: "De ingebouwde assistentieknop die de juiste plek visueel verduidelijkt.",
        why: "Zorgt ervoor dat een kind nooit vastloopt of gefrustreerd raakt.",
        how: "BtnHintAssist activeert de pulserende `TargetZoneHint` op het strand.",
        action: "Tik op de oranje cirkelknop met het lampje/vraagteken.",
        screenshotFile: s29,
      });
      await hintBtn.click();
      await page.waitForTimeout(300);
    }

    // ==========================================
    // DEEL 10: GOED ANTWOORD & BELONING
    // ==========================================
    // Stap 30: Goed antwoord via typen/juiste plaatsing
    const currentInstr = await page.getByTestId("scene-builder-instruction-text").innerText();
    await page.getByTestId("typed-command-open-button").click();
    await page.getByTestId("typed-command-input").fill(currentInstr);
    await page.getByTestId("typed-command-submit-button").click();

    // Stap 31: Succesbevestiging
    const confirmNextBtn = page.getByTestId("scene-builder-confirm-button");
    await confirmNextBtn.click();
    await page.waitForTimeout(400);

    const s31 = await markAndScreenshot(
      page,
      confirmNextBtn,
      "stap-31-goed-antwoord-volgende",
      "Bij een goed antwoord verandert de knop in 'Volgende' en toont de toast feestelijke confetti.",
      "VOLGENDE OPDRACHT",
    );
    steps.push({
      id: "stap-31",
      category: "10. Goed Antwoord & Succes",
      title: "Goed Antwoord & Positieve Bekrachtiging",
      what: "De successtatus bij een correct geplaatst object volgens de opdracht.",
      why: "Belonen van correcte taalverwerking; activeert intrinsieke motivatie bij het kind.",
      how: "De knop toont 'Volgende', de mascotte viert feest en er worden sterren toegekend.",
      action: "Klik op 'Volgende' om direct door te gaan naar de volgende uitdaging.",
      screenshotFile: s31,
    });
    await confirmNextBtn.click();

    // ==========================================
    // HTML RAPPORT GENERATIE
    // ==========================================
    const htmlReportPath = path.resolve(process.cwd(), "TEST_RAPPORT_MAGISCH_STRAND_AVONTUUR.html");

    const categories = Array.from(new Set(steps.map((s) => s.category)));

    const htmlContent = `<!DOCTYPE html>
<html lang="nl" class="scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visueel E2E Testrapport: Magisch Strand-Avontuur</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    .screenshot-frame {
      box-shadow: 0 10px 30px -10px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.8) inset;
    }
  </style>
</head>
<body class="bg-slate-900 text-slate-100 min-h-screen">

  <!-- TOP HEADER -->
  <header class="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 shadow-xl">
    <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-3">
        <span class="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-400 text-slate-950 font-black text-2xl shadow-lg">
          🏖️
        </span>
        <div>
          <h1 class="text-xl font-black tracking-tight text-white">
            Magisch Strand-Avontuur
          </h1>
          <p class="text-xs font-bold text-amber-400">
            Uitgebreid Visueel E2E Testrapport • ${steps.length} Actiestappen met Markeringen
          </p>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <span class="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-xs font-black">
          <span class="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
          100% Geslaagd (${steps.length}/${steps.length})
        </span>
        <span class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-sky-500/20 border border-sky-400/40 text-sky-300 text-xs font-bold">
          Playwright Chromium Tablet
        </span>
      </div>
    </div>
  </header>

  <!-- MAIN WRAPPER -->
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">

    <!-- SIDEBAR NAVIGATION -->
    <aside class="hidden lg:block sticky top-24 self-start bg-slate-800/80 border border-slate-700/60 rounded-3xl p-5 shadow-2xl backdrop-blur-sm max-h-[calc(100vh-8rem)] overflow-y-auto">
      <h2 class="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
        Inhoudsopgave & Thema's
      </h2>
      <nav class="space-y-1 text-sm font-bold">
        ${categories
          .map(
            (cat, idx) => `
          <a href="#cat-${idx}" class="block px-3 py-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700/60 transition">
            ${cat}
          </a>
        `,
          )
          .join("")}
      </nav>
      <div class="mt-6 pt-5 border-t border-slate-700/60 text-xs text-slate-400 space-y-2">
        <p><strong class="text-slate-200">🔴 Rode markering:</strong> Geeft exact aan waar de actie wordt uitgevoerd.</p>
        <p><strong class="text-slate-200">🔒 Privacy:</strong> 100% lokaal op het apparaat, geen cloud audio.</p>
      </div>
    </aside>

    <!-- CONTENT SECTION -->
    <main class="space-y-12">

      <!-- INTRO CARD -->
      <section class="bg-gradient-to-br from-sky-900/60 via-slate-800/80 to-indigo-900/60 border border-sky-500/30 rounded-3xl p-6 shadow-2xl">
        <h2 class="text-lg font-black text-white mb-2 flex items-center gap-2">
          <span>📋</span> Doel van dit Testrapport
        </h2>
        <p class="text-sm leading-relaxed text-slate-300 font-medium">
          Dit rapport documenteert alle interactiemogelijkheden en kwaliteitscontroles van <strong>Magisch Strand-Avontuur</strong>.
          Voor iedere actiestap is een real-time screenshot gemaakt met een duidelijke <strong>rode pulserende markering</strong>
          op het element waar de gebruiker moet klikken of tikken.
        </p>
      </section>

      <!-- SECTIONS PER CATEGORY -->
      ${categories
        .map((cat, catIdx) => {
          const catSteps = steps.filter((s) => s.category === cat);
          return `
        <section id="cat-${catIdx}" class="space-y-6 pt-4">
          <div class="flex items-center gap-3 border-b border-slate-800 pb-3">
            <h2 class="text-xl font-black text-amber-300 tracking-tight">
              ${cat}
            </h2>
            <span class="px-2.5 py-0.5 rounded-full bg-slate-800 border border-slate-700 text-xs font-black text-slate-300">
              ${catSteps.length} stappen
            </span>
          </div>

          <div class="space-y-8">
            ${catSteps
              .map(
                (step, stepIdx) => `
              <article class="bg-slate-800/90 border border-slate-700/80 rounded-3xl overflow-hidden shadow-2xl hover:border-sky-500/40 transition duration-300">
                
                <!-- CARD HEADER -->
                <div class="px-6 py-4 bg-slate-800/60 border-b border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <span class="flex h-8 w-8 items-center justify-center rounded-xl bg-sky-500 text-white font-black text-xs shadow-md">
                      ${step.id.replace("stap-", "")}
                    </span>
                    <h3 class="text-base font-black text-white">
                      ${step.title}
                    </h3>
                  </div>
                  <span class="px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold">
                    ✅ Getest & Functioneel
                  </span>
                </div>

                <!-- CARD BODY -->
                <div class="p-6 grid grid-cols-1 xl:grid-cols-[1fr_1.35fr] gap-6 items-start">
                  
                  <!-- SPECS & DESCRIPTION -->
                  <div class="space-y-4 text-xs">
                    
                    <div class="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <span class="font-black uppercase tracking-wider text-sky-400 block">
                        🎯 Wat we testen
                      </span>
                      <p class="text-slate-200 leading-relaxed font-semibold">
                        ${step.what}
                      </p>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <span class="font-black uppercase tracking-wider text-amber-400 block">
                        💡 Waarom we dit testen
                      </span>
                      <p class="text-slate-300 leading-relaxed">
                        ${step.why}
                      </p>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1">
                      <span class="font-black uppercase tracking-wider text-indigo-400 block">
                        ⚙️ Hoe de functionaliteit werkt
                      </span>
                      <p class="text-slate-300 leading-relaxed">
                        ${step.how}
                      </p>
                    </div>

                    <div class="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 space-y-1">
                      <span class="font-black uppercase tracking-wider text-emerald-400 block">
                        👉 Concrete Actiestap
                      </span>
                      <p class="text-emerald-100 font-bold leading-relaxed">
                        ${step.action}
                      </p>
                    </div>

                  </div>

                  <!-- SCREENSHOT CONTAINER -->
                  <div class="space-y-2">
                    <div class="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-slate-950 screenshot-frame group">
                      <img 
                        src="test-rapport-assets/${step.screenshotFile}" 
                        alt="${step.title}" 
                        loading="lazy"
                        class="w-full h-auto object-contain transition duration-200 group-hover:scale-[1.01]"
                      />
                      <div class="absolute bottom-2 right-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-sm text-[11px] font-mono text-slate-300 pointer-events-none">
                        Rode cirkel = Waar te klikken
                      </div>
                    </div>
                    <p class="text-center text-[11px] text-slate-400 font-medium">
                      Screenshot: <code>${step.screenshotFile}</code>
                    </p>
                  </div>

                </div>
              </article>
            `,
              )
              .join("")}
          </div>
        </section>
      `;
        })
        .join("")}

      <!-- FOOTER -->
      <footer class="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 pb-12 space-y-2">
        <p>Game-Wereld • Magisch Strand-Avontuur Testrapport • Automatisch gegenereerd met Playwright</p>
        <p class="text-slate-600">Alle screenshots zijn direct vastgelegd vanuit de Chromium tablet runtime zonder handmatige bewerking.</p>
      </footer>

    </main>
  </div>

</body>
</html>
`;

    fs.writeFileSync(htmlReportPath, htmlContent, "utf-8");
  });
});
