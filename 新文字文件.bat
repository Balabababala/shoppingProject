@echo off
setlocal enabledelayedexpansion

echo 開始 ping 範圍 192.168.1.1 ~ 192.168.1.254

for /L %%i in (1,1,254) do (
    ping -n 1 -w 1 10.100.53.%%i >nul
    if !errorlevel! == 0 (
        echo 10.100.53.%%i 通
    ) else (
        echo 10.100.53.%%i 不通
    )
)

echo 完成
pause