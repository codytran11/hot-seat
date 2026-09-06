import { useEffect, useState } from "react";
import { prompts } from "./data/prompts";
import "./App.css";

const INITIAL_PROMPT = "Draw a topic";

const categoryIcons = {
  General: "🔥",
  NBA: "🏀",
  NFL: "🏈",
  MLB: "⚾",
  NHL: "🏒",
  Soccer: "⚽",
  "College Sports": "🎓",
};

function App() {
  const [category, setCategory] = useState("General");
  const [currentPrompt, setCurrentPrompt] = useState(INITIAL_PROMPT);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [isTimerOpen, setIsTimerOpen] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);

  useEffect(() => {
    if (!isRunning) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((previousTime) => {
        if (previousTime <= 1) {
          setIsRunning(false);
          return 0;
        }

        return previousTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning]);

  function getAvailablePrompts() {
    if (category === "General") {
      return prompts.General;
    }

    return [...prompts.General, ...prompts[category]];
  }

  function getRandomPrompt(promptList, promptToAvoid) {
    const filteredPrompts = promptList.filter(
      (prompt) => prompt !== promptToAvoid,
    );

    const listToUse = filteredPrompts.length > 0 ? filteredPrompts : promptList;
    const randomIndex = Math.floor(Math.random() * listToUse.length);

    return listToUse[randomIndex];
  }

  function spinPrompt() {
    if (isSpinning) {
      return;
    }

    const availablePrompts = getAvailablePrompts();
    const previousFinalPrompt = currentPrompt;
    const totalChanges = 18;

    setIsSpinning(true);

    function changePrompt(changeNumber) {
      const isFinalChange = changeNumber === totalChanges;

      const nextPrompt = getRandomPrompt(
        availablePrompts,
        isFinalChange ? previousFinalPrompt : null,
      );

      setCurrentPrompt(nextPrompt);

      if (!isFinalChange) {
        const nextDelay = 45 + changeNumber * 12;

        setTimeout(() => {
          changePrompt(changeNumber + 1);
        }, nextDelay);
      } else {
        setIsSpinning(false);
      }
    }

    changePrompt(1);
  }

  function changeCategory(categoryName) {
    if (isSpinning) {
      return;
    }

    setCategory(categoryName);
    setCurrentPrompt(INITIAL_PROMPT);
    setTimeLeft(60);
    setIsRunning(false);
  }

  function startTimer() {
    setTimeLeft(60);
    setIsTimerOpen(true);
    setIsRunning(true);
  }

  function closeTimer() {
    setIsTimerOpen(false);
    setIsRunning(false);
    setTimeLeft(60);
  }

  function playAgain() {
    setIsTimerOpen(false);
    setIsRunning(false);
    setTimeLeft(60);

    spinPrompt();
  }

  if (isTimerOpen) {
    return (
      <main className="timer-screen">
        <header className="timer-header">
          <span>SHOTCLOCK</span>

          <span>
            {categoryIcons[category]} {category.toUpperCase()}
          </span>
        </header>

        <section className="timer-content">
          <p className="shot-clock-label">SHOT CLOCK</p>

          <div
            className={
              timeLeft <= 10 ? "shot-clock shot-clock-warning" : "shot-clock"
            }
            aria-live="polite"
            aria-label={`${timeLeft} seconds remaining`}
          >
            {timeLeft}
          </div>

          <p className="timer-prompt">{currentPrompt}</p>

          <p className="speak-text">
            {timeLeft === 0 ? "TIME." : "STAND YOUR GROUND."}
          </p>

          {timeLeft === 0 ? (
            <button className="play-again-button" onClick={playAgain}>
              Play Again
            </button>
          ) : (
            <button className="end-round-button" onClick={closeTimer}>
              End Round
            </button>
          )}
        </section>
      </main>
    );
  }

  return (
    <main className="home-screen">
      <header className="site-header">
        <div>
          <h1>
            Shot <span>Clock</span>
          </h1>

          <p className="tagline">
            One topic. Sixty seconds. Stand your ground.
          </p>
        </div>

        <p className="credit">
          Based on{" "}
          <a href="https://unprompted.cool" target="_blank" rel="noreferrer">
            Unprompted.cool
          </a>
        </p>
      </header>

      <section className="game-area" aria-label="ShotClock sports debate game">
        <nav className="category-list" aria-label="Choose a sports category">
          {Object.keys(prompts).map((categoryName) => (
            <button
              key={categoryName}
              className={
                category === categoryName
                  ? "category-button active"
                  : "category-button"
              }
              onClick={() => changeCategory(categoryName)}
              disabled={isSpinning}
              aria-pressed={category === categoryName}
            >
              <span className="category-icon" aria-hidden="true">
                {categoryIcons[categoryName]}
              </span>

              <span>{categoryName}</span>
            </button>
          ))}
        </nav>

        <p className="prompt-guide">
          Explain the topic—or make the case for a player, team, or moment that
          embodies it.
        </p>

        <div className="prompt-window" aria-live="polite">
          <h2 className={isSpinning ? "prompt-text spinning" : "prompt-text"}>
            {currentPrompt}
          </h2>
        </div>

        <div className="controls">
          <button
            className="draw-button"
            onClick={spinPrompt}
            disabled={isSpinning}
          >
            {isSpinning ? "Drawing..." : "Draw Topic"}
          </button>

          <button
            className="start-button"
            onClick={startTimer}
            disabled={currentPrompt === INITIAL_PROMPT || isSpinning}
          >
            Start Clock
          </button>
        </div>

        <p className="seo-description">
          ShotClock is a free 60-second sports debate game featuring random NBA,
          NFL, MLB, NHL, soccer, and college sports topics.
        </p>
      </section>
    </main>
  );
}

export default App;
