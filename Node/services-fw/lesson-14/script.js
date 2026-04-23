async function check() {
    const text = document.getElementById('text').value;
    const res = await fetch('/check', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({text: text})
    });
    const data = await res.json();
    document.getElementById('result').innerHTML = 
        data.success ? '✅ Успех! Палиндром' : '❌ Не палиндром';
}