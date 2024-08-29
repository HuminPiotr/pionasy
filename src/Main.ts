const fs = require('fs');

// Definicje typów
type Team = {
  name: string;
  speedFactor: number;
  pieces: Piece[];
};

type Piece = {
  x: number;
  y: number;
  speed: number;
};

// Funkcja walidująca dane wejściowe
function validateInput(data: string[]): [Team, Team, number, number] | null {
  const [teamAName, teamASpeedStr, teamBName, teamBSpeedStr, boardWidthStr, boardHeightStr] = data;

  const teamANameValid = /^[A-Za-z0-9]{1,10}$/.test(teamAName);
  const teamBNameValid = /^[A-Za-z0-9]{1,10}$/.test(teamBName);
  if (!teamANameValid || !teamBNameValid || teamAName === teamBName) return null;

  const teamASpeed = parseInt(teamASpeedStr, 10);
  const teamBSpeed = parseInt(teamBSpeedStr, 10);
  const boardWidth = parseInt(boardWidthStr, 10);
  const boardHeight = parseInt(boardHeightStr, 10);

  if (
    isNaN(teamASpeed) || isNaN(teamBSpeed) ||
    isNaN(boardWidth) || isNaN(boardHeight) ||
    teamASpeed < 1 || teamASpeed > 3 ||
    teamBSpeed < 1 || teamBSpeed > 3 ||
    boardWidth < 1 || boardWidth > 1000 ||
    boardHeight < 1 || boardHeight > 1000
  ) {
    return null;
  }

  const teamA: Team = {
    name: teamAName,
    speedFactor: teamASpeed,
    pieces: []
  };

  const teamB: Team = {
    name: teamBName,
    speedFactor: teamBSpeed,
    pieces: []
  };

  // Inicjalizacja figur
  for (let x = 0; x < boardWidth; x++) {
    const teamASpeedCalculated = x % 2 === 0 ? teamASpeed : Math.pow(2, teamASpeed);
    teamA.pieces.push({ x, y: boardHeight - 1, speed: -teamASpeedCalculated });

    const teamBSpeedCalculated = x % 2 === 0 ? teamBSpeed : Math.pow(2, teamBSpeed);
    teamB.pieces.push({ x, y: 0, speed: teamBSpeedCalculated });
  }

  return [teamA, teamB, boardWidth, boardHeight];
}

// Funkcja obsługująca kolizje
function resolveCollisions(pieces: Piece[]): Piece[] {
  const positions = new Map<string, Piece[]>();

  pieces.forEach(f => {
    const key = `${f.x},${f.y}`;
    if (!positions.has(key)) {
      positions.set(key, []);
    }
    positions.get(key)!.push(f);
  });

  const survivingPieces: Piece[] = [];

  positions.forEach(figuresAtPosition => {
    if (figuresAtPosition.length > 1) {
      const minSpeed = Math.min(...figuresAtPosition.map(f => Math.abs(f.speed)));
      const survivors = figuresAtPosition.filter(f => Math.abs(f.speed) === minSpeed);

      if (survivors.length === 1) {
        survivingPieces.push(...survivors);
      }
    } else {
      survivingPieces.push(figuresAtPosition[0]);
    }
  });

  return survivingPieces;
}

// Funkcja symulująca ruchy i kolizje
function runSimulation(teamA: Team, teamB: Team, boardWidth: number, boardHeight: number): string {
  while (teamA.pieces.length > 0 && teamB.pieces.length > 0) {
    teamA.pieces = teamA.pieces
      .map(piece => piece.y + piece.speed >= 0 && piece.y + piece.speed < boardHeight ? { ...piece, y: piece.y + piece.speed } : null)
      .filter(piece => piece !== null) as Piece[];

    teamB.pieces = teamB.pieces
      .map(piece => piece.y + piece.speed >= 0 && piece.y + piece.speed < boardHeight ? { ...piece, y: piece.y + piece.speed } : null)
      .filter(piece => piece !== null) as Piece[];

    const allPieces = [...teamA.pieces, ...teamB.pieces];
    const survivingPieces = resolveCollisions(allPieces);

    teamA.pieces = survivingPieces.filter(piece => teamA.pieces.includes(piece));
    teamB.pieces = survivingPieces.filter(piece => teamB.pieces.includes(piece));
  }

  if (teamA.pieces.length > 0) {
    return teamA.name;
  } else if (teamB.pieces.length > 0) {
    return teamB.name;
  } else {
    return 'remis';
  }
}

// Główna funkcja programu
function main() {
  const inputFile = 'src/input.txt';

  try {
    const inputData = fs.readFileSync(inputFile, 'utf-8').trim().split('\n');
    if (inputData.length !== 6) {
      console.log('error');
      return;
    }

    const validatedInput = validateInput(inputData);

    if (!validatedInput) {
      console.log('error');
      return;
    }

    const [teamA, teamB, boardWidth, boardHeight] = validatedInput;
    const result = runSimulation(teamA, teamB, boardWidth, boardHeight);
    console.log(result);
  } catch (error) {
    console.log('error');
  }
}

// Uruchomienie programu
main();
