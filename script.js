// Calculate edit distance between two strings
function editDistance(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array(m + 1).fill().map(() => Array(n + 1).fill(0));

    // Initialize first row and column
    for (let i = 1; i <= m; i++) dp[i][0] = i;
    for (let j = 1; j <= n; j++) dp[0][j] = j;

    // Fill the matrix
    for (let i = 1; i <= m; i++) {
        for (let j = 1; j <= n; j++) {
            if (a[i - 1] === b[j - 1]) {
                dp[i][j] = dp[i - 1][j - 1];
            } else {
                // Try all operations
                const replace = dp[i - 1][j - 1] + 1;
                const insert = dp[i][j - 1] + 1;
                const remove = dp[i - 1][j] + 1;

                // Check swap operation (only if we have at least 2 characters)
                let swap = Infinity;
                if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
                    swap = dp[i - 2][j - 2] + 1;
                }

                dp[i][j] = Math.min(replace, insert, remove, swap);
            }
        }
    }

    return dp[m][n];
}

// Language & UI translation
let currentLanguage = 'ru'; // Default language is Russian

// Translation dictionaries
const translations = {
    'en': {
        'appTitle': 'Latvian Vocabulary Trainer',
        'lvToLang': 'Latvian → English',
        'langToLv': 'English → Latvian',
        'cardsMode': 'Cards Mode',
        'typingMode': 'Typing Mode',
        'check': 'Check',
        'showAnswer': 'Show the answer',
        'nextWord': 'Next word',
        'masteredWords': 'Mastered Words',
        'totalMasteredWords': 'Total mastered words:',
        'clearAll': 'Delete All',
        'deleteWord': 'Delete',
        'export': 'Export',
        'import': 'Import',
        'enterAnswer': 'Enter your answer',
        'cards': 'cards',
        'correct': 'Correct! Well done!',
        'fullAnswer': 'The correct answer is:',
        'incorrect': 'Incorrect.',
        'minEditDistance': 'Distance to correct answer:',
        'attemptsLeft': 'Try again! Attempts left:',
        'incorrectAnswer': 'Incorrect. The correct answer is:',
        'congratulations': 'Congratulations! You have mastered all words in this direction!',
        'score': 'Score:',
        'masteredWordsCount': 'Mastered Words:',
        'noMasteredWords': 'No mastered words in this direction yet.',
        'confirmClearAll': 'Are you sure you want to clear all mastered words?',
        'importSuccess': 'Mastered words imported successfully!',
        'importError': 'Error importing mastered words. Please make sure the file is in the correct format.'
    },
    'ru': {
        'appTitle': 'Тренажер латышской лексики',
        'lvToLang': 'Латышский → Русский',
        'langToLv': 'Русский → Латышский',
        'cardsMode': 'Режим карточек',
        'typingMode': 'Режим ввода',
        'check': 'Проверить',
        'showAnswer': 'Показать ответ',
        'nextWord': 'Следующее слово',
        'masteredWords': 'Изученные слова',
        'totalMasteredWords': 'Всего изученных слов:',
        'clearAll': 'Удалить все',
        'deleteWord': 'Удалить',
        'export': 'Экспорт',
        'import': 'Импорт',
        'enterAnswer': 'Введите ваш ответ',
        'cards': 'карточек',
        'correct': 'Правильно! Молодец!',
        'fullAnswer': 'Правильный ответ:',
        'incorrect': 'Неправильно.',
        'minEditDistance': 'Расстояние до правильного ответа:',
        'attemptsLeft': 'Попробуйте еще раз! Осталось попыток:',
        'incorrectAnswer': 'Неправильно. Правильный ответ:',
        'congratulations': 'Поздравляем! Вы изучили все слова в этом направлении!',
        'score': 'Счет:',
        'masteredWordsCount': 'Изученные слова:',
        'noMasteredWords': 'В этом направлении пока нет изученных слов.',
        'confirmClearAll': 'Вы уверены, что хотите удалить все изученные слова?',
        'importSuccess': 'Изученные слова успешно импортированы!',
        'importError': 'Ошибка импорта изученных слов. Пожалуйста, убедитесь, что формат файла верный.'
    }
};

// Vocabulary data
let vocabulary = [];
let currentWordIndex = 0;
let score = 0;
let totalAttempts = 0;
let currentDirection = 'lv-ru'; // Default to Latvian-Russian
let currentMode = 'cards'; // Change default mode to cards
let numCardsToShow = 6; // Default number of cards to show
let masteredWords = {
    'lv-ru': new Set(),
    'ru-lv': new Set(),
    'lv-en': new Set(),
    'en-lv': new Set()
};
let attemptsLeft = 3; // Number of attempts allowed per word

