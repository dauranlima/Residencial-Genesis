import { useNavigate, useLocation } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Construction, Store, ArrowLeft } from "lucide-react";

const ALLOWED_PATHS = ["/", "/condo-market", "/localizacao", "/adm-login", "/super-admin"];

export default function UnderDevelopmentModal() {
  const location = useLocation();
  const navigate = useNavigate();

  const isUnderDevelopment = !ALLOWED_PATHS.includes(location.pathname);

  const handleClose = () => {
    navigate("/");
  };

  return (
    <Dialog open={isUnderDevelopment} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-md border-border bg-card shadow-2xl p-6 rounded-2xl">
        <DialogHeader className="flex flex-col items-center text-center space-y-3">
          <div className="p-3.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm animate-pulse">
            <Construction className="h-10 w-10" />
          </div>
          <div>
            <span className="inline-block px-3 py-1 mb-2 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
              Módulo em Construção
            </span>
            <DialogTitle className="text-2xl font-bold text-card-foreground">
              Página em Desenvolvimento
            </DialogTitle>
          </div>
          <DialogDescription className="text-base text-muted-foreground pt-1 leading-relaxed">
            Esta funcionalidade está sendo desenvolvida para oferecer a melhor experiência aos moradores do condomínio.
          </DialogDescription>
        </DialogHeader>

        <div className="my-3 p-4 rounded-xl bg-accent/5 border border-accent/20 flex items-start gap-3 text-left">
          <Store className="h-5 w-5 text-accent shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="font-semibold text-foreground">Acesso Liberado:</p>
            <p className="text-muted-foreground text-xs mt-0.5">
              No momento, o sistema está disponível para uso na página <strong className="text-foreground">Início</strong>, no módulo <strong className="text-foreground">viziGO</strong> e na <strong className="text-foreground">Localização</strong>.
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-center pt-2">
          <Button
            variant="hero"
            size="lg"
            onClick={handleClose}
            className="w-full sm:w-auto px-8 gap-2 font-medium shadow-luxury"
          >
            <ArrowLeft className="h-4 w-4" /> OK, Voltar ao Início
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
