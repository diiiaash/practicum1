// Основной JavaScript файл для сайта

document.addEventListener('DOMContentLoaded', function() {
    // Мобильное меню
    initMobileMenu();
    
    // Подсветка текущей страницы
    highlightCurrentPage();
    
    // Инициализация навигации для страниц лекций
    initLectureNavigation();
    
    // Добавление функциональности для элементов лекций
    initLectureFeatures();
});

// Мобильное меню
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            // Анимация иконки
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
        
        // Закрытие меню при клике на ссылку
        const navLinks = mainNav.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            });
        });
        
        // Закрытие меню при клике вне его
        document.addEventListener('click', function(event) {
            if (!mainNav.contains(event.target) && !menuToggle.contains(event.target)) {
                mainNav.classList.remove('active');
                menuToggle.querySelector('i').classList.remove('fa-times');
                menuToggle.querySelector('i').classList.add('fa-bars');
            }
        });
    }
}

// Подсветка текущей страницы
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    // Сбрасываем все активные классы
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Для главной страницы
    if (currentPage === 'index.html' || currentPage === '') {
        const homeLink = document.querySelector('nav a[href="index.html"]');
        if (homeLink) homeLink.classList.add('active');
    }
    
    // Для страниц лекций
    if (currentPage && currentPage.startsWith('tema')) {
        const currentLectureLink = document.querySelector(`nav a[href*="${currentPage}"]`);
        if (currentLectureLink) currentLectureLink.classList.add('active');
    }
}

// Навигация между лекциями
function initLectureNavigation() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    
    if (currentPage && currentPage.startsWith('tema')) {
        const topicNum = parseInt(currentPage.match(/\d+/)[0]);
        
        // Обновление навигации в меню
        updateMenuNavigation(topicNum);
        
        // Обновление кнопок навигации на странице
        updatePageNavigation(topicNum);
    }
}

// Обновление меню навигации
function updateMenuNavigation(topicNum) {
    const navItems = document.querySelectorAll('nav ul li a');
    if (navItems.length === 0) return;
    
    // Сброс активного класса
    navItems.forEach(item => item.classList.remove('active'));
    
    // Установка активного класса для текущей темы
    const currentLink = document.querySelector(`nav a[href*="tema${topicNum}.html"]`);
    if (currentLink) {
        currentLink.classList.add('active');
    }
}

// Обновление навигации на странице
function updatePageNavigation(topicNum) {
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    if (prevBtn) {
        if (topicNum > 1) {
            prevBtn.href = `tema${topicNum - 1}.html`;
        } else {
            prevBtn.href = '../index.html';
            prevBtn.innerHTML = '<i class="fas fa-arrow-left"></i> На главную';
        }
    }
    
    if (nextBtn) {
        if (topicNum < 11) {
            nextBtn.href = `tema${topicNum + 1}.html`;
        } else {
            nextBtn.style.display = 'none';
        }
    }
}

// Дополнительные функции для лекций
function initLectureFeatures() {
    // Добавление интерактивности к таблицам
    enhanceTables();
    
    // Добавление функциональности для заметок
    enhanceNotes();
    
    // Инициализация примеров
    enhanceExamples();
}

// Улучшение таблиц
function enhanceTables() {
    const tables = document.querySelectorAll('table');
    tables.forEach(table => {
        // Добавляем класс для стилизации
        table.classList.add('enhanced-table');
        
        // Добавляем возможность сортировки (если нужно)
        if (table.querySelector('th')) {
            addTableSorting(table);
        }
    });
}

// Добавление сортировки таблиц
function addTableSorting(table) {
    const headers = table.querySelectorAll('th');
    headers.forEach((header, index) => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            sortTable(table, index);
        });
    });
}

