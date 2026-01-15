#!/usr/bin/env node

/**
 * converter-wasm.js - Demonstrates converting musical notes to numbers using Tree-sitter WASM parser
 * 
 * This script shows how Tree-sitter enables scalable parsing:
 * 1. Parse input using grammar.js-defined WASM parser (REQUIRED approach)
 * 2. Traverse the parse tree to extract notes
 * 3. Convert notes to numbers using a mapping
 * 
 * Example: C-F-G-C → 1,4,5,1
 */

const path = require('path');

// Note to number mapping (C=1, D=2, ..., B=7)
const noteToNumber = {
  'C': 1,
  'D': 2,
  'E': 3,
  'F': 4,
  'G': 5,
  'A': 6,
  'B': 7
};

/**
 * Extract note values from the parse tree by traversing it
 * This demonstrates using Tree-sitter's parse tree structure
 */
function extractNotes(node) {
  const notes = [];
  
  function traverse(n) {
    // Tree-sitter provides type information for each node
    if (n.type === 'note') {
      notes.push(n.text);
    }
    // Recursively traverse child nodes
    for (let i = 0; i < n.childCount; i++) {
      traverse(n.child(i));
    }
  }
  
  traverse(node);
  return notes;
}

/**
 * Convert musical notes string to numbers array using WASM parser
 */
async function convertNotesToNumbers(input) {
  const TreeSitter = require('web-tree-sitter');
  
  // Initialize web-tree-sitter
  await TreeSitter.Parser.init();
  
  // Create parser instance
  const parser = new TreeSitter.Parser();
  
  // Load the WASM parser generated from grammar/grammar.js
  const wasmPath = path.join(__dirname, 'dist', 'parser.wasm');
  const Language = await TreeSitter.Language.load(wasmPath);
  parser.setLanguage(Language);
  
  // Parse the input using Tree-sitter
  const tree = parser.parse(input);
  
  // Extract notes from the parse tree
  const notes = extractNotes(tree.rootNode);
  
  // Convert to numbers using the mapping
  const numbers = notes.map(note => noteToNumber[note]);
  
  return {
    tree,
    notes,
    numbers
  };
}

// Main execution
async function main() {
  const input = 'C-F-G-C';
  
  console.log('=== Tree-sitter Musical Notes Converter (WASM) ===\n');
  console.log('Input:', input);
  
  try {
    const result = await convertNotesToNumbers(input);
    
    console.log('\nParse Tree (generated from grammar/grammar.js):');
    console.log(result.tree.rootNode.toString());
    
    console.log('\nExtracted Notes:', result.notes);
    console.log('Converted Numbers:', result.numbers);
    console.log('\nOutput:', result.numbers.join(','));
    
    // Verify the expected result
    const expected = '1,4,5,1';
    const actual = result.numbers.join(',');
    if (actual === expected) {
      console.log('\n✓ Success: Output matches expected result');
    } else {
      console.log(`\n✗ Error: Expected ${expected}, got ${actual}`);
      process.exit(1);
    }
  } catch (error) {
    console.error('\nError:', error.message);
    console.error('\nNote: Make sure the WASM parser is built:');
    console.error('  npm run build-wasm');
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

module.exports = { convertNotesToNumbers, extractNotes, noteToNumber };
