#!/bin/bash

# HealthVault AI - GitHub Deployment Helper
echo "==================================================="
echo "  HealthVault AI - GitHub Deployment Helper"
echo "==================================================="
echo ""

# Check for Git installation
if ! command -v git &> /dev/null; then
    echo "[ERROR] Git is not installed or not in your PATH."
    echo "Please install Git and try again."
    exit 1
fi

# Initialize git repository if .git doesn't exist
if [ ! -d ".git" ]; then
    echo "[INFO] Git repository not detected. Initializing git..."
    git init
    if [ $? -ne 0 ]; then
        echo "[ERROR] Git initialization failed."
        exit 1
    fi
else
    echo "[INFO] Git repository already initialized."
fi

# Stage all files
echo "[INFO] Staging all files..."
git add .

# Check if there are changes to commit
if ! git diff --cached --quiet; then
    echo "[INFO] Committing changes..."
    git commit -m "feat: setup Vercel monorepo deployment and public landing page"
else
    echo "[INFO] No new changes to commit."
fi

# Ask for remote repository URL
echo ""
echo "Please create a new empty repository on GitHub first."
echo "Then, paste the repository URL below."
echo "Example: https://github.com/username/repository-name.git"
echo ""
read -p "GitHub Repository URL: " REPO_URL

if [ -z "$REPO_URL" ]; then
    echo "[ERROR] Repository URL cannot be empty."
    exit 1
fi

# Remove existing origin if it exists
git remote remove origin &> /dev/null

# Add remote origin and push
echo "[INFO] Adding remote origin..."
git remote add origin "$REPO_URL"

echo "[INFO] Setting branch to main..."
git branch -M main

echo "[INFO] Pushing repository contents to GitHub..."
git push -u origin main

if [ $? -ne 0 ]; then
    echo ""
    echo "[ERROR] Push failed."
    echo "Please check if the repository exists and you have write permissions."
    exit 1
fi

echo ""
echo "==================================================="
echo "[SUCCESS] Code successfully pushed to GitHub!"
echo "==================================================="
echo ""
echo "Now, follow these steps to deploy to Vercel:"
echo "1. Go to Vercel (https://vercel.com) and log in."
echo "2. Click \"Add New...\" and choose \"Project\"."
echo "3. Import your newly created GitHub repository."
echo "4. Vercel will automatically read your 'vercel.json'."
echo "5. In the settings, add these Environment Variables:"
echo "   - MONGODB_URI (Your MongoDB Atlas connection string)"
echo "   - GROQ_API_KEY (Your Groq API key)"
echo "   - GEMINI_API_KEY (Your Gemini API key)"
echo "6. Click \"Deploy\"."
echo "==================================================="
echo ""
