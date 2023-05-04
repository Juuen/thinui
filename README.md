# thinui

A UI framework for thinjs.



# 使用方式

## 安装

```console
npm i thinui2
```

## 运行CLI

```console
> thinui
```



# 常见问题

- windows系统中thinui命令无法运行

  ```
  报错信息：
  thinui : 无法加载文件 C:\Program Files\nodejs\node_global\thinui.ps1，因为在此系统上禁止运行脚本。有关详细信息，请参阅 https:/go.microsoft.com/fwlink/?LinkID=135170 中的 about_Execution_Policies。
  这个报错信息意味着在您的系统上禁止运行 PowerShell 脚本，因此无法加载 thinui.ps1 脚本文件。
  
  解决办法：
  打开 PowerShell 终端并以管理员身份运行以下命令：
  Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy Unrestricted
  
  
  ```

  

  
