// Лайтбокс для галереи
function openLightbox(elem) {
    document.getElementById("lightbox").style.display = "block";
    document.getElementById("lightbox-img").src = elem.src;
}

function closeLightbox() {
    document.getElementById("lightbox").style.display = "none";
}

// Модальное окно для записи
function openModal() {
    document.getElementById("modal").style.display = "block";
}

function closeModal() {
    document.getElementById("modal").style.display = "none";
}

// Закрытие модалки при клике вне ее
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    const lightbox = document.getElementById('lightbox');
    if (event.target == modal) {
        closeModal();
    }
    if (event.target == lightbox) {
        closeLightbox();
    }
}

// Обработка формы (заглушка)
document.getElementById('booking-form').addEventListener('submit', function(e) {
    e.preventDefault();
    alert('Спасибо! Мы скоро с вами свяжемся!');
    closeModal();
    // Здесь должна быть отправка данных на сервер (AJAX)
});

// Мобильное меню
const hamburger = document.getElementById('hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Закрываем меню при клике на ссылку
document.querySelectorAll('.nav-menu a').forEach(n => n.addEventListener('click', () => {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
}));

// Фильтрация услуг
document.addEventListener('DOMContentLoaded', function() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Убираем активный класс у всех кнопок
            filterBtns.forEach(b => b.classList.remove('active'));
            // Добавляем активный класс нажатой кнопке
            this.classList.add('active');
            
            const filterValue = this.getAttribute('data-filter');
            
            serviceCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
});

// Переменные для хранения данных формы
let bookingData = {
    service: '',
    date: '',
    time: '',
    name: '',
    phone: '',
    email: '',
    car: '',
    year: '',
    message: ''
};

// Управление шагами формы
let currentStep = 1;

function showStep(step) {
    console.log('Показываем шаг:', step);
    
    // Скрываем все шаги
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Показываем нужный шаг
    const stepElement = document.getElementById(`step-${step}`);
    if (stepElement) {
        stepElement.classList.add('active');
    } else {
        console.error('Элемент step-' + step + ' не найден!');
        return;
    }
    
    // Обновляем индикатор шагов
    document.querySelectorAll('.step').forEach(stepEl => {
        stepEl.classList.remove('active');
    });
    
    const stepIndicator = document.querySelector(`.step[data-step="${step}"]`);
    if (stepIndicator) {
        stepIndicator.classList.add('active');
    }
    
    currentStep = step;
}

function nextStep(step) {
    console.log('Переход к шагу:', step, 'Текущие данные:', bookingData);
    
    if (validateStep(currentStep)) {
        showStep(step);
    }
}

function prevStep(step) {
    showStep(step);
}

function validateStep(step) {
    console.log('Валидация шага:', step, 'Данные:', bookingData);
    
    switch(step) {
        case 1:
            if (!bookingData.service) {
                alert('Пожалуйста, выберите услугу');
                return false;
            }
            console.log('Услуга выбрана:', bookingData.service);
            return true;
        case 2:
            if (!bookingData.date || !bookingData.time) {
                alert('Пожалуйста, выберите дату и время');
                return false;
            }
            return true;
        case 3:
            const name = document.getElementById('clientName')?.value;
            const phone = document.getElementById('clientPhone')?.value;
            const car = document.getElementById('carModel')?.value;
            
            if (!name || !phone || !car) {
                alert('Пожалуйста, заполните обязательные поля');
                return false;
            }
            return true;
    }
    return true;
}

// Инициализация при открытии модалки
function openModal() {
    console.log('Открываем модалку');
    document.getElementById('modal').style.display = 'block';
    document.body.style.overflow = 'hidden'; // Блокируем скролл страницы
    showStep(1);
    generateDates();
    initServiceSelection();
    initTimeSelection();
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.body.style.overflow = 'auto'; // Возвращаем скролл
    
    // Сброс формы
    bookingData = {
        service: '',
        date: '',
        time: '',
        name: '',
        phone: '',
        email: '',
        car: '',
        year: '',
        message: ''
    };
    
    // Сброс выбранных элементов
    document.querySelectorAll('.selected').forEach(el => {
        el.classList.remove('selected');
    });
    
    // Сброс полей формы
    const inputs = document.querySelectorAll('#clientName, #clientPhone, #clientEmail, #carModel, #carYear, #clientMessage');
    inputs.forEach(input => {
        input.value = '';
    });
}

