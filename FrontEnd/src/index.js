import express from 'express';

const  app  =  express();

app.use(express.static('public'));

app.set('view engine', 'ejs');


app.get('/', (req, res) => {
    // il metodo render parte già dalla cartella 'views' quindi specifichiamo il file partendo dal suo interno. Inoltre non serve specificare l'estensione '.ejs'
    res.render('pages/home');
})

app.get('/login', (req,res) =>{
    res.render('pages/login')
});

app.get('/signIn', (req,res) =>{
    res.render('pages/signIn')
});

app.get('/dashboard',(req,res) => {
    res.render('pages/dashboard')
});

app.listen(3000);