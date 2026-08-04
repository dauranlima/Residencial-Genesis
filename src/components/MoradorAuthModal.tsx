import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";

const VALID_APTS = [
  "511","512","513","514","521","522","523","524","531","532","533","534","541","542","543","544",
  "411","412","413","414","421","422","423","424","431","432","433","434","441","442","443","444"
];

interface MoradorAuthModalProps {
  onAuthenticated: () => void;
}

export default function MoradorAuthModal({ onAuthenticated }: MoradorAuthModalProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(true);
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", ""]);
  const [pinError, setPinError] = useState(false);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      navigate("/");
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 3).split("");
      const newPin = [...pinDigits];
      digits.forEach((d, i) => {
        if (index + i < 3) newPin[index + i] = d;
      });
      setPinDigits(newPin);
      const nextInput = document.getElementById(`morador-pin-input-${Math.min(index + digits.length, 2)}`);
      if (nextInput) nextInput.focus();
      return;
    }

    const digit = value.replace(/\D/g, "");
    const newPin = [...pinDigits];
    newPin[index] = digit;
    setPinDigits(newPin);
    setPinError(false);

    if (digit && index < 2) {
      const nextInput = document.getElementById(`morador-pin-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`morador-pin-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerifyPin = () => {
    const enteredPin = pinDigits.join("");
    if (VALID_APTS.includes(enteredPin)) {
      setIsOpen(false);
      onAuthenticated();
      toast({
        title: "Acesso Liberado!",
        description: `Apartamento ${enteredPin} autenticado com sucesso.`,
      });
    } else {
      setPinError(true);
      toast({
        title: "Apartamento Inválido",
        description: "Verifique o número digitado.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl rounded-2xl p-6">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-gold/15 flex items-center justify-center text-gold mb-1">
            <User className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl mx-auto font-bold text-foreground">
            Autenticação Morador
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            Digite o número de 3 dígitos para acessar.
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          <div className="flex items-center justify-center gap-3">
            {[0, 1, 2].map((idx) => (
              <input
                key={idx}
                id={`morador-pin-input-${idx}`}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={pinDigits[idx]}
                onChange={(e) => handlePinChange(idx, e.target.value)}
                onKeyDown={(e) => handlePinKeyDown(idx, e)}
                className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-background focus:outline-none transition-all shadow-sm ${
                  pinError
                    ? "border-red-500 text-red-600 focus:ring-2 focus:ring-red-400"
                    : "border-input focus:border-gold focus:ring-2 focus:ring-gold/30 text-foreground"
                }`}
              />
            ))}
          </div>

          {pinError && (
            <p className="text-xs text-red-500 text-center font-medium animate-shake">
              ⚠️ Verifique o número digitado.
            </p>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="w-full sm:w-auto"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleVerifyPin}
            className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
          >
            Confirmar PIN
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
