// Game state
const gameState = {
    currentLevel: 1,
    currentQuestion: 1,
    score: 0,
    streak: 0,
    questions: []
};

// DOM elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const levelCompleteScreen = document.getElementById('level-complete-screen');
const gameCompleteScreen = document.getElementById('game-complete-screen');
const startBtn = document.getElementById('start-btn');
const nextLevelBtn = document.getElementById('next-level-btn');
const restartBtn = document.getElementById('restart-btn');
const submitBtn = document.getElementById('submit-btn');
const questionElement = document.getElementById('question');
const answerInput = document.getElementById('answer-input');
const levelElement = document.getElementById('level');
const scoreElement = document.getElementById('score');
const streakElement = document.getElementById('streak');
const questionNumberElement = document.getElementById('question-number');
const levelScoreElement = document.getElementById('level-score');
const totalScoreElement = document.getElementById('total-score');
const finalScoreElement = document.getElementById('final-score');
const progressFill = document.getElementById('progress-fill');

// Event listeners
startBtn.addEventListener('click', startGame);
nextLevelBtn.addEventListener('click', nextLevel);
restartBtn.addEventListener('click', restartGame);
submitBtn.addEventListener('click', checkAnswer);
answerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Start the game
function startGame() {
    gameState.currentLevel = 1;
    gameState.currentQuestion = 1;
    gameState.score = 0;
    gameState.streak = 0;
    
    updateStats();
    generateQuestions();
    showGameScreen();
}

// Show game screen and display first question
function showGameScreen() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    levelCompleteScreen.classList.add('hidden');
    gameCompleteScreen.classList.add('hidden');
    
    displayQuestion();
}

// Generate questions for current level
function generateQuestions() {
    gameState.questions = [];
    
    for (let i = 0; i < 5; i++) {
        gameState.questions.push(generateQuestion(gameState.currentLevel));
    }
}

// Generate a single question based on level
function generateQuestion(level) {
    let question = {};
    let num1, num2, operation;
    
    // Determine operations based on level
    if (level <= 10) {
        // Levels 1-10: Simple addition and subtraction
        operation = Math.random() < 0.5 ? '+' : '-';
        num1 = getRandomInt(1, 10 + level);
        num2 = getRandomInt(1, 10 + level);
    } else if (level <= 20) {
        // Levels 11-20: Addition, subtraction with larger numbers
        operation = Math.random() < 0.5 ? '+' : '-';
        num1 = getRandomInt(10, 50 + level);
        num2 = getRandomInt(10, 50 + level);
    } else if (level <= 30) {
        // Levels 21-30: Introduce multiplication
        operation = ['+', '-', '*'][Math.floor(Math.random() * 3)];
        num1 = getRandomInt(1, 10 + Math.floor(level/2));
        num2 = getRandomInt(1, 10 + Math.floor(level/2));
    } else if (level <= 40) {
        // Levels 31-40: All operations with larger numbers
        operation = ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
        num1 = getRandomInt(10, 100 + level);
        num2 = getRandomInt(1, 10 + Math.floor(level/3));
        
        // For division, make sure it divides evenly
        if (operation === '/') {
            num1 = num2 * getRandomInt(1, 5 + Math.floor(level/10));
        }
    } else if (level <= 50) {
        // Levels 41-50: Introduce exponents
        operation = ['+', '-', '*', '/', '^'][Math.floor(Math.random() * 5)];
        num1 = getRandomInt(1, 10 + Math.floor(level/4));
        num2 = operation === '^' ? getRandomInt(2, 3) : getRandomInt(1, 10 + Math.floor(level/4));
        
        if (operation === '/') {
            num1 = num2 * getRandomInt(1, 5 + Math.floor(level/10));
        }
    } else if (level <= 60) {
        // Levels 51-60: More complex problems
        operation = ['+', '-', '*', '/', '^', '√'][Math.floor(Math.random() * 6)];
        
        if (operation === '√') {
            num1 = getRandomInt(1, 10 + Math.floor(level/5));
            num2 = num1 * num1;
        } else {
            num1 = getRandomInt(10, 100 + level);
            num2 = getRandomInt(1, 20 + Math.floor(level/4));
            
            if (operation === '/') {
                num1 = num2 * getRandomInt(1, 10 + Math.floor(level/10));
            } else if (operation === '^') {
                num2 = getRandomInt(2, 4);
            }
        }
    } else if (level <= 70) {
        // Levels 61-70: Even more complex
        operation = ['+', '-', '*', '/', '^', '√', '%'][Math.floor(Math.random() * 7)];
        
        if (operation === '√') {
            num1 = getRandomInt(1, 15 + Math.floor(level/5));
            num2 = num1 * num1;
        } else if (operation === '%') {
            num1 = getRandomInt(1, 200 + level);
            num2 = getRandomInt(1, 100);
        } else {
            num1 = getRandomInt(10, 200 + level);
            num2 = getRandomInt(1, 30 + Math.floor(level/3));
            
            if (operation === '/') {
                num1 = num2 * getRandomInt(1, 15 + Math.floor(level/10));
            } else if (operation === '^') {
                num2 = getRandomInt(2, 5);
            }
        }
    } else {
        // Levels 71-100: All operations with large numbers and complexity
        operation = ['+', '-', '*', '/', '^', '√', '%'][Math.floor(Math.random() * 7)];
        
        if (operation === '√') {
            num1 = getRandomInt(1, 20 + Math.floor(level/4));
            num2 = num1 * num1;
        } else if (operation === '%') {
            num1 = getRandomInt(1, 500 + level);
            num2 = getRandomInt(1, 200);
        } else {
            num1 = getRandomInt(50, 500 + level);
            num2 = getRandomInt(1, 50 + Math.floor(level/2));
            
            if (operation === '/') {
                num1 = num2 * getRandomInt(1, 20 + Math.floor(level/10));
            } else if (operation === '^') {
                num2 = getRandomInt(2, 6);
            }
        }
    }
    
    // Create question object
    question.num1 = num1;
    question.num2 = num2;
    question.operation = operation;
    
    // Calculate correct answer
    switch(operation) {
        case '+':
            question.answer = num1 + num2;
            question.text = `${num1} + ${num2} = ?`;
            break;
        case '-':
            question.answer = num1 - num2;
            question.text = `${num1} - ${num2} = ?`;
            break;
        case '*':
            question.answer = num1 * num2;
            question.text = `${num1} × ${num2} = ?`;
            break;
        case '/':
            question.answer = num1 / num2;
            question.text = `${num1} ÷ ${num2} = ?`;
            break;
        case '^':
            question.answer = Math.pow(num1, num2);
            question.text = `${num1}^${num2} = ?`;
            break;
        case '√':
            question.answer = num1;
            question.text = `√${num2} = ?`;
            break;
        case '%':
            question.answer = Math.round((num1 / num2) * 100);
            question.text = `What is ${num1} as a percentage of ${num2}? (Round to nearest whole number)`;
            break;
    }
    
    return question;
}

