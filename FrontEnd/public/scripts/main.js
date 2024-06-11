document.getElementById('dashboard-link').addEventListener('click', loadDashboard);
document.getElementById('my-articles-link').addEventListener('click', loadMyArticles);

//sistema in file .js diversi

async function loadDashboard() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="header-container flex justify-center items-center">
            <h1 class="text-5xl font-bold text-blue-600 mb-8">OpenWiki</h1>
        </div>
        <form id="search-form" class="flex justify-center items-center mb-8">
            <input type="text" id="search-input" class="flex-grow text-xl p-2 border-2 border-gray-300 rounded-md mr-4 focus:outline-none focus:border-blue-500" placeholder="Inserisci il termine di ricerca" />
            <button type="submit" class="text-xl p-2 bg-blue-600 text-white rounded-md hover:bg-blue-500">Cerca</button>
        </form>
        <div id="search-results" class="bg-white p-6 rounded-md shadow-md">
            <ol id="results-list" class="list-decimal pl-5 space-y-4">
                <!-- I risultati della ricerca verranno inseriti qui -->
            </ol>
            <p id="error-message" class="text-red-600 hidden">Si è verificato un errore durante la ricerca.</p>
        </div>
        <div id="article-text" class="mt-6 bg-white p-6 rounded-lg shadow-md text-gray-800 leading-relaxed">
            <!-- Il testo dell'articolo completo verrà inserito qui -->
        </div>
    `;

    // Aggiungi di nuovo l'event listener per il form di ricerca
    document.getElementById('search-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const searchInp = document.getElementById('search-input').value;
        const errorMessage = document.getElementById('error-message');
        const articleText = document.getElementById('article-text');
        const resultsList = document.getElementById('results-list');

        errorMessage.classList.add('hidden');
        articleText.innerHTML = '';

        try {
            const res = await fetch('http://localhost:8000/dashboard', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ titolo: searchInp }),
            });
            const data = await res.json();
            renderResults(data);
        } catch (error) {
            errorMessage.classList.remove('hidden');
            console.error('Errore durante la ricerca:', error);
        }
    });
}

async function loadMyArticles() {
    const content = document.getElementById('content');
    content.innerHTML = `
        <div class="header-container flex justify-center items-center">
            <h1 class="text-5xl font-bold text-blue-600 mb-8">I miei articoli</h1>
        </div>
        <div id="my-articles" class="bg-white p-6 rounded-md shadow-md">
            <ol id="articles-list" class="list-decimal pl-5 space-y-4">
                <!-- Gli articoli dell'utente verranno inseriti qui -->
            </ol>
        </div>
    `;

    try {
        const res = await fetch('http://localhost:8000/my-articles', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
        });
        const data = await res.json();
        renderMyArticles(data);
    } catch (error) {
        console.error('Errore durante il caricamento degli articoli:', error);
    }
}

function renderMyArticles(data) {
    const articlesList = document.getElementById('articles-list');
    articlesList.innerHTML = '';

    data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('border-b', 'border-gray-300', 'pb-2');

        listItem.innerHTML = `
            <h3 class="text-lg font-semibold">
                ${item.title}
            </h3>
            <button class="mt-2 text-blue-500 hover:underline" onclick="getFullArticleText('${item.title}')">Mostra testo completo</button>
        `;

        articlesList.appendChild(listItem);
    });
}

async function getFullArticleText(title) {
    try {
        const res = await fetch('http://localhost:8000/textView', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });
        const data = await res.json();

        const imagesHtml = data.mainImage ? `<img src="${data.mainImage}" alt="Immagine principale" class="w-full mb-4 rounded-lg shadow-md">` : '';
        const articleText = document.getElementById('article-text');
        articleText.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">${data.title}</h2>
            <p>${data.text}</p>
            ${imagesHtml}
        `;
    } catch (error) {
        console.error('Errore nel recupero del testo completo:', error);
        const articleText = document.getElementById('article-text');
        articleText.innerHTML = '<p>Errore nel recupero del testo completo.</p>';
    }
}

async function downloadArticle(title) {
    try {
        const encodedTitle = encodeURIComponent(title);
        const res = await fetch('http://localhost:8000/textDownload', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title: encodedTitle }),
        });
        const data = await res.json();

        if (data.articleExists) {
            const downloadAgain = confirm(`Questo articolo è già stato scaricato in precedenza. Vuoi scaricarlo di nuovo e sovrascrivere la versione esistente?`);
            if (downloadAgain) {
                const res = await fetch('http://localhost:8000/textDownload', {
                    method: 'POST',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ title: encodedTitle, overwrite: true }),
                });
                const overwriteData = await res.json();
                alert(overwriteData.message);
            } else {
                return;
            }
        } else {
            alert('Articolo scaricato con successo!');
        }
    } catch (error) {
        console.error('Errore durante il download dell\'articolo:', error.message);
        alert('Si è verificato un errore durante il download dell\'articolo. Riprova più tardi.');
    }
}

function renderResults(data) {
    const resultsList = document.getElementById('results-list');
    resultsList.innerHTML = '';

    data.forEach(item => {
        const listItem = document.createElement('li');
        listItem.classList.add('border-b', 'border-gray-300', 'pb-2');

        listItem.innerHTML = `
            <h3 class="text-lg font-semibold">
                <a href="${item.link}" target="_blank" class="text-blue-600 hover:text-blue-800">
                    ${item.title}
                </a>
            </h3>
            <details class="mt-2">
                <summary class="cursor-pointer text-sm text-gray-600">Leggi di più</summary>
                <p class="text-sm text-gray-700 mt-1">${item.summary}</p>
                <button class="mt-2 text-blue-500 hover:underline" onclick="getFullArticleText('${item.title}')">Mostra testo completo</button>
                <button class="mt-2 text-blue-500 hover:underline" onclick="downloadArticle('${item.title}')">Scarica articolo</button>
            </details>
        `;

        resultsList.appendChild(listItem);
    });
}

// Carica la dashboard di default all'avvio
window.onload = loadDashboard;