// DOM elements
const wordToTranslateElement = document.getElementById('wordToTranslate');
const userInputElement = document.getElementById('userInput');
const checkButton = document.getElementById('checkButton');
const showAnswerButton = document.getElementById('showAnswerButton');
const skipButton = document.getElementById('skipButton');
const feedbackElement = document.getElementById('feedback');
const progressBar = document.getElementById('progressBar');
const scoreElement = document.getElementById('score');
const showMasteredButton = document.getElementById('showMasteredButton');
const masteredWordsModal = new bootstrap.Modal(document.getElementById('masteredWordsModal'));
const masteredWordsList = document.getElementById('masteredWordsList');
const masteredCount = document.getElementById('masteredCount');
const clearAllButton = document.getElementById('clearAllButton');
const directionInputs = document.querySelectorAll('input[name="direction"]');
const exportMasteredButton = document.getElementById('exportMasteredButton');
const importMasteredButton = document.getElementById('importMasteredButton');
const importFileInput = document.getElementById('importFileInput');
const modeInputs = document.querySelectorAll('input[name="mode"]'); // Add mode toggle inputs
const cardsContainer = document.getElementById('cardsContainer'); // Container for cards in cards mode
const cardNumberSelection = document.getElementById('cardNumberSelection'); // Container for number selection
const numCardsInputs = document.querySelectorAll('input[name="numCards"]'); // Radio buttons for number selection
const cardNumberLabel = document.getElementById('cardNumberLabel'); // Label for number selection

// Language switch elements
const languageInputs = document.querySelectorAll('input[name="language"]');
const appTitle = document.getElementById('app-title');
const cardsLabel = document.getElementById('cards-label');
const typingLabel = document.getElementById('typing-label');
const masteredWordsTitle = document.getElementById('masteredWordsTitle');
const masteredCountText = document.getElementById('masteredCountText');

// Function to get translation for a key
function getTranslation(key) {
    if (typeof translations === 'undefined' || !translations || !translations[currentLanguage]) {
        console.warn('Translations not loaded yet or language not found:', currentLanguage);
        // Return a default value based on the key
        return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
    }
    return translations[currentLanguage][key] || 'Translation missing';
}

// Function to update all UI text based on current language
function updateUILanguage() {
    // Update static text elements
    appTitle.textContent = getTranslation('appTitle');
    cardsLabel.textContent = getTranslation('cardsMode');
    typingLabel.textContent = getTranslation('typingMode');
    checkButton.textContent = getTranslation('check');
    showAnswerButton.textContent = getTranslation('showAnswer');
    skipButton.textContent = getTranslation('nextWord');
    showMasteredButton.textContent = getTranslation('masteredWords');
    masteredWordsTitle.textContent = getTranslation('masteredWords');
    clearAllButton.textContent = getTranslation('clearAll');
    exportMasteredButton.textContent = getTranslation('export');
    importMasteredButton.textContent = getTranslation('import');
    userInputElement.placeholder = getTranslation('enterAnswer');
    cardNumberLabel.textContent = getTranslation('cards') + ':';
    
    // Update masteredCountText, preserving the count value
    const currentCount = masteredCount.textContent;
    masteredCountText.innerHTML = `${getTranslation('totalMasteredWords')} <span id="masteredCount">${currentCount}</span>`;
    
    // Update direction labels based on current language
    updateDirectionLabels();
    
    // Update score display with new translations
    updateScore();
}

// Function to update direction labels based on current language
function updateDirectionLabels() {
    // Show/hide appropriate direction buttons based on language
    const lvToLangLabel = document.querySelector(`label[for="${currentLanguage === 'ru' ? 'lv-ru' : 'lv-en'}"]`);
    const langToLvLabel = document.querySelector(`label[for="${currentLanguage === 'ru' ? 'ru-lv' : 'en-lv'}"]`);
    
    lvToLangLabel.textContent = getTranslation('lvToLang');
    langToLvLabel.textContent = getTranslation('langToLv');
    
    // Show/hide direction inputs based on language
    document.querySelectorAll('.direction-btn').forEach(input => {
        const isEnglish = input.id === 'lv-en' || input.id === 'en-lv';
        const isRussian = input.id === 'lv-ru' || input.id === 'ru-lv';
        const shouldShow = (currentLanguage === 'en' && isEnglish) || (currentLanguage === 'ru' && isRussian);
        
        input.style.display = shouldShow ? '' : 'none';
        document.querySelector(`label[for="${input.id}"]`).style.display = shouldShow ? '' : 'none';
    });
}

// Load mastered words from localStorage
function loadMasteredWords() {
    const saved = localStorage.getItem('masteredWords');
    if (saved) {
        try {
            const parsed = JSON.parse(saved);
            // Initialize all directions with empty Sets
            masteredWords = {
                'lv-ru': new Set(),
                'ru-lv': new Set(),
                'lv-en': new Set(),
                'en-lv': new Set()
            };
            
            if (Array.isArray(parsed)) {
                // Handle old format (array) - assign to lv-en only
                masteredWords['lv-en'] = new Set(parsed);
            } else if (typeof parsed === 'object' && parsed !== null) {
                // Handle new format (object with Sets)
                // Only copy the data for directions that exist in the saved data
                if (Array.isArray(parsed['lv-en'])) masteredWords['lv-en'] = new Set(parsed['lv-en']);
                if (Array.isArray(parsed['en-lv'])) masteredWords['en-lv'] = new Set(parsed['en-lv']);
                if (Array.isArray(parsed['lv-ru'])) masteredWords['lv-ru'] = new Set(parsed['lv-ru']);
                if (Array.isArray(parsed['ru-lv'])) masteredWords['ru-lv'] = new Set(parsed['ru-lv']);
            }
            console.log('Loaded mastered words:', masteredWords);
            updateMasteredCount();
        } catch (error) {
            console.error('Error loading mastered words:', error);
            // Reset to empty sets if there's an error
            masteredWords = {
                'lv-ru': new Set(),
                'ru-lv': new Set(),
                'lv-en': new Set(),
                'en-lv': new Set()
            };
        }
    }
}

