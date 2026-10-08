# AutoTaxa — Landing + Downsell

Site estático (sem build). Suba para o GitHub e importe o repositório na Vercel (Framework: Other).

## Onde colocar os ficheiros

```
favicon.png                    ← na raiz, ao lado do index.html
assets/
  vsl.mp4                      ← vídeo 9:16
  provas/
    prova-1.png ... prova-5.png  ← prints do WhatsApp (ordem de aparição)
  planilha/
    planilha-laptop.png
    planilha-browser.png
    planilha-mobile.png
```

Renomeie os seus ficheiros para estes nomes (ou altere o `src` no HTML).

## Páginas
- `/`           → landing com VSL (index.html)
- `/downsell`   → oferta Essencial 6.997 Kz (downsell.html)
- `/termos` e `/privacidade` → páginas legais (preencher campos a amarelo)

## Ajustes rápidos
- Minuto de desbloqueio: `UNLOCK_AT` em `main.js` (203 = 3:23).
- Ligar o downsell: no OkandaPay, configure a página de recusa/abandono para `https://SEU-DOMINIO/downsell`.
