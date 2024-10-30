let playerScore = 0;
let computerScore = 0;
let targetScore = -1;
let isPlayerBatting = true;
let gameStarted = false;
let tossChoice = '';
let gameEnded = false;
let playerWins = 0;
let aiWins = 0;

function chooseToss(choice) {
    tossChoice = choice;
    document.getElementById("tossInputSection").style.display = 'block';
}

function getRandomRun() {
    return Math.floor(Math.random() * 7);
}

function performToss() {
    const playerTossRun = parseInt(document.getElementById("playerTossNumber").value);
    if (isNaN(playerTossRun) || playerTossRun < 0 || playerTossRun > 6) {
        alert("Please enter a valid number between 0 and 6 for the toss.");
        return;
    }

    const aiTossRun = getRandomRun();
    const tossSum = playerTossRun + aiTossRun;
    const tossResult = (tossSum % 2 === 0) ? 'even' : 'odd';

    document.getElementById("tossResult").innerText = `You chose ${tossChoice}. You picked ${playerTossRun} and AI chose ${aiTossRun}. Toss Sum: ${tossSum} (${tossResult})`;

    if (tossChoice === tossResult) {
        document.getElementById("tossResult").innerText += " - You won the toss!";
        document.getElementById("choiceSection").style.display = 'block';
    } else {
        document.getElementById("tossResult").innerText += " - AI won the toss!";
        isPlayerBatting = Math.random() > 0.5;
        document.getElementById("result").innerText = `AI chose to ${isPlayerBatting ? 'bowl' : 'bat'} first.`;
        startGame(isPlayerBatting ? 'bowl' : 'bat');
    }
}

function startGame(choice) {
    gameStarted = true;
    isPlayerBatting = (choice === 'bat');
    document.getElementById("tossSection").style.display = 'none';
    document.getElementById("choiceSection").style.display = 'none';
    document.getElementById("gameSection").style.display = 'block';
    document.getElementById("result").innerText = `You are ${isPlayerBatting ? 'batting' : 'bowling'} first!`;
}

function play(playerRun) {
    if (!gameStarted || gameEnded) return;

    let resultMessage;
    const aiRun = getAIGuess();

    if (isPlayerBatting) {
        if (playerRun === aiRun) {
            resultMessage = `Out! You chose ${playerRun}, AI chose ${aiRun}.`;
            if (targetScore === -1) {
                targetScore = playerScore + 1;
                document.getElementById("targetScore").innerText = targetScore;
                isPlayerBatting = false;
                resultMessage += " Now AI is batting!";
            } else {
                gameEnded = true;
                if (playerScore >= computerScore) {
                    playerWins++;
                    resultMessage += " You win!";
                } else {
                    aiWins++;
                    resultMessage += " AI wins!";
                }
            }
        } else {
            if (playerRun === 0) {
                playerScore += aiRun;
                resultMessage = `You chose 0, AI chose ${aiRun}. You scored ${aiRun} runs.`;
            } else {
                playerScore += playerRun;
                resultMessage = `You chose ${playerRun}, AI chose ${aiRun}. You scored ${playerRun} runs.`;
            }
            if (targetScore !== -1 && playerScore >= targetScore) {
                gameEnded = true;
                playerWins++;
                resultMessage += " You win!";
            }
        }
    } else {
        if (playerRun === aiRun) {
            resultMessage = `AI is out! It chose ${aiRun} and you also chose ${playerRun}.`;
            if (targetScore === -1) {
                targetScore = computerScore + 1;
                document.getElementById("targetScore").innerText = targetScore;
                isPlayerBatting = true;
                resultMessage += " Now you are batting!";
            } else {
                gameEnded = true;
                if (computerScore >= playerScore) {
                    aiWins++;
                    resultMessage += " AI wins!";
                } else {
                    playerWins++;
                    resultMessage += " You win!";
                }
            }
        } else {
            if (aiRun === 0) {
                computerScore += playerRun;
                resultMessage = `AI chose 0. You scored ${playerRun} runs.`;
            } else {
                computerScore += aiRun;
                resultMessage = `AI chose ${aiRun}, you chose ${playerRun}. AI scored ${aiRun} runs.`;
            }
            if (targetScore !== -1 && computerScore >= targetScore) {
                gameEnded = true;
                aiWins++;
                resultMessage += " AI wins!";
            }
        }
    }

    document.getElementById("playerScore").textContent = playerScore;
    document.getElementById("computerScore").textContent = computerScore;
    document.getElementById("result").innerText = resultMessage;
    document.getElementById("playerWins").textContent = `Player Wins: ${playerWins}`;
    document.getElementById("aiWins").textContent = `AI Wins: ${aiWins}`;
}

function getAIGuess() {
    const aiRun = getRandomRun();
    if (playerScore > 20) {
        return Math.max(0, aiRun - 1);
    }
    return aiRun;
}

function newGame() {
    playerScore = 0;
    computerScore = 0;
    targetScore = -1;
    gameStarted = false;
    gameEnded = false;
    isPlayerBatting = true;
    tossChoice = '';

    document.getElementById("playerScore").textContent = 0;
    document.getElementById("computerScore").textContent = 0;
    document.getElementById("targetScore").textContent = "-";
    document.getElementById("tossResult").innerText = "";
    document.getElementById("result").innerText = "";
    document.getElementById("playerWins").textContent = `Player Wins: ${playerWins}`;
    document.getElementById("aiWins").textContent = `AI Wins: ${aiWins}`;

    document.getElementById("tossSection").style.display = 'block';
    document.getElementById("choiceSection").style.display = 'none';
    document.getElementById("gameSection").style.display = 'none';
}

document.addEventListener('keydown', function(event) {
    if (gameStarted && !gameEnded) {
        const run = parseInt(event.key);
        if (!isNaN(run) && run >= 0 && run <= 6) {
            play(run);
        }
    } else if (event.key === 'Enter' && gameEnded) {
        newGame();
    }
});