// Display current question
function displayQuestion() {
    const currentQuestion = gameState.questions[gameState.currentQuestion - 1];
    questionElement.textContent = currentQuestion.text;
    answerInput.value = '';
    answerInput.focus();
    
    // Update progress
    questionNumberElement.textContent = gameState.currentQuestion;
    progressFill.style.width = `${(gameState.currentQuestion - 1) * 20}%`;
}

// Check user's answer
function checkAnswer() {
    const currentQuestion = gameState.questions[gameState.currentQuestion - 1];
    const userAnswer = parseFloat(answerInput.value);
    const correctAnswer = currentQuestion.answer;
    
    // Check if answer is correct (with some tolerance for floating point)
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.0001;
    
    if (isCorrect) {
        gameState.score += 1;
        gameState.streak += 1;
    } else {
        gameState.streak = 0;
    }
    
    updateStats();
    
    // Move to next question or complete level
    if (gameState.currentQuestion < 5) {
        gameState.currentQuestion += 1;
        displayQuestion();
    } else {
        completeLevel();
    }
}

// Complete current level
function completeLevel() {
    gameScreen.classList.add('hidden');
    levelCompleteScreen.classList.remove('hidden');
    
    levelScoreElement.textContent = gameState.score - ((gameState.currentLevel - 1) * 5);
    totalScoreElement.textContent = gameState.score;
    
    // Check if game is complete
    if (gameState.currentLevel >= 100) {
        gameCompleteScreen.classList.remove('hidden');
        finalScoreElement.textContent = gameState.score;
    }
}

// Move to next level
function nextLevel() {
    gameState.currentLevel += 1;
    gameState.currentQuestion = 1;
    
    if (gameState.currentLevel <= 100) {
        generateQuestions();
        showGameScreen();
    }
}

// Restart game
function restartGame() {
    startGame();
}

// Update stats display
function updateStats() {
    levelElement.textContent = gameState.currentLevel;
    scoreElement.textContent = gameState.score;
    streakElement.textContent = gameState.streak;
}

// Helper function to get random integer
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
