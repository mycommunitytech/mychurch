# Шрифти для картинок соцмереж

Тут лежать статичні зрізи, які читає satori (`next/og`) — сам він не вміє
ні woff2 з `next/font`, ні варіативні осі. Файли зібрані скриптом
[`brand/ogfonts.py`](../../../brand/ogfonts.py), руками їх не правлять.

| Файл | Звідки | Де на картці |
|---|---|---|
| `Manrope-ExtraBold.ttf` | `brand/fonts/Manrope[wght].ttf`, вага 800 | «Моя Церква» — як у хедері |
| `Inter-SemiBold.ttf` | Inter із `next/font`, вага 600 | заголовки (`font-semibold` героя) |
| `Inter-Regular.ttf` | Inter із `next/font`, вага 400 | текст під заголовками |

Обидві гарнітури — SIL Open Font License 1.1. Повний текст ліцензії
Manrope лежить поруч (`Manrope-OFL.txt`); Inter роздається Google Fonts
під тією ж ліцензією і потрапляє сюди з того самого файлу, який
`next/font` завантажує для сайту.

## Шрифт логотипа на сайті

`manrope-brand-800.woff2` — не для картинок, а для самого сайту: Manrope
800, у якому лишились тільки літери «Моя Церква My Church» (~2 КБ замість
~38 КБ повного шрифту з Google). Підключений у `src/app/layout.tsx`,
збирається скриптом [`brand/logofont.py`](../../../brand/logofont.py).