// Save mastered words to localStorage
function saveMasteredWords() {
    const toSave = {
        'lv-ru': Array.from(masteredWords['lv-ru']),
        'ru-lv': Array.from(masteredWords['ru-lv']),
        'lv-en': Array.from(masteredWords['lv-en']),
        'en-lv': Array.from(masteredWords['en-lv'])
    };
    localStorage.setItem('masteredWords', JSON.stringify(toSave));
    updateMasteredCount();
}

// Update mastered words count
function updateMasteredCount() {
    masteredCount.textContent = masteredWords[currentDirection].size;
}

// Show mastered words in modal
function showMasteredWords() {
    masteredWordsList.innerHTML = '';
    
    // Update mastered count first
    updateMasteredCount();
    
    // Update masteredCountText with current count
    masteredCountText.innerHTML = `${getTranslation('totalMasteredWords')} <span id="masteredCount">${masteredWords[currentDirection].size}</span>`;
    // Re-get masteredCount since we just replaced it
    const masteredCountElement = document.getElementById('masteredCount');
    
    // Sort mastered words alphabetically
    const sortedWords = [...masteredWords[currentDirection]].sort();
    
    if (sortedWords.length === 0) {
        masteredWordsList.innerHTML = `<div class="list-group-item">${getTranslation('noMasteredWords')}</div>`;
    } else {
        sortedWords.forEach(word => {
            // Find word data in vocabulary
            let wordData;
            const sourceField = getSourceField();
            const translationField = getTranslationDirection();
            
            // For current direction
            wordData = vocabulary.find(w => w[sourceField][0] === word);
            
            if (wordData) {
                const item = document.createElement('div');
                item.className = 'list-group-item d-flex justify-content-between align-items-center';
                item.innerHTML = `
                    <div>
                        <strong>${word}</strong>
                        <span class="text-muted ms-2">${wordData[translationField].join('; ')}</span>
                    </div>
                    <button class="btn btn-sm btn-outline-danger delete-word" data-word="${word}">
                        ${getTranslation('deleteWord')}
                    </button>
                `;
                masteredWordsList.appendChild(item);
            }
        });
    }

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-word').forEach(button => {
        button.addEventListener('click', (e) => {
            const word = e.target.dataset.word;
            masteredWords[currentDirection].delete(word);
            saveMasteredWords();
            showMasteredWords();
        });
    });

    masteredWordsModal.show();
}

// Clear all mastered words
function clearAllMasteredWords() {
    if (confirm(getTranslation('confirmClearAll'))) {
        masteredWords[currentDirection].clear();
        saveMasteredWords();
        showMasteredWords();
    }
}

// Parse CSV line
function parseCSVLine(line) {
    // Skip empty lines
    if (!line.trim()) return null;

    // Find commas that are not inside quotes
    let commaIndices = [];
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        if (line[i] === '"') {
            inQuotes = !inQuotes;
        } else if (line[i] === ',' && !inQuotes) {
            commaIndices.push(i);
        }
    }

    if (commaIndices.length < 1) {
        console.error('No commas found in line:', line);
        return null;
    }

    // Extract latvian, english, and russian parts
    let latvian = line.substring(0, commaIndices[0]).trim();
    let english = line.substring(commaIndices[0] + 1, commaIndices[1] || line.length).trim();
    let russian = commaIndices[1] ? line.substring(commaIndices[1] + 1).trim() : '';

    // Remove quotes if present
    if (latvian.startsWith('"') && latvian.endsWith('"')) {
        latvian = latvian.substring(1, latvian.length - 1);
    }
    if (english.startsWith('"') && english.endsWith('"')) {
        english = english.substring(1, english.length - 1);
    }
    if (russian.startsWith('"') && russian.endsWith('"')) {
        russian = russian.substring(1, russian.length - 1);
    }

    // Remove text within parentheses
    const removeParentheses = (text) => {
        return text.replace(/\s*\([^)]*\)/g, '').trim();
    };

    // Process each part to remove parentheses and split by semicolons
    const latvianAnswers = latvian.split(';').map(ans => removeParentheses(ans.trim()));
    const englishAnswers = english.split(';').map(ans => removeParentheses(ans.trim()));
    const russianAnswers = russian ? russian.split(';').map(ans => removeParentheses(ans.trim())) : [];

    return {
        latvian: latvianAnswers,
        english: englishAnswers,
        russian: russianAnswers
    };
}

