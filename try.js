const prettier = require('prettier');
const { ESLint } = require('eslint');
const acorn = require('acorn');
const vm = require('vm');
const fs = require('fs');
const path = require('path');


function syntaxCheckerTool(code) {
    let syntaxErrorCount = 0;
  
    try {
      acorn.parse(code);
    } catch (e) {
      syntaxErrorCount++;
    }
  
    return syntaxErrorCount;
  }
  


  function codeFormatterTool(code) {
    // Define the required function signatures
    const REQUIRED_FUNCTIONS = [
      'function functionName(input) {',
      '}',
      '',
    ];
    
    // Check if the input code matches the required function signatures
    const codeLines = code.split('\n').map(line => line.trim());
    let hasRequiredFunctions = true;
    for (const requiredFunction of REQUIRED_FUNCTIONS) {
      if (!codeLines.includes(requiredFunction)) {
        hasRequiredFunctions = false;
        break;
      }
    }
    
    return hasRequiredFunctions;
  }
  


  function codeAnalyzerTool(code) {
    let eslint = new ESLint();
  
    return eslint.lintText(code).then((results) => {
      let errorCount = 0;
      for (const result of results) {
        errorCount += result.errorCount;
      }
      return errorCount;
    });
  }
  
  
  
  function compileAndRunCode(code) {
    const startTime = process.hrtime.bigint();
    try {
      const script = new vm.Script(code, {
        timeout: 1000,
        filename: 'usercode.js',
        displayErrors: false
      });
  
      const sandbox = {
        console: {
          log: function() {}
        },
        require: require
      };
  
      const context = vm.createContext(sandbox);
      script.runInContext(context);
    } catch (e) {
      // Ignore errors for the purpose of measuring execution time
    }
    const endTime = process.hrtime.bigint();
  
    return Number(endTime - startTime) / 1000000; // Return execution time in milliseconds
  }
  


function checkJavaScriptFile(filePath) {
    // Read the file contents
    let fileContents = fs.readFileSync(filePath, 'utf8');
  
    // Check for syntax errors
    let syntaxErrors = syntaxCheckerTool(fileContents);
  
     // Check for formatting issues
     let formattedCode = codeFormatterTool(fileContents);
  
     // Check for logical errors
     let logicalErrors = codeAnalyzerTool(fileContents);
   
     // Compile the code and check for runtime errors
     let runtimeErrors = compileAndRunCode(fileContents);
   
     // Generate the table with the results
     let table = generateTable(syntaxErrors, logicalErrors, runtimeErrors, formattedCode);
   
     // Display the table to the user
     return table;
   }
  
 
 
 function generateTable(syntaxErrors, logicalErrors, runtimeErrors, formattedCode) {
    let table = '';
  
    // Build the table rows
    table += '| Criteria | Quality of Implementation |\n';
    table += '|:--------:|:------------------------:|\n';
    table += `| Formatting | ${formattedCode} |\n`;
    table += `| Syntax | ${syntaxErrors} |\n`;
    table += `| Logic | ${logicalErrors} |\n`;
    table += `| Runtime | ${runtimeErrors} |\n`;
  
    return table;
  }
  
 
 
 // Get the path to the file to check
 let fileName = 'example.js';
 
 // Call the checkJavaScriptFile function with the file object
 console.log(checkJavaScriptFile(fileName));
 
