export type Dimension = 
  | "length" | "mass" | "area" | "volume" | "temperature" 
  | "pressure" | "time" | "speed" | "acceleration" | "force" 
  | "energy" | "frequency" | "power";

export type SystemType = "si" | "us" | "seximal";

export interface Unit {
  key: string;
  name: string;
  symbol: string;
  toBase: number; // conversion factor to base unit
}

export interface ConversionResult {
  value: number;
  unit: string;
  displayValue: string;
}

// Base conversion factors for Seximal system
const seximalBaseConversions = {
  time: 0.07716,        // 1 tujo = 0.07716 seconds
  length: 0.058352,     // 1 tumbo = 2.29867 inches = 0.058352 meters
  area: 0.003405,       // 1 surfao = 5.28388 sq inches = 0.003405 sq meters
  volume: 0.0001990345, // 1 voluo = 199.0345 mL = 0.0001990345 cubic meters
  speed: 0.75668,       // 1 pido = 0.75668 m/s
  acceleration: 9.80664, // 1 gravito = 9.80664 m/s^2
  mass: 0.1990345,      // 1 mazo = 199.0345 g = 0.1990345 kg
  force: 1.95186,       // 1 forso = 1.95186 N
  pressure: 572.75,     // 1 premuo = 0.08304 psi = 572.75 Pa
  energy: 0.11396,      // 1 nergo = 0.11396 J
  temperature: 1,       // 1 grado celsia = 1°C
  frequency: 12.96,     // 1 freko = 12.96 Hz
  power: 1.47694,       // 1 paŭo = 1.47694 W
};

