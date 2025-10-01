import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Play, Pause, RotateCcw, Timer as TimerIcon } from "lucide-react";

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
    const hours = parseInt(time.hours) || 0;
    const minutes = parseInt(time.minutes) || 0;
    const seconds = parseInt(time.seconds) || 0;

    if (system === "seximal") {
      // For seximal time: each unit represents base-6 values
      // Convert seximal hours:minutes:seconds to total decimal seconds
      const totalSeximalSeconds = hours * 216 + minutes * 36 + seconds; // 6^3, 6^2, 6^1 (no 6^0 place for seconds)
      // Each seximal second equals ~2.777... real seconds (25/9)
      return totalSeximalSeconds * (25/9);
    } else {
      // Standard time: direct conversion to seconds
      return hours * 3600 + minutes * 60 + seconds;
    }
  };

  const convertToSeximalUnits = (time: TimeInput): number => {
    const hours = parseInt(time.hours) || 0;
    const minutes = parseInt(time.minutes) || 0;
    const seconds = parseInt(time.seconds) || 0;
    // Convert to total seximal time units (base 6)
    return hours * 216 + minutes * 36 + seconds; // 6^3, 6^2, 6^1
  };

  const decrementSeximalTime = (seximalUnits: number): number => {
    if (seximalUnits <= 0) return 0;
    return seximalUnits - 1;
  };

  const formatSeximalTime = (seximalUnits: number): TimeInput & { sixths: string } => {
    const seximalHours = Math.floor(seximalUnits / 216); // 6^3 seximal seconds per seximal hour
    const remainingAfterHours = seximalUnits % 216;

    const seximalMinutes = Math.floor(remainingAfterHours / 36); // 6^2 seximal seconds per seximal minute
    const seximalSeconds = remainingAfterHours % 36; // 6^1 seximal seconds

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
      const seximalHours = Math.floor(totalSeximalSeconds / 216); // 6^3 seximal seconds per seximal hour
      const remainingAfterHours = totalSeximalSeconds % 216;

      const seximalMinutes = Math.floor(remainingAfterHours / 36); // 6^2 seximal seconds per seximal minute
      const seximalSeconds = remainingAfterHours % 36; // 6^1 seximal seconds

      return {
        hours: seximalHours.toString(), // Hours in base 10 for display
        minutes: seximalMinutes.toString(), // Minutes in base 10 for display
        seconds: seximalSeconds.toString(), // Seconds in base 10 for display
        tenths: "0"
      };
    } else {
      // Standard time: show tenths of seconds
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = Math.floor(totalSeconds % 60);
      const tenths = Math.floor((totalSeconds * 10) % 10); // Get tenths place

      return {
        hours: hours.toString(),
        minutes: minutes.toString(),
        seconds: seconds.toString(),
        tenths: tenths.toString()
      };
    }
  };

  const formatSeximalTimeWithSixths = (seximalUnits: number, fractionalTime: number): TimeInput & { sixths: string } => {
    const seximalHours = Math.floor(seximalUnits / 216); // 6^3 seximal seconds per seximal hour
    const remainingAfterHours = seximalUnits % 216;

    const seximalMinutes = Math.floor(remainingAfterHours / 36); // 6^2 seximal seconds per seximal minute
    const seximalSeconds = remainingAfterHours % 36; // 6^1 seximal seconds

    // Calculate sixths of a seximal second
    // A seximal second = 25/9 real seconds
    // A sixth of a seximal second = (25/9)/6 = 25/54 real seconds
    // So we need to calculate how many sixths have passed based on fractional time
    const sixths = Math.floor((fractionalTime / (25/54)) % 6);

    // Convert to seximal digits (base 6)
    const toSeximalDigit = (num: number): string => {
      return num.toString(6);
    };

    return {
      hours: toSeximalDigit(seximalHours),
      minutes: toSeximalDigit(seximalMinutes),
      seconds: toSeximalDigit(seximalSeconds),
      sixths: sixths.toString(6) // Show sixths in base 6
    };
  };

  const updateCountdown = () => {
    setCountdownTime(prevTime => {
      if (!prevTime) return null;

      const newTotalSeconds = prevTime.totalSeconds - 0.1; // Decrement by 0.1 seconds for tenths precision
      const newAccumulatedTime = prevTime.accumulatedTimeForSeximal + 0.1; // Add 0.1 seconds
      const SEXIMAL_SECOND_DURATION = 25/9; // ~2.777 seconds

      let newSeximalUnits = prevTime.seximalTotalUnits;
      let resetAccumulatedTime = newAccumulatedTime;

      // Check if enough time has passed to decrement seximal units
      if (newAccumulatedTime >= SEXIMAL_SECOND_DURATION) {
        newSeximalUnits = decrementSeximalTime(prevTime.seximalTotalUnits);
        resetAccumulatedTime = newAccumulatedTime - SEXIMAL_SECOND_DURATION;
      }

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
        return {
          totalSeconds: newTotalSeconds,
          standard: formatTime(newTotalSeconds, "standard"),
          seximal: formatSeximalTimeWithSixths(newSeximalUnits, resetAccumulatedTime % (25/9)),
          seximalTotalUnits: newSeximalUnits,
          accumulatedTimeForSeximal: resetAccumulatedTime,
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

      if (timeSystem === "seximal") {
        // When input is in seximal format, use the input values directly as seximal units
        seximalUnits = convertToSeximalUnits(inputTime);
      } else {
        // When input is in standard format, convert decimal seconds to seximal units
        seximalUnits = Math.floor(totalSeconds / (25/9));
      }

      setCountdownTime({
        totalSeconds,
        standard: formatTime(totalSeconds, "standard"),
        seximal: formatSeximalTimeWithSixths(seximalUnits, 0),
        seximalTotalUnits: seximalUnits,
        accumulatedTimeForSeximal: 0,
        accumulatedTimeForStandardTenths: 0,
        accumulatedTimeForSeximalSixths: 0
      });
      setIsFinished(false);
    }
  };

  const handleInputChange = (field: keyof TimeInput, value: string) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

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
                      {timeSystem === "standard" ? "Hours" : "Hours (6²)"}
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
                      {timeSystem === "standard" ? "Minutes" : "Minutes (6¹)"}
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
                      {timeSystem === "standard" ? "Seconds" : "Seconds (6⁰)"}
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
                    <div>• Hours: 0-35₆ (6² place)</div>
                    <div>• Minutes: 0-55₆ (6¹ place, ~100 seconds each)</div>
                    <div>• Seconds: 0-55₆ (6⁰ place, ~2.78 seconds each)</div>
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
