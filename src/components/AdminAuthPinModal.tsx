import { useState, useEffect } from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface AdminAuthPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  description?: string;
}

const ADMIN_PIN = "85810220";

export default function AdminAuthPinModal({
  isOpen,
  onClose,
  onSuccess,
  description = "Digite o PIN de 8 dígitos para acessar a área administrativa.",
}: AdminAuthPinModalProps) {
  const [pinDigits, setPinDigits] = useState<string[]>(["", "", "", "", "", "", "", ""]);
  const [pinError, setPinError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPinDigits(["", "", "", "", "", "", "", ""]);
      setPinError(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handlePinChange = (index: number, value: string) => {
    // If user pastes multiple digits
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, 8).split("");
      const newPin = [...pinDigits];
      digits.forEach((d, i) => {
        if (index + i < 8) newPin[index + i] = d;
      });
      setPinDigits(newPin);
      const nextInput = document.getElementById(
        `admin-pin-modal-input-${Math.min(index + digits.length, 7)}`
      );
      if (nextInput) nextInput.focus();
      return;
    }

    const digit = value.replace(/\D/g, "");
    const newPin = [...pinDigits];
    newPin[index] = digit;
    setPinDigits(newPin);
    setPinError(false);

    if (digit && index < 7) {
      const nextInput = document.getElementById(`admin-pin-modal-input-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handlePinKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !pinDigits[index] && index > 0) {
      const prevInput = document.getElementById(`admin-pin-modal-input-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "Enter") {
      handleVerifyPin();
    }
  };

  const handleVerifyPin = () => {
    const enteredPin = pinDigits.join("");
    if (enteredPin === ADMIN_PIN) {
      toast.success("Acesso Concedido! PIN autenticado com sucesso.");
      onSuccess();
      onClose();
    } else {
      setPinError(true);
      toast.error("PIN Incorreto. Verifique o código de 8 dígitos digitado.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border/80 shadow-2xl rounded-2xl p-6">
        <DialogHeader className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-amber-500/15 flex items-center justify-center text-amber-500 mb-1">
            <User className="w-6 h-6" />
          </div>
          <DialogTitle className="text-xl font-bold text-foreground">
            Autenticação de Administrador
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6 space-y-4">
          {/* PIN Inputs com formato: [3 dígitos] - [3 dígitos] - [2 dígitos] */}
          <div className="flex items-center justify-center gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 sm:gap-1.5">
              {[0, 1, 2].map((idx) => (
                <input
                  key={idx}
                  id={`admin-pin-modal-input-${idx}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={pinDigits[idx]}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(idx, e)}
                  className={`w-9 h-11 sm:w-10 sm:h-12 text-center text-lg font-bold rounded-lg border-2 bg-background focus:outline-none transition-all shadow-xs ${
                    pinError
                      ? "border-red-500 text-red-600 focus:ring-2 focus:ring-red-400"
                      : "border-input focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 text-foreground"
                  }`}
                />
              ))}
            </div>

            <span className="text-lg font-bold text-muted-foreground/60 select-none">-</span>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {[3, 4, 5].map((idx) => (
                <input
                  key={idx}
                  id={`admin-pin-modal-input-${idx}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={pinDigits[idx]}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(idx, e)}
                  className={`w-9 h-11 sm:w-10 sm:h-12 text-center text-lg font-bold rounded-lg border-2 bg-background focus:outline-none transition-all shadow-xs ${
                    pinError
                      ? "border-red-500 text-red-600 focus:ring-2 focus:ring-red-400"
                      : "border-input focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 text-foreground"
                  }`}
                />
              ))}
            </div>

            <span className="text-lg font-bold text-muted-foreground/60 select-none">-</span>

            <div className="flex items-center gap-1 sm:gap-1.5">
              {[6, 7].map((idx) => (
                <input
                  key={idx}
                  id={`admin-pin-modal-input-${idx}`}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={pinDigits[idx]}
                  onChange={(e) => handlePinChange(idx, e.target.value)}
                  onKeyDown={(e) => handlePinKeyDown(idx, e)}
                  className={`w-9 h-11 sm:w-10 sm:h-12 text-center text-lg font-bold rounded-lg border-2 bg-background focus:outline-none transition-all shadow-xs ${
                    pinError
                      ? "border-red-500 text-red-600 focus:ring-2 focus:ring-red-400"
                      : "border-input focus:border-amber-500 focus:ring-2 focus:ring-amber-500/30 text-foreground"
                  }`}
                />
              ))}
            </div>
          </div>

          {pinError && (
            <p className="text-xs text-red-500 text-center font-medium animate-shake">
              ⚠️ PIN incorreto. Verifique os 8 dígitos e tente novamente.
            </p>
          )}
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} className="w-full sm:w-auto">
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
