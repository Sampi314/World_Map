# How to Deploy Cố Nguyên Giới Map to GitHub Pages

Since the React component is provided as a single `.jsx` file, the easiest way to host it and share it is to build a fast web application using Vite, embed the component, and deploy it to GitHub Pages.

Follow these step-by-step instructions to get your interactive map online!

## Prerequisites

- Node.js installed on your computer (v16+ recommended).
- A GitHub account.
- Git installed on your computer.

## Step 1: Create a Vite React Project

Open your terminal and run the following commands to scaffold a new React app with Vite:

```bash
# Create a new Vite project using the React template
npm create vite@latest co-nguyen-gioi -- --template react

# Navigate into the project directory
cd co-nguyen-gioi

# Install dependencies
npm install
```

## Step 2: Add the Component

1. Inside your `src` folder, create a new folder called `components`.
2. Copy the `CoNguyenMap.jsx` file you generated into `src/components/CoNguyenMap.jsx`.

## Step 3: Update App.jsx

Open `src/App.jsx` and replace its entire content with the following so that it only renders the map component:

```jsx
import React from 'react';
import CoNguyenMap from './components/CoNguyenMap';

function App() {
  return (
    <div style={{ margin: 0, padding: 0, width: '100vw', height: '100vh' }}>
      <CoNguyenMap />
    </div>
  );
}

export default App;
```

## Step 4: Fix Global Styles

To make sure the map takes up the full screen without any margins or padding, edit `src/index.css` (or `src/App.css`) and make sure it has this:

```css
body, html, #root {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background-color: #0a0e14;
}
```

You can start your local server to test the map and make sure everything is working:

```bash
npm run dev
```

Open `http://localhost:5173` in your browser. If everything looks good, proceed to deployment!

## Step 5: Prepare for GitHub Pages

First, we need to install the `gh-pages` package which will handle the deployment for us:

```bash
npm install gh-pages --save-dev
```

Next, open your `package.json` file and make **two** changes:

1. Add a `homepage` field at the top level of the JSON file. Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:
   ```json
   "homepage": "https://YOUR_GITHUB_USERNAME.github.io/co-nguyen-gioi",
   ```

2. Add a `predeploy` and `deploy` script to the `"scripts"` section:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview",
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```

Finally, open your `vite.config.js` and add a `base` property to match your repository name:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/co-nguyen-gioi/', // This must exactly match your repository name!
})
```

## Step 6: Initialize Git and Push to GitHub

Create a new repository on GitHub named `co-nguyen-gioi`. **Do not** initialize it with a README, .gitignore, or license.

Run these commands in your terminal to push your code:

```bash
git init
git add .
git commit -m "Initial commit of Cố Nguyên Giới map"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/co-nguyen-gioi.git
git push -u origin main
```

## Step 7: Deploy!

Now that your code is on GitHub, you can deploy it to GitHub Pages by running:

```bash
npm run deploy
```

This command will automatically build your app and push the built files to a special `gh-pages` branch on your GitHub repository.

## Step 8: Configure GitHub Pages Settings

1. Go to your repository on GitHub.
2. Click on **Settings** > **Pages** (on the left sidebar).
3. Under **Build and deployment**, ensure the **Source** is set to `Deploy from a branch`.
4. Under **Branch**, select `gh-pages` from the dropdown and `/ (root)` for the folder.
5. Click **Save**.

Wait a minute or two, and your interactive world map will be live at `https://YOUR_GITHUB_USERNAME.github.io/co-nguyen-gioi`!
