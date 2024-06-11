import prisma from '../db/prisma.js';
import isLoggedIn from '../src/middleware/isLoggedIn.js';

export default function getUserArticles(app) {
    app.get('/viewArticle', isLoggedIn, async (req, res) => {
        try {
            const userId = req.user.id;
            console.log('User ID:', userId); // Log user ID
            const userArticles = await prisma.article.findMany({
                where: {
                    userId: userId
                }
            });
            console.log('User articles:', userArticles); // Log articles retrieved
            res.json(userArticles);
        } catch (error) {
            console.error('Errore durante il recupero degli articoli dell\'utente:', error);
            res.status(500).json({ error: 'Errore durante il recupero degli articoli dell\'utente' });
        }
    });
}
