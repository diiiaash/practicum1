// Основной JavaScript файл для сайта

document.addEventListener('DOMContentLoaded', function() {
    // Активация текущей страницы в навигации
    highlightCurrentPage();
    
    // Добавление функциональности для полей ответов
    initAnswerFields();
    
    // Инициализация тем
    initTopics();
});

// Подсветка текущей страницы в навигации
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href').split('/').pop();
        
        // Для главной страницы
        if (currentPage === 'index.html' || currentPage === '') {
            if (linkPage === 'index.html' || linkPage === '') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        } 
        // Для других страниц
        else if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Инициализация полей для ответов
function initAnswerFields() {
    const answerFields = document.querySelectorAll('.answer-field');
    
    answerFields.forEach(field => {
        // Добавляем подсказку при фокусе
        field.addEventListener('focus', function() {
            if (!this.dataset.hintAdded && this.dataset.hint) {
                const hintDiv = document.createElement('div');
                hintDiv.className = 'hint';
                hintDiv.innerHTML = `<div class="hint-title"><i class="fas fa-lightbulb"></i> Подсказка</div>${this.dataset.hint}`;
                
                this.parentNode.insertBefore(hintDiv, this.nextSibling);
                this.dataset.hintAdded = true;
            }
        });
        
        // Сохраняем ответы в localStorage
        field.addEventListener('input', function() {
            const taskId = this.closest('.task').id || 'task-' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem(taskId, this.innerHTML);
        });
        
        // Восстанавливаем сохраненные ответы
        const taskId = field.closest('.task')?.id;
        if (taskId && localStorage.getItem(taskId)) {
            field.innerHTML = localStorage.getItem(taskId);
        }
    });
}

// Инициализация функциональности для тем
function initTopics() {
    // Для страниц с темами добавляем навигацию
    if (document.querySelector('.topic-navigation')) {
        initTopicNavigation();
    }
    
    // Для заданий с выбором ответов
    initChoiceQuestions();
}

// Навигация между темами
function initTopicNavigation() {
    // Определяем текущую тему
    const currentTopic = window.location.pathname.match(/tema(\d+)\.html/);
    
    if (currentTopic) {
        const topicNum = parseInt(currentTopic[1]);
        
        // Обновляем ссылки на предыдущую и следующую тему
        const prevBtn = document.querySelector('.topic-nav-btn.prev');
        const nextBtn = document.querySelector('.topic-nav-btn.next');
        
        if (prevBtn && topicNum > 1) {
            prevBtn.href = `tema${topicNum - 1}.html`;
        } else if (prevBtn) {
            prevBtn.style.display = 'none';
        }
        
        if (nextBtn && topicNum < 11) {
            nextBtn.href = `tema${topicNum + 1}.html`;
        } else if (nextBtn) {
            nextBtn.style.display = 'none';
        }
    }
}

// Инициализация заданий с выбором ответа
function initChoiceQuestions() {
    const checkboxes = document.querySelectorAll('input[type="checkbox"]');
    const radioButtons = document.querySelectorAll('input[type="radio"]');
    
    // Сохраняем состояние чекбоксов
    checkboxes.forEach(checkbox => {
        const name = checkbox.name;
        const value = checkbox.value;
        const savedState = localStorage.getItem(`checkbox-${name}-${value}`);
        
        if (savedState === 'checked') {
            checkbox.checked = true;
        }
        
        checkbox.addEventListener('change', function() {
            localStorage.setItem(`checkbox-${name}-${value}`, this.checked ? 'checked' : 'unchecked');
        });
    });
    
    // Сохраняем состояние радиокнопок
    radioButtons.forEach(radio => {
        const name = radio.name;
        const value = radio.value;
        const savedState = localStorage.getItem(`radio-${name}`);
        
        if (savedState === value) {
            radio.checked = true;
        }
        
        radio.addEventListener('change', function() {
            localStorage.setItem(`radio-${name}`, this.value);
        });
    });
}

// Функция для проверки ответов (заглушка - в реальном приложении здесь была бы логика проверки)
function checkAnswers(taskId) {
    alert('В реальном приложении здесь будет проверка ваших ответов. Для демонстрации функция не реализована.');
    return false;
}

// Функция для очистки всех ответов
function clearAllAnswers() {
    if (confirm('Вы уверены, что хотите очистить все ответы? Это действие нельзя отменить.')) {
        localStorage.clear();
        location.reload();
    }
}