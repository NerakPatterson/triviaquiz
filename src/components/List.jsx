import { useState, useEffect, useCallback } from "react";

function List({ settings }) {
  const [questionData, setQuestionData] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [error, setError] = useState("");
  const [apiError, setApiError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchQuestions = useCallback(async () => {
    setLoading(true);
    setApiError("");
    setQuestionData(null);
    setSelectedAnswer("");
    setResult(null);

    const difficulties = [settings.difficulty, "easy"];

    for (let diff of difficulties) {
      try {
        const url = `https://opentdb.com/api.php?amount=10&category=${settings.category}&difficulty=${diff}&type=multiple`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.response_code === 0 && data.results.length > 0) {
          const q = data.results[0]; // pick first question
          const answers = [...q.incorrect_answers, q.correct_answer].sort(() => Math.random() - 0.5);

          setQuestionData({
            question: q.question,
            correctAnswer: q.correct_answer,
            answers,
          });
          setLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
      }
    }

    // If both attempts fail
    setApiError("No questions available for this category. Try another.");
    setLoading(false);
  });

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

    const isCorrect = selectedAnswer === questionData.correctAnswer;
    setResult({
      isCorrect,
      correctAnswer: questionData.correctAnswer,
    });
  };

  const handleRestart = () => {
    fetchQuestions();
  };

  if (loading) return <p>Loading question...</p>;
  if (apiError) return <p style={{ color: "red" }}>{apiError}</p>;

  if (result) {
    return (
      <div>
        <h2>
          {settings.name}, {result.isCorrect ? "✅ Correct!" : "❌ Incorrect!"}
        </h2>
        {!result.isCorrect && (
          <p>
            The correct answer was:{" "}
            <span dangerouslySetInnerHTML={{ __html: result.correctAnswer }} />
          </p>
        )}
        <button onClick={handleRestart}>Next Question</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h3 dangerouslySetInnerHTML={{ __html: questionData.question }} />
      {questionData.answers.map((answer, index) => (
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
