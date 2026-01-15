#!/usr/bin/env node

/**
 * converter.js - Demonstrates converting musical notes to numbers using Tree-sitter parser
 * 
 * This script shows how Tree-sitter enables scalable parsing:
 * 1. Parse input using grammar.js-defined parser (REQUIRED approach)
 * 2. Traverse the parse tree to extract notes
 * 3. Convert notes to numbers using a mapping
 * 
 * Example: C-F-G-C → 1,4,5,1
 */

const Parser = require('tree-sitter');
const MusicalNotes = require('./bindings/node');

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
    for (let child of n.children) {
      traverse(child);
    }
  }
  
  traverse(node);
  return notes;
}

/**
 * Convert musical notes string to numbers array
 */
function convertNotesToNumbers(input) {
  // Create parser instance
  const parser = new Parser();
  
  // Set the language from our grammar.js-generated parser
  parser.setLanguage(MusicalNotes.language);
  
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
function main() {
  const input = 'C-F-G-C';
  
  console.log('=== Tree-sitter Musical Notes Converter ===\n');
  console.log('Input:', input);
  
  try {
    const result = convertNotesToNumbers(input);
    
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
    console.error('\nNote: Make sure to build the native binding first:');
    console.error('  npm run build-native');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { convertNotesToNumbers, extractNotes, noteToNumber };
