'use client'

import { useState } from 'react';

export default function Home() {
  const [teamA, setTeamA] = useState('');
  const [teamASpeed, setTeamASpeed] = useState('');
  const [teamB, setTeamB] = useState('');
  const [teamBSpeed, setTeamBSpeed] = useState('');
  const [boardWidth, setBoardWidth] = useState('');
  const [boardHeight, setBoardHeight] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch('/api/simulation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        teamA,
        teamASpeed,
        teamB,
        teamBSpeed,
        boardWidth,
        boardHeight,
      }),
    });

    const data = await response.json();
    setResult(data.result);
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Symulacja Gry</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Team A: </label>
          <input
            type="text"
            value={teamA}
            onChange={(e) => setTeamA(e.target.value)}
            required
            className="border p-2 text-black"
          />
        </div>
        <div>
          <label>Prędkość Team A: </label>
          <input
            type="number"
            value={teamASpeed}
            onChange={(e) => setTeamASpeed(e.target.value)}
            required
            className="border p-2 text-black"
          />
        </div>
        <div>
          <label>Team B: </label>
          <input
            type="text"
            value={teamB}
            onChange={(e) => setTeamB(e.target.value)}
            required
            className="border p-2 text-black"
          />
        </div>
        <div>
          <label>Prędkość Team B: </label>
          <input
            type="number"
            value={teamBSpeed}
            onChange={(e) => setTeamBSpeed(e.target.value)}
            required
            className="border p-2 text-black"
          />
        </div>
        <div>
          <label>Rozmiar Planszy X: </label>
          <input
            type="number"
            value={boardWidth}
            onChange={(e) => setBoardWidth(e.target.value)}
            required
            className="border p-2 text-black"
          />
        </div>
        <div>
          <label>Rozmiar Planszy Y: </label>
          <input
            type="number"
            value={boardHeight}
            onChange={(e) => setBoardHeight(e.target.value)}
            required
            className="border p-2 text-black"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Symuluj</button>
      </form>

      {result && (
        <div className="mt-5">
          <h2 className="text-2xl font-bold">Wynik:</h2>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
}
