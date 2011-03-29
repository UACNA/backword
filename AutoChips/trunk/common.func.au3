#cs-------------------------------------------------
定义公用函数
#ce-------------------------------------------------
#include-once
#include "config.include.au3"

; 更新 AutoChips 脚本
Func UpdateAu3()
	RUN("SVN update " & $cp_au3)
EndFunc
