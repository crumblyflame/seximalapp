import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Timer as TimerIcon } from "lucide-react";
import { decimalToSeximal } from "@/lib/seximal";

type TimeSystem = "standard" | "seximal";

interface TimeInput {
  hours: string;
  minutes: string;
  seconds: string;
}

interface CountdownTime {
  totalSeconds: number;
  standard: TimeInput & { tenths: string };
  seximal: TimeInput & { sixths: string };
  seximalTotalUnits: number; // Total seximal time units for proper countdown
  accumulatedTimeForSeximal: number; // Track real seconds accumulated for seximal countdown
  accumulatedTimeForStandardTenths: number; // Track for standard timer tenths
  accumulatedTimeForSeximalSixths: number; // Track for seximal timer sixths
}

export default function Timer() {
  const [timeSystem, setTimeSystem] = useState<TimeSystem>("standard");
  const [inputTime, setInputTime] = useState<TimeInput>({ hours: "0", minutes: "0", seconds: "0" });
  const [countdownTime, setCountdownTime] = useState<CountdownTime | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize audio context for sound playback
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const playNotificationSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      const context = audioContextRef.current;
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(context.destination);

      // Create a pleasant notification tone (C5 note)
      oscillator.frequency.setValueAtTime(523.25, context.currentTime);
      oscillator.type = "sine";

      // Quick fade in/out envelope
      gainNode.gain.setValueAtTime(0, context.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.3, context.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 1);

      oscillator.start(context.currentTime);
      oscillator.stop(context.currentTime + 1);
    } catch (error) {
      console.warn("Could not play notification sound:", error);
    }
  };

  const convertToSeconds = (time: TimeInput, system: TimeSystem): number => {
    if (system === "seximal") {
      // For seximal time: interpret input values as base-6
      const hours = parseInt(time.hours, 6) || 0;
      const minutes = parseInt(time.minutes, 6) || 0;
      const seconds = parseInt(time.seconds, 6) || 0;

      // Convert seximal hours:minutes:seconds to total decimal seconds
      const totalSeximalSeconds = hours * 1296 + minutes * 36 + seconds; // 6^4, 6^2, 6^0
      // Each seximal second equals ~2.777... real seconds (25/9)
      return totalSeximalSeconds * (25/9);
    } else {
      // Standard time: direct conversion to seconds (base-10)
      const hours = parseInt(time.hours) || 0;
      const minutes = parseInt(time.minutes) || 0;
      const seconds = parseInt(time.seconds) || 0;
      return hours * 3600 + minutes * 60 + seconds;
    }
  };

  const convertStandardToSeximalTime = (totalSeconds: number): TimeInput & { sixths: string } => {
    // Convert decimal seconds to seximal time units properly
    // 1 seximal second = 25/9 real seconds
    // So real seconds to seximal seconds conversion factor is 9/25

    // First convert to total seximal seconds (with fractional part)
    const totalSeximalSecondsWithFraction = totalSeconds * (9/25);

    // Split into whole and fractional parts
    const wholeSeximalSeconds = Math.floor(totalSeximalSecondsWithFraction);
    const fractionalSeximalSeconds = totalSeximalSecondsWithFraction - wholeSeximalSeconds;

    // Convert to seximal time units (base 6)
    const seximalHours = Math.floor(wholeSeximalSeconds / 1296); // 6^4 seximal seconds per seximal hour
    const remainingAfterHours = wholeSeximalSeconds % 1296;

    const seximalMinutes = Math.floor(remainingAfterHours / 36); // 6^2 seximal seconds per seximal minute
    const seximalSeconds = remainingAfterHours % 36; // 6^2 seximal seconds

    // Calculate sixths of a seximal second (0-5 in base 6)
    // Since we're showing fractional seximal seconds, we need to convert the fractional part
    const sixths = Math.floor(fractionalSeximalSeconds * 6) % 6;

    return {
      hours: decimalToSeximal(seximalHours),
      minutes: decimalToSeximal(seximalMinutes),
      seconds: decimalToSeximal(seximalSeconds),
      sixths: decimalToSeximal(sixths)
    };
  };

  const convertToSeximalUnits = (time: TimeInput): number => {
    // For seximal time, interpret input values as base-6
    const hours = parseInt(time.hours, 6) || 0;
    const minutes = parseInt(time.minutes, 6) || 0;
    const seconds = parseInt(time.seconds, 6) || 0;
    // Convert to total seximal time units (base 6)
    return hours * 1296 + minutes * 36 + seconds; // 6^4, 6^2, 6^0
  };

  const decrementSeximalTime = (seximalUnits: number): number => {
    if (seximalUnits <= 0) return 0;
    return seximalUnits - 1;
  };

  const formatSeximalTime = (seximalUnits: number): TimeInput & { sixths: string } => {
    const seximalHours = Math.floor(seximalUnits / 1296); // 6^4 seximal seconds per seximal hour
    const remainingAfterHours = seximalUnits % 1296;

    const seximalMinutes = Math.floor(remainingAfterHours / 36); // 6^2 seximal seconds per seximal minute
    const seximalSeconds = remainingAfterHours % 36; // 6^2 seximal seconds

    // Convert to seximal digits (base 6)
    const toSeximalDigit = (num: number): string => {
      return num.toString(6);
    };

    return {
      hours: toSeximalDigit(seximalHours),
      minutes: toSeximalDigit(seximalMinutes),
      seconds: toSeximalDigit(seximalSeconds),
      sixths: "0"
    };
  };

  const formatTime = (totalSeconds: number, system: TimeSystem): TimeInput & { tenths: string } => {
    if (system === "seximal") {
      // For seximal time display, we need to convert from decimal seconds back to seximal time units
      // First, convert total decimal seconds to seximal seconds (each seximal second = 25/9 decimal seconds)
      const totalSeximalSeconds = Math.floor(totalSeconds / (25/9));

      // Convert to seximal time units (base 6)
      const seximalHours = Math.floor(totalSeximalSeconds / 1296); // 6^4 seximal seconds per seximal hour
      const remainingAfterHours = totalSeximalSeconds % 1296;

      const seximalMinutes = Math.floor(remainingAfterHours / 36); // 6^2 seximal seconds per seximal minute
      const seximalSeconds = remainingAfterHours % 36; // 6^2 seximal seconds

      return {
        hours: seximalHours.toString(), // Hours in base 10 for display
        minutes: seximalMinutes.toString(), // Minutes in base 10 for display
        seconds: seximalSeconds.toString(), // Seconds in base 10 for display
        tenths: "0"
      };
    } else {
      // Standard time: show tenths of seconds (natural countdown)
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const tenths = Math.floor((totalSeconds * 10) % 10); // Get tenths place (0-9 countdown)

      return {
        hours: hours.toString(),
        minutes: minutes.toString(),
        seconds: seconds.toString(),
        tenths: tenths.toString()
      };
    }
  };



  const formatSeximalTimeWithSixths = (seximalUnits: number, fractionalTime: number): TimeInput & { sixths: string } => {
    const seximalHours = Math.floor(seximalUnits / 1296); // 6^4 seximal seconds per seximal hour
    const remainingAfterHours = seximalUnits % 1296;

    const seximalMinutes = Math.floor(remainingAfterHours / 36); // 6^2 seximal seconds per seximal minute
    const seximalSeconds = remainingAfterHours % 36; // 6^2 seximal seconds

    // Calculate sixths of a seximal second for countdown (decrementing)
    // A seximal second = 25/9 real seconds
    // A sixth of a seximal second = (25/9)/6 = 25/54 real seconds
    // For countdown: we want to show 5, 4, 3, 2, 1, 0 as time progresses
    const sixths = Math.floor((fractionalTime / (25/54)) % 6);
    const countdownSixths = (5 - sixths) % 6; // Reverse the count for countdown

    // Convert to seximal digits (base 6)
    const toSeximalDigit = (num: number): string => {
      return num.toString(6);
    };

    return {
      hours: toSeximalDigit(seximalHours),
      minutes: toSeximalDigit(seximalMinutes),
      seconds: toSeximalDigit(seximalSeconds),
      sixths: countdownSixths.toString(6) // Show countdown sixths in base 6
    };
  };

  const formatStandardToSeximal = (totalSeconds: number): TimeInput & { sixths: string } => {
    // Convert decimal seconds to seximal time units properly
    // 1 seximal second = 25/9 real seconds
    // So real seconds to seximal seconds conversion factor is 9/25

    // First convert to total seximal seconds (with fractional part)
    const totalSeximalSecondsWithFraction = totalSeconds * (9/25);

    // Split into whole and fractional parts
    const wholeSeximalSeconds = Math.floor(totalSeximalSecondsWithFraction);
    const fractionalSeximalSeconds = totalSeximalSecondsWithFraction - wholeSeximalSeconds;

    // Convert to seximal time units (base 6)
    const seximalHours = Math.floor(wholeSeximalSeconds / 1296); // 6^4 seximal seconds per seximal hour
    const remainingAfterHours = wholeSeximalSeconds % 1296;

    const seximalMinutes = Math.floor(remainingAfterHours / 36); // 6^2 seximal seconds per seximal minute
    const seximalSeconds = remainingAfterHours % 36; // 6^2 seximal seconds

    // Calculate sixths of a seximal second (0-5 in base 6)
    // Since we're showing fractional seximal seconds, we need to convert the fractional part
    const sixths = Math.floor(fractionalSeximalSeconds * 6) % 6;

    // Convert to seximal digits (base 6)
    const toSeximalDigit = (num: number): string => {
      return num.toString(6);
    };

    return {
      hours: toSeximalDigit(seximalHours),
      minutes: toSeximalDigit(seximalMinutes),
      seconds: toSeximalDigit(seximalSeconds),
      sixths: sixths.toString(6)
    };
  };

  const updateCountdown = () => {
    setCountdownTime(prevTime => {
      if (!prevTime) return null;

      const newTotalSeconds = prevTime.totalSeconds - 0.1; // Decrement by 0.1 seconds for tenths precision

      if (newTotalSeconds <= 0) {
        setIsRunning(false);
        setIsFinished(true);
        playNotificationSound();
        return {
          totalSeconds: 0,
          standard: { hours: "0", minutes: "0", seconds: "0", tenths: "0" },
          seximal: { hours: "0", minutes: "0", seconds: "0", sixths: "0" },
          seximalTotalUnits: 0,
          accumulatedTimeForSeximal: 0,
          accumulatedTimeForStandardTenths: 0,
          accumulatedTimeForSeximalSixths: 0
        };
      } else {
        // Update standard time (simple decrement)
        const newStandardTime = formatTime(newTotalSeconds, "standard");

        // Update seximal time - convert current total seconds to seximal time
        const currentSeximalDisplay = convertStandardToSeximalTime(newTotalSeconds);

        return {
          totalSeconds: newTotalSeconds,
          standard: newStandardTime,
          seximal: currentSeximalDisplay,
          seximalTotalUnits: prevTime.seximalTotalUnits,
          accumulatedTimeForSeximal: 0,
          accumulatedTimeForStandardTenths: 0,
          accumulatedTimeForSeximalSixths: 0
        };
      }
    });
  };

  const startTimer = () => {
    if (!countdownTime || countdownTime.totalSeconds <= 0) return;

    setIsRunning(true);
    setIsFinished(false);
    intervalRef.current = setInterval(updateCountdown, 100); // Update every 100ms for tenths precision
  };

  const pauseTimer = () => {
    setIsRunning(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const resetTimer = () => {
    pauseTimer();
    setIsFinished(false);
    setCountdownTime(null);
    setInputTime({ hours: "0", minutes: "0", seconds: "0" });
  };

  const setTimer = () => {
    const totalSeconds = convertToSeconds(inputTime, timeSystem);
    if (totalSeconds > 0) {
      let seximalUnits: number;
      let initialSeximalDisplay: TimeInput & { sixths: string };

      if (timeSystem === "seximal") {
        // When input is in seximal format, use the input values directly as seximal units
        seximalUnits = convertToSeximalUnits(inputTime);
        initialSeximalDisplay = formatSeximalTime(seximalUnits);
      } else {
        // When input is in standard format, use the proper conversion for initial display
        seximalUnits = Math.floor(totalSeconds / (25/9));
        initialSeximalDisplay = convertStandardToSeximalTime(totalSeconds);
      }

      setCountdownTime({
        totalSeconds,
        standard: formatTime(totalSeconds, "standard"),
        seximal: initialSeximalDisplay,
        seximalTotalUnits: seximalUnits,
        accumulatedTimeForSeximal: 0,
        accumulatedTimeForStandardTenths: 0,
        accumulatedTimeForSeximalSixths: 0
      });
      setIsFinished(false);
    }
  };

  const handleInputChange = (field: keyof TimeInput, value: string) => {
    if (timeSystem === "seximal") {
      // For seximal time, only allow digits 0-5 (base-6 digits)
      if (!/^[0-5]*$/.test(value)) return;
    } else {
      // For standard time, allow digits 0-9
      if (!/^\d*$/.test(value)) return;
    }

    setInputTime(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Timer Setup */}
          <Card className="shadow-lg border border-border">
            <CardHeader className="bg-primary text-primary-foreground">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TimerIcon className="h-6 w-6" />
                Timer Setup
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Time System Selection */}
              <div className="space-y-3">
                <Label className="text-base font-medium">Time System</Label>
                <Select value={timeSystem} onValueChange={(value: TimeSystem) => setTimeSystem(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard Time</SelectItem>
                    <SelectItem value="seximal">Seximal Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time Input */}
              <div className="space-y-4">
                <Label className="text-base font-medium">
                  Set Timer ({timeSystem === "standard" ? "Hours:Minutes:Seconds" : "Base-6 Hours:Minutes:Seconds"})
                </Label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="hours" className="text-sm text-muted-foreground">
                      {timeSystem === "standard" ? "Hours" : "Hours"}
                    </Label>
                    <Input
                      id="hours"
                      type="text"
                      value={inputTime.hours}
                      onChange={(e) => handleInputChange("hours", e.target.value)}
                      className="text-center text-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="minutes" className="text-sm text-muted-foreground">
                      {timeSystem === "standard" ? "Minutes" : "Minutes"}
                    </Label>
                    <Input
                      id="minutes"
                      type="text"
                      value={inputTime.minutes}
                      onChange={(e) => handleInputChange("minutes", e.target.value)}
                      className="text-center text-lg"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <Label htmlFor="seconds" className="text-sm text-muted-foreground">
                      {timeSystem === "standard" ? "Seconds" : "Seconds"}
                    </Label>
                    <Input
                      id="seconds"
                      type="text"
                      value={inputTime.seconds}
                      onChange={(e) => handleInputChange("seconds", e.target.value)}
                      className="text-center text-lg"
                      placeholder="0"
                    />
                  </div>
                </div>
              </div>

              {/* Set Timer Button */}
              <Button onClick={setTimer} className="w-full" size="lg">
                Set Timer
              </Button>
            </CardContent>
          </Card>

          {/* Timer Display */}
          <Card className="shadow-lg border border-border">
            <CardHeader className="bg-accent text-accent-foreground">
              <CardTitle className="flex items-center gap-2 text-xl">
                <TimerIcon className="h-6 w-6" />
                Countdown
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {countdownTime ? (
                <div className="space-y-6">
                  {/* Standard Time Display */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Standard Time</div>
                    <div className="text-4xl font-mono font-bold text-foreground">
                      {countdownTime.standard.hours.padStart(2, "0")}:
                      {countdownTime.standard.minutes.padStart(2, "0")}:
                      {countdownTime.standard.seconds.padStart(2, "0")}.
                      <span className="text-3xl">{countdownTime.standard.tenths}</span>
                    </div>
                  </div>

                  {/* Seximal Time Display */}
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground mb-2">Seximal Time</div>
                    <div className="text-4xl font-mono font-bold text-foreground">
                      {countdownTime.seximal.hours.padStart(2, "0")}:
                      {countdownTime.seximal.minutes.padStart(2, "0")}:
                      {countdownTime.seximal.seconds.padStart(2, "0")}.
                      <span className="text-3xl">{countdownTime.seximal.sixths}</span>
                      <span className="text-2xl align-super">₆</span>
                    </div>
                  </div>

                  {/* Timer Controls */}
                  <div className="flex justify-center gap-3">
                    {!isRunning ? (
                      <Button onClick={startTimer} size="lg" className="flex items-center gap-2">
                        <Play className="h-5 w-5" />
                        Start
                      </Button>
                    ) : (
                      <Button onClick={pauseTimer} variant="secondary" size="lg" className="flex items-center gap-2">
                        <Pause className="h-5 w-5" />
                        Pause
                      </Button>
                    )}
                    <Button onClick={resetTimer} variant="outline" size="lg" className="flex items-center gap-2">
                      <RotateCcw className="h-5 w-5" />
                      Reset
                    </Button>
                  </div>

                  {/* Finished State */}
                  {isFinished && (
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="text-green-800 dark:text-green-200 font-semibold">
                        Timer Finished!
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-12">
                  <TimerIcon className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p>Set a timer to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Time System Reference */}
        <div className="mt-8">
          <Card className="shadow-lg border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Time System Reference</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h3 className="font-semibold mb-2">Standard Time</h3>
                  <div className="space-y-1">
                    <div>• Hours: 0-23 (24-hour cycle)</div>
                    <div>• Minutes: 0-59 (60 seconds each)</div>
                    <div>• Seconds: 0-59 (1 second each)</div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Seximal Time</h3>
                  <div className="space-y-1">
                    <div>• Hours: 0-35₆ in a day</div>
                    <div>• Minutes: 0-55₆ (~100 standard seconds each)</div>
                    <div>• Seconds: 0-55₆ (~2.78 standard seconds each)</div>
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
