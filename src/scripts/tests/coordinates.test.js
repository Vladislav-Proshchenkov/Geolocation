const { parseCoordinates } = require('../geolocation');

describe('parseCoordinates function', () => {
  test('parses coordinates with space', () => {
    const result = parseCoordinates('51.50851, -0.12572');
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572
    });
  });
  
  test('parses coordinates without space', () => {
    const result = parseCoordinates('51.50851,-0.12572');
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572
    });
  });
  
  test('parses coordinates with brackets', () => {
    const result = parseCoordinates('[51.50851, -0.12572]');
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572
    });
  });
  
  test('throws error for invalid format', () => {
    expect(() => parseCoordinates('invalid')).toThrow('Invalid coordinates format');
  });
  
  test('throws error for empty input', () => {
    expect(() => parseCoordinates('')).toThrow('Coordinates are empty');
  });
  
  test('throws error for invalid latitude', () => {
    expect(() => parseCoordinates('91, 0')).toThrow('Latitude must be between -90 and 90');
  });
  
  test('throws error for invalid longitude', () => {
    expect(() => parseCoordinates('0, 181')).toThrow('Longitude must be between -180 and 180');
  });
});