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
# защита: после правки главный скрипт обязан быть валидным JS, иначе сборка падает
node -e '
const s=require("fs").readFileSync("www/index.html","utf8");
const m=s.match(/<script id="mainjs" type="text\/plain">([\s\S]*?)<\/script><script>__boot/);
if(!m)throw new Error("mainjs не найден");
new Function(m[1]);
if((s.match(/fonts\/manrope\.css/g)||[]).length<1)throw new Error("шрифты не подключены");
console.log("main script OK");'
