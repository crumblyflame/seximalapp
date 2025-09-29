import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarIcon } from "lucide-react";

// Seximal calendar constants
const TWOMOONS = ["Pama", "Befa", "Tiva", "Donu", "Kusu", "Gerza"] as const;
const DAYS_OF_WEEK = ["Firsday", "Seconday", "Thirday", "Forday", "Fifday", "Siksday"] as const;
const INTERCALARY_DAYS = ["Festival 1", "Festival 2", "Festival 3", "Festival 4", "Festival 5", "Festival 6"] as const;

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

interface CalendarDay {
  dayOfWeek: number;
  date: number;
  isToday: boolean;
  isIntercalary?: boolean;
  festivalName?: string;
}

interface CalendarWeek {
  weekNumber: number;
  days: CalendarDay[];
}

interface CalendarTwomoon {
  name: string;
  weeks: CalendarWeek[];
}

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentSeximalDate, setCurrentSeximalDate] = useState<SeximalDate | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    try {
      const seximalDate = convertToSeximalDate(currentDate);
      console.log('Current Gregorian date:', currentDate);
      console.log('Converted seximal date:', seximalDate);
      setCurrentSeximalDate(seximalDate);
    } catch (error) {
      console.error('Error converting date:', error);
      // Fallback to a default date if conversion fails
      setCurrentSeximalDate({
        year: 25, // Current approximate year
        twomoon: 0,
        week: 0,
        dayOfWeek: 0,
        dayOfYear: 0,
        isIntercalary: false
      });
    }
  }, [currentDate]);

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

  // Generate calendar data for the current year
  const generateCalendarData = (year: number): CalendarTwomoon[] => {
    const isLeapYear = isSeximalLeapYear(year);
    const calendarData: CalendarTwomoon[] = [];

    for (let twomoon = 0; twomoon < 6; twomoon++) {
      const twomoonData: CalendarTwomoon = {
        name: TWOMOONS[twomoon],
        weeks: []
      };

      for (let week = 0; week < 10; week++) {
        const weekData: CalendarWeek = {
          weekNumber: week,
          days: []
        };

        for (let day = 0; day < 6; day++) {
          const dayOfYear = twomoon * 60 + week * 6 + day;
          const dayData: CalendarDay = {
            dayOfWeek: day,
            date: dayOfYear + 1,
            isToday: false // Will be set below
          };
          weekData.days.push(dayData);
        }

        twomoonData.weeks.push(weekData);
      }

      calendarData.push(twomoonData);
    }

    // Add intercalary days if it's a leap year
    if (isLeapYear) {
      const intercalaryData: CalendarTwomoon = {
        name: "Intercalary",
        weeks: [{
          weekNumber: 10,
          days: []
        }]
      };

      for (let i = 0; i < 6; i++) {
        const dayData: CalendarDay = {
          dayOfWeek: i,
          date: 361 + i,
          isToday: false,
          isIntercalary: true,
          festivalName: INTERCALARY_DAYS[i]
        };
        intercalaryData.weeks[0].days.push(dayData);
      }

      calendarData.push(intercalaryData);
    } else {
      // 5 intercalary days for non-leap years
      const intercalaryData: CalendarTwomoon = {
        name: "Intercalary",
        weeks: [{
          weekNumber: 10,
          days: []
        }]
      };

      for (let i = 0; i < 5; i++) {
        const dayData: CalendarDay = {
          dayOfWeek: i,
          date: 361 + i,
          isToday: false,
          isIntercalary: true,
          festivalName: INTERCALARY_DAYS[i]
        };
        intercalaryData.weeks[0].days.push(dayData);
      }

      calendarData.push(intercalaryData);
    }

    return calendarData;
  };

  // Show a simple fallback if date conversion fails
  if (!currentSeximalDate) {
    return (
      <div className="min-h-screen bg-background">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Seximal Calendar</h1>
            <p>Loading calendar data...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Current date: {currentDate.toLocaleDateString()}
            </p>
          </div>
        </main>
      </div>
    );
  }

  const calendarData = generateCalendarData(currentSeximalDate.year);

  // Mark current day
  if (currentSeximalDate.isIntercalary) {
    const intercalaryIndex = calendarData.length - 1;
    if (calendarData[intercalaryIndex]?.weeks[0]?.days[currentSeximalDate.intercalaryDay || 0]) {
      calendarData[intercalaryIndex].weeks[0].days[currentSeximalDate.intercalaryDay || 0].isToday = true;
    }
  } else {
    if (calendarData[currentSeximalDate.twomoon]?.weeks[currentSeximalDate.week]?.days[currentSeximalDate.dayOfWeek]) {
      calendarData[currentSeximalDate.twomoon].weeks[currentSeximalDate.week].days[currentSeximalDate.dayOfWeek].isToday = true;
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with current date info */}
        <Card className="mb-8 shadow-lg border border-border">
          <CardHeader className="bg-primary text-primary-foreground">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <CalendarIcon className="h-8 w-8" />
              Seximal Calendar
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">
                  {currentSeximalDate.year}
                </div>
                <div className="text-sm text-muted-foreground">Year</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {DAYS_OF_WEEK[currentSeximalDate.dayOfWeek]}
                </div>
                <div className="text-sm text-muted-foreground">Day of Week</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-primary">
                  {currentSeximalDate.dayOfYear + 1}
                </div>
                <div className="text-sm text-muted-foreground">Day of Year</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Calendar Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {calendarData.map((twomoon, twomoonIndex) => (
            <Card key={twomoonIndex} className="shadow-lg border border-border">
              <CardHeader>
                <CardTitle className="text-xl text-center">
                  {twomoon.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-2">
                  {twomoon.weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className="grid grid-cols-7 gap-1">
                      <div className="text-xs text-muted-foreground text-center py-1">
                        W{week.weekNumber}
                      </div>
                      {week.days.map((day, dayIndex) => (
                        <div
                          key={dayIndex}
                          className={`
                            text-center py-2 px-1 text-sm rounded-md transition-colors
                            ${day.isToday
                              ? "bg-primary text-primary-foreground font-bold ring-2 ring-primary/20"
                              : day.isIntercalary
                                ? "bg-accent text-accent-foreground"
                                : "bg-muted hover:bg-muted/80"
                            }
                          `}
                        >
                          {day.isIntercalary ? (
                            <div>
                              <div className="font-semibold">{day.festivalName}</div>
                              <div className="text-xs opacity-75">{day.date}</div>
                            </div>
                          ) : (
                            <div>
                              <div className="font-medium">{DAYS_OF_WEEK[day.dayOfWeek].slice(0, 3)}</div>
                              <div className="text-xs opacity-75">{day.date}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Calendar Information */}
        <div className="mt-8">
          <Card className="shadow-lg border border-border">
            <CardHeader>
              <CardTitle className="text-xl">Calendar System Reference</CardTitle>
              <p className="text-sm text-muted-foreground">Understanding the seximal calendar structure</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Structure</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Twomoons:</strong> 6 per year (Pama-Gerza)</div>
                    <div><strong>Weeks:</strong> 10 per twomoon</div>
                    <div><strong>Days:</strong> 6 per week</div>
                    <div><strong>Regular Days:</strong> 360 per year</div>
                    <div><strong>Intercalary Days:</strong> 5-6 at year end</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Days of the Week</h3>
                  <div className="space-y-1 text-sm">
                    {DAYS_OF_WEEK.map((day, index) => (
                      <div key={index}>{day}</div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
