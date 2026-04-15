// Регистрация
async function register() {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch("/api/register", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ login, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        alert(data.message);
        // Очищаем форму
        document.getElementById('login').value = '';
        document.getElementById('password').value = '';
    } else {
        alert("Ошибка: " + data.error);
    }
}

// Вход
async function login() {
    const login = document.getElementById('login').value;
    const password = document.getElementById('password').value;
    
    const response = await fetch("/api/login", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ login, password })
    });
    
    const data = await response.json();
    
    if (data.success) {
        // Сохраняем данные пользователя в sessionStorage
        sessionStorage.setItem('user', JSON.stringify(data.user));
        // Перенаправляем на защищенную страницу
        window.location.href = '/dashboard';
    } else {
        alert("Ошибка: " + data.error);
    }
}

// Проверка при загрузке страницы - если уже авторизован, перенаправляем
window.onload = () => {
    const user = sessionStorage.getItem('user');
    if (user && window.location.pathname === '/') {
        window.location.href = '/dashboard';
    }
};