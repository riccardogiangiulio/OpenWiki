import wiki from 'wikipedia';
import prisma from '../db/prisma.js';
import isLoggedIn from '../src/middleware/isLoggedIn.js';

export default function getResultsWiki(app) {
    app.post('/dashboard', isLoggedIn, async (req, res) => {
        try {
            const { titolo } = req.body;
            wiki.setLang('it');
            const searchResults = await wiki.search(titolo);
            const results = await Promise.all(
                searchResults.results.map(async (result) => {
                    const page = await wiki.page(result.title);
                    const summary = await page.summary();
                    return {
                        title: result.title,
                        link: `https://it.wikipedia.org/wiki/${encodeURIComponent(result.title)}`,
                        summary: summary.extract,
                    };
                })
            );
            res.json(results);
        } catch (error) {
            console.error('Errore durante la ricerca:', error);
            res.status(500).json({ error: 'Errore durante la ricerca' });
        }
    });

    app.post('/textView', async (req, res) => {
        try {
            const { title } = req.body;
            wiki.setLang('it');
            const page = await wiki.page(title);
            const content = await page.content();
            const summary = await page.summary();
            const mainImage = summary.originalimage?.source || null;
            if (content) {
                res.json({
                    title,
                    text: content,
                    mainImage: mainImage,
                });
            } else {
                res.status(404).json({ error: 'Articolo non trovato' });
            }
        } catch (error) {
            console.error('Errore nel recupero del testo completo:', error);
            res.status(500).json({ error: 'Errore nel recupero del testo completo' });
        }
    });

    app.post('/textDownload', isLoggedIn, async (req, res) => {
        try {
            const { title, overwrite } = req.body;
            const decodedTitle = decodeURIComponent(title);
            console.log('Titolo ricevuto per il download:', decodedTitle);
    
            wiki.setLang('it');
            const page = await wiki.page(decodedTitle);
            const text = await page.content();
            const summary = await page.summary();
            const mainImage = summary.originalimage?.source || null;
            const userId = req.user.id;
    
            const existingArticle = await prisma.article.findUnique({
                where: {
                    pageId: summary.pageid,
                }
            });
    
            if (existingArticle) {
                if (overwrite) {
                    const updatedArticle = await prisma.article.update({
                        where: { pageId: summary.pageid },
                        data: {
                            text,
                            mainImage,
                            userId: userId,
                        }
                    });
                    return res.status(200).json({ 
                        message: 'Articolo aggiornato con successo', 
                        article: updatedArticle 
                    });
                } else {
                    return res.status(200).json({ 
                        articleExists: true, 
                        message: 'Articolo già presente nel database', 
                        article: existingArticle 
                    });
                }
            } else {
                const newArticle = await prisma.article.create({
                    data: {
                        title: decodedTitle,
                        text,
                        url: `https://it.wikipedia.org/wiki/${encodeURIComponent(decodedTitle)}`,
                        pageId: summary.pageid,
                        mainImage: mainImage,
                        userId: userId,
                    },
                });
                res.status(200).json({ message: 'Articolo salvato con successo', article: newArticle });
            }
        } catch (error) {
            console.error(`Errore nel salvataggio dell'articolo: ${error.message}`);
            res.status(500).json({ error: 'Errore nel salvataggio dell\'articolo. Riprova più tardi.' });
        }
    });        
}
