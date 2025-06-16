export function parseCoordinates(input) {
    if (!input) throw new Error('Coordinates are empty');
    
    const cleanedInput = input.replace(/[\[\]]/g, '');
    
    const parts = cleanedInput.split(',');
    
    if (parts.length !== 2) {
      throw new Error('Invalid coordinates format. Use "latitude, longitude"');
    }
    
    const lat = parseFloat(parts[0].trim());
    const lng = parseFloat(parts[1].trim());
    
    if (isNaN(lat)) throw new Error('Latitude must be a number');
    if (isNaN(lng)) throw new Error('Longitude must be a number');
    if (lat < -90 || lat > 90) throw new Error('Latitude must be between -90 and 90');
    if (lng < -180 || lng > 180) throw new Error('Longitude must be between -180 and 180');
    
    return { latitude: lat, longitude: lng };
  }