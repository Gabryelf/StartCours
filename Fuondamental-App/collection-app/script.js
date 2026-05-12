// ========== 1. ПОЛУЧАЕМ ЭЛЕМЕНТЫ ==========
const mainImage = document.getElementById('mainImage');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const counterSpan = document.getElementById('counter');

// ========== 2. ПЕРЕМЕННЫЕ ==========
const images = GALLERY_CONFIG.images;
let currentIndex = 0;

// ========== 3. ОБНОВЛЕНИЕ КАРТИНКИ ==========
function updateImage() {
    mainImage.src = images[currentIndex];
    counterSpan.textContent = `${currentIndex + 1} / ${images.length}`;
}

// ========== 4. НАВИГАЦИЯ ==========
function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    updateImage();
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateImage();
}

// ========== 5. СОБЫТИЯ ==========
prevBtn.addEventListener('click', prevImage);
nextBtn.addEventListener('click', nextImage);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') prevImage();
    if (event.key === 'ArrowRight') nextImage();
});

// ========== 6. ЗАПУСК ==========
updateImage();