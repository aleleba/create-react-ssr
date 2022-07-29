#!/usr/bin/env node
const { execSync } = require('child_process');
const isWin = process.platform === "win32";

const runCommand = command => {
    try{
        execSync(`${command}`, {stdio: 'inherit'});
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/aleleba/create-react-ssr ${repoName}`;
const installDepsCommand = `cd ${repoName} && rm -rf .git && git init && git add . && git commit -m "Initial commit" && npm install`;
const installDepsCommandWindows = `cd ${repoName} && rd -r .git && git init && git add . && git commit -m "Initial commit" && npm install`;
const deleteFoldersCommand = `cd ${repoName} && rm -rf .github &&  rm -rf bin`
const deleteFoldersCommandWindows = `cd ${repoName} && rd -r .github &&  rd -r bin`

console.log(`Cloning the repository with name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if(!checkedOut) process.exit(-1);

console.log(`Installing dependencies for ${repoName}`);
const installedDeps = isWin ? runCommand(installDepsCommandWindows) : runCommand(installDepsCommand);
if(!installedDeps) process.exit(-1);

console.log(`Delete folders for ${repoName}`);
const deleteFolders = isWin ? runCommand(deleteFoldersCommandWindows) : runCommand(deleteFoldersCommand);
if(!deleteFolders) process.exit(-1);

console.log("Congratulations! You are ready. Follow the following commands to start");
console.log(`cd ${repoName}`);
console.log('Create a .env file with ENV=development(defauld: production), PORT=3000 (default: 80), PUBLIC_URL=your_public_url(optional)(default: /)');
console.log(`Then you can run: npm start:dev`);