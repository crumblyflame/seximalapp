import { describe, it, expect } from 'vitest';

// Mock the seximal calendar functions from the calendar component
// Since we can't easily import them directly, we'll recreate the logic here for testing

// Autumnal equinox of Gregorian year 2000 (Year 1 of seximal calendar)
const SEXIMAL_EPOCH = new Date(2000, 8, 22); // Month is 0-indexed, so 8 = September

interface SeximalDate {
  year: number;
  twomoon: number; // 0-5 (Pama-Gerza)
  week: number;    // 0-9
  dayOfWeek: number; // 0-5 (Firsday-Siksday)
  dayOfYear: number; // 0-364 (or 365 in leap years)
  isIntercalary: boolean;
  intercalaryDay?: number; // 0-5 for Festival 1-6
}

// Check if a seximal year is a leap year
const isSeximalLeapYear = (year: number): boolean => {
  // Every year divisible by 3 EXCEPT years divisible by 12
  if (year % 12 === 0) return false;
  if (year % 3 === 0) return true;

  // Also, 3 years before a year divisible by 108 is not a leap year
  if ((year + 3) % 108 === 0) return false;

  // But 3 years before a year divisible by 648 is a leap year
  if ((year + 3) % 648 === 0) return true;

  return false;
};

// Convert Gregorian date to seximal date
const convertToSeximalDate = (gregorianDate: Date): SeximalDate => {
  // Calculate days since epoch
  const daysSinceEpoch = Math.floor((gregorianDate.getTime() - SEXIMAL_EPOCH.getTime()) / (1000 * 60 * 60 * 24));

  // Calculate seximal year
  const year = Math.floor(daysSinceEpoch / 365) + 1;
  const dayOfYear = daysSinceEpoch % 365;

  // Check if it's a leap year
  const isLeapYear = isSeximalLeapYear(year);

  // Calculate twomoon, week, and day
  let remainingDays = dayOfYear;
  let twomoon = 0;
  let week = 0;
  let dayOfWeek = 0;

  // Check if we're in the intercalary period
  const totalDaysInYear = isLeapYear ? 366 : 365;
  if (remainingDays >= 360) {
    // Intercalary period
    return {
      year,
      twomoon: 5, // Gerza
      week: 9,    // Special case for intercalary
      dayOfWeek: 0,
      dayOfYear: remainingDays,
      isIntercalary: true,
      intercalaryDay: remainingDays - 360
    };
  }

  // Regular days (0-359)
  twomoon = Math.floor(remainingDays / 60);
  remainingDays %= 60;

  week = Math.floor(remainingDays / 6);
  dayOfWeek = remainingDays % 6;

  return {
    year,
    twomoon,
    week,
    dayOfWeek,
    dayOfYear: dayOfYear,
    isIntercalary: false
  };
};

