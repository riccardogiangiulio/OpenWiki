
const loginForm = document.querySelector('#loginForm');
const errorMessage = document.getElementById('error-message');

loginForm.addEventListener('submit',async (e) => {
    e.preventDefault();
;
    const email= e.target.children[0].value;
    const password= e.target.children[1].value;

    if (!email || !password) {
        errorMessage.textContent = 'Inserisci email e password!.';
        errorMessage.classList.remove('hidden');
        return;
    }

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
    console.log(res);
    if (res.status !== 200) {
        errorMessage.textContent = 'Credenziali errate. Riprova.';
        errorMessage.classList.remove('hidden');
        return;
    }

    const data = await res.json();
    console.log(data);
    //localStorage per salvare dati specifici nell'app una volta fatto l'accesso
    localStorage.setItem('user', JSON.stringify(data.user))
    
    localStorage.setItem('token', data.token)
    console.log('Resetting form...');
    loginForm.reset();
    //per cambaire pagina una volta fatto il login
    window.location.href = '/dashboard';
})