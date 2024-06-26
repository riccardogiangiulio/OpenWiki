const searchForm = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const resultsList = document.getElementById('results-list');
const errorMessage = document.getElementById('error-message');
const articleText = document.getElementById('article-text');
const downloadButton = document.getElementById('download-button');
const openSearchFormButton = document.getElementById('open-search-form-button');
const searchFormContainer = document.getElementById('search-form-container');

openSearchFormButton.addEventListener('click', () => {
    searchFormContainer.classList.toggle('hidden');
});

searchForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const searchInp = searchInput.value;
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
        articleText.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">${data.title}</h2>
            <p>${data.text}</p>
            ${imagesHtml}
        `;
    } catch (error) {
        console.error('Errore nel recupero del testo completo:', error);
        articleText.innerHTML = '<p>Errore nel recupero del testo completo.</p>';
    }
}

function renderResults(data) {
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
