set -e
# шрифты внутрь приложения (чтобы вид не менялся без интернета)
mkdir -p www/fonts
for p in manrope noto-sans-arabic; do
  cp -r node_modules/@fontsource-variable/$p/files www/fonts/$p-files
  sed "s#./files/#./$p-files/#g; s/Manrope Variable/Manrope/g; s/Noto Sans Arabic Variable/Noto Sans Arabic/g" node_modules/@fontsource-variable/$p/index.css > www/fonts/$p.css
done
sed -i.bak 's#</head>#<link rel="stylesheet" href="fonts/manrope.css"><link rel="stylesheet" href="fonts/noto-sans-arabic.css"></head>#' www/index.html
ls www/fonts | head
rm -f www/index.html.bak