// Export mastered words
function exportMasteredWords() {
    const data = {
        'lv-ru': Array.from(masteredWords['lv-ru']),
        'ru-lv': Array.from(masteredWords['ru-lv']),
        'lv-en': Array.from(masteredWords['lv-en']),
        'en-lv': Array.from(masteredWords['en-lv'])
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mastered_words.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Import mastered words
function importMasteredWords(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importedData = JSON.parse(e.target.result);
            if (typeof importedData === 'object' && importedData !== null) {
                // Validate the imported data structure
                const validDirections = ['lv-ru', 'ru-lv', 'lv-en', 'en-lv'];
                const hasValidStructure = validDirections.every(dir => 
                    Array.isArray(importedData[dir]) || !importedData.hasOwnProperty(dir)
                );
                
                if (hasValidStructure) {
                    // Initialize with empty sets for all directions
                    validDirections.forEach(dir => {
                        masteredWords[dir] = new Set(importedData[dir] || []);
                    });
                    
                    saveMasteredWords();
                    showMasteredWords();
                    alert(getTranslation('importSuccess'));
                } else {
                    throw new Error('Invalid data format');
                }
            } else {
                throw new Error('Invalid JSON format');
            }
        } catch (error) {
            console.error('Error importing mastered words:', error);
            alert(getTranslation('importError'));
        }
    };
    reader.readAsText(file);
}

// Initialize the app
async function init() {
    // Debug translations
    console.log('Translations object at init start:', typeof translations, translations ? Object.keys(translations).length : 'not defined');
    
    // Load vocabulary and mastered words first
    await loadVocabulary();

    // Set initial direction, language, and word from URL hash
    let restoredWordIndex = -1;
    const hash = window.location.hash.substring(1);
    if (hash) {
        const hashParts = hash.split('/');
        const hashDirection = hashParts[0];
        const hashMode = hashParts[1]; // Extract mode from hash
        const encodedWord = hashParts[2]; // Word is now the third part

        // Set direction and language based on hash direction
        if (['lv-ru', 'ru-lv', 'lv-en', 'en-lv'].includes(hashDirection)) {
            currentDirection = hashDirection;
            
            // Determine language based on direction
            currentLanguage = (hashDirection === 'lv-ru' || hashDirection === 'ru-lv') ? 'ru' : 'en';
            
            // Set appropriate radio buttons
            document.getElementById(currentDirection).checked = true;
            document.getElementById(currentLanguage).checked = true;
        } else {
            // Default direction
            currentDirection = 'lv-ru';
            currentLanguage = 'ru';
        }

        // Set mode if present
        if (hashMode === 'typing' || hashMode === 'cards') {
            currentMode = hashMode;
            document.getElementById(currentMode).checked = true;
        }

        // Try to restore word based on the direction's source language
        if (encodedWord) {
            console.log("Encoded word:", encodedWord);
            try {
                const targetWordIdentifier = decodeURIComponent(encodedWord);
                let wordIdentifierField = currentDirection.startsWith('lv') ? 'latvian' : 
                                          (currentDirection.startsWith('en') ? 'english' : 'russian');

                restoredWordIndex = vocabulary.findIndex(word => word[wordIdentifierField][0] === targetWordIdentifier);

                if (restoredWordIndex === -1) {
                    console.log("Word from hash not found or mastered, choosing random.");
                }
            } catch (e) {
                console.error("Error decoding word from hash or finding word:", e);
                restoredWordIndex = -1; // Fallback to random on error
            }
        }
    } else {
        // Default settings if no hash
        currentDirection = 'lv-ru';
        currentLanguage = 'ru';
        currentMode = 'cards'; // Set cards as default mode
        document.getElementById('cards').checked = true;
        document.getElementById('ru').checked = true;
        document.getElementById('lv-ru').checked = true;
    }

    // Update UI with initial language
    updateUILanguage();

    // Read initially checked card number
    const checkedNumCardsInput = document.querySelector('input[name="numCards"]:checked');
    if (checkedNumCardsInput) {
        numCardsToShow = parseInt(checkedNumCardsInput.value, 10);
    } else {
        numCardsToShow = 6; // Fallback default
        document.getElementById('numCards6').checked = true; // Ensure default is checked visually
    }

    // Initialize UI based on the current mode
    updateUIForCurrentMode();

    // Start the learning session, potentially with the restored word
    startLearning(restoredWordIndex);

    // Setup event listeners
    checkButton.addEventListener('click', checkAnswer);
    showAnswerButton.addEventListener('click', () => {
        const currentWord = vocabulary[currentWordIndex];
        const translationField = getTranslationDirection();
        feedbackElement.innerHTML = `
            <div class="incorrect">
                ${getTranslation('fullAnswer')} ${currentWord[translationField].join('; ')}
            </div>
        `;
        disableInputs();
        skipButton.disabled = false;
    });
    skipButton.addEventListener('click', () => {
        feedbackElement.innerHTML = '';
        showNextWord(); // Directly show next random word
    });
    userInputElement.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            checkAnswer();
        }
    });
    showMasteredButton.addEventListener('click', () => {
        // Explicitly update the counter before showing the modal
        updateMasteredCount();
        showMasteredWords();
    });
    clearAllButton.addEventListener('click', clearAllMasteredWords);
    exportMasteredButton.addEventListener('click', exportMasteredWords);
    importMasteredButton.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', importMasteredWords);

    // Add direction change handler
    directionInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            currentDirection = e.target.value;
            score = 0;
            totalAttempts = 0;
            updateScore();
            // When direction changes, update the URL hash and refresh with a new random word
            updateUrlHash();
            // Start with a new random word
            feedbackElement.innerHTML = '';
            showNextWord();
        });
    });

    // Add language change handler
    languageInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            currentLanguage = e.target.value;
            
            // Update UI text for new language
            updateUILanguage();
            
            // Set appropriate direction based on language
            const newDirection = currentLanguage === 'ru' ? 
                (currentDirection === 'lv-en' ? 'lv-ru' : (currentDirection === 'en-lv' ? 'ru-lv' : currentDirection)) :
                (currentDirection === 'lv-ru' ? 'lv-en' : (currentDirection === 'ru-lv' ? 'en-lv' : currentDirection));
            
            if (newDirection !== currentDirection) {
                currentDirection = newDirection;
                document.getElementById(currentDirection).checked = true;
                
                // Reset score for new direction
                score = 0;
                totalAttempts = 0;
                updateScore();
            }
            
            // Update URL hash and refresh with current word
            updateUrlHash();
            showSpecificWord(currentWordIndex);
        });
    });

    // Add mode change handler
    modeInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            currentMode = e.target.value;
            updateUIForCurrentMode();
            // When mode changes, update the URL hash and refresh the current word
            updateUrlHash();
            // When mode changes, refresh the current word
            showSpecificWord(currentWordIndex);
        });
    });

    // Add card number change handler
    numCardsInputs.forEach(input => {
        input.addEventListener('change', (e) => {
            numCardsToShow = parseInt(e.target.value, 10);
            console.log(`Number of cards changed to: ${numCardsToShow}`);
            // Regenerate cards for the current word if in cards mode
            if (currentMode === 'cards') {
                // Ensure cards are regenerated with the new count
                showSpecificWord(currentWordIndex);
            }
        });
    });
}

