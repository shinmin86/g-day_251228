# G-DAY Static Export (Repo-ready)

이 ZIP은 업로드해주신 HTML을 기준으로 **정적(Static) HTML** 형태로 GitHub에 올릴 수 있게 구조화한 버전입니다.
- `../` 상대경로를 `css/`, `js/`, `src/` 로 정리했습니다.
- 서버 연동이 필요한 기능(방명록/참석등록 등)은 정적 환경에서 동작하지 않을 수 있어, JS에서 안전하게 비활성화 처리했습니다.
- 원본 디자인/동작을 위해서는 아래의 에셋(CSS/JS/이미지/음원)을 다운로드해 **placeholder 파일을 덮어쓰기** 하세요.

## 1) GitHub 업로드
1. 이 폴더를 그대로 GitHub repo에 업로드
2. GitHub Pages 설정 시, 브랜치 `main` / 루트(`/`) 선택

## 2) 원본 에셋 다운로드 (로컬에서 실행)
아래 명령을 **프로젝트 루트에서** 실행하세요.

### macOS / Linux (curl)
```bash
BASE="https://g-day.co.kr/kr/test"
curl -L "$BASE/css/myBirthday.css" -o css/myBirthday.css
curl -L "$BASE/js/mobileInvitation.js?id=226" -o js/mobileInvitation.js

# images + music
curl -L "$BASE/src/common/accountArrow.png" -o src/common/accountArrow.png
curl -L "$BASE/src/common/deleteBtn.png" -o src/common/deleteBtn.png
curl -L "$BASE/src/common/editBtn.png" -o src/common/editBtn.png
curl -L "$BASE/src/common/guestBookWriteDelete.png" -o src/common/guestBookWriteDelete.png
curl -L "$BASE/src/common/kakaoShareBtn.png" -o src/common/kakaoShareBtn.png
curl -L "$BASE/src/common/kakaomap.png" -o src/common/kakaomap.png
curl -L "$BASE/src/common/linkShareBtn.png" -o src/common/linkShareBtn.png
curl -L "$BASE/src/common/musicPlayBtn.png" -o src/common/musicPlayBtn.png
curl -L "$BASE/src/common/naverMap.png" -o src/common/naverMap.png
curl -L "$BASE/src/common/tMAp.png" -o src/common/tMAp.png

curl -L "$BASE/src/music/02%20-%20The%20Story%20(Instrumental).mp3" -o "src/music/02 - The Story (Instrumental).mp3"

curl -L "$BASE/src/myBirthday/callBtn.png" -o src/myBirthday/callBtn.png
curl -L "$BASE/src/myBirthday/galleryPhotos01.png" -o src/myBirthday/galleryPhotos01.png
curl -L "$BASE/src/myBirthday/galleryPhotos02.png" -o src/myBirthday/galleryPhotos02.png
curl -L "$BASE/src/myBirthday/galleryPhotos03.png" -o src/myBirthday/galleryPhotos03.png
curl -L "$BASE/src/myBirthday/galleryPhotos04.png" -o src/myBirthday/galleryPhotos04.png
curl -L "$BASE/src/myBirthday/galleryPhotos05.png" -o src/myBirthday/galleryPhotos05.png
curl -L "$BASE/src/myBirthday/galleryPhotos06.png" -o src/myBirthday/galleryPhotos06.png
curl -L "$BASE/src/myBirthday/greetingPhoto.png" -o src/myBirthday/greetingPhoto.png
curl -L "$BASE/src/myBirthday/mainBG.png" -o src/myBirthday/mainBG.png
curl -L "$BASE/src/myBirthday/timeLine01.png" -o src/myBirthday/timeLine01.png
curl -L "$BASE/src/myBirthday/timeLine02.png" -o src/myBirthday/timeLine02.png

curl -L "$BASE/src/star/timeLine01.png" -o src/star/timeLine01.png
curl -L "$BASE/src/star/timeLine02.png" -o src/star/timeLine02.png
```

### Windows (PowerShell)
```powershell
$BASE="https://g-day.co.kr/kr/test"
Invoke-WebRequest "$BASE/css/myBirthday.css" -OutFile "css/myBirthday.css"
Invoke-WebRequest "$BASE/js/mobileInvitation.js?id=226" -OutFile "js/mobileInvitation.js"
```
(이미지/음원도 같은 방식으로 `Invoke-WebRequest <URL> -OutFile <경로>`로 받으면 됩니다.)

## 3) 정적 환경 제한
- GitHub Pages는 PHP 실행이 불가합니다.
- 방명록/참석등록 등은 서버(API)가 필요합니다.
