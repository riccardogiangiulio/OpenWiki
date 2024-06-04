
const loginForm = document.querySelector('#loginForm');

loginForm.addEventListener('submit',async (e) => {
    e.preventDefault();

    const email= e.target.children[0].value;
    const password= e.target.children[1].value;

    console.log({email, password});
    const res = await fetch('http://localhost:8000/login', {
        body: JSON.stringify({
            email,
            password,
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    if (res.status !== 200) {
        console.log('errore');
        return
    }
    const data = await res.json();
    console.log(data);
    //localStorage per salvare dati specifici nell'app una volta fatto l'accesso
    localStorage.setItem('user', JSON.stringify(data.user))
    localStorage.setItem('token', data.token)

    //per cambaire pagina una volta fatto il login
    window.location.href = '/dashboard';
})