// Helper function to get translation direction based on current direction
function getTranslationDirection() {
    if (currentDirection === 'lv-ru' || currentDirection === 'lv-en') {
        return currentDirection === 'lv-ru' ? 'russian' : 'english';
    } else {
        return 'latvian';
    }
}

// Update UI based on current learning mode
function updateUIForCurrentMode() {
    const isTypingMode = currentMode === 'typing';

    // Typing mode elements
    userInputElement.style.display = isTypingMode ? 'block' : 'none';
    checkButton.style.display = isTypingMode ? 'inline-block' : 'none';

    // Cards mode elements
    cardsContainer.style.display = isTypingMode ? 'none' : 'flex';
    cardNumberSelection.style.display = isTypingMode ? 'none' : 'flex'; // Show/hide number buttons
    cardNumberLabel.style.display = isTypingMode ? 'none' : 'inline'; // Show/hide number label

    // Handle buttons layout based on mode
    if (isTypingMode) {
        // Clear any existing cards when switching to typing mode
        cardsContainer.innerHTML = '';
        
        // Move buttons back to the input group for typing mode
        const inputGroup = document.querySelector('.input-group');
        if (!inputGroup.contains(showAnswerButton)) {
            inputGroup.appendChild(showAnswerButton);
            inputGroup.appendChild(skipButton);
        }
        
        // Remove any cards-mode-buttons container if it exists
        const cardsModeButtons = document.querySelector('.cards-mode-buttons');
        if (cardsModeButtons) {
            cardsModeButtons.remove();
        }
    } else {
        // Create a centered container for the buttons in cards mode
        let cardsModeButtons = document.querySelector('.cards-mode-buttons');
        if (!cardsModeButtons) {
            cardsModeButtons = document.createElement('div');
            cardsModeButtons.className = 'cards-mode-buttons';
            
            // Create a button group container for proper styling
            const btnGroup = document.createElement('div');
            btnGroup.className = 'btn-group';
            btnGroup.role = 'group';
            
            // Add the buttons to the button group
            btnGroup.appendChild(showAnswerButton);
            btnGroup.appendChild(skipButton);
            
            // Add the button group to the cards-mode-buttons container
            cardsModeButtons.appendChild(btnGroup);
            
            // Insert the buttons container after the cards container
            cardsContainer.parentNode.insertBefore(cardsModeButtons, cardsContainer.nextSibling);
        } else {
            // Check if the button group already exists
            let btnGroup = cardsModeButtons.querySelector('.btn-group');
            if (!btnGroup) {
                // Create a new button group
                btnGroup = document.createElement('div');
                btnGroup.className = 'btn-group';
                btnGroup.role = 'group';
                
                // Move existing buttons to the btn-group
                while (cardsModeButtons.firstChild) {
                    btnGroup.appendChild(cardsModeButtons.firstChild);
                }
                
                // Add the button group to the container
                cardsModeButtons.appendChild(btnGroup);
            } else {
                // Ensure the buttons are in the button group
                if (!btnGroup.contains(showAnswerButton)) {
                    btnGroup.appendChild(showAnswerButton);
                }
                if (!btnGroup.contains(skipButton)) {
                    btnGroup.appendChild(skipButton);
                }
            }
        }
    }
}

