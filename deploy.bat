@echo off
cd /d "D:\SkyCommand"
copy /Y cockpit-dashboard.html index.html
call npx -y vercel@latest --prod --yes
echo.
echo === DEPLOY OUTPUT ABOVE ===
pause