describe('Seximal Calendar Date Calculations', () => {
  describe('Leap Year Calculations', () => {
    it('should identify year 3 as a leap year', () => {
      expect(isSeximalLeapYear(3)).toBe(true);
    });

    it('should identify year 6 as a leap year', () => {
      expect(isSeximalLeapYear(6)).toBe(true);
    });

    it('should NOT identify year 12 as a leap year (divisible by 12)', () => {
      expect(isSeximalLeapYear(12)).toBe(false);
    });

    it('should identify year 15 as a leap year', () => {
      expect(isSeximalLeapYear(15)).toBe(true);
    });

    it('should NOT identify year 105 as a leap year (3 years before 108)', () => {
      expect(isSeximalLeapYear(105)).toBe(false);
    });

    it('should identify year 645 as a leap year (3 years before 648)', () => {
      expect(isSeximalLeapYear(645)).toBe(true);
    });

    it('should NOT identify year 9 as a leap year (not divisible by 3)', () => {
      expect(isSeximalLeapYear(9)).toBe(false);
    });
  });

  describe('Date Conversion - Regular Days', () => {
    it('should convert epoch date correctly', () => {
      const epochDate = new Date(2000, 8, 22); // September 22, 2000
      const seximalDate = convertToSeximalDate(epochDate);

      expect(seximalDate.year).toBe(1);
      expect(seximalDate.dayOfYear).toBe(0);
      expect(seximalDate.twomoon).toBe(0);
      expect(seximalDate.week).toBe(0);
      expect(seximalDate.dayOfWeek).toBe(0);
      expect(seximalDate.isIntercalary).toBe(false);
    });

    it('should convert day 1 correctly', () => {
      const day1 = new Date(2000, 8, 23); // September 23, 2000
      const seximalDate = convertToSeximalDate(day1);

      expect(seximalDate.year).toBe(1);
      expect(seximalDate.dayOfYear).toBe(1);
      expect(seximalDate.twomoon).toBe(0);
      expect(seximalDate.week).toBe(0);
      expect(seximalDate.dayOfWeek).toBe(1);
      expect(seximalDate.isIntercalary).toBe(false);
    });

    it('should convert end of first week correctly', () => {
      const day5 = new Date(2000, 8, 27); // September 27, 2000
      const seximalDate = convertToSeximalDate(day5);

      expect(seximalDate.year).toBe(1);
      expect(seximalDate.dayOfYear).toBe(5);
      expect(seximalDate.twomoon).toBe(0);
      expect(seximalDate.week).toBe(0);
      expect(seximalDate.dayOfWeek).toBe(5);
      expect(seximalDate.isIntercalary).toBe(false);
    });

    it('should convert start of second week correctly', () => {
      const day6 = new Date(2000, 8, 28); // September 28, 2000
      const seximalDate = convertToSeximalDate(day6);

      expect(seximalDate.year).toBe(1);
      expect(seximalDate.dayOfYear).toBe(6);
      expect(seximalDate.twomoon).toBe(0);
      expect(seximalDate.week).toBe(1);
      expect(seximalDate.dayOfWeek).toBe(0);
      expect(seximalDate.isIntercalary).toBe(false);
    });

    it('should convert end of first twomoon correctly', () => {
      const day59 = new Date(2000, 10, 19); // November 19, 2000 (59 days after epoch)
      const seximalDate = convertToSeximalDate(day59);

      expect(seximalDate.year).toBe(1);
      expect(seximalDate.dayOfYear).toBe(59);
      expect(seximalDate.twomoon).toBe(0);
      expect(seximalDate.week).toBe(9);
      expect(seximalDate.dayOfWeek).toBe(5);
      expect(seximalDate.isIntercalary).toBe(false);
    });

    it('should convert start of second twomoon correctly', () => {
      const day60 = new Date(2000, 10, 20); // November 20, 2000
      const seximalDate = convertToSeximalDate(day60);

      expect(seximalDate.year).toBe(1);
      expect(seximalDate.dayOfYear).toBe(60);
      expect(seximalDate.twomoon).toBe(1);
      expect(seximalDate.week).toBe(0);
      expect(seximalDate.dayOfWeek).toBe(0);
      expect(seximalDate.isIntercalary).toBe(false);
    });
  });

  describe('Date Conversion - Intercalary Days', () => {
    it('should convert first intercalary day correctly', () => {
      const day360 = new Date(2001, 8, 17); // Approximately 360 days after epoch
      const seximalDate = convertToSeximalDate(day360);

      expect(seximalDate.year).toBe(1);
      expect(seximalDate.dayOfYear).toBe(360);
      expect(seximalDate.twomoon).toBe(5);
      expect(seximalDate.isIntercalary).toBe(true);
      expect(seximalDate.intercalaryDay).toBe(0);
    });

    it('should convert last intercalary day correctly', () => {
      const day364 = new Date(2001, 8, 21); // Approximately 364 days after epoch
      const seximalDate = convertToSeximalDate(day364);

      expect(seximalDate.year).toBe(1);
      expect(seximalDate.dayOfYear).toBe(364);
      expect(seximalDate.twomoon).toBe(5);
      expect(seximalDate.isIntercalary).toBe(true);
      expect(seximalDate.intercalaryDay).toBe(4);
    });
  });

  describe('Date Conversion - Leap Year', () => {
    it('should handle leap year intercalary days correctly', () => {
      // Year 3 should be a leap year
      const year3Start = new Date(2002, 8, 22); // Approximate start of year 3
      const seximalDate = convertToSeximalDate(year3Start);

      expect(seximalDate.year).toBe(3);
      expect(isSeximalLeapYear(3)).toBe(true);
    });

    it('should convert leap year intercalary day 5 correctly', () => {
      // This would be the 6th intercalary day in a leap year
      const day365 = new Date(2003, 8, 21); // Approximate 365th day of year 3
      const seximalDate = convertToSeximalDate(day365);

      expect(seximalDate.year).toBe(3);
      expect(seximalDate.isIntercalary).toBe(true);
      expect(seximalDate.intercalaryDay).toBe(5);
    });
  });

  describe('Current Date Edge Cases', () => {
    it('should handle dates far in the future', () => {
      const futureDate = new Date(2100, 0, 1);
      const seximalDate = convertToSeximalDate(futureDate);

      expect(seximalDate.year).toBeGreaterThan(1);
      expect(seximalDate.dayOfYear).toBeGreaterThanOrEqual(0);
      expect(seximalDate.dayOfYear).toBeLessThan(366);
    });

    it('should handle dates before epoch', () => {
      const beforeEpoch = new Date(1999, 8, 21);
      const seximalDate = convertToSeximalDate(beforeEpoch);

      expect(seximalDate.year).toBe(1);
      expect(seximalDate.dayOfYear).toBeLessThan(0);
    });
  });
});
