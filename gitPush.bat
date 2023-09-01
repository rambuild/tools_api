@echo off
set /p remarks=remarks:
git add .
git commit -m %remarks%
git push
@echo success!
echo off

pause;