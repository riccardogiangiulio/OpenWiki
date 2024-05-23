import  express  from  'express';

const  app  =  express();

app.use(express.static('public'));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    // il metodo render parte già dalla cartella 'views' quindi specifichiamo il file partendo dal suo interno. Inoltre non serve specificare l'estensione '.ejs'
    res.render('pages/home');
})



app.listen(3000);