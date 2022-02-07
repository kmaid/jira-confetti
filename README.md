# Jira Confetti

This is a quickly hacked together chrome extension to replace the shared celebration of marking work as completed.

This only seems to work on paid jira as the selectors seem to be a bit different.

## Project Structure

- src/typescript: TypeScript source files
- src/assets: static files
- dist: Chrome Extension directory
- dist/js: Generated JavaScript files

## Setup

```
npm install
```

## Build

```
npm run build
```

## Load extension to chrome

https://www.youtube.com/watch?v=oswjtLwCUqg

Load `dist` directory after build

## Test

`npx jest` or `npm run test`
