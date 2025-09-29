const prompt = require('prompt');

// it starts the prompt
prompt.start();

console.log("Choose ROCK, PAPER, or SCISSORS:");

// Get s user input
prompt.get(['userSelection'], function (err, result) {
    if (err) {
        console.log("Error with prompt");
        return 1;
    }

    const userSelection = result.userSelection.trim().toUpperCase();

    // Generate computer selection based on Math.random()
    const randomNum = Math.random();
    let computerSelection;

    if (randomNum <= 0.34) {
        computerSelection = 'PAPER';
    } else if (randomNum <= 0.67) {
        computerSelection = 'SCISORS';
    } else {
        computerSelection = 'ROCK';
    }

    // Display selections of both user and the computer
    console.log("User selected:", userSelection);
    console.log("Computer selected:", computerSelection);

    // Decide outcome using if-else statements (decision control structure)
    let outcome;
    if (userSelection === computerSelection) {
        outcome = "It's a tie";
    } else if (
        (userSelection === 'ROCK' && computerSelection === 'SCISSORS') ||
        (userSelection === 'PAPER' && computerSelection === 'ROCK') ||
        (userSelection === 'SCISSORS' && computerSelection === 'PAPER')
    ) {
        outcome = "User Wins";
    } else if (
        (userSelection === 'ROCK' && computerSelection === 'PAPER') ||
        (userSelection === 'PAPER' && computerSelection === 'SCISSORS') ||
        (userSelection === 'SCISSORS' && computerSelection === 'ROCK')
    ) {
        outcome = "Computer Wins";
    } else {
        outcome = "Invalid selection/input. Please choose ROCK, PAPER, or SCISSORS.";
    }

    // Display the outcome
    console.log(outcome);
});
