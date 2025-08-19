import { useState, useEffect, useCallback } from "react";

function List({ settings }) {
  const [questions, setQuestions] = useState([]);   // all questions
  const [currentIndex, setCurrentIndex] = useState(0); // which question we’re on
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setApiError("");
    setQuestions([]);
    setCurrentIndex(0);
    setSelectedAnswer("");
    setResult(null);

    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=5&category=${settings.category}&difficulty=${settings.difficulty}&type=multiple`
      );
      const data = await response.json();

      if (data.response_code !== 0 || data.results.length === 0) {
        setApiError("No questions available. Try another category/difficulty.");
        setLoading(false);
        return;
      }

      const formatted = data.results.map((q) => {
        const answers = [...q.incorrect_answers, q.correct_answer].sort(
          () => Math.random() - 0.5
        );
        return {
          question: q.question,
          correctAnswer: q.correct_answer,
          answers,
        };
      });

      setQuestions(formatted);
    } catch (err) {
      console.error("API fetch failed:", err);
      setApiError("Failed to fetch questions. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [settings]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions, settings]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedAnswer) {
      setError("Please select an answer before submitting.");
      return;
    }
    setError("");

    const isCorrect = selectedAnswer === questions[currentIndex].correctAnswer;
    setResult({
      isCorrect,
      correctAnswer: questions[currentIndex].correctAnswer,
    });
  };

  const handleNext = () => {
    setResult(null);
    setSelectedAnswer("");

    if (currentIndex + 1 < questions.length) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setApiError("🎉 You’ve reached the end of the quiz!");
    }
  };

  if (loading) return <p>Loading question...</p>;
  if (apiError) return <p style={{ color: "red" }}>{apiError}</p>;

  const currentQuestion = questions[currentIndex];

  if (result) {
    return (
      <div>
        <h2>
          {settings.name}, {result.isCorrect ? "✅ Correct!" : "❌ Incorrect!"}
        </h2>
        {!result.isCorrect && (
          <p>
            The correct answer was:{" "}
            <span
              dangerouslySetInnerHTML={{ __html: result.correctAnswer }}
            />
          </p>
        )}
        <button onClick={handleNext}>Next Question</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />
      {currentQuestion.answers.map((answer, index) => (
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
      <button type="submit">Submit Answer</button>
    </form>
  );
}

export default List;
