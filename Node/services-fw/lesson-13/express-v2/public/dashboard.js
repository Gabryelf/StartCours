// Проверяем авторизацию при загрузке
window.onload = () => {
    const userJson = sessionStorage.getItem('user');
    
    if (!userJson) {
        // Не авторизован - возвращаем на главную
        window.location.href = '/';
        return;
    }
    
    const user = JSON.parse(userJson);
    document.getElementById('userInfo').innerHTML = `
        <strong>Вы вошли как:</strong> ${user.login}<br>
        <strong>ID:</strong> ${user.id}<br>
        <strong>Зарегистрирован:</strong> ${new Date(user.created_at).toLocaleString()}
    `;
};

// Отправка сообщения (как и раньше)
async function sendMessage() {
    const message = document.getElementById('message').value;
    
    const response = await fetch("/api/send-message", {
        method: "POST",
        headers: {
            "content-type": "application/json",
        },
        body: JSON.stringify({ message: message })
    });
    
    const data = await response.json();
    
    document.getElementById('length').textContent = data.length;
    document.getElementById('wordCount').textContent = data.wordCount;
}

// Выход из системы
function logout() {
    sessionStorage.removeItem('user');
    window.location.href = '/';
}