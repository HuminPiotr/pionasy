import { NextRequest, NextResponse } from 'next/server';

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

function validateInput(data: any): [Team, Team, number, number] | null {
  const { teamA, teamASpeed, teamB, teamBSpeed, boardWidth, boardHeight } = data;

  const teamANameValid = /^[A-Za-z0-9]{1,10}$/.test(teamA);
  const teamBNameValid = /^[A-Za-z0-9]{1,10}$/.test(teamB);
  if (!teamANameValid || !teamBNameValid || teamA === teamB) return null;

  const teamASpeedInt = parseInt(teamASpeed, 10);
  const teamBSpeedInt = parseInt(teamBSpeed, 10);
  const boardWidthInt = parseInt(boardWidth, 10);
  const boardHeightInt = parseInt(boardHeight, 10);

  if (
    isNaN(teamASpeedInt) || isNaN(teamBSpeedInt) ||
    isNaN(boardWidthInt) || isNaN(boardHeightInt) ||
    teamASpeedInt < 1 || teamASpeedInt > 3 ||
    teamBSpeedInt < 1 || teamBSpeedInt > 3 ||
    boardWidthInt < 1 || boardWidthInt > 1000 ||
    boardHeightInt < 1 || boardHeightInt > 1000
  ) {
    return null;
  }

  const teamAObj: Team = {
    name: teamA,
    speedFactor: teamASpeedInt,
    pieces: []
  };

  const teamBObj: Team = {
    name: teamB,
    speedFactor: teamBSpeedInt,
    pieces: []
  };

  // Ustawianie pionków
  for (let x = 0; x < boardWidthInt; x++) {
    const teamASpeed = x % 2 === 0 ? teamASpeedInt : Math.pow(2, teamASpeedInt);
    teamAObj.pieces.push({ x, y: boardHeightInt - 1, speed: -teamASpeed });

    const teamBSpeed = x % 2 === 0 ? teamBSpeedInt : Math.pow(2, teamBSpeedInt);
    teamBObj.pieces.push({ x, y: 0, speed: teamBSpeed });
  }

  return [teamAObj, teamBObj, boardWidthInt, boardHeightInt];
}

function resolveCollisions(pieces: Piece[]): Piece[] {
  const positions = new Map<string, Piece[]>();

  for (const piece of pieces) {
    const key = `${piece.x},${piece.y}`;
    if (!positions.has(key)) {
      positions.set(key, []);
    }
    positions.get(key)!.push(piece);
  }

  const survivingPieces: Piece[] = [];

  for (const [position, collidingPieces] of Array.from(positions.entries())) {
    // Jeśli na pozycji jest tylko jeden pionek, automatycznie przeżywa
    if (collidingPieces.length === 1) {
      survivingPieces.push(collidingPieces[0]);
    // Jeśli na pozycji jest więcej pionków, sortujemy je według wartości bezwzględnej prędkości
    // Jęsli pionek o najmniejszej prędkości ma inn prędkość niż kolejny w kolejności, przeżywa
    } else {
      collidingPieces.sort((a: Piece, b: Piece) => Math.abs(a.speed) - Math.abs(b.speed));
      if (Math.abs(collidingPieces[0].speed) !== Math.abs(collidingPieces[1].speed)) {
        survivingPieces.push(collidingPieces[0]);
      }
    }
  }

  return survivingPieces;
}

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

export async function POST(request: NextRequest) {
  const body = await request.json();

  const validatedInput = validateInput(body);

  if (!validatedInput) {
    return NextResponse.json({ result: 'error' }, { status: 400 });
  }

  const [teamA, teamB, boardWidth, boardHeight] = validatedInput;
  const result = runSimulation(teamA, teamB, boardWidth, boardHeight);

  return NextResponse.json({ result });
}
