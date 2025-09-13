// Seximal (base-6) number system utilities

export function decimalToSeximal(decimal: number): string {
  if (decimal === 0) return "0";
  
  const isNegative = decimal < 0;
  decimal = Math.abs(decimal);
  
  const integerPart = Math.floor(decimal);
  const fractionalPart = decimal - integerPart;
  
  // Convert integer part
  let integerSeximal = "";
  let num = integerPart;
  if (num === 0) {
    integerSeximal = "0";
  } else {
    while (num > 0) {
      integerSeximal = (num % 6).toString() + integerSeximal;
      num = Math.floor(num / 6);
    }
  }
  
  // Convert fractional part with proper rounding
  let fractionalSeximal = "";
  let frac = fractionalPart;
  let precision = 0;
  const maxPrecision = 6;
  
  // Store digits for potential rounding
  const digits: number[] = [];
  
  // Generate one extra digit for rounding decision
  while (frac > 0 && precision <= maxPrecision) {
    frac *= 6;
    const digit = Math.floor(frac);
    digits.push(digit);
    frac -= digit;
    precision++;
  }
  
  // Implement proper rounding
  if (digits.length > maxPrecision) {
    // Check if we should round up based on the extra digit
    if (digits[maxPrecision] >= 3) {
      // Round up by carrying over
      let carry = 1;
      for (let i = maxPrecision - 1; i >= 0 && carry; i--) {
        digits[i] += carry;
        if (digits[i] >= 6) {
          digits[i] = 0;
          carry = 1;
        } else {
          carry = 0;
        }
      }
      
      // If carry propagates to integer part
      if (carry) {
        const intValue = parseInt(integerSeximal, 6) + 1;
        integerSeximal = intValue.toString(6);
      }
    }
    // Remove the extra digit
    digits.pop();
  }
  
  // Build fractional string, removing trailing zeros
  for (let i = 0; i < digits.length; i++) {
    fractionalSeximal += digits[i].toString();
  }
  
  // Remove trailing zeros
  fractionalSeximal = fractionalSeximal.replace(/0+$/, "");
  
  let result = integerSeximal;
  if (fractionalSeximal) {
    result += "." + fractionalSeximal;
  }
  
  return isNegative ? "-" + result : result;
}

export function seximalToDecimal(seximal: string): number {
  if (!isValidSeximal(seximal)) {
    throw new Error("Invalid seximal number");
  }
  
  const isNegative = seximal.startsWith("-");
  const cleanSeximal = seximal.replace("-", "");
  
  const parts = cleanSeximal.split(".");
  const integerPart = parts[0] || "0";
  const fractionalPart = parts[1] || "";
  
  // Convert integer part
  let decimal = 0;
  for (let i = 0; i < integerPart.length; i++) {
    const digit = parseInt(integerPart[integerPart.length - 1 - i]);
    decimal += digit * Math.pow(6, i);
  }
  
  // Convert fractional part
  for (let i = 0; i < fractionalPart.length; i++) {
    const digit = parseInt(fractionalPart[i]);
    decimal += digit * Math.pow(6, -(i + 1));
  }
  
  return isNegative ? -decimal : decimal;
}

export function isValidSeximal(seximal: string): boolean {
  const cleanSeximal = seximal.replace("-", "");
  return /^[0-5]*\.?[0-5]*$/.test(cleanSeximal) && cleanSeximal !== "" && cleanSeximal !== ".";
}

// Seximal prefixes and their multipliers
export const seximalPrefixes = {
  // Positive powers of 6
  "sese": Math.pow(6, 6),    // 46,656
  "kvinse": Math.pow(6, 5),  // 7,776
  "kvarse": Math.pow(6, 4),  // 1,296
  "trise": Math.pow(6, 3),   // 216
  "duse": Math.pow(6, 2),    // 36
  "unse": Math.pow(6, 1),    // 6
  "": 1,                     // base unit
  // Negative powers of 6
  "undo": Math.pow(6, -1),   // 1/6
  "dudo": Math.pow(6, -2),   // 1/36
  "trido": Math.pow(6, -3),  // 1/216
  "kvardo": Math.pow(6, -4), // 1/1296
  "kvindo": Math.pow(6, -5), // 1/7776
  "sedo": Math.pow(6, -6),   // 1/46656
};

export function getPrefixMultiplier(prefix: string): number {
  return seximalPrefixes[prefix as keyof typeof seximalPrefixes] || 1;
}
