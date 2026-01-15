module.exports = grammar({
  name: 'musical_notes',

  rules: {
    // Entry point: a sequence of musical notes
    source_file: $ => $.note_sequence,

    // A sequence of notes separated by hyphens
    note_sequence: $ => seq(
      $.note,
      repeat(seq('-', $.note))
    ),

    // Individual musical note (C, D, E, F, G, A, B)
    note: $ => choice(
      'C',
      'D',
      'E',
      'F',
      'G',
      'A',
      'B'
    ),
  }
});
