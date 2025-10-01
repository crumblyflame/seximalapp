import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock as ClockIcon, Globe } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface SeximalTime {
  hours: string;
  minutes: string;
  seconds: string;
  sixths?: string;
}

interface StandardTime {
  hours: string;
  minutes: string;
  seconds: string;
  ampm: string;
}

export default function Clock() {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [showSixths, setShowSixths] = useState<boolean>(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 100); // Update every 100ms for smooth seconds display

    return () => clearInterval(timer);
  }, []);

  const getStandardTime = (date: Date): StandardTime => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";
    
    // Convert to 12-hour format
    if (hours === 0) {
      hours = 12;
    } else if (hours > 12) {
      hours = hours - 12;
    }

    return {
      hours: hours.toString().padStart(2, "0"),
      minutes: minutes.toString().padStart(2, "0"),
      seconds: seconds.toString().padStart(2, "0"),
      ampm
    };
  };

  const getSeximalTime = (date: Date): SeximalTime => {
    // Get total seconds since midnight
    const totalSeconds = date.getHours() * 3600 + date.getMinutes() * 60 + date.getSeconds() + date.getMilliseconds() / 1000;

    // Seximal time calculations:
    // - Seximal seconds tick every 2.777... (25/9) real seconds
    // - Seximal minutes tick every 100 real seconds
    // - Seximal hours tick normally (every 3600 real seconds)

    // Calculate seximal hours (0-35 in seximal, which is 0-23 in decimal)
    const seximalHoursDecimal = Math.floor(totalSeconds / 3600);
    const seximalHours = seximalHoursDecimal.toString(6).padStart(2, "0");

    // Calculate seximal minutes (ticks every 100 real seconds)
    const remainingAfterHours = totalSeconds % 3600;
    const seximalMinutesDecimal = Math.floor(remainingAfterHours / 100);
    const seximalMinutes = seximalMinutesDecimal.toString(6).padStart(2, "0");

    // Calculate seximal seconds (ticks every 25/9 real seconds)
    const remainingAfterMinutes = remainingAfterHours % 100;
    const seximalSecondsDecimal = Math.floor(remainingAfterMinutes / (25/9));
    const seximalSeconds = seximalSecondsDecimal.toString(6).padStart(2, "0");

    // Calculate sixths of a seximal second
    const fractionalPart = (remainingAfterMinutes / (25/9)) - seximalSecondsDecimal;
    const sixthsDecimal = Math.floor(fractionalPart * 6);
    const sixths = sixthsDecimal.toString(6);

    return {
      hours: seximalHours,
      minutes: seximalMinutes,
      seconds: seximalSeconds,
      sixths: sixths
    };
  };

  const standardTime = getStandardTime(currentTime);
  const seximalTime = getSeximalTime(currentTime);

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Standard Time */}
          <Card className="shadow-lg border border-border">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Globe className="h-6 w-6" />
                Standard Time
              </CardTitle>
              <p className="text-sm opacity-80">12-Hour US Format</p>
            </CardHeader>
            <CardContent className="p-8">
              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-foreground mb-4">
                  {standardTime.hours}:{standardTime.minutes}:{standardTime.seconds}
                </div>
                <div className="text-2xl font-semibold text-muted-foreground">
                  {standardTime.ampm}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Seximal Time */}
          <Card className="shadow-lg border border-border">
            <CardHeader className="bg-accent text-accent-foreground">
              <CardTitle className="flex items-center gap-2 text-xl">
                <ClockIcon className="h-6 w-6" />
                Seximal Time
              </CardTitle>
              <p className="text-sm opacity-80">Base-6 Time System</p>
            </CardHeader>
            <CardContent className="p-8">
              {/* Sixth-second toggle */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <Label htmlFor="sixths-toggle" className="text-sm font-medium">
                  Show sixths of seconds:
                </Label>
                <Switch
                  id="sixths-toggle"
                  checked={showSixths}
                  onCheckedChange={setShowSixths}
                />
              </div>

              <div className="text-center">
                <div className="text-6xl font-mono font-bold text-foreground mb-4">
                  {seximalTime.hours}:{seximalTime.minutes}:{seximalTime.seconds}
                  {showSixths && seximalTime.sixths ? `.${seximalTime.sixths}` : ''}
                  <span className="text-3xl align-super">₆</span>
                </div>
                <div className="text-sm text-muted-foreground mt-4 space-y-1">
                  <div>Hours: Normal (0-35₆)</div>
                  <div>Minutes: Every 100 seconds</div>
                  <div>Seconds: Every 2.78 seconds</div>
                  {showSixths && <div>Sixths: Fractions of a second</div>}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Time Conversion Examples */}
        <div className="mt-12">
          <Card className="shadow-lg border border-border">
            <CardHeader>
              <CardTitle className="text-xl">Time System Reference</CardTitle>
              <p className="text-sm text-muted-foreground">Example time conversions between systems</p>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold mb-3">Seximal → Standard</h3>
                  <div className="space-y-2 text-sm font-mono">
                    <div>00:00:00₆ = 12:00:00 AM</div>
                    <div>01:00:00₆ = 01:00:00 AM</div>
                    <div>10:00:00₆ = 06:00:00 AM</div>
                    <div>20:30:00₆ = 12:30:00 PM</div>
                    <div>30:00:00₆ = 06:00:00 PM</div>
                    <div>35:55:55₆ = 11:59:59 PM</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-3">Timing Rules</h3>
                  <div className="space-y-2 text-sm">
                    <div><strong>Hours:</strong> Standard 24-hour cycle</div>
                    <div><strong>Minutes:</strong> Tick every 100 SI seconds</div>
                    <div><strong>Seconds:</strong> Tick every 2⁷⁄₉ SI seconds</div>
                    <div><strong>Range:</strong> 00:00:00₆ to 35:55:55₆</div>
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
