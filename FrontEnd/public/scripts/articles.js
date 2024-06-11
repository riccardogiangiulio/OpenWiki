const viewUserArticlesButton = document.getElementById('view-user-articles-button');

viewUserArticlesButton.addEventListener('click', () => {
    viewArticle();
});

function renderUserArticles(articles) {
    const userArticlesContainer = document.getElementById('user-articles-container');
    userArticlesContainer.innerHTML = ''; // Pulisce il contenitore prima di aggiungere gli articoli

    // Creazione della tabella
    const table = document.createElement('table');
    table.classList.add('min-w-full', 'divide-y', 'divide-gray-200', 'shadow', 'overflow-hidden', 'rounded-lg');

    // Intestazione della tabella
    const thead = document.createElement('thead');
    thead.classList.add('bg-gray-50');
    const headerRow = document.createElement('tr');
    const titleHeader = document.createElement('th');
    titleHeader.textContent = 'Titolo';
    titleHeader.classList.add('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider');
    const textHeader = document.createElement('th');
    textHeader.textContent = 'Testo';
    textHeader.classList.add('px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 'text-gray-500', 'uppercase', 'tracking-wider');
    headerRow.appendChild(titleHeader);
    headerRow.appendChild(textHeader);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Corpo della tabella
    const tbody = document.createElement('tbody');
    articles.forEach(article => {
        const row = document.createElement('tr');
        const titleCell = document.createElement('td');
        titleCell.textContent = article.title;
        titleCell.classList.add('px-6', 'py-4', 'whitespace-nowrap', 'text-sm', 'text-gray-900');
        const textCell = document.createElement('td');
        textCell.textContent = article.text;
        textCell.classList.add('px-6', 'py-4', 'whitespace-wrap', 'text-sm', 'text-gray-500');
        row.appendChild(titleCell);
        row.appendChild(textCell);
        tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Aggiunta della tabella al contenitore
    userArticlesContainer.appendChild(table);
}


async function viewArticle() {
    try {
        const res = await fetch('http://localhost:8000/viewArticle', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json'
            }
        });
        const data = await res.json();
        // Chiamata alla funzione per visualizzare gli articoli
        renderUserArticles(data);
    } catch (error) {
        console.error('Errore durante il recupero degli articoli:', error);
    }
}
