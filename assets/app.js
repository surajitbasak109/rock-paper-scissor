class BasePlayer {
  constructor(game) {
    this.game = game;
    this.points = 0;
    this.choice = null;
    this.level = 1;
  }

  fillIndicator() {
    if (this.points < 1) return;
    for (let i = 1; i <= this.points; i++) {
      this.turnIndicatorsElement
        .querySelector(`.indicator-${i}`)
        ?.classList.add("fill");
    }
  }

  emptyIndicator() {
    for (let i = 1; i <= this.game.rounds; i++) {
      this.turnIndicatorsElement
        .querySelector(`.indicator-${i}`)
        .classList.remove("fill");
    }
  }

  reset() {
    this.points = 0;
    this.choice = null;
    this.emptyIndicator();
  }
}

class Player extends BasePlayer {
  constructor(game) {
    super(game);
    this.element = document.getElementById("player");
    this.turnIndicatorsElement = this.element.querySelector(".turn-indicators");
    this.choiceImage = document.querySelector("#player-choice img");
    this.levelTextElement = document.getElementById("player-level-text");

    this.game.drawIndicators(this.turnIndicatorsElement);
  }
}

class Computer extends BasePlayer {
  constructor(game) {
    super(game);
    this.element = document.getElementById("computer");
    this.choiceImage = document.querySelector("#player .choice-screen img");
    this.turnIndicatorsElement = this.element.querySelector(".turn-indicators");
    this.choiceImage = document.querySelector("#computer-choice img");
    this.levelTextElement = document.getElementById("computer-level-text");

    this.game.drawIndicators(this.turnIndicatorsElement);
  }
}

class Game {
  rounds = 10;
  constructor() {
    this.player = new Player(this);
    this.computer = new Computer(this);
    this.turns = this.rounds * 2;

    this.choices = ["rock", "paper", "scissor"];
    this.roundWinner = null;
    this.winner = null;

    this.resultTexElement = document.getElementById("result-text");
    this.turnElement = document.getElementById("turns");
    this.choiceButtonsSection = document.getElementById(
      "choice-buttons-section"
    );
    this.playNextSection = document.getElementById("play-next-section");
    this.nextLevelButton = document.getElementById("next-level-button");
    this.startOverButton = document.getElementById("start-over-button");

    this.addButtonEventListeners();
  }

  reset(isNextLevel = false) {
    this.winner = null;
    this.turns = this.rounds * 2;

    if (!isNextLevel) {
      this.computer.level = 1;
      this.player.level = 1;
    }

    this.player.reset();
    this.computer.reset();

    this.hideWinnerText();
    this.start();
  }

  addButtonEventListeners() {
    this.choices.forEach((choice) => {
      document.getElementById(choice).addEventListener("click", (event) => {
        this.handleButtonClick(choice);
      });
    });

    this.startOverButton.addEventListener("click", () => {
      this.reset();
    });

    this.nextLevelButton.addEventListener("click", () => {
      this.reset(true);
    });
  }

  start() {
    this.showTurns();
    this.showPlayerLevel();
  }

  showPlayerLevel() {
    this.player.levelTextElement.textContent = this.player.level;
    this.computer.levelTextElement.textContent = this.computer.level;
  }

  nextLevel() {
    this.reset();
  }

  showTurns() {
    this.turnElement.innerHTML = `<h3>${this.turns}</h3>`;
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

    setTimeout(() => {
      if (player == this.player) {
        player.choiceImage.classList.add("slide-left");
      } else {
        player.choiceImage.classList.add("slide-right");
      }
    }, 500);
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
    this.turns--;
    this.showTurns();
    this.disableButtons();
    this.player.choiceImage.classList.remove("slide-left");
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

    setTimeout(() => {
      this.enableButtons();
    }, 1500);

    this.checkWinner();
  }

  calculatePoint() {
    switch (this.player.choice) {
      case this.choices[0]:
        if (this.computer.choice === this.choices[1]) {
          this.computer.points += this.computer.level;
          this.roundWinner = this.computer;
        } else if (this.computer.choice === this.choices[2]) {
          this.player.points += this.player.level;
          this.roundWinner = this.player;
        }
        break;
      case this.choices[1]:
        if (this.computer.choice === this.choices[2]) {
          this.computer.points += this.computer.level;
          this.roundWinner = this.computer;
        } else if (this.computer.choice === this.choices[0]) {
          this.player.points += this.player.level;
          this.roundWinner = this.player;
        }
        break;
      case this.choices[2]:
        if (this.computer.choice === this.choices[0]) {
          this.computer.points += this.computer.level;
          this.roundWinner = this.computer;
        } else if (this.computer.choice === this.choices[1]) {
          this.player.points += this.player.level;
          this.roundWinner = this.player;
        }
        break;
      default:
        break;
    }

    setTimeout(() => {
      this.hideChoiceImage(
        this.roundWinner == this.player ? this.computer : this.player
      );
    }, 1500);

    this.computer.fillIndicator();
    this.player.fillIndicator();
  }

  checkWinner() {
    if (this.player.points >= this.rounds) {
      this.winner = this.player;
      this.player.level++;
    } else if (this.computer.points >= this.rounds) {
      this.winner = this.computer;
      this.computer.level++;
    }

    if (this.winner) {
      this.showWinnerText();
    }
  }

  hideWinnerText() {
    this.resultTexElement.innerHTML = "";
    this.resultTexElement.classList.add("hidden");
    this.enableButtons();
    this.choiceButtonsSection.classList.remove("hidden");
    this.playNextSection.classList.add("hidden");
    this.nextLevelButton.classList.remove("hidden");
  }

  showWinnerText() {
    const text = this.winner === this.player ? "You won" : "You lost";
    this.resultTexElement.innerHTML = `<h2>${text}</h2>`;
    this.resultTexElement.classList.remove("hidden");
    this.disableButtons();
    this.choiceButtonsSection.classList.add("hidden");
    this.playNextSection.classList.remove("hidden");

    if (this.computer.level > 9 || this.player.level > 9) {
      const dominatedText =
        this.computer.level > 9
          ? "You lost miserably"
          : "You dominated the opponent";
      this.resultTexElement.innerHTML = `<h2>${dominatedText}</h2>`;

      this.nextLevelButton.classList.add("hidden");
    }
  }
}

(function () {
  const game = new Game();
  game.start();
})();
