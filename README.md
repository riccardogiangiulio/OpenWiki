Il progetto Open-Wikipedia mira a sviluppare un sito web locale che funzioni come un clone di Wikipedia. Gli utenti potranno registrarsi, cercare articoli da Wikipedia, scaricarli localmente e visualizzarli. Sarà possibile anche modificare e cancellare le voci, ma tali operazioni si rifletteranno solo nel database locale.

Tecnologie utilizzate:

Front-end: HTML(ejs), CSS(Tailwind), JavaScript
Back-end: Express.js (Node.js)
Database: MongoDb e Prisma/client
Requisiti di progetto:

Sviluppo di una web app che interagisce con le API di Wikipedia per scaricare gli articoli richiesti dagli utenti.
Visualizzazione degli articoli scaricati attraverso il sito e possibilità di modifica/cancellazione delle voci, limitate al database locale.
Implementazione di un meccanismo per rilevare se un utente cerca lo stesso articolo più di una volta e notificarlo.
Funzionalità "Articolo del giorno" simulata sul sito in locale.
Sistema di registrazione e autenticazione dell'utente utilizzando un database non relazionale.
Istruzioni per l'installazione e l'avvio:

Clonare il repository dal link fornito.
Assicurarsi di avere Node.js e npm installati sul proprio sistema.
Installare le dipendenze del progetto eseguendo npm install nella directory del progetto.
Creare un file .env per configurare le variabili d'ambiente necessarie, come le credenziali del database.
Eseguire il comando npm start per avviare il server locale.
Accedere al sito tramite il browser all'indirizzo http://localhost:3000.
Contributi:
Sono benvenuti i contributi al progetto. Si prega di aprire una pull request per proporre modifiche.

Licenza:
Questo progetto è rilasciato sotto la licenza MIT.

Contatti:
Per domande o informazioni, contattare l'autore del progetto all'indirizzo email specificato nel file AUTHORS.
