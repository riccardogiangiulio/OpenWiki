import express from 'express';
import cors from "cors";
import "dotenv/config";
import userRouting from '../routing/user.routing.js'
import authRouting from '../routing/auth.routing.js'
import getResultsWiki from '../routing/wiki.routing.js'
import getUserArticles from '../routing/article.routing.js'


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'http://127.0.0.1:8000', 'http://localhost:8000']
}));

getUserArticles(app)
userRouting(app);
authRouting(app);
getResultsWiki(app)

app.listen(process.env.PORT, () => {
    console.log(`Application listening at ${process.env.PORT}`);
});
