#/bin/sh
mkdir -p webview/generated/audit webview/generated/scan
npm run build --workspace=audit &&  cp src-webviews/audit/dist/index.js webview/generated/audit/ && cp src-webviews/audit/dist/style.css webview/generated/audit/style.css
npm run build --workspace=scan &&  cp src-webviews/scan/dist/index.js webview/generated/scan/ && cp src-webviews/scan/dist/style.css webview/generated/scan/style.css
