Uruchamianie programu

Umieść dane wejściowe w pliku src/input.txt. Plik powinien zawierać 6 linii, zgodnie z formatem:


Format danych wejściowych:
```bash
<nazwa_drużyny_A>
<współczynnik_prędkości_drużyny_A>
<nazwa_drużyny_B>
<współczynnik_prędkości_drużyny_B>
<wielkość_planszy_x>
<wielkość_planszy_y>
```
Zainstaluj zależności:

```bash
npm i
```

Uruchom program:

Skopiuj kod
```bash
npx ts-node src/Main.ts
```

lub jeśli masz zainstalowany ts-node globalnie możesz użyć:
```bash
ts-node src/Main.ts
```

Program przetworzy dane wejściowe, wykona symulację i wyświetli wynik w terminalu.