// Get random word index (excluding mastered words)
function getRandomWordIndex() {
    const sourceField = getSourceField();
    
    const availableIndices = vocabulary
        .map((word, index) => ({word, index}))
        .filter(({word}) => {
            // Only include words that have the required source and translation fields
            if (!word[sourceField] || !word[sourceField][0]) return false;
            
            const translationField = getTranslationDirection();
            if (!word[translationField] || !word[translationField][0]) return false;
            
            // Filter out mastered words
            return !masteredWords[currentDirection].has(word[sourceField][0]);
        })
        .map(({index}) => index);

    if (availableIndices.length === 0) {
        // All words are mastered or no suitable words found
        feedbackElement.innerHTML = `<h3>${getTranslation('congratulations')}</h3>`;
        return -1;
    }

    return availableIndices[Math.floor(Math.random() * availableIndices.length)];
}

// Start learning session
function startLearning(initialIndex = -1) {
    score = 0;
    totalAttempts = 0;
    let wordIndexToShow;
    if (initialIndex !== -1 && initialIndex < vocabulary.length) {
        console.log(`Starting with restored word index: ${initialIndex}`);
        wordIndexToShow = initialIndex;
    } else {
        console.log("Choosing initial random word.");
        wordIndexToShow = getRandomWordIndex();
    }

    if (wordIndexToShow === -1) {
        // Handle case where all words are mastered initially
        console.log("All words mastered from the start or no words available.");
        feedbackElement.innerHTML = '<h3>Congratulations! You have mastered all words in this direction!</h3>';
        disableInputs();
        return; // Stop if no words to show
    }

    showSpecificWord(wordIndexToShow);
    updateScore();
}

// Check user's answer
function checkAnswer() {
    if (currentMode === 'typing') {
        checkTypedAnswer();
    } else {
        // For cards mode, the check happens when a card is clicked
        // This is handled by the event listeners on the cards
    }
}

// Check answer in typing mode
function checkTypedAnswer() {
    const userAnswer = userInputElement.value.trim().toLowerCase();
    if (!currentWordIndex === -1) {
        return
    } // Don't check if no word loaded
    const currentWord = vocabulary[currentWordIndex];

    // Get all possible correct answers for the current direction
    const translationField = getTranslationDirection();
    
    const correctAnswers = currentWord[translationField]
        .map(ans => ans.toLowerCase().trim())
        .flatMap(ans => {
            // Handle comma-separated answers within a single answer string
            return ans.split(/[,;]/).map(a => a.trim());
        })
        .map(ans => {
            // Remove "to " prefix if present
            return ans.replace(/^to\s+/, '');
        })
        .filter(ans => ans); // Remove empty strings resulting from splits

    totalAttempts++;

    // Log the current word and answers
    console.log('Current word:', {
        latvian: currentWord.latvian,
        english: currentWord.english,
        russian: currentWord.russian,
        direction: currentDirection
    });
    console.log('User answer:', userAnswer);
    console.log('Correct answers:', correctAnswers);

    // Check if user's answer matches any of the correct answers
    const userAnswerClean = userAnswer.replace(/^to\s+/, '');
    if (correctAnswers.includes(userAnswerClean)) {
        handleCorrectAnswer(currentWord);
    } else {
        handleIncorrectAnswer(userAnswerClean, correctAnswers, currentWord);
    }

    updateScore();
}

// Check if selected card is correct
function checkCardAnswer(selectedCard) {
    if (currentWordIndex === -1) return; // Don't check if no word loaded
    
    const currentWord = vocabulary[currentWordIndex];
    const correctWordId = `card-${currentWordIndex}`;
    
    totalAttempts++;
    
    if (selectedCard.id === correctWordId) {
        handleCorrectAnswer(currentWord);
    } else {
        // In cards mode, we don't decrease attempts - just show the correct answer
        const translationField = getTranslationDirection();
        feedbackElement.innerHTML = `
            <div class="incorrect">
                ${getTranslation('incorrectAnswer')} ${currentWord[translationField].join('; ')}
            </div>
        `;
        
        // Highlight the correct card
        document.querySelectorAll('.card-option').forEach(card => {
            card.classList.remove('selected-correct', 'selected-incorrect');
            if (card.id === correctWordId) {
                card.classList.add('selected-correct');
            } else if (card.id === selectedCard.id) {
                card.classList.add('selected-incorrect');
            }
        });
        
        // Disable all cards
        document.querySelectorAll('.card-option').forEach(card => {
            card.onclick = null;
            card.classList.add('disabled');
        });
        
        // Enable the skip button
        skipButton.disabled = false;
    }
    
    updateScore();
}

// Handle correct answer (both modes)
function handleCorrectAnswer(currentWord) {
    score++;
    const sourceField = getSourceField();
    masteredWords[currentDirection].add(currentWord[sourceField][0]);
    saveMasteredWords();
    
    const translationField = getTranslationDirection();
    feedbackElement.innerHTML = `<div class="correct">${getTranslation('correct')}<br>${getTranslation('fullAnswer')} ${currentWord[translationField].join('; ')}</div>`;

    // Reset attempts for next word
    attemptsLeft = 3;
    
    if (currentMode === 'cards') {
        // Highlight the correct card
        document.querySelectorAll('.card-option').forEach(card => {
            card.classList.remove('selected-correct', 'selected-incorrect');
            if (card.id === `card-${currentWordIndex}`) {
                card.classList.add('selected-correct');
            }
            // Disable all cards
            card.onclick = null;
            card.classList.add('disabled');
        });
    }
    
    showNextWord(); // Queue up next word
    // Show next word after 5 seconds
    setTimeout(hideCorrectAnswer, 5000);
}

