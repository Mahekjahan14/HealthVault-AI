@echo off
title HealthVault AI - GitHub Deployment Helper
echo ===================================================
echo   HealthVault AI - GitHub Deployment Helper
echo ===================================================
echo.

:: Check for Git installation
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Git is not installed or not in your PATH.
    echo Please install Git from https://git-scm.com/ and try again.
    pause
    exit /b 1
)

:: Initialize git repository if .git doesn't exist
if not exist .git (
    echo [INFO] Git repository not detected. Initializing git...
    git init
    if %errorlevel% neq 0 (
        echo [ERROR] Git initialization failed.
        pause
        exit /b 1
    )
) else (
    echo [INFO] Git repository already initialized.
)

:: Stage all files
echo [INFO] Staging all files...
git add .

:: Check if there are changes to commit
git diff --cached --quiet
if %errorlevel% neq 0 (
    echo [INFO] Committing changes...
    git commit -m "feat: setup Vercel monorepo deployment and public landing page"
) else (
    echo [INFO] No new changes to commit.
)

:: Ask for remote repository URL
echo.
echo Please create a new empty repository on GitHub first.
echo Then, paste the repository URL below.
echo Example: https://github.com/username/repository-name.git
echo.
set /p REPO_URL="GitHub Repository URL: "

if "%REPO_URL%"=="" (
    echo [ERROR] Repository URL cannot be empty.
    pause
    exit /b 1
)

:: Remove existing origin if it exists
git remote remove origin >nul 2>nul

:: Add remote origin and push
echo [INFO] Adding remote origin...
git remote add origin %REPO_URL%

echo [INFO] Setting branch to main...
git branch -M main

echo [INFO] Pushing repository contents to GitHub...
git push -u origin main

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Push failed. 
    echo Please check if the repository exists and you have write permissions.
    pause
    exit /b 1
)

echo.
echo ===================================================
echo [SUCCESS] Code successfully pushed to GitHub!
echo ===================================================
echo.
echo Now, follow these steps to deploy to Vercel:
echo 1. Go to Vercel (https://vercel.com) and log in.
echo 2. Click "Add New..." and choose "Project".
echo 3. Import your newly created GitHub repository.
echo 4. Vercel will automatically read your 'vercel.json'.
echo 5. In the settings, add these Environment Variables:
echo    - MONGODB_URI (Your MongoDB Atlas connection string)
echo    - GROQ_API_KEY (Your Groq API key)
echo    - GEMINI_API_KEY (Your Gemini API key)
echo 6. Click "Deploy".
echo ===================================================
echo.
pause
