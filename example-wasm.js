const TreeSitter = require('web-tree-sitter');
const fs = require('fs');
const path = require('path');

// Note to number mapping
const noteToNumber = {
  'C': 1,
  'D': 2,
  'E': 3,
  'F': 4,
  'G': 5,
  'A': 6,
  'B': 7
};

async function main() {
  console.log('=== Tree-sitter Musical Notes Parser Example ===\n');
  
  // Create parser instance
  const parser = new TreeSitter.Parser();
  
  // Load the WASM parser
  const wasmPath = path.join(__dirname, 'dist', 'parser.wasm');
  const Language = await TreeSitter.Language.load(wasmPath);
  parser.setLanguage(Language);
  
  // Parse the input
  const sourceCode = 'C-F-G-C';
  console.log('Input:', sourceCode);
  
  const tree = parser.parse(sourceCode);
  console.log('\nParse Tree:');
  console.log(tree.rootNode.toString());
  
  // Extract notes from the parse tree
  const notes = extractNotes(tree.rootNode);
  console.log('\nExtracted Notes:', notes);
  
  // Convert to numbers
  const numbers = notes.map(note => noteToNumber[note]);
  console.log('Converted to Numbers:', numbers);
  console.log('\nOutput:', numbers.join(','));
}

// Extract note values from the parse tree by traversing it
function extractNotes(node) {
  const notes = [];
  
  function traverse(n) {
    if (n.type === 'note') {
      notes.push(n.text);
    }
    for (let i = 0; i < n.childCount; i++) {
      traverse(n.child(i));
    }
  }
  
  traverse(node);
  return notes;
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