// Handle incorrect answer (typing mode)
function handleIncorrectAnswer(userAnswerClean, correctAnswers, currentWord) {
    attemptsLeft--;

    // Calculate minimum edit distance to any correct answer
    const minDistance = Math.min(...correctAnswers.map(ans => editDistance(userAnswerClean, ans)));

    if (attemptsLeft > 0) {
        feedbackElement.innerHTML = `
            <div class="incorrect">
                ${getTranslation('incorrect')} ${getTranslation('minEditDistance')} ${minDistance}<br>
                ${getTranslation('attemptsLeft')} ${attemptsLeft}
            </div>
        `;
        userInputElement.focus(); // Keep focus for retry
    } else {
        const translationField = getTranslationDirection();
        feedbackElement.innerHTML = `
            <div class="incorrect">
                ${getTranslation('incorrectAnswer')} ${currentWord[translationField].join('; ')}<br>
                ${getTranslation('minEditDistance')} ${minDistance}
            </div>
        `;
        // Disable inputs except for the skip button
        userInputElement.disabled = true;
        checkButton.disabled = true;
        showAnswerButton.disabled = true;
        skipButton.disabled = false; // Keep the "Next word" button enabled

        // Reset attempts for next word
        attemptsLeft = 3;
    }
}

// Show next random word
function showNextWord() {
    const nextIndex = getRandomWordIndex();
    showSpecificWord(nextIndex);
}

function hideCorrectAnswer() {
    // Check if the feedback element has a child with class "correct"
    const correctElement = feedbackElement.querySelector('.correct');
    if (correctElement) {
        feedbackElement.innerHTML = ''; // Clear feedback
    }
}

// Display a specific word by its index
function showSpecificWord(index) {
    currentWordIndex = index;

    if (currentWordIndex === -1) {
        feedbackElement.innerHTML = `<h3>${getTranslation('congratulations')}</h3>`;
        disableInputs();
        wordToTranslateElement.textContent = ''; // Clear the word display
        cardsContainer.innerHTML = ''; // Clear the cards
        updateUrlHash(); // Update hash without word
        return;
    }

    const currentWord = vocabulary[currentWordIndex];
    // Determine which word to show (target) and which to use as identifier (source)
    const sourceField = getSourceField();
    const wordToShow = currentWord[sourceField][0];
    const wordIdentifier = currentWord[sourceField][0]; // Same as wordToShow
    
    wordToTranslateElement.textContent = wordToShow;

    // Reset UI elements based on mode
    if (currentMode === 'typing') {
        userInputElement.value = '';
    } else if (currentMode === 'cards') {
        // Clear previous cards before generating new ones
        cardsContainer.innerHTML = '';
        generateCards(currentWordIndex);
    }
    
    enableInputs();
    attemptsLeft = 3; // Reset attempts for new word

    // Update progress bar
    const progress = ((masteredWords[currentDirection].size / vocabulary.length) * 100).toFixed(1);
    progressBar.style.width = `${progress}%`;

    // Update URL hash
    updateUrlHash();

    // Focus the input box in typing mode
    if (currentMode === 'typing') {
        userInputElement.focus();
    }
}

// Helper function to get source field based on current direction
function getSourceField() {
    return currentDirection.startsWith('lv') ? 'latvian' : 
           (currentDirection.startsWith('en') ? 'english' : 'russian');
}

// Generate cards for cards mode
function generateCards(correctIndex) {
    // Don't generate cards if correctIndex is invalid
    if (correctIndex === -1) return;
    
    // Note: cardsContainer is already cleared in showSpecificWord, no need to clear it again here
    
    // Get the correct word
    const correctWord = vocabulary[correctIndex];
    
    // Get the required number of incorrect words
    const numIncorrectNeeded = numCardsToShow - 1;
    const incorrectIndices = getRandomIncorrectIndices(correctIndex, numIncorrectNeeded);
    
    // Check if enough incorrect indices were found
    if (incorrectIndices.length < numIncorrectNeeded) {
        console.warn(`Could not find enough (${numIncorrectNeeded}) distinct incorrect words. Showing ${incorrectIndices.length + 1} cards instead.`);
        // Optionally, provide feedback to the user in the UI
    }

    // Combine correct and incorrect indices and shuffle
    const allIndices = [correctIndex, ...incorrectIndices];
    shuffleArray(allIndices);
    
    // Create cards
    const translationField = getTranslationDirection();
    
    allIndices.forEach(index => {
        const word = vocabulary[index];
        const cardText = word[translationField][0];
        
        const card = document.createElement('div');
        card.className = 'card-option';
        card.id = `card-${index}`;
        card.textContent = cardText;
        
        // Add click event to check if this card is correct
        card.onclick = function() {
            checkCardAnswer(this);
        };
        
        cardsContainer.appendChild(card);
    });
}

