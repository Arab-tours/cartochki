set -e
# собирает www для приложения «Уд» из папки oud/ и кладёт шрифты внутрь (работа без интернета)
rm -rf www && mkdir -p www && cp -r ../oud/index.html ../oud/manifest.webmanifest ../oud/icon-*.png ../oud/snd www/
mkdir -p www/fonts
for p in manrope noto-sans-arabic; do
  cp -r node_modules/@fontsource-variable/$p/files www/fonts/$p-files
  sed "s#./files/#./$p-files/#g; s/Manrope Variable/Manrope/g; s/Noto Sans Arabic Variable/Noto Sans Arabic/g" node_modules/@fontsource-variable/$p/index.css > www/fonts/$p.css
done
sed -i.bak 's#</head>#<link rel="stylesheet" href="fonts/manrope.css"><link rel="stylesheet" href="fonts/noto-sans-arabic.css"></head>#' www/index.html && rm -f www/index.html.bak
node -e 'const s=require("fs").readFileSync("www/index.html","utf8");const m=s.match(/<script type="text\/plain" id="app">([\s\S]*?)<\/script>/);if(!m)throw new Error("script не найден");new Function(m[1]);if(!s.includes("OUD.open(true)"))throw new Error("нет запуска");console.log("oud www OK")'