// Сортировка таблицы
function sortTable(table, column) {
    const tbody = table.querySelector('tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));
    
    const isAscending = table.dataset.sortDirection === 'asc';
    
    rows.sort((a, b) => {
        const aValue = a.children[column].textContent.trim();
        const bValue = b.children[column].textContent.trim();
        
        if (isAscending) {
            return aValue.localeCompare(bValue);
        } else {
            return bValue.localeCompare(aValue);
        }
    });
    
    // Очищаем и добавляем отсортированные строки
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
    
    // Меняем направление сортировки
    table.dataset.sortDirection = isAscending ? 'desc' : 'asc';
}

// Улучшение заметок
function enhanceNotes() {
    const notes = document.querySelectorAll('.note-box');
    notes.forEach(note => {
        // Добавляем кнопку для сворачивания/разворачивания
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'note-toggle';
        toggleBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
        toggleBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 10px;
            background: none;
            border: none;
            cursor: pointer;
            color: #856404;
        `;
        
        note.style.position = 'relative';
        note.appendChild(toggleBtn);
        
        // Функционал сворачивания
        toggleBtn.addEventListener('click', () => {
            const content = note.querySelector('p, ul, ol');
            if (content) {
                const isHidden = content.style.display === 'none';
                content.style.display = isHidden ? 'block' : 'none';
                toggleBtn.innerHTML = isHidden ? 
                    '<i class="fas fa-chevron-down"></i>' : 
                    '<i class="fas fa-chevron-up"></i>';
            }
        });
    });
}

// Улучшение примеров
function enhanceExamples() {
    const examples = document.querySelectorAll('.example-box');
    examples.forEach(example => {
        // Добавляем возможность копирования
        const copyBtn = document.createElement('button');
        copyBtn.className = 'example-copy';
        copyBtn.innerHTML = '<i class="fas fa-copy"></i> Копировать';
        copyBtn.style.cssText = `
            margin-top: 10px;
            padding: 5px 10px;
            background-color: var(--secondary-color);
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        `;
        
        example.appendChild(copyBtn);
        
        copyBtn.addEventListener('click', () => {
            const text = example.textContent.replace('Копировать', '').trim();
            navigator.clipboard.writeText(text).then(() => {
                const originalText = copyBtn.innerHTML;
                copyBtn.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
                copyBtn.style.backgroundColor = '#27ae60';
                
                setTimeout(() => {
                    copyBtn.innerHTML = originalText;
                    copyBtn.style.backgroundColor = 'var(--secondary-color)';
                }, 2000);
            });
        });
    });
}

// Функция для отображения прогресса изучения
function showProgress() {
    const progress = localStorage.getItem('lectureProgress') || '{}';
    const progressData = JSON.parse(progress);
    
    // Обновляем карточки лекций
    const lectureCards = document.querySelectorAll('.lecture-card');
    lectureCards.forEach(card => {
        const href = card.getAttribute('href');
        const topicNum = href ? href.match(/tema(\d+)/) : null;
        
        if (topicNum && progressData[topicNum[1]]) {
            const progressBadge = document.createElement('div');
            progressBadge.className = 'progress-badge';
            progressBadge.innerHTML = '<i class="fas fa-check-circle"></i> Изучено';
            progressBadge.style.cssText = `
                position: absolute;
                top: 10px;
                right: 10px;
                background-color: #27ae60;
                color: white;
                padding: 3px 8px;
                border-radius: 12px;
                font-size: 11px;
            `;
            card.style.position = 'relative';
            card.appendChild(progressBadge);
        }
    });
}

// Инициализация прогресса при загрузке
if (document.querySelector('.lectures-grid')) {
    showProgress();
}

// Сохранение прогресса при посещении страницы лекции
if (window.location.pathname.includes('tema')) {
    const topicNum = window.location.pathname.match(/tema(\d+)/);
    if (topicNum) {
        const progress = localStorage.getItem('lectureProgress') || '{}';
        const progressData = JSON.parse(progress);
        progressData[topicNum[1]] = true;
        localStorage.setItem('lectureProgress', JSON.stringify(progressData));
    }
}