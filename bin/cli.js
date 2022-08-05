#!/usr/bin/env node
const { execSync } = require('child_process');
var fs = require('fs')

const isWin = process.platform === "win32";
const isAppple = process.platform === "darwin";
 
const runCommand = command => {
    try{
        execSync(`${command}`, {stdio: 'inherit'});
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
    return true;
}

const runCommandWithOutput = command => {
    try{
        return execSync(`${command}`);
    } catch (e) {
        console.error(`Failed to execute ${command}`, e);
        return false;
    }
}

const replaceTextOnFile = ({ file, textToBeReplaced, textReplace }) => {
    fs.readFile(file, 'utf8', function (err,data) {
        if (err) {
          console.log(err);
          return false
        }
        var result = data.replace(textToBeReplaced, textReplace);
        
        fs.writeFile(file, result, 'utf8', function (err) {
            if (err){
                console.log(err);
                return false
            }
        });
    });
}

const repoName = process.argv[2];
const gitCheckoutCommand = `git clone --depth 1 https://github.com/aleleba/create-react-ssr ${repoName}`;
console.log(`Cloning the repository with name ${repoName}`);
const checkedOut = runCommand(gitCheckoutCommand);
if(!checkedOut) process.exit(-1);

const actualVersion = runCommandWithOutput(`cd ${repoName} && node -p "require('./package.json').version"`).toString().trim()

const installDepsCommand = `cd ${repoName} && npm install`;
const cleanGitHistoryCommand = `cd ${repoName} && rm -rf .git && git init && git add --all -- ":!.github" ":!bin" && git commit -m "Initial commit"`
const cleanGitHistoryCommandWindows = `cd ${repoName} && rmdir .git /s /q && git init && git add --all -- ":!.github" ":!bin" && git commit -m "Initial commit"`
const deleteFoldersCommand = `cd ${repoName} && rm -rf .github && rm -rf bin`
const deleteFoldersCommandWindows = `cd ${repoName} && rmdir .github /s /q && rmdir bin /s /q`
const deleteBinCommand = `cd ${repoName} && sed -i 's+"bin": "./bin/cli.js",++g' package.json && sed -i '/^[[:space:]]*$/d' package.json`
const deleteBinCommandWindows = `cd ${repoName} && copy package.json package2.json && del package.json && type package2.json | findstr /v cli.js > package.json && del package2.json`
const deleteBinCommandApple = `cd ${repoName} && sed -i .copy 's+"bin": "./bin/cli.js",++g' package.json && sed -i .copy '/^[[:space:]]*$/d' package.json &&
rm -rf package.json.copy`
const replaceNewVersionCommand = `cd ${repoName} && sed -i 's+"version": "${actualVersion}",+"version": "0.0.1",+g' package.json`
const replaceNewVersionCommandWindows = `cd ${repoName} && copy package.json package2.json && del package.json && type package2.json | %"version": "${actualVersion}",="version": "0.0.1"% > package.json && del package2.json`
const replaceNewVersionCommandApple = `cd ${repoName} && sed -i .copy 's+"version": "${actualVersion}",+"version": "0.0.1",+g' package.json &&
rm -rf package.json.copy`
const replaceNameAppCommand = `cd ${repoName} && sed -i 's+"name": "@aleleba/create-react-ssr",+"name": "${repoName}",+g' package.json`
const replaceNameAppCommandApple = `cd ${repoName} && sed -i .copy 's+"name": "@aleleba/create-react-ssr",+"name": "${repoName}",+g' package.json &&
rm -rf package.json.copy`

console.log(`Installing dependencies for ${repoName}`);
const installedDeps = runCommand(installDepsCommand);
if(!installedDeps) process.exit(-1);

const deleteBin = isAppple ? runCommand(deleteBinCommandApple) : (isWin ? runCommand(deleteBinCommandWindows) : runCommand(deleteBinCommand));
if(!deleteBin) process.exit(-1);

const replaceNewVersion = replaceTextOnFile({ 
    file: 'package.json', 
    textToBeReplaced: `"version": "${actualVersion}",`, 
    textReplace: `"version": "0.0.1",`
})
if(!replaceNewVersion) process.exit(-1);

/* const replaceNewVersion = runCommand(replaceNewVersionCommand)
if(!replaceNewVersion) process.exit(-1);

const replaceNameApp = runCommand(replaceNameAppCommand)
if(!replaceNameApp) process.exit(-1); */

console.log(`Cleaning History of Git for ${repoName}`);
const cleanGitHistory = isWin ? runCommand(cleanGitHistoryCommandWindows) : runCommand(cleanGitHistoryCommand);
if(!cleanGitHistory) process.exit(-1);

console.log("Congratulations! You are ready. Follow the following commands to start");
console.log(`cd ${repoName}`);
console.log('Create a .env file with ENV=development(defauld: production), PORT=3000 (default: 80), PUBLIC_URL=your_public_url(optional)(default: /)');
console.log(`Then you can run: npm start:dev`);

const deleteFolders = isWin ? runCommand(deleteFoldersCommandWindows) : runCommand(deleteFoldersCommand);
if(!deleteFolders) process.exit(-1);