// Get random incorrect word indices that don't have overlapping translations with correct word
function getRandomIncorrectIndices(correctIndex, count) {
    const correctWord = vocabulary[correctIndex];
    const translationField = getTranslationDirection();
    const sourceField = getSourceField();
    
    // Flatten and lowercase all possible correct answers
    const correctAnswerSet = new Set(
        correctWord[translationField].flatMap(ans => 
            ans.toLowerCase().split(/[,;]/).map(a => a.trim().replace(/^to\s+/, ''))
        ).filter(ans => ans)
    );
    
    // Get all available indices excluding the correct one and mastered words
    const availableIndices = vocabulary
        .map((word, index) => ({word, index}))
        .filter(({word, index}) => {
            // Skip the correct word
            if (index === correctIndex) return false;
            
            // Skip mastered words
            if (masteredWords[currentDirection].has(word[sourceField][0])) return false;
            
            // Skip words that don't have required translation
            if (!word[translationField] || word[translationField].length === 0) return false;
            
            // Check for translation overlap
            const answerSet = new Set(
                word[translationField].flatMap(ans => 
                    ans.toLowerCase().split(/[,;]/).map(a => a.trim().replace(/^to\s+/, ''))
                ).filter(ans => ans)
            );
            
            // Check if there's any overlap between this word's answers and the correct word's answers
            for (const answer of answerSet) {
                if (correctAnswerSet.has(answer)) return false;
            }
            
            return true;
        })
        .map(({index}) => index);
    
    // Shuffle the available indices
    shuffleArray(availableIndices);

    // Return the requested number of indices, or fewer if not enough are available
    return availableIndices.slice(0, count);
}

// Fisher-Yates shuffle algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Helper to disable inputs
function disableInputs() {
    if (currentMode === 'typing') {
        userInputElement.disabled = true;
        checkButton.disabled = true;
    } else {
        // Disable all cards
        document.querySelectorAll('.card-option').forEach(card => {
            card.onclick = null;
            card.classList.add('disabled');
        });
    }
    showAnswerButton.disabled = true;
    skipButton.disabled = false; // Keep the "Next word" button enabled
}

// Helper to enable inputs
function enableInputs() {
    if (currentMode === 'typing') {
        userInputElement.disabled = false;
        checkButton.disabled = false;
    }
    // For cards mode, the cards are generated with their event listeners
    showAnswerButton.disabled = false;
    skipButton.disabled = false;
}

// Update score display
function updateScore() {
    const remainingWords = vocabulary.length - masteredWords[currentDirection].size;
    const percentage = ((masteredWords[currentDirection].size / vocabulary.length) * 100).toFixed(1);
    scoreElement.textContent = `${getTranslation('score')} ${score}/${totalAttempts} | ${getTranslation('masteredWordsCount')} ${masteredWords[currentDirection].size}/${vocabulary.length} (${percentage}%)`;
}

// Load vocabulary from CSV
async function loadVocabulary() {
    try {
        console.log('Starting to load vocabulary...');
        const response = await fetch('words.csv');
        console.log('Fetch response status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const text = await response.text();
        console.log('CSV file loaded, first 200 chars:', text.substring(0, 200));
        if (!text || text.trim() === '') {
            throw new Error('CSV file is empty');
        }
        const lines = text.split('\n');
        console.log('Number of lines in CSV:', lines.length);
        vocabulary = lines
            .map((line, index) => {
                try {
                    const result = parseCSVLine(line);
                    if (result) {
                        console.log(`Line ${index + 1}:`, result);
                    }
                    return result;
                } catch (lineError) {
                    console.error(`Error processing line ${index + 1}:`, line, lineError);
                    return null;
                }
            })
            .filter(word => word && word.latvian && word.english && word.russian && 
                   word.latvian.length > 0 && word.english.length > 0 && word.russian.length > 0);
        console.log('Successfully processed vocabulary:', {
            totalLines: lines.length,
            validWords: vocabulary.length,
            firstWord: vocabulary[0],
            lastWord: vocabulary[vocabulary.length - 1]
        });
        if (vocabulary.length === 0) {
            throw new Error('No valid vocabulary words found in the CSV file');
        }

        // Load mastered words before starting the learning session
        loadMasteredWords();
    } catch (error) {
        console.error('Detailed error loading vocabulary:', {
            name: error.name,
            message: error.message,
            stack: error.stack
        });
        feedbackElement.innerHTML = `Error loading vocabulary: ${error.message}`;
    }
}

// Update URL hash with current direction, mode and word
function updateUrlHash() {
    // Get the current word identifier
    let wordIdentifier = '';
    if (currentWordIndex !== -1 && currentWordIndex < vocabulary.length) {
        const currentWord = vocabulary[currentWordIndex];
        const sourceField = getSourceField();
        wordIdentifier = currentWord[sourceField][0];
        try {
            window.location.hash = `${currentDirection}/${currentMode}/${encodeURIComponent(wordIdentifier)}`;
        } catch (e) {
            console.error("Error updating hash:", e);
            window.location.hash = `${currentDirection}/${currentMode}`; // Fallback without word
        }
    } else {
        // No word or all words mastered
        window.location.hash = `${currentDirection}/${currentMode}`;
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init); 