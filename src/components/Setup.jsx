import { useState } from "react";

function Setup({ onStart }) {
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    difficulty: "easy",
  });

  const categories = [
    { id: 9, name: "General Knowledge" },
    { id: 11, name: "Film" },
    { id: 12, name: "Music" },
    { id: 15, name: "Video Games" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.category || !formData.difficulty) {
      alert("Please fill out all fields!");
      return;
    }
    onStart({ ...formData, category: Number(formData.category) });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Welcome to Trivia!</h1>
      <p>
        Fill out your name, pick a category, and choose a difficulty to start the quiz.
      </p>

      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </label>
      <br />

      <label>
        Category:
        <select name="category" value={formData.category} onChange={handleChange} required>
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      <br />

      <label>
        Difficulty:
        <select name="difficulty" value={formData.difficulty} onChange={handleChange} required>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </label>
      <br /><br />

      <button type="submit">Start Quiz</button>
    </form>
  );
}

export default Setup;
