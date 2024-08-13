class Player {
  constructor(game) {
    this.game = game;
    this.points = 0;
    this.choice = null;
    this.element = document.getElementById("player");
    this.turnIndicatorsElement = this.element.querySelector(".turn-indicators");
    this.choiceImage = this.element.querySelector(".choice-screen img");

    this.game.drawIndicators(this.turnIndicatorsElement);
  }

  fillIndicator() {
    if (this.points < 1) return;
    for (let i = 1; i <= this.points; i++) {
      this.turnIndicatorsElement
        .querySelector(`.indicator-${i}`)
        .classList.add("fill");
    }
  }
}

class Computer {
  constructor(game) {
    this.game = game;
    this.points = 0;
    this.choice = null;
    this.element = document.getElementById("computer");
    this.choiceImage = document.querySelector("#player .choice-screen img");
    this.turnIndicatorsElement = this.element.querySelector(".turn-indicators");
    this.choiceImage = this.element.querySelector(".choice-screen img");

    this.game.drawIndicators(this.turnIndicatorsElement);
  }

  fillIndicator() {
    if (this.points < 1) return;
    for (let i = 1; i <= this.points; i++) {
      this.turnIndicatorsElement
        .querySelector(`.indicator-${i}`)
        .classList.add("fill");
    }
  }
}

class Game {
  rounds = 10;
  constructor() {
    this.player = new Player(this);
    this.computer = new Computer(this);

    this.choices = ["rock", "paper", "scissor"];
    this.winner = null;
    this.resultTexElement = document.getElementById("result-text");
  }

  start() {
    this.choices.forEach((choice) => {
      document.getElementById(choice).addEventListener("click", (event) => {
        this.handleButtonClick(choice);
      });
    });
  }

  enableButtons() {
    this.choices.forEach((choice) => {
      document.getElementById(choice).removeAttribute("disabled");
    });
  }

  disableButtons() {
    this.choices.forEach((choice) => {
      document.getElementById(choice).setAttribute("disabled", "true");
    });
  }

  setChoiceImage(player, choice) {
    player.choiceImage.src = `./assets/images/${choice}.png`;
    player.choiceImage.classList.remove("hidden");
  }

  hideChoiceImage(player) {
    player.choiceImage.classList.add("hidden");
  }

  drawIndicators(turnIndicatorsElement) {
    for (let i = 1; i <= this.rounds; i++) {
      const indicator = document.createElement("div");
      indicator.classList.add("indicator");
      indicator.classList.add(`indicator-${i}`);
      turnIndicatorsElement.append(indicator);
    }
  }

  handleButtonClick(choice) {
    this.disableButtons();
    this.hideChoiceImage(this.computer);
    this.player.choice = choice;
    this.setChoiceImage(this.player, choice);
    setTimeout(() => {
      this.decideComputerChoice();
    }, 1000);
  }

  decideComputerChoice() {
    const remainingChoices = this.choices.filter(
      (choice) => choice !== this.player.choice
    );

    this.computer.choice =
      remainingChoices[Math.floor(Math.random() * remainingChoices.length)];

    this.setChoiceImage(this.computer, this.computer.choice);

    this.calculatePoint();
    this.enableButtons();

    this.checkWinner();
  }

  calculatePoint() {
    switch (this.player.choice) {
      case this.choices[0]:
        if (this.computer.choice === this.choices[1]) this.computer.points += 1;
        else if (this.computer.choice === this.choices[2])
          this.player.points += 1;
        break;
      case this.choices[1]:
        if (this.computer.choice === this.choices[2]) this.computer.points += 1;
        else if (this.computer.choice === this.choices[0])
          this.player.points += 1;
        break;
      case this.choices[2]:
        if (this.computer.choice === this.choices[0]) this.computer.points += 1;
        else if (this.computer.choice === this.choices[1])
          this.player.points += 1;
        break;
      default:
        break;
    }

    this.computer.fillIndicator();
    this.player.fillIndicator();
  }

  checkWinner() {
    if (this.player.points === this.rounds) {
      this.winner = this.player;
    } else if (this.computer.points === this.rounds) {
      this.winner = this.computer;
    }

    if (this.winner) {
      this.showWinnerText();
    }
  }

  showWinnerText() {
    const text = this.winner === this.player ? "You won" : "You lost";
    this.resultTexElement.innerHTML = `<h2>${text}</h2>`;
    this.resultTexElement.classList.remove("hidden");
    this.disableButtons();
  }
}

(function () {
  const game = new Game();
  game.start();
})();
