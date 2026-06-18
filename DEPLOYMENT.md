# Render.com Static Site Deployment Guide

This guide describes how to deploy your portfolio website to Render.com for free.

## Step 1: Initialize Git and Push to GitHub
1. Open your terminal (PowerShell, CMD, or Git Bash).
2. Navigate to your project folder:
   ```bash
   cd C:\Users\Ikrom\Desktop\portfolio-website
   ```
3. Initialize Git:
   ```bash
   git init
   ```
4. Add all files to staging:
   ```bash
   git add .
   ```
5. Commit the files:
   ```bash
   git commit -m "Initial commit: Premium portfolio website"
   ```
6. Create a new repository on your GitHub account (`ikoshdev-lab`) named `portfolio-website`.
7. Link your local project to your GitHub repository and push:
   ```bash
   git remote add origin https://github.com/ikoshdev-lab/portfolio-website.git
   git branch -M main
   git push -u origin main
   ```

## Step 2: Deploy to Render.com
1. Go to [Render Dashboard](https://dashboard.render.com/) and log in (you can use your GitHub account).
2. Click the **"New +"** button and select **"Static Site"**.
3. Connect your GitHub account (if not already done) and search for the `portfolio-website` repository.
4. Click **"Connect"** next to your repository.
5. In the settings page:
   - **Name**: `ikrom-portfolio` (or any name you prefer)
   - **Branch**: `main`
   - **Build Command**: *Leave this blank* (no build command is needed for static HTML/CSS/JS)
   - **Publish Directory**: `.` (just a dot, which represents the root directory where `index.html` is located)
6. Click **"Create Static Site"**.

Render will fetch your files, build, and deploy the site in less than a minute. You will receive a free URL (e.g., `https://ikrom-portfolio.onrender.com`) where your site is live!
