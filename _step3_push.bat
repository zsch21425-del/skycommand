@echo off
cd /d "D:\SkyCommand"
echo === git init === > _push_log.txt
git init >> _push_log.txt 2>&1
echo. >> _push_log.txt
echo === git branch -M main === >> _push_log.txt
git branch -M main >> _push_log.txt 2>&1
echo. >> _push_log.txt
echo === git add . === >> _push_log.txt
git add . >> _push_log.txt 2>&1
echo. >> _push_log.txt
echo === git status === >> _push_log.txt
git status --short >> _push_log.txt 2>&1
echo. >> _push_log.txt
echo === git commit === >> _push_log.txt
git commit -m "Initial SkyCommand cockpit dashboard" >> _push_log.txt 2>&1
echo. >> _push_log.txt
echo === git remote add origin === >> _push_log.txt
git remote add origin https://github.com/zsch21425-del/skycommand.git >> _push_log.txt 2>&1
echo. >> _push_log.txt
echo === git push -u origin main === >> _push_log.txt
git push -u origin main >> _push_log.txt 2>&1
echo. >> _push_log.txt
echo === DONE === >> _push_log.txt
exit
