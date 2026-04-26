async function register() {
    const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            login: document.getElementById('login').value, 
            password: document.getElementById('password').value 
        })
    });
    const data = await response.json();
    if (data.success) alert('Registered');
    else alert('Error');
}

async function login() {
    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            login: document.getElementById('login').value, 
            password: document.getElementById('password').value 
        })
    });
    const data = await response.json();
    if (data.success) {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data.user));
        window.location.href = '/dashboard';
    } else alert('Error');
}

window.onload = () => {
    if (sessionStorage.getItem('user') && window.location.pathname === '/') {
        window.location.href = '/dashboard';
    }
};