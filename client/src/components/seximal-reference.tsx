import { Card, CardContent } from "@/components/ui/card";
import { Book } from "lucide-react";

export function SeximalReference() {
  const prefixes = [
    { name: "sese- (6⁶)", multiplier: "×46,656" },
    { name: "kvinse- (6⁵)", multiplier: "×7,776" },
    { name: "kvarse- (6⁴)", multiplier: "×1,296" },
    { name: "trise- (6³)", multiplier: "×216" },
    { name: "duse- (6²)", multiplier: "×36" },
    { name: "unse- (6¹)", multiplier: "×6" },
    { name: "undo- (6⁻¹)", multiplier: "÷6" },
    { name: "dudo- (6⁻²)", multiplier: "÷36" },
    { name: "trido- (6⁻³)", multiplier: "÷216" },
    { name: "kvardo- (6⁻⁴)", multiplier: "÷1,296" },
    { name: "kvindo- (6⁻⁵)", multiplier: "÷7,776" },
    { name: "sedo- (6⁻⁶)", multiplier: "÷46,656" },
  ];

  const baseUnits = [
    { name: "1 tujo (time)", conversion: "0.07716 sec" },
    { name: "1 tumbo (length)", conversion: "2.29867 in" },
    { name: "1 surfao (area)", conversion: "5.28388 in²" },
    { name: "1 voluo (volume)", conversion: "199.0345 mL" },
    { name: "1 mazo (mass)", conversion: "199.0345 g" },
    { name: "1 premuo (pressure)", conversion: "0.08304 psi" },
    { name: "1 pido (speed)", conversion: "0.75668 m/s" },
    { name: "1 gravito (acceleration)", conversion: "9.80664 m/s²" },
    { name: "1 forso (force)", conversion: "1.95186 N" },
    { name: "1 nergo (energy)", conversion: "0.11396 J" },
    { name: "1 freko (frequency)", conversion: "12.96 Hz" },
    { name: "1 paŭo (power)", conversion: "1.47694 W" },
  ];

  return (
    <Card className="shadow-lg border border-border overflow-hidden">
      <div className="px-6 py-4 border-b border-border bg-accent/5">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Book className="h-5 w-5 text-accent" />
          Seximal System Reference
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Base-6 measurement system with unique prefixes
        </p>
      </div>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Prefixes */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Prefixes (Powers of 6)</h4>
            <div className="space-y-2 text-sm">
              {prefixes.map((prefix, index) => (
                <div 
                  key={index}
                  className="flex justify-between p-2 bg-muted rounded"
                  data-testid={`prefix-${index}`}
                >
                  <span className="font-medium">{prefix.name}</span>
                  <span className="text-muted-foreground">{prefix.multiplier}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Base Units */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">Base Conversion Values</h4>
            <div className="space-y-2 text-sm">
              {baseUnits.map((unit, index) => (
                <div 
                  key={index}
                  className="flex justify-between p-2 bg-muted rounded"
                  data-testid={`base-unit-${index}`}
                >
                  <span className="font-medium">{unit.name}</span>
                  <span className="text-muted-foreground">{unit.conversion}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
