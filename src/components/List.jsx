import { useState, useEffect, useCallback } from "react";

function List({ settings, onRestart }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setApiError("");
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setScore(0);
    setFinished(false);

    const difficulties = [settings.difficulty, "easy"];

    for (let diff of difficulties) {
      try {
        const url = `https://opentdb.com/api.php?amount=5&category=${settings.category}&difficulty=${diff}&type=multiple`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.response_code === 0 && data.results.length > 0) {
          const formatted = data.results.map((q) => ({
            question: q.question,
            correctAnswer: q.correct_answer,
            answers: [...q.incorrect_answers, q.correct_answer].sort(
              () => Math.random() - 0.5
            ),
          }));

          setQuestions(formatted);
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    setApiError("No questions available for this category. Try another.");
    setLoading(false);
  }, [settings]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnswer) {
      setError("Please select an answer before submitting.");
      return;
    }
    setError("");

    const currentQ = questions[currentIndex];
    if (selectedAnswer === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer("");
    } else {
      setFinished(true);
    }
  };

  if (loading) return <p>Loading question...</p>;
  if (apiError) return <p style={{ color: "red" }}>{apiError}</p>;

  // Results Page
  if (finished) {
    return (
      <div>
        <h2>
          {settings.name}, you scored {score} / {questions.length}
        </h2>
        <button onClick={fetchQuestions}>Play Again (same settings)</button>
        <button onClick={onRestart}>Back to Selection</button>
      </div>
    );
  }

  // Question Page
  const currentQ = questions[currentIndex];
  return (
    <form onSubmit={handleSubmit}>
      <h3 dangerouslySetInnerHTML={{ __html: currentQ.question }} />
      {currentQ.answers.map((answer, index) => (
        <div key={index}>
          <label>
            <input
              type="radio"
              name="answer"
              value={answer}
              checked={selectedAnswer === answer}
              onChange={() => setSelectedAnswer(answer)}
            />
            <span dangerouslySetInnerHTML={{ __html: answer }} />
          </label>
        </div>
      ))}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <br />
      <button type="submit">
        {currentIndex + 1 === questions.length ? "Finish" : "Next"}
      </button>
    </form>
  );
}

export default List;
