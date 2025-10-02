// Test script to verify seximal timer conversion logic
// Test cases from the user requirements

const testCases = [
  { input: 600, expected: "00:10:00.0" }, // 600 standard seconds
  { input: 600, expected: "00:10:00.0" }, // 10 standard minutes (600 seconds)
  { input: 1200, expected: "00:20:00.0" }, // 20 standard minutes (1200 seconds)
  { input: 1800, expected: "00:30:00.0" }, // 30 standard minutes (1800 seconds)
  { input: 2400, expected: "00:40:00.0" }, // 40 standard minutes (2400 seconds)
  { input: 3000, expected: "00:50:00.0" }, // 50 standard minutes (3000 seconds)
  { input: 3600, expected: "01:00:00.0" }, // 60 standard minutes (3600 seconds)
  { input: 3600, expected: "01:00:00.0" }, // 1 standard hour (3600 seconds)
  { input: 7200, expected: "02:00:00.0" }, // 2 standard hours (7200 seconds)
  { input: 21600, expected: "10:00:00.0" }, // 6 standard hours (21600 seconds)
  { input: 129600, expected: "100:00:00.0" }, // 36 standard hours (129600 seconds)
];

function convertStandardToSeximalTime(totalSeconds) {
  // Convert decimal seconds to seximal time units properly
  // 1 seximal second = 25/9 real seconds
  // So real seconds to seximal seconds conversion factor is 9/25

  // First convert to total seximal seconds (with fractional part)
  const totalSeximalSecondsWithFraction = totalSeconds * (9/25);

  // Split into whole and fractional parts
  const wholeSeximalSeconds = Math.floor(totalSeximalSecondsWithFraction);
  const fractionalSeximalSeconds = totalSeximalSecondsWithFraction - wholeSeximalSeconds;

  // Convert to seximal time units (base 6)
  const seximalHours = Math.floor(wholeSeximalSeconds / 216); // 6^3 seximal seconds per seximal hour
  const remainingAfterHours = wholeSeximalSeconds % 216;

  const seximalMinutes = Math.floor(remainingAfterHours / 36); // 6^2 seximal seconds per seximal minute
  const seximalSeconds = remainingAfterHours % 36; // 6^1 seximal seconds

  // Calculate sixths of a seximal second (0-5 in base 6)
  // Since we're showing fractional seximal seconds, we need to convert the fractional part
  const sixths = Math.floor(fractionalSeximalSeconds * 6) % 6;

  // Convert to seximal digits (base 6)
  const toSeximalDigit = (num) => {
    return num.toString(6);
  };

  return {
    hours: toSeximalDigit(seximalHours),
    minutes: toSeximalDigit(seximalMinutes),
    seconds: toSeximalDigit(seximalSeconds),
    sixths: sixths.toString(6)
  };
}

function formatSeximalTimeDisplay(seximalTime) {
  return `${seximalTime.hours.padStart(2, "0")}:${seximalTime.minutes.padStart(2, "0")}:${seximalTime.seconds.padStart(2, "0")}.${seximalTime.sixths}`;
}

console.log("Testing Seximal Timer Conversion Logic");
console.log("=====================================");

let allTestsPassed = true;

testCases.forEach((testCase, index) => {
  const result = convertStandardToSeximalTime(testCase.input);
  const formattedResult = formatSeximalTimeDisplay(result);
  const passed = formattedResult === testCase.expected;

  console.log(`Test ${index + 1}: ${testCase.input} seconds`);
  console.log(`  Expected: ${testCase.expected}`);
  console.log(`  Got:      ${formattedResult}`);
  console.log(`  Status:   ${passed ? '✅ PASS' : '❌ FAIL'}`);
  console.log();

  if (!passed) {
    allTestsPassed = false;
  }
});

console.log("=====================================");
console.log(`Overall Result: ${allTestsPassed ? '✅ ALL TESTS PASSED' : '❌ SOME TESTS FAILED'}`);