export const unitDefinitions: Record<Dimension, Record<SystemType, Unit[]>> = {
  length: {
    si: [
      { key: "m", name: "Meters", symbol: "m", toBase: 1 },
      { key: "km", name: "Kilometers", symbol: "km", toBase: 1000 },
      { key: "cm", name: "Centimeters", symbol: "cm", toBase: 0.01 },
      { key: "mm", name: "Millimeters", symbol: "mm", toBase: 0.001 },
      { key: "μm", name: "Micrometers", symbol: "μm", toBase: 0.000001 },
      { key: "nm", name: "Nanometers", symbol: "nm", toBase: 0.000000001 },
    ],
    us: [
      { key: "ft", name: "Feet", symbol: "ft", toBase: 0.3048 },
      { key: "in", name: "Inches", symbol: "in", toBase: 0.0254 },
      { key: "yd", name: "Yards", symbol: "yd", toBase: 0.9144 },
      { key: "mi", name: "Miles", symbol: "mi", toBase: 1609.344 },
      { key: "mil", name: "Mils", symbol: "mil", toBase: 0.0000254 },
    ],
    seximal: [
      { key: "tumbo", name: "Tumbo", symbol: "tumbo", toBase: seximalBaseConversions.length },
      { key: "unsetumbo", name: "Unsetumbo", symbol: "unsetumbo", toBase: seximalBaseConversions.length * 6 },
      { key: "dusetumbo", name: "Dusetumbo", symbol: "dusetumbo", toBase: seximalBaseConversions.length * 36 },
      { key: "trisetumbo", name: "Trisetumbo", symbol: "trisetumbo", toBase: seximalBaseConversions.length * 216 },
      { key: "undotumbo", name: "Undotumbo", symbol: "undotumbo", toBase: seximalBaseConversions.length / 6 },
      { key: "dudotumbo", name: "Dudotumbo", symbol: "dudotumbo", toBase: seximalBaseConversions.length / 36 },
      { key: "tridotumbo", name: "Tridotumbo", symbol: "tridotumbo", toBase: seximalBaseConversions.length / 216 },
    ],
  },
  mass: {
    si: [
      { key: "kg", name: "Kilograms", symbol: "kg", toBase: 1 },
      { key: "g", name: "Grams", symbol: "g", toBase: 0.001 },
      { key: "mg", name: "Milligrams", symbol: "mg", toBase: 0.000001 },
      { key: "t", name: "Metric Tons", symbol: "t", toBase: 1000 },
    ],
    us: [
      { key: "lb", name: "Pounds", symbol: "lb", toBase: 0.453592 },
      { key: "oz", name: "Ounces", symbol: "oz", toBase: 0.0283495 },
      { key: "ton", name: "US Tons", symbol: "ton", toBase: 907.185 },
      { key: "st", name: "Stones", symbol: "st", toBase: 6.35029 },
    ],
    seximal: [
      { key: "mazo", name: "Mazo", symbol: "mazo", toBase: seximalBaseConversions.mass },
      { key: "unsemazo", name: "Unsemazo", symbol: "unsemazo", toBase: seximalBaseConversions.mass * 6 },
      { key: "dusemazo", name: "Dusemazo", symbol: "dusemazo", toBase: seximalBaseConversions.mass * 36 },
      { key: "undomazo", name: "Undomazo", symbol: "undomazo", toBase: seximalBaseConversions.mass / 6 },
      { key: "dudomazo", name: "Dudomazo", symbol: "dudomazo", toBase: seximalBaseConversions.mass / 36 },
    ],
  },
  area: {
    si: [
      { key: "m²", name: "Square Meters", symbol: "m²", toBase: 1 },
      { key: "km²", name: "Square Kilometers", symbol: "km²", toBase: 1000000 },
      { key: "cm²", name: "Square Centimeters", symbol: "cm²", toBase: 0.0001 },
      { key: "mm²", name: "Square Millimeters", symbol: "mm²", toBase: 0.000001 },
      { key: "ha", name: "Hectares", symbol: "ha", toBase: 10000 },
    ],
    us: [
      { key: "ft²", name: "Square Feet", symbol: "ft²", toBase: 0.092903 },
      { key: "in²", name: "Square Inches", symbol: "in²", toBase: 0.00064516 },
      { key: "yd²", name: "Square Yards", symbol: "yd²", toBase: 0.836127 },
      { key: "ac", name: "Acres", symbol: "ac", toBase: 4046.86 },
      { key: "mi²", name: "Square Miles", symbol: "mi²", toBase: 2589988 },
    ],
    seximal: [
      { key: "surfao", name: "Surfao", symbol: "surfao", toBase: seximalBaseConversions.area },
      { key: "unsesurfao", name: "Unsesurfao", symbol: "unsesurfao", toBase: seximalBaseConversions.area * 6 },
      { key: "dusesurfao", name: "Dusesurfao", symbol: "dusesurfao", toBase: seximalBaseConversions.area * 36 },
      { key: "undosurfao", name: "Undosurfao", symbol: "undosurfao", toBase: seximalBaseConversions.area / 6 },
    ],
  },
  volume: {
    si: [
      { key: "m³", name: "Cubic Meters", symbol: "m³", toBase: 1 },
      { key: "L", name: "Liters", symbol: "L", toBase: 0.001 },
      { key: "mL", name: "Milliliters", symbol: "mL", toBase: 0.000001 },
      { key: "cm³", name: "Cubic Centimeters", symbol: "cm³", toBase: 0.000001 },
    ],
    us: [
      { key: "gal", name: "Gallons", symbol: "gal", toBase: 0.00378541 },
      { key: "qt", name: "Quarts", symbol: "qt", toBase: 0.000946353 },
      { key: "pt", name: "Pints", symbol: "pt", toBase: 0.000473176 },
      { key: "fl oz", name: "Fluid Ounces", symbol: "fl oz", toBase: 0.0000295735 },
      { key: "ft³", name: "Cubic Feet", symbol: "ft³", toBase: 0.0283168 },
      { key: "in³", name: "Cubic Inches", symbol: "in³", toBase: 0.0000163871 },
    ],
    seximal: [
      { key: "voluo", name: "Voluo", symbol: "voluo", toBase: seximalBaseConversions.volume },
      { key: "unsevoluo", name: "Unsevoluo", symbol: "unsevoluo", toBase: seximalBaseConversions.volume * 6 },
      { key: "dusevoluo", name: "Dusevoluo", symbol: "dusevoluo", toBase: seximalBaseConversions.volume * 36 },
      { key: "undovoluo", name: "Undovoluo", symbol: "undovoluo", toBase: seximalBaseConversions.volume / 6 },
    ],
  },
  temperature: {
    si: [
      { key: "°C", name: "Celsius", symbol: "°C", toBase: 1 },
      { key: "K", name: "Kelvin", symbol: "K", toBase: 1 },
    ],
    us: [
      { key: "°F", name: "Fahrenheit", symbol: "°F", toBase: 1 },
    ],
    seximal: [
      { key: "grado", name: "Grado Celsia", symbol: "grado", toBase: 1 },
    ],
  },
  pressure: {
    si: [
      { key: "Pa", name: "Pascals", symbol: "Pa", toBase: 1 },
      { key: "kPa", name: "Kilopascals", symbol: "kPa", toBase: 1000 },
      { key: "MPa", name: "Megapascals", symbol: "MPa", toBase: 1000000 },
      { key: "bar", name: "Bars", symbol: "bar", toBase: 100000 },
      { key: "atm", name: "Atmospheres", symbol: "atm", toBase: 101325 },
    ],
    us: [
      { key: "psi", name: "PSI", symbol: "psi", toBase: 6894.76 },
      { key: "psf", name: "PSF", symbol: "psf", toBase: 47.8803 },
    ],
    seximal: [
      { key: "premuo", name: "Premuo", symbol: "premuo", toBase: seximalBaseConversions.pressure },
      { key: "unsepremuo", name: "Unsepremuo", symbol: "unsepremuo", toBase: seximalBaseConversions.pressure * 6 },
      { key: "undopremuo", name: "Undopremuo", symbol: "undopremuo", toBase: seximalBaseConversions.pressure / 6 },
    ],
  },
  time: {
    si: [
      { key: "s", name: "Seconds", symbol: "s", toBase: 1 },
      { key: "min", name: "Minutes", symbol: "min", toBase: 60 },
      { key: "h", name: "Hours", symbol: "h", toBase: 3600 },
      { key: "d", name: "Days", symbol: "d", toBase: 86400 },
      { key: "ms", name: "Milliseconds", symbol: "ms", toBase: 0.001 },
    ],
    us: [
      { key: "s", name: "Seconds", symbol: "s", toBase: 1 },
      { key: "min", name: "Minutes", symbol: "min", toBase: 60 },
      { key: "h", name: "Hours", symbol: "h", toBase: 3600 },
      { key: "d", name: "Days", symbol: "d", toBase: 86400 },
    ],
    seximal: [
      { key: "tujo", name: "Tujo", symbol: "tujo", toBase: seximalBaseConversions.time },
      { key: "unsetujo", name: "Unsetujo", symbol: "unsetujo", toBase: seximalBaseConversions.time * 6 },
      { key: "dusetujo", name: "Dusetujo", symbol: "dusetujo", toBase: seximalBaseConversions.time * 36 },
      { key: "undotujo", name: "Undotujo", symbol: "undotujo", toBase: seximalBaseConversions.time / 6 },
    ],
  },
  speed: {
    si: [
      { key: "m/s", name: "Meters per Second", symbol: "m/s", toBase: 1 },
      { key: "km/h", name: "Kilometers per Hour", symbol: "km/h", toBase: 0.277778 },
    ],
    us: [
      { key: "mph", name: "Miles per Hour", symbol: "mph", toBase: 0.44704 },
      { key: "ft/s", name: "Feet per Second", symbol: "ft/s", toBase: 0.3048 },
    ],
    seximal: [
      { key: "pido", name: "Pido", symbol: "pido", toBase: seximalBaseConversions.speed },
      { key: "unsepido", name: "Unsepido", symbol: "unsepido", toBase: seximalBaseConversions.speed * 6 },
      { key: "undopido", name: "Undopido", symbol: "undopido", toBase: seximalBaseConversions.speed / 6 },
    ],
  },
  acceleration: {
    si: [
      { key: "m/s²", name: "Meters per Second²", symbol: "m/s²", toBase: 1 },
    ],
    us: [
      { key: "ft/s²", name: "Feet per Second²", symbol: "ft/s²", toBase: 0.3048 },
    ],
    seximal: [
      { key: "gravito", name: "Gravito", symbol: "gravito", toBase: seximalBaseConversions.acceleration },
      { key: "unsegravito", name: "Unsegravito", symbol: "unsegravito", toBase: seximalBaseConversions.acceleration * 6 },
      { key: "undogravito", name: "Undogravito", symbol: "undogravito", toBase: seximalBaseConversions.acceleration / 6 },
    ],
  },
  force: {
    si: [
      { key: "N", name: "Newtons", symbol: "N", toBase: 1 },
      { key: "kN", name: "Kilonewtons", symbol: "kN", toBase: 1000 },
    ],
    us: [
      { key: "lbf", name: "Pound-force", symbol: "lbf", toBase: 4.44822 },
    ],
    seximal: [
      { key: "forso", name: "Forso", symbol: "forso", toBase: seximalBaseConversions.force },
      { key: "unseforso", name: "Unseforso", symbol: "unseforso", toBase: seximalBaseConversions.force * 6 },
      { key: "undoforso", name: "Undoforso", symbol: "undoforso", toBase: seximalBaseConversions.force / 6 },
    ],
  },
  energy: {
    si: [
      { key: "J", name: "Joules", symbol: "J", toBase: 1 },
      { key: "kJ", name: "Kilojoules", symbol: "kJ", toBase: 1000 },
      { key: "MJ", name: "Megajoules", symbol: "MJ", toBase: 1000000 },
      { key: "Wh", name: "Watt-hours", symbol: "Wh", toBase: 3600 },
      { key: "kWh", name: "Kilowatt-hours", symbol: "kWh", toBase: 3600000 },
    ],
    us: [
      { key: "BTU", name: "British Thermal Units", symbol: "BTU", toBase: 1055.06 },
      { key: "cal", name: "Calories", symbol: "cal", toBase: 4.184 },
      { key: "ft·lbf", name: "Foot-pounds", symbol: "ft·lbf", toBase: 1.35582 },
    ],
    seximal: [
      { key: "nergo", name: "Nergo", symbol: "nergo", toBase: seximalBaseConversions.energy },
      { key: "unsenergo", name: "Unsenergo", symbol: "unsenergo", toBase: seximalBaseConversions.energy * 6 },
      { key: "undonergo", name: "Undonergo", symbol: "undonergo", toBase: seximalBaseConversions.energy / 6 },
    ],
  },
  frequency: {
    si: [
      { key: "Hz", name: "Hertz", symbol: "Hz", toBase: 1 },
      { key: "kHz", name: "Kilohertz", symbol: "kHz", toBase: 1000 },
      { key: "MHz", name: "Megahertz", symbol: "MHz", toBase: 1000000 },
      { key: "GHz", name: "Gigahertz", symbol: "GHz", toBase: 1000000000 },
    ],
    us: [
      { key: "Hz", name: "Hertz", symbol: "Hz", toBase: 1 },
      { key: "kHz", name: "Kilohertz", symbol: "kHz", toBase: 1000 },
      { key: "MHz", name: "Megahertz", symbol: "MHz", toBase: 1000000 },
    ],
    seximal: [
      { key: "freko", name: "Freko", symbol: "freko", toBase: seximalBaseConversions.frequency },
      { key: "unsefreko", name: "Unsefreko", symbol: "unsefreko", toBase: seximalBaseConversions.frequency * 6 },
      { key: "undofreko", name: "Undofreko", symbol: "undofreko", toBase: seximalBaseConversions.frequency / 6 },
    ],
  },
  power: {
    si: [
      { key: "W", name: "Watts", symbol: "W", toBase: 1 },
      { key: "kW", name: "Kilowatts", symbol: "kW", toBase: 1000 },
      { key: "MW", name: "Megawatts", symbol: "MW", toBase: 1000000 },
      { key: "hp", name: "Metric Horsepower", symbol: "hp", toBase: 735.499 },
    ],
    us: [
      { key: "hp", name: "Horsepower", symbol: "hp", toBase: 745.7 },
      { key: "BTU/h", name: "BTU per Hour", symbol: "BTU/h", toBase: 0.293071 },
    ],
    seximal: [
      { key: "paŭo", name: "Paŭo", symbol: "paŭo", toBase: seximalBaseConversions.power },
      { key: "unsepaŭo", name: "Unsepaŭo", symbol: "unsepaŭo", toBase: seximalBaseConversions.power * 6 },
      { key: "undopaŭo", name: "Undopaŭo", symbol: "undopaŭo", toBase: seximalBaseConversions.power / 6 },
    ],
  },
};

