Uruchamianie programu
Umieść dane wejściowe w pliku input.txt w katalogu głównym projektu. Plik powinien zawierać 6 linii, zgodnie z formatem:


Format danych wejściowych
```bash
<nazwa_drużyny_A>
<współczynnik_prędkości_drużyny_A>
<nazwa_drużyny_B>
<współczynnik_prędkości_drużyny_B>
<wielkość_planszy_x>
<wielkość_planszy_y>
Przykład zawartości input.txt:
```

Jeśli zainstalowałeś ts-node globalnie:

Skopiuj kod
```bash
ts-node src/Main.ts
```

Jeśli zainstalowałeś ts-node lokalnie:

Skopiuj kod
```bash
npx ts-node Main.ts
```
Program przetworzy dane wejściowe, wykona symulację i wyświetli wynik w terminalu.