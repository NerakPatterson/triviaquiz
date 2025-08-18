import { useState } from 'react';
import Setup from './components/Setup';
import List from './components/List';
import './App.css';

function App() {
  const [settings, setSettings] = useState(null);

  const handleStart = (formData) => {
    setSettings(formData);
  };

  const handleRestart = () => {
    setSettings(null); // go back to setup form
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {!settings && <Setup onStart={handleStart} />}
      {settings && <List settings={settings} onRestart={handleRestart} />}
    </div>
  );
}

export default App;