import { useState } from 'react';

export default function FeedbackForm() {
  const [name, setName] = useState('');

  function handleClick() {
    const newName = prompt('What is your name?');
    if (newName) {
      setName(newName);
      alert(`Hello, ${newName}!`);
    }
  }

  return (
    <button onClick={handleClick}>
      Greet
    </button>
  );
}
