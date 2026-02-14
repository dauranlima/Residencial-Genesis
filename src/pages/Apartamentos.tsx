import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BedDouble, Maximize, DollarSign } from "lucide-react";
import apt1 from "@/assets/apartment-1.jpg";
import apt2 from "@/assets/apartment-2.jpg";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MessageCircle, AlertCircle } from "lucide-react";

const apartments = [
  { id: 1, name: "Flat 101", beds: 1, area: 45, price: "R$ 1.200/mês", status: "disponível", img: apt1 },
  { id: 2, name: "Flat 102", beds: 2, area: 68, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 3, name: "Flat 103", beds: 1, area: 45, price: "R$ 1.200/mês", status: "alugado", img: apt1 },
  { id: 4, name: "Flat 104", beds: 2, area: 72, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 5, name: "Flat 105", beds: 1, area: 50, price: "R$ 1.200/mês", status: "disponível", img: apt1 },
  { id: 6, name: "Flat 106", beds: 2, area: 65, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 7, name: "Flat 107", beds: 2, area: 65, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 8, name: "Flat 108", beds: 2, area: 65, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 9, name: "Flat 201", beds: 2, area: 65, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 10, name: "Flat 202", beds: 2, area: 65, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 11, name: "Flat 203", beds: 2, area: 65, price: "R$ 1.200/mês", status: "disponível", img: apt2 },
  { id: 12, name: "Flat 204", beds: 2, area: 65, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 13, name: "Flat 205", beds: 2, area: 65, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 14, name: "Flat 206", beds: 2, area: 65, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
  { id: 15, name: "Flat 207", beds: 2, area: 65, price: "R$ 1.200/mês", status: "alugado", img: apt2 },
];

export default function Apartamentos() {
  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Nossos <span className="text-gradient-gold">Apartamentos</span></h1>
        <p className="text-muted-foreground mb-8">Conheça os flats disponíveis no condomínio.</p>
      </motion.div>

      {!apartments.some(apt => apt.status === "disponível") && (
        <Alert variant="destructive" className="mb-8 border-red-200 bg-red-50 text-red-900">
          <AlertCircle className="h-5 w-5 text-red-600" />
          <AlertTitle className="text-lg font-bold">Aviso Importante</AlertTitle>
          <AlertDescription className="font-semibold mt-1">
            NO MOMENTO NÃO TEMOS APARTAMENTO DISPONÍVEL PARA LOCAÇÃO
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {apartments.map((apt, i) => (
          <motion.div
            key={apt.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-xl overflow-hidden bg-card border border-border shadow-luxury hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-12 overflow-hidden">
              <Badge
                className={`absolute top-3 right-3 ${
                  apt.status === "disponível"
                    ? "bg-accent text-accent-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {apt.status}
              </Badge>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg text-card-foreground mb-3">{apt.name}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {apt.beds} quarto(s)</span>
                <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {apt.area}m²</span>
              </div>
              <div className="flex items-center justify-between">
                {apt.status === "disponível" ? (
                  <span className="flex items-center gap-1 font-bold text-accent">
                    <DollarSign className="h-4 w-4" /> {apt.price}
                  </span>
                ) : (
                  <span></span>
                )}
                {apt.status === "disponível" ? (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm" variant="default">Consultar</Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Interesse no {apt.name}</DialogTitle>
                        <DialogDescription>
                          Entre em contato com o condomínio para mais informações.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex flex-col gap-4 py-4">
                        <p className="text-center text-lg font-medium text-navy-dark">
                          Telefone: (45) 99915-8889
                        </p>
                        <Button 
                          className="bg-green-600 hover:bg-green-700 text-white w-full gap-2"
                          onClick={() => {
                            const message = encodeURIComponent(`Olá, tenho interesse no ${apt.name}, gostaria de mais informações.`);
                            window.open(`https://wa.me/5545999158889?text=${message}`, "_blank");
                          }}
                        >
                          <MessageCircle className="w-5 h-5" />
                          Conversar no WhatsApp
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                ) : (
                  <Button size="sm" variant="secondary" disabled>
                    Indisponível
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
