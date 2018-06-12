const Tokenizer = require('./Tokenizer');

const TYPE = Tokenizer.TYPE;

const tokenize = input => (new Tokenizer(input).tokenize());

describe('Tokenizer', () => {
  test('tokenize single tag', () => {
    const input = '[SingleTag]';
    const tokens = tokenize(input);

    expect(tokens).toBeInstanceOf(Array);
    expect(tokens).toEqual([
      [TYPE.TAG, 'SingleTag', 0, 0],
    ]);
  });

  test('tokenize single tag with spaces', () => {
    const input = '[Single Tag]';
    const tokens = tokenize(input);

    expect(tokens).toBeInstanceOf(Array);
    expect(tokens).toEqual([
      [TYPE.TAG, 'Single Tag', 0, 0],
    ]);
  });

  test('tokenize tag as param', () => {
    const input = '[color="#ff0000"]Text[/color]';
    const tokens = tokenize(input);

    expect(tokens).toBeInstanceOf(Array);
    expect(tokens).toEqual([
      [TYPE.TAG, 'color', 0, 0],
      [TYPE.ATTR_VALUE, '#ff0000', 6, 0],
      [TYPE.WORD, 'Text', 17, 0],
      [TYPE.TAG, '/color', 21, 0],
    ]);
  });

  test('tokenize tag param without quotemarks', () => {
    const input = '[style color=#ff0000]Text[/style]';
    const tokens = tokenize(input);

    expect(tokens).toBeInstanceOf(Array);
    expect(tokens).toEqual([
      [TYPE.TAG, 'style', 0, 0],
      [TYPE.ATTR_NAME, 'color', 6, 0],
      [TYPE.ATTR_VALUE, '#ff0000', 12, 0],
      [TYPE.WORD, 'Text', 21, 0],
      [TYPE.TAG, '/style', 25, 0],
    ]);
  });

  test('tokenize list tag with items', () => {
    const input = `[list]
   [*] Item 1.
   [*] Item 2.
   [*] Item 3.
[/list]`;

    const tokens = tokenize(input);

    expect(tokens).toBeInstanceOf(Array);
    expect(tokens).toEqual([
      [TYPE.TAG, 'list', 0, 0],
      [TYPE.NEW_LINE, '\n', 6, 0],
      [TYPE.SPACE, ' ', 0, 1],
      [TYPE.SPACE, ' ', 1, 1],
      [TYPE.SPACE, ' ', 2, 1],
      [TYPE.TAG, '*', 3, 1],
      [TYPE.SPACE, ' ', 6, 1],
      [TYPE.WORD, 'Item', 7, 1],
      [TYPE.SPACE, ' ', 11, 1],
      [TYPE.WORD, '1.', 11, 1],
      [TYPE.NEW_LINE, '\n', 14, 1],
      [TYPE.SPACE, ' ', 0, 2],
      [TYPE.SPACE, ' ', 1, 2],
      [TYPE.SPACE, ' ', 2, 2],
      [TYPE.TAG, '*', 3, 2],
      [TYPE.SPACE, ' ', 6, 2],
      [TYPE.WORD, 'Item', 14, 1],
      [TYPE.SPACE, ' ', 11, 2],
      [TYPE.WORD, '2.', 11, 2],
      [TYPE.NEW_LINE, '\n', 14, 2],
      [TYPE.SPACE, ' ', 0, 3],
      [TYPE.SPACE, ' ', 1, 3],
      [TYPE.SPACE, ' ', 2, 3],
      [TYPE.TAG, '*', 3, 3],
      [TYPE.SPACE, ' ', 6, 3],
      [TYPE.WORD, 'Item', 14, 2],
      [TYPE.SPACE, ' ', 11, 3],
      [TYPE.WORD, '3.', 11, 3],
      [TYPE.NEW_LINE, '\n', 14, 3],
      [TYPE.TAG, '/list', 0, 4],
    ]);
  });

  test('tokenize bad tags as texts', () => {
    const inputs = [
      '[]',
      '[=]',
      '![](image.jpg)',
      'x html([a. title][, alt][, classes]) x',
      '[/y]',
      '[sc',
      // '[sc / [/sc]',
      // '[sc arg="val',
    ];

    const asserts = [
      [[TYPE.WORD, '[]', 0, 0]],
      [[TYPE.WORD, '[=]', 0, 0]],
      [
        [TYPE.WORD, '!', 0, 0],
        [TYPE.WORD, '[](image.jpg)', 1, 0],
      ],
      [
        [TYPE.WORD, 'x', 0, 0],
        [TYPE.SPACE, ' ', 1, 0],
        [TYPE.WORD, 'html(', 1, 0],
        [TYPE.TAG, 'a. title', 7, 0],
        [TYPE.TAG, ', alt', 17, 0],
        [TYPE.TAG, ', classes', 24, 0],
        [TYPE.WORD, ')', 7, 0],
        [TYPE.SPACE, ' ', 36, 0],
        [TYPE.WORD, 'x', 36, 0],
      ],
      [[TYPE.TAG, '/y', 0, 0]],
      [[TYPE.WORD, '[sc', 0, 0]],
      [
        [TYPE.WORD, '[sc', 0, 0],
        [TYPE.SPACE, ' ', 0, 0],
        [TYPE.WORD, '/', 0, 0],
        [TYPE.SPACE, ' ', 0, 0],
        [TYPE.WORD, '[/sc]', 0, 0],
      ],
    ];

    inputs.forEach((input, idx) => {
      const tokens = tokenize(input);

      expect(tokens).toBeInstanceOf(Array);
      expect(tokens).toEqual(asserts[idx]);
    });
  });
});
