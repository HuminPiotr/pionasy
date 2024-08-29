export interface GameInput {
    teamA: string;
    speedA: number;
    teamB: string;
    speedB: number;
    boardX: number;
    boardY: number;
  }
  
  export interface GameState {
    winner: string | null;
  }
  
  interface Figure {
    team: string;
    x: number;
    y: number;
    speed: number;
  }
  
  export function simulateGame(input: GameInput): GameState {
    const { teamA, speedA, teamB, speedB, boardX, boardY } = input;
  
    // Walidacja wejścia
    if (!isValidInput(input)) {
      return { winner: 'error' };
    }
  
    // Inicjalizacja figur
    let figures: Figure[] = [];
  
    for (let x = 0; x < boardX; x++) {
      figures.push({
        team: teamA,
        x,
        y: 0,
        speed: x % 2 === 0 ? speedA : Math.pow(2, speedA),
      });
      figures.push({
        team: teamB,
        x,
        y: boardY - 1,
        speed: (x % 2 === 0 ? speedB : Math.pow(2, speedB)) * -1,
      });
    }
  
    // Symulacja tur
    while (true) {
      // Przesuwanie figur
      figures = figures.map(f => ({
        ...f,
        y: f.y + f.speed,
      }));
  
      // Usuwanie figur, które wypadły poza planszę
      figures = figures.filter(f => f.y >= 0 && f.y < boardY);
  
      // Sprawdzanie kolizji
      const positions = new Map<string, Figure[]>();
  
      figures.forEach(f => {
        const key = `${f.x},${f.y}`;
        if (!positions.has(key)) {
          positions.set(key, []);
        }
        positions.get(key)!.push(f);
      });
      
      positions.forEach(figuresAtPosition => {
        if (figuresAtPosition.length > 1) {
          const minSpeed = Math.min(...figuresAtPosition.map(f => Math.abs(f.speed)));
          const survivors = figuresAtPosition.filter(f => Math.abs(f.speed) === minSpeed);
  
          if (survivors.length === 1) {
            figures = figures.filter(f => f !== survivors[0]);
          } else {
            figures = figures.filter(f => !figuresAtPosition.includes(f));
          }
        }
      });
  
      // Sprawdzenie warunku zakończenia gry
      const remainingTeams = new Set(figures.map(f => f.team));
  
      if (remainingTeams.size === 1) {
        return { winner: Array.from(remainingTeams)[0] };
      }
  
      if (remainingTeams.size === 0) {
        return { winner: null };
      }
    }
  }
  
  function isValidInput(input: GameInput): boolean {
    const { teamA, teamB, speedA, speedB, boardX, boardY } = input;
    const isValidName = (name: string) => /^[A-Za-z0-9]{1,10}$/.test(name);
  
    return (
      isValidName(teamA) &&
      isValidName(teamB) &&
      teamA !== teamB &&
      speedA >= 1 && speedA <= 3 &&
      speedB >= 1 && speedB <= 3 &&
      boardX >= 1 && boardX <= 1000 &&
      boardY >= 1 && boardY <= 1000
    );
  }
  