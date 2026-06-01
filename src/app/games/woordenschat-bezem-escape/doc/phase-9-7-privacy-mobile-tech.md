# Fase 9.7: Privacy En Mobiele Techniek

Doel: `Zeg & Bouw` moet veilig en begrijpelijk werken op telefoons. Spraak is een hulpmiddel, geen verplichting.

## Privacyregels

- De app bewaart geen geluidsopnames.
- De microfoon wordt alleen gestart nadat de gebruiker op de microfoonknop tikt.
- Bij eerste gebruik verschijnt een oudervriendelijke melding.
- Na de melding vraagt de app expliciet browsertoestemming met `getUserMedia`.
- De app kan microfoontoegang niet automatisch aanzetten; mobiele browsers vereisen een gebruikersactie en browsertoestemming.
- De herkende zin mag als tekst-observatie bij de voortgang worden opgeslagen.
- Audio zelf wordt niet in `localStorage`, `sessionStorage` of progress-events opgeslagen.
- De app gebruikt de spraakfunctie van browser/apparaat. Volgens MDN kan spraakherkenning afhankelijk zijn van browserondersteuning en implementatie: [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) en [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

## Toestemming Flow

1. Het kind of de ouder tikt op `Zeg zelf`.
2. Bij eerste gebruik toont de app de privacyuitleg.
3. De knop `Vraag toestemming` opent de browser-microfoontoestemming.
4. Bij `Sta toe` start de spraakherkenning direct.
5. Bij blokkade, HTTP-lokaal netwerk of ontbrekende browserondersteuning toont de app een korte melding en de `Typ` fallback.

In `Instellingen` staat daarnaast een ouderknop `Vraag microfoon`. Die knop probeert dezelfde browsertoestemming te vragen of opnieuw te controleren zonder dat het kind eerst een opdracht hoeft te spelen. De settings-kaart toont ook zichtbaar waarom er eventueel geen permission-popup komt, bijvoorbeeld wanneer de app via `http://192.168.x.x` in plaats van HTTPS is geopend.

## Fallback

Als spraakherkenning niet beschikbaar is:

- De microfoonknop toont dat spraak niet beschikbaar is.
- De speler kan dezelfde zin typen.
- De getypte zin gaat door dezelfde Nederlandse zinparser.
- De game blijft dus dezelfde taalvaardigheid oefenen.

## Mobiele testafspraken

Android Chrome:

- Test op `localhost` in desktop-browser.
- Test op telefoon via lokaal netwerk.
- Controleer of `SpeechRecognition` of `webkitSpeechRecognition` beschikbaar is.
- Controleer of de pagina een veilige context heeft.
- Test: `Zet de boot in de zee.`
- Verwacht: de boot wordt als pending object geplaatst en de speler kan op `Klaar` drukken.

iPhone Safari:

- Controleer of spraakherkenning beschikbaar is via feature-detectie.
- Als de API ontbreekt, moet de typ-fallback zichtbaar zijn.
- Test of er geen vastgelopen microfoonstatus blijft hangen.
- Test landscape en portrait.

## HTTPS Voor Lokaal Mobiel Testen

Mobiele browsers behandelen een lokale netwerk-URL zoals `http://192.168.x.x:3000` meestal niet als `localhost`. Daardoor kan microfoonfunctionaliteit blokkeren als de pagina geen veilige context is. MDN beschrijft veilige contexten hier: [Secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Secure_Contexts).

Praktische aanpak voor later:

- Houd `npm run dev` voor gewone UI-tests op lokaal netwerk.
- Gebruik voor echte microfoontests op telefoon een HTTPS-dev setup met lokaal certificaat.
- Mogelijke route: lokaal certificaat maken met `mkcert`, daarna Vite-server configureren met `server.https`.
- Dit doen we pas wanneer we fysieke telefoon-QA uitvoeren, zodat we de certificaatpaden niet hardcoderen in het project.

## Acceptatie

- Eerste microfoongebruik toont privacyuitleg.
- Eerste microfoongebruik vraagt daarna expliciet microfoontoestemming.
- Settings heeft een aparte knop om microfoontoestemming te vragen of opnieuw te controleren.
- Settings legt zichtbaar uit waarom er op mobiel geen microfoon-popup verschijnt.
- De app bewaart geen audio.
- Unsupported browser toont een typ-fallback.
- De fallback gebruikt dezelfde gameflow als gesproken zinnen.
- Dashboard blijft oefenobservatie tonen en geen diagnose.
