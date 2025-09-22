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
      { key: "Ym", name: "Yottameters", symbol: "Ym", toBase: 1e24 },
      { key: "Zm", name: "Zettameters", symbol: "Zm", toBase: 1e21 },
      { key: "Em", name: "Exameters", symbol: "Em", toBase: 1e18 },
      { key: "Pm", name: "Petameters", symbol: "Pm", toBase: 1e15 },
      { key: "Tm", name: "Terameters", symbol: "Tm", toBase: 1e12 },
      { key: "Gm", name: "Gigameters", symbol: "Gm", toBase: 1e9 },
      { key: "Mm", name: "Megameters", symbol: "Mm", toBase: 1e6 },
      { key: "km", name: "Kilometers", symbol: "km", toBase: 1000 },
      { key: "m", name: "Meters", symbol: "m", toBase: 1 },
      { key: "dm", name: "Decimeters", symbol: "dm", toBase: 0.1 },
      { key: "cm", name: "Centimeters", symbol: "cm", toBase: 0.01 },
      { key: "mm", name: "Millimeters", symbol: "mm", toBase: 0.001 },
      { key: "μm", name: "Micrometers", symbol: "μm", toBase: 1e-6 },
      { key: "nm", name: "Nanometers", symbol: "nm", toBase: 1e-9 },
      { key: "pm", name: "Picometers", symbol: "pm", toBase: 1e-12 },
      { key: "fm", name: "Femtometers", symbol: "fm", toBase: 1e-15 },
      { key: "am", name: "Attometers", symbol: "am", toBase: 1e-18 },
    ],
    us: [
      { key: "ly", name: "Light Years", symbol: "ly", toBase: 9.461e15 },
      { key: "pc", name: "Parsecs", symbol: "pc", toBase: 3.086e16 },
      { key: "mi", name: "Miles", symbol: "mi", toBase: 1609.344 },
      { key: "nmi", name: "Nautical Miles", symbol: "nmi", toBase: 1852 },
      { key: "fur", name: "Furlongs", symbol: "fur", toBase: 201.168 },
      { key: "yd", name: "Yards", symbol: "yd", toBase: 0.9144 },
      { key: "ft", name: "Feet", symbol: "ft", toBase: 0.3048 },
      { key: "in", name: "Inches", symbol: "in", toBase: 0.0254 },
      { key: "mil", name: "Mils", symbol: "mil", toBase: 0.0000254 },
    ],
    seximal: [
      { key: "exatumbo", name: "Exatumbo", symbol: "exatumbo", toBase: seximalBaseConversions.length * Math.pow(6, 24) },
      { key: "petatumbo", name: "Petatumbo", symbol: "petatumbo", toBase: seximalBaseConversions.length * Math.pow(6, 20) },
      { key: "teratumbo", name: "Teratumbo", symbol: "teratumbo", toBase: seximalBaseConversions.length * Math.pow(6, 16) },
      { key: "gigatumbo", name: "Gigatumbo", symbol: "gigatumbo", toBase: seximalBaseConversions.length * Math.pow(6, 12) },
      { key: "megatumbo", name: "Megatumbo", symbol: "megatumbo", toBase: seximalBaseConversions.length * Math.pow(6, 8) },
      { key: "largatumbo", name: "Largatumbo", symbol: "largatumbo", toBase: seximalBaseConversions.length * Math.pow(6, 6) },
      { key: "kilatumbo", name: "Kilatumbo", symbol: "kilatumbo", toBase: seximalBaseConversions.length * Math.pow(6, 4) },
      { key: "nifatumbo", name: "Nifatumbo", symbol: "nifatumbo", toBase: seximalBaseConversions.length * Math.pow(6, 2) },
      { key: "unsetumbo", name: "Unsetumbo", symbol: "unsetumbo", toBase: seximalBaseConversions.length * 6 },
      { key: "tumbo", name: "Tumbo", symbol: "tumbo", toBase: seximalBaseConversions.length },
      { key: "nivitumbo", name: "Nivitumbo", symbol: "nivitumbo", toBase: seximalBaseConversions.length * Math.pow(6, -2) },
      { key: "millitumbo", name: "Millitumbo", symbol: "millitumbo", toBase: seximalBaseConversions.length * Math.pow(6, -4) },
      { key: "tinitumbo", name: "Tinitumbo", symbol: "tinitumbo", toBase: seximalBaseConversions.length * Math.pow(6, -6) },
      { key: "microtumbo", name: "Microtumbo", symbol: "microtumbo", toBase: seximalBaseConversions.length * Math.pow(6, -8) },
      { key: "nanotumbo", name: "Nanotumbo", symbol: "nanotumbo", toBase: seximalBaseConversions.length * Math.pow(6, -12) },
      { key: "picotumbo", name: "Picotumbo", symbol: "picotumbo", toBase: seximalBaseConversions.length * Math.pow(6, -16) },
    ],
  },
  mass: {
    si: [
      { key: "Yg", name: "Yottagrams", symbol: "Yg", toBase: 1e21 },
      { key: "Zg", name: "Zettagrams", symbol: "Zg", toBase: 1e18 },
      { key: "Eg", name: "Exagrams", symbol: "Eg", toBase: 1e15 },
      { key: "Pg", name: "Petagrams", symbol: "Pg", toBase: 1e12 },
      { key: "Tg", name: "Teragrams", symbol: "Tg", toBase: 1e9 },
      { key: "Gg", name: "Gigagrams", symbol: "Gg", toBase: 1e6 },
      { key: "Mg", name: "Megagrams", symbol: "Mg", toBase: 1e3 },
      { key: "t", name: "Metric Tons", symbol: "t", toBase: 1000 },
      { key: "kg", name: "Kilograms", symbol: "kg", toBase: 1 },
      { key: "hg", name: "Hectograms", symbol: "hg", toBase: 0.1 },
      { key: "dag", name: "Dekagrams", symbol: "dag", toBase: 0.01 },
      { key: "g", name: "Grams", symbol: "g", toBase: 0.001 },
      { key: "dg", name: "Decigrams", symbol: "dg", toBase: 0.0001 },
      { key: "cg", name: "Centigrams", symbol: "cg", toBase: 0.00001 },
      { key: "mg", name: "Milligrams", symbol: "mg", toBase: 0.000001 },
      { key: "μg", name: "Micrograms", symbol: "μg", toBase: 1e-9 },
      { key: "ng", name: "Nanograms", symbol: "ng", toBase: 1e-12 },
      { key: "pg", name: "Picograms", symbol: "pg", toBase: 1e-15 },
    ],
    us: [
      { key: "ton", name: "US Tons", symbol: "ton", toBase: 907.185 },
      { key: "st", name: "Stones", symbol: "st", toBase: 6.35029 },
      { key: "lb", name: "Pounds", symbol: "lb", toBase: 0.453592 },
      { key: "oz", name: "Ounces", symbol: "oz", toBase: 0.0283495 },
      { key: "dr", name: "Drams", symbol: "dr", toBase: 0.00177185 },
      { key: "gr", name: "Grains", symbol: "gr", toBase: 0.00006479891 },
    ],
    seximal: [
      { key: "examazo", name: "Examazo", symbol: "examazo", toBase: seximalBaseConversions.mass * Math.pow(6, 24) },
      { key: "petamazo", name: "Petamazo", symbol: "petamazo", toBase: seximalBaseConversions.mass * Math.pow(6, 20) },
      { key: "teramazo", name: "Teramazo", symbol: "teramazo", toBase: seximalBaseConversions.mass * Math.pow(6, 16) },
      { key: "gigamazo", name: "Gigamazo", symbol: "gigamazo", toBase: seximalBaseConversions.mass * Math.pow(6, 12) },
      { key: "megamazo", name: "Megamazo", symbol: "megamazo", toBase: seximalBaseConversions.mass * Math.pow(6, 8) },
      { key: "largamazo", name: "Largamazo", symbol: "largamazo", toBase: seximalBaseConversions.mass * Math.pow(6, 6) },
      { key: "kilamazo", name: "Kilamazo", symbol: "kilamazo", toBase: seximalBaseConversions.mass * Math.pow(6, 4) },
      { key: "nifamazo", name: "Nifamazo", symbol: "nifamazo", toBase: seximalBaseConversions.mass * Math.pow(6, 2) },
      { key: "unsemazo", name: "Unsemazo", symbol: "unsemazo", toBase: seximalBaseConversions.mass * 6 },
      { key: "mazo", name: "Mazo", symbol: "mazo", toBase: seximalBaseConversions.mass },
      { key: "nivimazo", name: "Nivimazo", symbol: "nivimazo", toBase: seximalBaseConversions.mass * Math.pow(6, -2) },
      { key: "millimazo", name: "Millimazo", symbol: "millimazo", toBase: seximalBaseConversions.mass * Math.pow(6, -4) },
      { key: "tinimazo", name: "Tinimazo", symbol: "tinimazo", toBase: seximalBaseConversions.mass * Math.pow(6, -6) },
      { key: "micromazo", name: "Micromazo", symbol: "micromazo", toBase: seximalBaseConversions.mass * Math.pow(6, -8) },
      { key: "nanomazo", name: "Nanomazo", symbol: "nanomazo", toBase: seximalBaseConversions.mass * Math.pow(6, -12) },
      { key: "picomazo", name: "Picomazo", symbol: "picomazo", toBase: seximalBaseConversions.mass * Math.pow(6, -16) },
    ],
  },
  area: {
    si: [
      { key: "km²", name: "Square Kilometers", symbol: "km²", toBase: 1000000 },
      { key: "ha", name: "Hectares", symbol: "ha", toBase: 10000 },
      { key: "m²", name: "Square Meters", symbol: "m²", toBase: 1 },
      { key: "dm²", name: "Square Decimeters", symbol: "dm²", toBase: 0.01 },
      { key: "cm²", name: "Square Centimeters", symbol: "cm²", toBase: 0.0001 },
      { key: "mm²", name: "Square Millimeters", symbol: "mm²", toBase: 0.000001 },
      { key: "μm²", name: "Square Micrometers", symbol: "μm²", toBase: 1e-12 },
    ],
    us: [
      { key: "mi²", name: "Square Miles", symbol: "mi²", toBase: 2589988 },
      { key: "ac", name: "Acres", symbol: "ac", toBase: 4046.86 },
      { key: "yd²", name: "Square Yards", symbol: "yd²", toBase: 0.836127 },
      { key: "ft²", name: "Square Feet", symbol: "ft²", toBase: 0.092903 },
      { key: "in²", name: "Square Inches", symbol: "in²", toBase: 0.00064516 },
    ],
    seximal: [
      { key: "exasurfao", name: "Exasurfao", symbol: "exasurfao", toBase: seximalBaseConversions.area * Math.pow(6, 24) },
      { key: "petasurfao", name: "Petasurfao", symbol: "petasurfao", toBase: seximalBaseConversions.area * Math.pow(6, 20) },
      { key: "terasurfao", name: "Terasurfao", symbol: "terasurfao", toBase: seximalBaseConversions.area * Math.pow(6, 16) },
      { key: "gigasurfao", name: "Gigasurfao", symbol: "gigasurfao", toBase: seximalBaseConversions.area * Math.pow(6, 12) },
      { key: "megasurfao", name: "Megasurfao", symbol: "megasurfao", toBase: seximalBaseConversions.area * Math.pow(6, 8) },
      { key: "largasurfao", name: "Largasurfao", symbol: "largasurfao", toBase: seximalBaseConversions.area * Math.pow(6, 6) },
      { key: "kilasurfao", name: "Kilasurfao", symbol: "kilasurfao", toBase: seximalBaseConversions.area * Math.pow(6, 4) },
      { key: "nifasurfao", name: "Nifasurfao", symbol: "nifasurfao", toBase: seximalBaseConversions.area * Math.pow(6, 2) },
      { key: "unsesurfao", name: "Unsesurfao", symbol: "unsesurfao", toBase: seximalBaseConversions.area * 6 },
      { key: "surfao", name: "Surfao", symbol: "surfao", toBase: seximalBaseConversions.area },
      { key: "nivisurfao", name: "Nivisurfao", symbol: "nivisurfao", toBase: seximalBaseConversions.area * Math.pow(6, -2) },
      { key: "millisurfao", name: "Millisurfao", symbol: "millisurfao", toBase: seximalBaseConversions.area * Math.pow(6, -4) },
      { key: "tinisurfao", name: "Tinisurfao", symbol: "tinisurfao", toBase: seximalBaseConversions.area * Math.pow(6, -6) },
      { key: "microsurfao", name: "Microsurfao", symbol: "microsurfao", toBase: seximalBaseConversions.area * Math.pow(6, -8) },
      { key: "nanosurfao", name: "Nanosurfao", symbol: "nanosurfao", toBase: seximalBaseConversions.area * Math.pow(6, -12) },
      { key: "picosurfao", name: "Picosurfao", symbol: "picosurfao", toBase: seximalBaseConversions.area * Math.pow(6, -16) },
    ],
  },
  volume: {
    si: [
      { key: "m³", name: "Cubic Meters", symbol: "m³", toBase: 1 },
      { key: "kL", name: "Kiloliters", symbol: "kL", toBase: 1 },
      { key: "hL", name: "Hectoliters", symbol: "hL", toBase: 0.1 },
      { key: "daL", name: "Dekaliters", symbol: "daL", toBase: 0.01 },
      { key: "L", name: "Liters", symbol: "L", toBase: 0.001 },
      { key: "dL", name: "Deciliters", symbol: "dL", toBase: 0.0001 },
      { key: "cL", name: "Centiliters", symbol: "cL", toBase: 0.00001 },
      { key: "mL", name: "Milliliters", symbol: "mL", toBase: 0.000001 },
      { key: "cm³", name: "Cubic Centimeters", symbol: "cm³", toBase: 0.000001 },
      { key: "mm³", name: "Cubic Millimeters", symbol: "mm³", toBase: 1e-9 },
    ],
    us: [
      { key: "gal", name: "Gallons", symbol: "gal", toBase: 0.00378541 },
      { key: "qt", name: "Quarts", symbol: "qt", toBase: 0.000946353 },
      { key: "pt", name: "Pints", symbol: "pt", toBase: 0.000473176 },
      { key: "cup", name: "Cups", symbol: "cup", toBase: 0.000236588 },
      { key: "fl oz", name: "Fluid Ounces", symbol: "fl oz", toBase: 0.0000295735 },
      { key: "tbsp", name: "Tablespoons", symbol: "tbsp", toBase: 0.0000147868 },
      { key: "tsp", name: "Teaspoons", symbol: "tsp", toBase: 0.00000492892 },
      { key: "ft³", name: "Cubic Feet", symbol: "ft³", toBase: 0.0283168 },
      { key: "in³", name: "Cubic Inches", symbol: "in³", toBase: 0.0000163871 },
      { key: "bbl", name: "Barrels", symbol: "bbl", toBase: 0.158987 },
    ],
    seximal: [
      { key: "exavoluo", name: "Exavoluo", symbol: "exavoluo", toBase: seximalBaseConversions.volume * Math.pow(6, 24) },
      { key: "petavoluo", name: "Petavoluo", symbol: "petavoluo", toBase: seximalBaseConversions.volume * Math.pow(6, 20) },
      { key: "teravoluo", name: "Teravoluo", symbol: "teravoluo", toBase: seximalBaseConversions.volume * Math.pow(6, 16) },
      { key: "gigavoluo", name: "Gigavoluo", symbol: "gigavoluo", toBase: seximalBaseConversions.volume * Math.pow(6, 12) },
      { key: "megavoluo", name: "Megavoluo", symbol: "megavoluo", toBase: seximalBaseConversions.volume * Math.pow(6, 8) },
      { key: "largavoluo", name: "Largavoluo", symbol: "largavoluo", toBase: seximalBaseConversions.volume * Math.pow(6, 6) },
      { key: "kilavoluo", name: "Kilavoluo", symbol: "kilavoluo", toBase: seximalBaseConversions.volume * Math.pow(6, 4) },
      { key: "nifavoluo", name: "Nifavoluo", symbol: "nifavoluo", toBase: seximalBaseConversions.volume * Math.pow(6, 2) },
      { key: "unsevoluo", name: "Unsevoluo", symbol: "unsevoluo", toBase: seximalBaseConversions.volume * 6 },
      { key: "voluo", name: "Voluo", symbol: "voluo", toBase: seximalBaseConversions.volume },
      { key: "nivivoluo", name: "Nivivoluo", symbol: "nivivoluo", toBase: seximalBaseConversions.volume * Math.pow(6, -2) },
      { key: "millivoluo", name: "Millivoluo", symbol: "millivoluo", toBase: seximalBaseConversions.volume * Math.pow(6, -4) },
      { key: "tinivoluo", name: "Tinivoluo", symbol: "tinivoluo", toBase: seximalBaseConversions.volume * Math.pow(6, -6) },
      { key: "microvoluo", name: "Microvoluo", symbol: "microvoluo", toBase: seximalBaseConversions.volume * Math.pow(6, -8) },
      { key: "nanovoluo", name: "Nanovoluo", symbol: "nanovoluo", toBase: seximalBaseConversions.volume * Math.pow(6, -12) },
      { key: "picovoluo", name: "Picovoluo", symbol: "picovoluo", toBase: seximalBaseConversions.volume * Math.pow(6, -16) },
    ],
  },
  temperature: {
    si: [
      { key: "°C", name: "Celsius", symbol: "°C", toBase: 1 },
      { key: "K", name: "Kelvin", symbol: "K", toBase: 1 },
    ],
    us: [
      { key: "°F", name: "Fahrenheit", symbol: "°F", toBase: 1 },
      { key: "°R", name: "Rankine", symbol: "°R", toBase: 1 },
    ],
    seximal: [
      { key: "grado", name: "Grado Celsia", symbol: "grado", toBase: 1 },
    ],
  },
  pressure: {
    si: [
      { key: "GPa", name: "Gigapascals", symbol: "GPa", toBase: 1e9 },
      { key: "MPa", name: "Megapascals", symbol: "MPa", toBase: 1e6 },
      { key: "kPa", name: "Kilopascals", symbol: "kPa", toBase: 1000 },
      { key: "hPa", name: "Hectopascals", symbol: "hPa", toBase: 100 },
      { key: "Pa", name: "Pascals", symbol: "Pa", toBase: 1 },
      { key: "mPa", name: "Millipascals", symbol: "mPa", toBase: 0.001 },
      { key: "bar", name: "Bars", symbol: "bar", toBase: 100000 },
      { key: "mbar", name: "Millibars", symbol: "mbar", toBase: 100 },
      { key: "atm", name: "Atmospheres", symbol: "atm", toBase: 101325 },
      { key: "Torr", name: "Torr", symbol: "Torr", toBase: 133.322 },
    ],
    us: [
      { key: "psi", name: "PSI", symbol: "psi", toBase: 6894.757293168361 },
      { key: "psf", name: "PSF", symbol: "psf", toBase: 47.8803 },
      { key: "inHg", name: "Inches of Mercury", symbol: "inHg", toBase: 3386.39 },
      { key: "inH2O", name: "Inches of Water", symbol: "inH2O", toBase: 248.84 },
    ],
    seximal: [
      { key: "exapremuo", name: "Exapremuo", symbol: "exapremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, 24) },
      { key: "petapremuo", name: "Petapremuo", symbol: "petapremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, 20) },
      { key: "terapremuo", name: "Terapremuo", symbol: "terapremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, 16) },
      { key: "gigapremuo", name: "Gigapremuo", symbol: "gigapremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, 12) },
      { key: "megapremuo", name: "Megapremuo", symbol: "megapremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, 8) },
      { key: "largapremuo", name: "Largapremuo", symbol: "largapremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, 6) },
      { key: "kilapremuo", name: "Kilapremuo", symbol: "kilapremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, 4) },
      { key: "nifapremuo", name: "Nifapremuo", symbol: "nifapremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, 2) },
      { key: "unsepremuo", name: "Unsepremuo", symbol: "unsepremuo", toBase: seximalBaseConversions.pressure * 6 },
      { key: "premuo", name: "Premuo", symbol: "premuo", toBase: seximalBaseConversions.pressure },
      { key: "nivipremuo", name: "Nivipremuo", symbol: "nivipremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, -2) },
      { key: "millipremuo", name: "Millipremuo", symbol: "millipremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, -4) },
      { key: "tinipremuo", name: "Tinipremuo", symbol: "tinipremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, -6) },
      { key: "micropremuo", name: "Micropremuo", symbol: "micropremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, -8) },
      { key: "nanopremuo", name: "Nanopremuo", symbol: "nanopremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, -12) },
      { key: "picopremuo", name: "Picopremuo", symbol: "picopremuo", toBase: seximalBaseConversions.pressure * Math.pow(6, -16) },
    ],
  },
  time: {
    si: [
      { key: "Gs", name: "Gigaseconds", symbol: "Gs", toBase: 1e9 },
      { key: "Ms", name: "Megaseconds", symbol: "Ms", toBase: 1e6 },
      { key: "ks", name: "Kiloseconds", symbol: "ks", toBase: 1000 },
      { key: "yr", name: "Years", symbol: "yr", toBase: 31557600 },
      { key: "d", name: "Days", symbol: "d", toBase: 86400 },
      { key: "h", name: "Hours", symbol: "h", toBase: 3600 },
      { key: "min", name: "Minutes", symbol: "min", toBase: 60 },
      { key: "s", name: "Seconds", symbol: "s", toBase: 1 },
      { key: "ms", name: "Milliseconds", symbol: "ms", toBase: 0.001 },
      { key: "μs", name: "Microseconds", symbol: "μs", toBase: 1e-6 },
      { key: "ns", name: "Nanoseconds", symbol: "ns", toBase: 1e-9 },
      { key: "ps", name: "Picoseconds", symbol: "ps", toBase: 1e-12 },
    ],
    us: [
      { key: "yr", name: "Years", symbol: "yr", toBase: 31557600 },
      { key: "wk", name: "Weeks", symbol: "wk", toBase: 604800 },
      { key: "d", name: "Days", symbol: "d", toBase: 86400 },
      { key: "h", name: "Hours", symbol: "h", toBase: 3600 },
      { key: "min", name: "Minutes", symbol: "min", toBase: 60 },
      { key: "s", name: "Seconds", symbol: "s", toBase: 1 },
    ],
    seximal: [
      { key: "exatujo", name: "Exatujo", symbol: "exatujo", toBase: seximalBaseConversions.time * Math.pow(6, 24) },
      { key: "petatujo", name: "Petatujo", symbol: "petatujo", toBase: seximalBaseConversions.time * Math.pow(6, 20) },
      { key: "teratujo", name: "Teratujo", symbol: "teratujo", toBase: seximalBaseConversions.time * Math.pow(6, 16) },
      { key: "gigatujo", name: "Gigatujo", symbol: "gigatujo", toBase: seximalBaseConversions.time * Math.pow(6, 12) },
      { key: "megatujo", name: "Megatujo", symbol: "megatujo", toBase: seximalBaseConversions.time * Math.pow(6, 8) },
      { key: "largatujo", name: "Largatujo", symbol: "largatujo", toBase: seximalBaseConversions.time * Math.pow(6, 6) },
      { key: "kilatujo", name: "Kilatujo", symbol: "kilatujo", toBase: seximalBaseConversions.time * Math.pow(6, 4) },
      { key: "nifatujo", name: "Nifatujo", symbol: "nifatujo", toBase: seximalBaseConversions.time * Math.pow(6, 2) },
      { key: "unsetujo", name: "Unsetujo", symbol: "unsetujo", toBase: seximalBaseConversions.time * 6 },
      { key: "tujo", name: "Tujo", symbol: "tujo", toBase: seximalBaseConversions.time },
      { key: "nivitujo", name: "Nivitujo", symbol: "nivitujo", toBase: seximalBaseConversions.time * Math.pow(6, -2) },
      { key: "millitujo", name: "Millitujo", symbol: "millitujo", toBase: seximalBaseConversions.time * Math.pow(6, -4) },
      { key: "tinitujo", name: "Tinitujo", symbol: "tinitujo", toBase: seximalBaseConversions.time * Math.pow(6, -6) },
      { key: "microtujo", name: "Microtujo", symbol: "microtujo", toBase: seximalBaseConversions.time * Math.pow(6, -8) },
      { key: "nanotujo", name: "Nanotujo", symbol: "nanotujo", toBase: seximalBaseConversions.time * Math.pow(6, -12) },
      { key: "picotujo", name: "Picotujo", symbol: "picotujo", toBase: seximalBaseConversions.time * Math.pow(6, -16) },
    ],
  },
  speed: {
    si: [
      { key: "m/s", name: "Meters per Second", symbol: "m/s", toBase: 1 },
      { key: "km/h", name: "Kilometers per Hour", symbol: "km/h", toBase: 0.2777777777777778 },
      { key: "km/s", name: "Kilometers per Second", symbol: "km/s", toBase: 1000 },
    ],
    us: [
      { key: "c", name: "Speed of Light", symbol: "c", toBase: 299792458 },
      { key: "Mach", name: "Mach (at sea level)", symbol: "Mach", toBase: 343 },
      { key: "mph", name: "Miles per Hour", symbol: "mph", toBase: 0.44704 },
      { key: "ft/s", name: "Feet per Second", symbol: "ft/s", toBase: 0.3048 },
      { key: "kn", name: "Knots", symbol: "kn", toBase: 0.514444 },
    ],
    seximal: [
      { key: "exapido", name: "Exapido", symbol: "exapido", toBase: seximalBaseConversions.speed * Math.pow(6, 24) },
      { key: "petapido", name: "Petapido", symbol: "petapido", toBase: seximalBaseConversions.speed * Math.pow(6, 20) },
      { key: "terapido", name: "Terapido", symbol: "terapido", toBase: seximalBaseConversions.speed * Math.pow(6, 16) },
      { key: "gigapido", name: "Gigapido", symbol: "gigapido", toBase: seximalBaseConversions.speed * Math.pow(6, 12) },
      { key: "megapido", name: "Megapido", symbol: "megapido", toBase: seximalBaseConversions.speed * Math.pow(6, 8) },
      { key: "largapido", name: "Largapido", symbol: "largapido", toBase: seximalBaseConversions.speed * Math.pow(6, 6) },
      { key: "kilapido", name: "Kilapido", symbol: "kilapido", toBase: seximalBaseConversions.speed * Math.pow(6, 4) },
      { key: "nifapido", name: "Nifapido", symbol: "nifapido", toBase: seximalBaseConversions.speed * Math.pow(6, 2) },
      { key: "unsepido", name: "Unsepido", symbol: "unsepido", toBase: seximalBaseConversions.speed * 6 },
      { key: "pido", name: "Pido", symbol: "pido", toBase: seximalBaseConversions.speed },
      { key: "nivipido", name: "Nivipido", symbol: "nivipido", toBase: seximalBaseConversions.speed * Math.pow(6, -2) },
      { key: "millipido", name: "Millipido", symbol: "millipido", toBase: seximalBaseConversions.speed * Math.pow(6, -4) },
      { key: "tinipido", name: "Tinipido", symbol: "tinipido", toBase: seximalBaseConversions.speed * Math.pow(6, -6) },
      { key: "micropido", name: "Micropido", symbol: "micropido", toBase: seximalBaseConversions.speed * Math.pow(6, -8) },
      { key: "nanopido", name: "Nanopido", symbol: "nanopido", toBase: seximalBaseConversions.speed * Math.pow(6, -12) },
      { key: "picopido", name: "Picopido", symbol: "picopido", toBase: seximalBaseConversions.speed * Math.pow(6, -16) },
    ],
  },
  acceleration: {
    si: [
      { key: "m/s²", name: "Meters per Second²", symbol: "m/s²", toBase: 1 },
      { key: "km/s²", name: "Kilometers per Second²", symbol: "km/s²", toBase: 1000 },
      { key: "g", name: "Standard Gravity", symbol: "g", toBase: 9.80665 },
    ],
    us: [
      { key: "ft/s²", name: "Feet per Second²", symbol: "ft/s²", toBase: 0.3048 },
      { key: "in/s²", name: "Inches per Second²", symbol: "in/s²", toBase: 0.0254 },
      { key: "g", name: "Standard Gravity", symbol: "g", toBase: 9.80665 },
    ],
    seximal: [
      { key: "exagravito", name: "Exagravito", symbol: "exagravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, 24) },
      { key: "petagravito", name: "Petagravito", symbol: "petagravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, 20) },
      { key: "teragravito", name: "Teragravito", symbol: "teragravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, 16) },
      { key: "gigagravito", name: "Gigagravito", symbol: "gigagravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, 12) },
      { key: "megagravito", name: "Megagravito", symbol: "megagravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, 8) },
      { key: "largagravito", name: "Largagravito", symbol: "largagravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, 6) },
      { key: "kilagravito", name: "Kilagravito", symbol: "kilagravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, 4) },
      { key: "nifagravito", name: "Nifagravito", symbol: "nifagravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, 2) },
      { key: "unsegravito", name: "Unsegravito", symbol: "unsegravito", toBase: seximalBaseConversions.acceleration * 6 },
      { key: "gravito", name: "Gravito", symbol: "gravito", toBase: seximalBaseConversions.acceleration },
      { key: "nivigravito", name: "Nivigravito", symbol: "nivigravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, -2) },
      { key: "milligravito", name: "Milligravito", symbol: "milligravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, -4) },
      { key: "tinigravito", name: "Tinigravito", symbol: "tinigravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, -6) },
      { key: "microgravito", name: "Microgravito", symbol: "microgravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, -8) },
      { key: "nanogravito", name: "Nanogravito", symbol: "nanogravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, -12) },
      { key: "picogravito", name: "Picogravito", symbol: "picogravito", toBase: seximalBaseConversions.acceleration * Math.pow(6, -16) },
    ],
  },
  force: {
    si: [
      { key: "GN", name: "Giganewtons", symbol: "GN", toBase: 1e9 },
      { key: "MN", name: "Meganewtons", symbol: "MN", toBase: 1e6 },
      { key: "kN", name: "Kilonewtons", symbol: "kN", toBase: 1000 },
      { key: "N", name: "Newtons", symbol: "N", toBase: 1 },
      { key: "mN", name: "Millinewtons", symbol: "mN", toBase: 0.001 },
      { key: "μN", name: "Micronewtons", symbol: "μN", toBase: 1e-6 },
      { key: "nN", name: "Nanonewtons", symbol: "nN", toBase: 1e-9 },
      { key: "dyn", name: "Dynes", symbol: "dyn", toBase: 1e-5 },
    ],
    us: [
      { key: "lbf", name: "Pound-force", symbol: "lbf", toBase: 4.44822 },
      { key: "ozf", name: "Ounce-force", symbol: "ozf", toBase: 0.278014 },
      { key: "kip", name: "Kip-force", symbol: "kip", toBase: 4448.22 },
    ],
    seximal: [
      { key: "exaforso", name: "Exaforso", symbol: "exaforso", toBase: seximalBaseConversions.force * Math.pow(6, 24) },
      { key: "petaforso", name: "Petaforso", symbol: "petaforso", toBase: seximalBaseConversions.force * Math.pow(6, 20) },
      { key: "teraforso", name: "Teraforso", symbol: "teraforso", toBase: seximalBaseConversions.force * Math.pow(6, 16) },
      { key: "gigaforso", name: "Gigaforso", symbol: "gigaforso", toBase: seximalBaseConversions.force * Math.pow(6, 12) },
      { key: "megaforso", name: "Megaforso", symbol: "megaforso", toBase: seximalBaseConversions.force * Math.pow(6, 8) },
      { key: "largaforso", name: "Largaforso", symbol: "largaforso", toBase: seximalBaseConversions.force * Math.pow(6, 6) },
      { key: "kilaforso", name: "Kilaforso", symbol: "kilaforso", toBase: seximalBaseConversions.force * Math.pow(6, 4) },
      { key: "nifaforso", name: "Nifaforso", symbol: "nifaforso", toBase: seximalBaseConversions.force * Math.pow(6, 2) },
      { key: "unseforso", name: "Unseforso", symbol: "unseforso", toBase: seximalBaseConversions.force * 6 },
      { key: "forso", name: "Forso", symbol: "forso", toBase: seximalBaseConversions.force },
      { key: "niviforso", name: "Niviforso", symbol: "niviforso", toBase: seximalBaseConversions.force * Math.pow(6, -2) },
      { key: "milliforso", name: "Milliforso", symbol: "milliforso", toBase: seximalBaseConversions.force * Math.pow(6, -4) },
      { key: "tiniforso", name: "Tiniforso", symbol: "tiniforso", toBase: seximalBaseConversions.force * Math.pow(6, -6) },
      { key: "microforso", name: "Microforso", symbol: "microforso", toBase: seximalBaseConversions.force * Math.pow(6, -8) },
      { key: "nanoforso", name: "Nanoforso", symbol: "nanoforso", toBase: seximalBaseConversions.force * Math.pow(6, -12) },
      { key: "picoforso", name: "Picoforso", symbol: "picoforso", toBase: seximalBaseConversions.force * Math.pow(6, -16) },
    ],
  },
  energy: {
    si: [
      { key: "TJ", name: "Terajoules", symbol: "TJ", toBase: 1e12 },
      { key: "GJ", name: "Gigajoules", symbol: "GJ", toBase: 1e9 },
      { key: "MJ", name: "Megajoules", symbol: "MJ", toBase: 1e6 },
      { key: "kJ", name: "Kilojoules", symbol: "kJ", toBase: 1000 },
      { key: "J", name: "Joules", symbol: "J", toBase: 1 },
      { key: "mJ", name: "Millijoules", symbol: "mJ", toBase: 0.001 },
      { key: "μJ", name: "Microjoules", symbol: "μJ", toBase: 1e-6 },
      { key: "nJ", name: "Nanojoules", symbol: "nJ", toBase: 1e-9 },
      { key: "TWh", name: "Terawatt-hours", symbol: "TWh", toBase: 3.6e15 },
      { key: "GWh", name: "Gigawatt-hours", symbol: "GWh", toBase: 3.6e12 },
      { key: "MWh", name: "Megawatt-hours", symbol: "MWh", toBase: 3.6e9 },
      { key: "kWh", name: "Kilowatt-hours", symbol: "kWh", toBase: 3.6e6 },
      { key: "Wh", name: "Watt-hours", symbol: "Wh", toBase: 3600 },
      { key: "eV", name: "Electron Volts", symbol: "eV", toBase: 1.602176634e-19 },
    ],
    us: [
      { key: "therm", name: "Therms", symbol: "therm", toBase: 105505600 },
      { key: "BTU", name: "British Thermal Units", symbol: "BTU", toBase: 1055.06 },
      { key: "cal", name: "Calories", symbol: "cal", toBase: 4.184 },
      { key: "kcal", name: "Kilocalories", symbol: "kcal", toBase: 4184 },
      { key: "ft·lbf", name: "Foot-pounds", symbol: "ft·lbf", toBase: 1.35582 },
    ],
    seximal: [
      { key: "exanergo", name: "Exanergo", symbol: "exanergo", toBase: seximalBaseConversions.energy * Math.pow(6, 24) },
      { key: "petanergo", name: "Petanergo", symbol: "petanergo", toBase: seximalBaseConversions.energy * Math.pow(6, 20) },
      { key: "teranergo", name: "Teranergo", symbol: "teranergo", toBase: seximalBaseConversions.energy * Math.pow(6, 16) },
      { key: "giganergo", name: "Giganergo", symbol: "giganergo", toBase: seximalBaseConversions.energy * Math.pow(6, 12) },
      { key: "meganergo", name: "Meganergo", symbol: "meganergo", toBase: seximalBaseConversions.energy * Math.pow(6, 8) },
      { key: "larganergo", name: "Larganergo", symbol: "larganergo", toBase: seximalBaseConversions.energy * Math.pow(6, 6) },
      { key: "kilanergo", name: "Kilanergo", symbol: "kilanergo", toBase: seximalBaseConversions.energy * Math.pow(6, 4) },
      { key: "nifanergo", name: "Nifanergo", symbol: "nifanergo", toBase: seximalBaseConversions.energy * Math.pow(6, 2) },
      { key: "unsenergo", name: "Unsenergo", symbol: "unsenergo", toBase: seximalBaseConversions.energy * 6 },
      { key: "nergo", name: "Nergo", symbol: "nergo", toBase: seximalBaseConversions.energy },
      { key: "nivinergo", name: "Nivinergo", symbol: "nivinergo", toBase: seximalBaseConversions.energy * Math.pow(6, -2) },
      { key: "millinergo", name: "Millinergo", symbol: "millinergo", toBase: seximalBaseConversions.energy * Math.pow(6, -4) },
      { key: "tininergo", name: "Tininergo", symbol: "tininergo", toBase: seximalBaseConversions.energy * Math.pow(6, -6) },
      { key: "micronergo", name: "Micronergo", symbol: "micronergo", toBase: seximalBaseConversions.energy * Math.pow(6, -8) },
      { key: "nanonergo", name: "Nanonergo", symbol: "nanonergo", toBase: seximalBaseConversions.energy * Math.pow(6, -12) },
      { key: "piconergo", name: "Piconergo", symbol: "piconergo", toBase: seximalBaseConversions.energy * Math.pow(6, -16) },
    ],
  },
  frequency: {
    si: [
      { key: "THz", name: "Terahertz", symbol: "THz", toBase: 1e12 },
      { key: "GHz", name: "Gigahertz", symbol: "GHz", toBase: 1e9 },
      { key: "MHz", name: "Megahertz", symbol: "MHz", toBase: 1e6 },
      { key: "kHz", name: "Kilohertz", symbol: "kHz", toBase: 1000 },
      { key: "Hz", name: "Hertz", symbol: "Hz", toBase: 1 },
      { key: "mHz", name: "Millihertz", symbol: "mHz", toBase: 0.001 },
      { key: "μHz", name: "Microhertz", symbol: "μHz", toBase: 1e-6 },
      { key: "rpm", name: "Revolutions per Minute", symbol: "rpm", toBase: 1/60 },
    ],
    us: [
      { key: "GHz", name: "Gigahertz", symbol: "GHz", toBase: 1e9 },
      { key: "MHz", name: "Megahertz", symbol: "MHz", toBase: 1e6 },
      { key: "kHz", name: "Kilohertz", symbol: "kHz", toBase: 1000 },
      { key: "Hz", name: "Hertz", symbol: "Hz", toBase: 1 },
      { key: "rpm", name: "Revolutions per Minute", symbol: "rpm", toBase: 1/60 },
      { key: "cps", name: "Cycles per Second", symbol: "cps", toBase: 1 },
    ],
    seximal: [
      { key: "exafreko", name: "Exafreko", symbol: "exafreko", toBase: seximalBaseConversions.frequency * Math.pow(6, 24) },
      { key: "petafreko", name: "Petafreko", symbol: "petafreko", toBase: seximalBaseConversions.frequency * Math.pow(6, 20) },
      { key: "terafreko", name: "Terafreko", symbol: "terafreko", toBase: seximalBaseConversions.frequency * Math.pow(6, 16) },
      { key: "gigafreko", name: "Gigafreko", symbol: "gigafreko", toBase: seximalBaseConversions.frequency * Math.pow(6, 12) },
      { key: "megafreko", name: "Megafreko", symbol: "megafreko", toBase: seximalBaseConversions.frequency * Math.pow(6, 8) },
      { key: "largafreko", name: "Largafreko", symbol: "largafreko", toBase: seximalBaseConversions.frequency * Math.pow(6, 6) },
      { key: "kilafreko", name: "Kilafreko", symbol: "kilafreko", toBase: seximalBaseConversions.frequency * Math.pow(6, 4) },
      { key: "nifafreko", name: "Nifafreko", symbol: "nifafreko", toBase: seximalBaseConversions.frequency * Math.pow(6, 2) },
      { key: "unsefreko", name: "Unsefreko", symbol: "unsefreko", toBase: seximalBaseConversions.frequency * 6 },
      { key: "freko", name: "Freko", symbol: "freko", toBase: seximalBaseConversions.frequency },
      { key: "nivifreko", name: "Nivifreko", symbol: "nivifreko", toBase: seximalBaseConversions.frequency * Math.pow(6, -2) },
      { key: "millifreko", name: "Millifreko", symbol: "millifreko", toBase: seximalBaseConversions.frequency * Math.pow(6, -4) },
      { key: "tinifreko", name: "Tinifreko", symbol: "tinifreko", toBase: seximalBaseConversions.frequency * Math.pow(6, -6) },
      { key: "microfreko", name: "Microfreko", symbol: "microfreko", toBase: seximalBaseConversions.frequency * Math.pow(6, -8) },
      { key: "nanofreko", name: "Nanofreko", symbol: "nanofreko", toBase: seximalBaseConversions.frequency * Math.pow(6, -12) },
      { key: "picofreko", name: "Picofreko", symbol: "picofreko", toBase: seximalBaseConversions.frequency * Math.pow(6, -16) },
    ],
  },
  power: {
    si: [
      { key: "TW", name: "Terawatts", symbol: "TW", toBase: 1e12 },
      { key: "GW", name: "Gigawatts", symbol: "GW", toBase: 1e9 },
      { key: "MW", name: "Megawatts", symbol: "MW", toBase: 1e6 },
      { key: "kW", name: "Kilowatts", symbol: "kW", toBase: 1000 },
      { key: "W", name: "Watts", symbol: "W", toBase: 1 },
      { key: "mW", name: "Milliwatts", symbol: "mW", toBase: 0.001 },
      { key: "μW", name: "Microwatts", symbol: "μW", toBase: 1e-6 },
      { key: "nW", name: "Nanowatts", symbol: "nW", toBase: 1e-9 },
      { key: "hp", name: "Metric Horsepower", symbol: "hp", toBase: 735.499 },
    ],
    us: [
      { key: "hp", name: "Horsepower", symbol: "hp", toBase: 745.7 },
      { key: "BTU/h", name: "BTU per Hour", symbol: "BTU/h", toBase: 0.293071 },
      { key: "BTU/s", name: "BTU per Second", symbol: "BTU/s", toBase: 1055.06 },
      { key: "ft·lbf/s", name: "Foot-pounds per Second", symbol: "ft·lbf/s", toBase: 1.35582 },
      { key: "ton", name: "Tons of Refrigeration", symbol: "ton", toBase: 3516.85 },
    ],
    seximal: [
      { key: "exapaŭo", name: "Exapaŭo", symbol: "exapaŭo", toBase: seximalBaseConversions.power * Math.pow(6, 24) },
      { key: "petapaŭo", name: "Petapaŭo", symbol: "petapaŭo", toBase: seximalBaseConversions.power * Math.pow(6, 20) },
      { key: "terapaŭo", name: "Terapaŭo", symbol: "terapaŭo", toBase: seximalBaseConversions.power * Math.pow(6, 16) },
      { key: "gigapaŭo", name: "Gigapaŭo", symbol: "gigapaŭo", toBase: seximalBaseConversions.power * Math.pow(6, 12) },
      { key: "megapaŭo", name: "Megapaŭo", symbol: "megapaŭo", toBase: seximalBaseConversions.power * Math.pow(6, 8) },
      { key: "largapaŭo", name: "Largapaŭo", symbol: "largapaŭo", toBase: seximalBaseConversions.power * Math.pow(6, 6) },
      { key: "kilapaŭo", name: "Kilapaŭo", symbol: "kilapaŭo", toBase: seximalBaseConversions.power * Math.pow(6, 4) },
      { key: "nifapaŭo", name: "Nifapaŭo", symbol: "nifapaŭo", toBase: seximalBaseConversions.power * Math.pow(6, 2) },
      { key: "unsepaŭo", name: "Unsepaŭo", symbol: "unsepaŭo", toBase: seximalBaseConversions.power * 6 },
      { key: "paŭo", name: "Paŭo", symbol: "paŭo", toBase: seximalBaseConversions.power },
      { key: "nivipaŭo", name: "Nivipaŭo", symbol: "nivipaŭo", toBase: seximalBaseConversions.power * Math.pow(6, -2) },
      { key: "millipaŭo", name: "Millipaŭo", symbol: "millipaŭo", toBase: seximalBaseConversions.power * Math.pow(6, -4) },
      { key: "tinipaŭo", name: "Tinipaŭo", symbol: "tinipaŭo", toBase: seximalBaseConversions.power * Math.pow(6, -6) },
      { key: "micropaŭo", name: "Micropaŭo", symbol: "micropaŭo", toBase: seximalBaseConversions.power * Math.pow(6, -8) },
      { key: "nanopaŭo", name: "Nanopaŭo", symbol: "nanopaŭo", toBase: seximalBaseConversions.power * Math.pow(6, -12) },
      { key: "picopaŭo", name: "Picopaŭo", symbol: "picopaŭo", toBase: seximalBaseConversions.power * Math.pow(6, -16) },
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

export function formatNumber(value: number, sigFigs: number = 6): string {
  if (value === 0) {
    return "0";
  }
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  
  // Use scientific notation for very large or very small numbers
  if (absValue >= 1000000 || absValue < 0.001) {
    // Ensure consistent significant figures in scientific notation
    return sign + absValue.toExponential(sigFigs - 1);
  }
  
  // For normal range numbers, use significant figures approach
  const magnitude = Math.floor(Math.log10(absValue));
  const decimalPlaces = Math.max(0, sigFigs - magnitude - 1);
  const result = absValue.toFixed(decimalPlaces);
  
  // Remove trailing zeros after decimal point
  const trimmed = parseFloat(result).toString();
  return sign + trimmed;
}