export function convertBetweenUnits(
  value: number,
  fromUnit: Unit,
  toUnit: Unit,
  dimension: Dimension
): number {
  if (dimension === "temperature") {
    return convertTemperature(value, fromUnit.key, toUnit.key);
  }
  
  // Convert to base unit, then to target unit
  const baseValue = value * fromUnit.toBase;
  return baseValue / toUnit.toBase;
}

function convertTemperature(value: number, fromUnit: string, toUnit: string): number {
  // Convert to Celsius first
  let celsius = value;
  
  if (fromUnit === "°F") {
    celsius = (value - 32) * 5/9;
  } else if (fromUnit === "K") {
    celsius = value - 273.15;
  } else if (fromUnit === "grado") {
    celsius = value; // grado celsia = °C
  }
  
  // Convert from Celsius to target
  if (toUnit === "°F") {
    return celsius * 9/5 + 32;
  } else if (toUnit === "K") {
    return celsius + 273.15;
  } else if (toUnit === "grado") {
    return celsius; // grado celsia = °C
  }
  
  return celsius;
}

export function formatNumber(value: number, precision: number = 6): string {
  if (Math.abs(value) < 0.000001) {
    return "0";
  }
  
  // Use scientific notation for very large or very small numbers
  if (Math.abs(value) >= 1000000 || (Math.abs(value) < 0.001 && Math.abs(value) > 0)) {
    return value.toExponential(3);
  }
  
  return parseFloat(value.toFixed(precision)).toString();
}
