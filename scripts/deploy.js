// deploy.js
// scripts/deploy.js
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log("Starting deployment to Cloudflare R2...");

require('dotenv').config();
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'economic-data-visualizer';

// Function to run shell commands
function runCommand(command) {
  try {
    console.log(`Executing: ${command}`);
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Command failed: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Helper function to get all files in a directory recursively
function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

// Upload files to R2
function uploadToR2(localPath, r2Path) {
  // *** MODIFICATION HERE: Add --remote flag ***
  const command = `wrangler r2 object put "${R2_BUCKET_NAME}/${r2Path}" --file="${localPath}" --remote`;
  runCommand(command);
}

// Main deployment function
async function deploy() {
  // Check if dist directory exists
  const distDir = path.join(process.cwd(), 'dist');
  if (!fs.existsSync(distDir)) {
    console.error('Error: dist directory not found. Run `npm run build` first.');
    process.exit(1);
  }

  console.log("Uploading files to R2 bucket from dist directory...");

  // Get all files in dist directory
  const files = getAllFiles(distDir);

  // Upload each file to R2
  for (const file of files) {
    // Calculate the R2 path by removing the dist directory from the full path
    const relativePath = path.relative(distDir, file);
    const r2Path = relativePath.replace(/\\/g, '/'); // Convert Windows paths to forward slashes

    console.log(`Uploading ${file} to ${r2Path}`);
    uploadToR2(file, r2Path);
  }

  console.log("Files uploaded to R2 bucket successfully!");

  // Deploy the worker
  // console.log("Deploying Cloudflare Worker...");
  // runCommand("wrangler deploy");

  // console.log("Deployment complete! Your app should be live shortly.");
}

// Run the deployment
deploy().catch(error => {
  console.error('Deployment failed:', error);
  process.exit(1);
});