// Выбор услуги
function initServiceSelection() {
    console.log('Инициализация выбора услуг');
    
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('click', function() {
            console.log('Кликнули на услугу:', this.querySelector('h4').textContent);
            
            document.querySelectorAll('.service-card').forEach(c => {
                c.classList.remove('selected');
            });
            this.classList.add('selected');
            bookingData.service = this.querySelector('h4').textContent;
            
            console.log('Выбрана услуга:', bookingData.service);
        });
    });
}

// Генерация дат (следующие 14 дней)
function generateDates() {
    const dateGrid = document.querySelector('.date-grid');
    if (!dateGrid) {
        console.error('Элемент .date-grid не найден!');
        return;
    }
    
    const today = new Date();
    dateGrid.innerHTML = '';
    
    for (let i = 0; i < 14; i++) {
        const date = new Date();
        date.setDate(today.getDate() + i);
        
        const dateOption = document.createElement('div');
        dateOption.className = 'date-option';
        dateOption.textContent = date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'short'
        });
        
        dateOption.addEventListener('click', function() {
            document.querySelectorAll('.date-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            bookingData.date = date.toLocaleDateString('ru-RU');
            console.log('Выбрана дата:', bookingData.date);
        });
        
        dateGrid.appendChild(dateOption);
    }
}

// Выбор времени
function initTimeSelection() {
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.addEventListener('click', function() {
            document.querySelectorAll('.time-slot').forEach(s => {
                s.classList.remove('selected');
            });
            this.classList.add('selected');
            bookingData.time = this.textContent;
            console.log('Выбрано время:', bookingData.time);
        });
    });
}

// Отправка формы
function submitBooking() {
    console.log('Отправка формы, текущий шаг:', currentStep);
    
    if (validateStep(3)) {
        // Обновляем данные из полей формы
        bookingData.name = document.getElementById('clientName').value;
        bookingData.phone = document.getElementById('clientPhone').value;
        bookingData.email = document.getElementById('clientEmail').value;
        bookingData.car = document.getElementById('carModel').value;
        bookingData.year = document.getElementById('carYear').value;
        bookingData.message = document.getElementById('clientMessage').value;
        
        console.log('Все данные для отправки:', bookingData);
        
        // Показываем данные в модалке успеха
        document.getElementById('summaryService').textContent = bookingData.service;
        document.getElementById('summaryDateTime').textContent = `${bookingData.date} в ${bookingData.time}`;
        document.getElementById('summaryNumber').textContent = 'A-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        // Закрываем форму и показываем успех
        closeModal();
        document.getElementById('successModal').style.display = 'block';
        
        // Здесь можно добавить отправку данных на сервер
        console.log('Данные записи:', bookingData);
        
        // Сброс данных после успешной отправки
        bookingData = {
            service: '',
            date: '',
            time: '',
            name: '',
            phone: '',
            email: '',
            car: '',
            year: '',
            message: ''
        };
    }
}

function closeSuccessModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Закрытие модалок при клике вне их
window.onclick = function(event) {
    const modal = document.getElementById('modal');
    const successModal = document.getElementById('successModal');
    
    if (event.target == modal) {
        closeModal();
    }
    if (event.target == successModal) {
        closeSuccessModal();
    }
}

// Делаем функции глобально доступными
window.nextStep = nextStep;
window.prevStep = prevStep;
window.submitBooking = submitBooking;
window.openModal = openModal;
window.closeModal = closeModal;
window.closeSuccessModal = closeSuccessModal;

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    console.log('Страница загружена, функции готовы к работе');
    
    // Проверяем, что кнопки есть на странице
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.setAttribute('onclick', 'openModal()');
    }
});