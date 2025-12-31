# Static Export (Rendered HTML)

This ZIP contains `index.html`, which is the rendered output downloaded from:
- https://g-day.co.kr/kr/test/html/myBirthday.php?idx=1188969&card_type=G

To keep the page working when opened locally, relative asset paths were converted to absolute URLs (g-day.co.kr).
If you want a fully offline copy (all images/CSS/JS included inside the ZIP), mirror assets and then rewrite links to local paths.

## Offline mirroring (example commands)
### macOS/Linux
```bash
mkdir -p offline && cd offline
wget -i ../_assets_urls.txt --content-disposition
```

### Windows (PowerShell)
```powershell
New-Item -ItemType Directory -Force offline | Out-Null
Get-Content .\_assets_urls.txt | ForEach-Object { Invoke-WebRequest $_ -OutFile (Join-Path offline (Split-Path $_ -Leaf)) }
```

Asset URL list is in `_assets_urls.txt`.
