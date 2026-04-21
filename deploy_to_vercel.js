const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log("🚀 Starting Vercel Automated Deployment Pipeline...");

function runCommand(cmd, options = {}) {
  try {
    return execSync(cmd, { stdio: 'pipe', encoding: 'utf-8', ...options });
  } catch (err) {
    if (options.ignoreError) return err.stdout;
    throw err;
  }
}

// 1. Detect project type & 4. Project Config
function detectAndConfigureProject() {
  console.log("🔍 Detecting project type...");
  const hasVite = fs.existsSync('./frontend/vite.config.ts') || fs.existsSync('./frontend/package.json');
  const hasExpress = fs.existsSync('./backend/package.json');
  
  if (hasVite && hasExpress) {
    console.log("   ✅ Detected Monorepo (Vite Frontend + Express Backend)");
    const vercelConfig = {
      version: 2,
      builds: [
        { src: "frontend/package.json", use: "@vercel/static-build", config: { distDir: "dist" } },
        { src: "backend/src/index.ts", use: "@vercel/node" }
      ],
      rewrites: [
        { source: "/api/(.*)", destination: "/backend/src/index.ts" },
        { source: "/(.*)", destination: "/frontend/$1" }
      ]
    };
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
    console.log("   ✅ Created vercel.json with Monorepo configuration.");
  } else if (fs.existsSync('next.config.js') || fs.existsSync('next.config.mjs')) {
    console.log("   ✅ Detected Next.js. Vercel will use default configuration.");
  } else if (fs.existsSync('package.json') && fs.readFileSync('package.json', 'utf8').includes('react')) {
    console.log("   ✅ Detected React (Static Build).");
  } else if (fs.existsSync('package.json') && fs.readFileSync('package.json', 'utf8').includes('express')) {
    console.log("   ✅ Detected Node/Express app. Creating serverless configuration.");
    const vercelConfig = {
      version: 2,
      builds: [ { src: "src/index.ts", use: "@vercel/node" } ],
      routes: [ { src: "/(.*)", dest: "src/index.ts" } ]
    };
    fs.writeFileSync('vercel.json', JSON.stringify(vercelConfig, null, 2));
  } else {
    console.log("   ⚠️ Unknown project type, letting Vercel auto-detect.");
  }
}

// 2. Setup (Install Vercel CLI)
function setupVercel() {
  console.log("⚙️ Checking Vercel CLI...");
  try {
    runCommand('vercel --version');
    console.log("   ✅ Vercel CLI is already installed.");
  } catch (e) {
    console.log("   ⏳ Installing Vercel CLI globally...");
    runCommand('npm install -g vercel');
    console.log("   ✅ Vercel CLI installed successfully.");
  }
}

// 3. Authentication
function checkAuth() {
  console.log("🔐 Checking Vercel Authentication...");
  try {
    runCommand('vercel whoami');
    console.log("   ✅ Logged into Vercel successfully.");
  } catch (e) {
    console.log("   ⚠️ Not logged in. Starting Vercel login process...");
    // Will run interactively to prompt for login
    try {
      execSync('vercel login', { stdio: 'inherit' });
    } catch(err) {
      console.error("   ❌ Vercel login failed. Aborting deployment.");
      process.exit(1);
    }
  }
}

// 6. Environment Variables
function pushEnvVars() {
  if (fs.existsSync('.env')) {
    console.log("🌍 Submitting Environment Variables to Vercel...");
    const envContent = fs.readFileSync('.env', 'utf-8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.trim() && !line.startsWith('#') && line.includes('=')) {
        const [key, ...values] = line.split('=');
        const value = values.join('=').trim().replace(/['"]/g, '');
        if (key.trim()) {
          try {
            execSync(`printf "%s" "${value}" | vercel env add ${key.trim()} production`, { stdio: 'ignore' });
          } catch(e) {
             // Ignoring errors if variable already exists
          }
        }
      }
    }
    console.log("   ✅ Environment variables pushed.");
  } else {
    console.log("   ℹ️ No .env file found.");
  }
}

// 5 & 7. Deployment
function deployWithRetry() {
  console.log("🚀 Starting Deployment to Vercel (--prod --yes)...");
  
  // Link project first so env variables can be added
  try {
    runCommand('vercel link --yes');
    pushEnvVars();
  } catch (e) {
    console.log("   ⚠️ Failed to pre-link project or push env vars. Continuing to deploy...");
  }

  let attempt = 1;
  let success = false;
  let url = '';

  while (attempt <= 2 && !success) {
    try {
      console.log(`   ⏳ Deployment Attempt ${attempt}...`);
      const output = runCommand('vercel --prod --yes');
      const lines = output.split('\n');
      const prodUrlLine = lines.find(line => line.includes('https://') && line.includes('.vercel.app'));
      if (prodUrlLine) {
        const match = prodUrlLine.match(/https:\/\/[^\s]+/);
        if (match) url = match[0];
      }
      success = true;
      console.log("   ✅ Deployment Successful!");
      url = url || "Check Vercel Dashboard for URL";
      console.log(`\n🎉 Deployed URL: ${url}`);
    } catch (err) {
      console.log(`   ❌ Deployment Attempt ${attempt} failed.`);
      if (attempt < 2) {
        console.log("   🔄 Retrying deployment once...");
      } else {
        console.error("   ❌ Deployment failed after retries.");
        console.error(err.stdout || err.message);
      }
    }
    attempt++;
  }
}

// Main execution
try {
  setupVercel();
  checkAuth();
  detectAndConfigureProject();
  runCommand('npm install');
  deployWithRetry();
} catch(err) {
  console.error("❌ Automation script encountered a fatal error:");
  console.error(err.message);
}
