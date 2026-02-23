import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchKanjiLevel } from "../data/api";
import { Home, RefreshCw, ChevronRight } from "lucide-react";

const LevelTest = () => {
  const { level } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchKanjiLevel(level).then(setDeck);
  }, [level]);

  // Generate 4 options (1 correct, 3 wrong from other kanji or random)
  const generateOptions = () => {
    if (!deck || deck.length === 0) return [];
    const current = deck[currentQuestionIdx];
    const allMeanings = deck.flatMap((k) => k.meanings[0]);
    const otherMeanings = allMeanings.filter((m) => m !== current.meanings[0]);
    const shuffledOthers = otherMeanings
      .sort(() => 0.5 - Math.random())
      .slice(0, 3);
    const options = [...shuffledOthers, current.meanings[0]];
    return options.sort(() => 0.5 - Math.random());
  };

  // Effect to regenerate options when question changes
  useEffect(() => {
    setOptions(generateOptions());
    // eslint-disable-next-line
  }, [currentQuestionIdx, deck]);

  if (!deck) {
    return (
      <div
        style={{
          padding: "40px",
          textAlign: "center",
          color: "var(--text-secondary)",
        }}
      >
        Loading Kanji data...
      </div>
    );
  }

  if (!deck.length) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h2>Level {level} not found or empty</h2>
        <button className="glass-button" onClick={() => navigate("/")}>
          Back Home
        </button>
      </div>
    );
  }

  const currentKanji = deck[currentQuestionIdx];

  const handleSelect = (option) => {
    if (selectedOption !== null) return;
    setSelectedOption(option);
    if (option === currentKanji.meanings[0]) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < deck.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedOption(null);
    } else {
      setShowResult(true);
    }
  };

  const resetTest = () => {
    setCurrentQuestionIdx(0);
    setScore(0);
    setShowResult(false);
    setSelectedOption(null);
  };

  if (showResult) {
    return (
      <div
        className="animate-fade-in"
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100dvh",
          padding:
            "max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom))",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: "40px",
            textAlign: "center",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <h2
            className="text-gradient"
            style={{ fontSize: "2.5rem", marginBottom: "16px" }}
          >
            Test Complete!
          </h2>
          <div
            style={{
              fontSize: "4rem",
              fontWeight: 800,
              margin: "24px 0",
              textShadow: "0 0 20px rgba(6, 214, 160, 0.4)",
            }}
          >
            {score} / {deck.length}
          </div>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.2rem",
              marginBottom: "32px",
            }}
          >
            {score === deck.length
              ? "Perfect! You're a Kanji Master!"
              : "Keep practicing, you'll get it next time!"}
          </p>
          <div
            style={{ display: "flex", gap: "16px", justifyContent: "center" }}
          >
            <button className="glass-button" onClick={resetTest}>
              <RefreshCw size={20} /> Retake
            </button>
            <button
              className="glass-button primary"
              onClick={() => navigate("/")}
            >
              <Home size={20} /> Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in"
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        minHeight: "100dvh",
        padding:
          "max(24px, env(safe-area-inset-top)) 24px max(24px, env(safe-area-inset-bottom))",
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "40px",
        }}
      >
        <button className="glass-button" onClick={() => navigate("/")}>
          <Home size={20} /> Home
        </button>
        <div
          className="text-gradient"
          style={{ fontSize: "1.5rem", fontWeight: 700 }}
        >
          {level} Test Mode
        </div>
        <div
          style={{
            fontSize: "1.2rem",
            fontWeight: 600,
            color: "var(--text-secondary)",
          }}
        >
          {currentQuestionIdx + 1} / {deck.length}
        </div>
      </header>

      <main
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          className="glass-panel"
          style={{
            padding: "24px",
            textAlign: "center",
            maxWidth: "500px",
            width: "100%",
          }}
        >
          <div
            style={{
              fontSize: "1rem",
              color: "var(--text-secondary)",
              marginBottom: "16px",
            }}
          >
            What is the meaning of this Kanji?
          </div>
          <div
            style={{
              fontSize: "64px",
              fontWeight: 800,
              margin: "16px 0",
              color: "var(--text-primary)",
              textShadow: "0 0 20px rgba(157, 78, 221, 0.4)",
            }}
          >
            {currentKanji.character}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginTop: "24px",
            }}
          >
            {options.map((opt, idx) => {
              let bg = "rgba(255, 255, 255, 0.05)";
              let border = "1px solid var(--card-border)";
              if (selectedOption !== null) {
                if (opt === currentKanji.meanings[0]) {
                  bg = "rgba(6, 214, 160, 0.2)"; // Correct green
                  border = "1px solid var(--status-learned)";
                } else if (opt === selectedOption) {
                  bg = "rgba(239, 71, 111, 0.2)"; // Wrong red
                  border = "1px solid var(--status-hard)";
                }
              }

              return (
                <button
                  key={idx}
                  disabled={selectedOption !== null}
                  onClick={() => handleSelect(opt)}
                  style={{
                    background: bg,
                    border: border,
                    padding: "12px 16px",
                    borderRadius: "12px",
                    color: "var(--text-primary)",
                    fontFamily: "var(--font-main)",
                    fontSize: "1.1rem",
                    cursor: selectedOption === null ? "pointer" : "default",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseOver={(e) => {
                    if (selectedOption === null) {
                      e.currentTarget.style.background =
                        "rgba(255, 255, 255, 0.1)";
                      e.currentTarget.style.transform = "translateY(-2px)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedOption === null) {
                      e.currentTarget.style.background = bg;
                      e.currentTarget.style.transform = "translateY(0)";
                    }
                  }}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {selectedOption !== null && (
            <button
              className="glass-button primary animate-slide-up"
              style={{ width: "100%", marginTop: "24px", padding: "16px" }}
              onClick={handleNext}
            >
              Continue <ChevronRight size={20} />
            </button>
          )}
        </div>
      </main>
    </div>
  );
};

export default LevelTest;
