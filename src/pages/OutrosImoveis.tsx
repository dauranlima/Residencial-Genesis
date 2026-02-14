import { useState } from "react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BedDouble, Maximize, MapPin, DollarSign, Search, CheckCircle2 } from "lucide-react";
import apt1 from "@/assets/aptos/imovel1.png";


// Import Outros images
import banho1 from "@/assets/outros/banho1.png";
import dentro1 from "@/assets/outros/dentro1.png";
import dentro2 from "@/assets/outros/dentro2.png";
import dentro3 from "@/assets/outros/dentro3.png";
import dentro4 from "@/assets/outros/dentro4.png";
import dentro5 from "@/assets/outros/dentro5.png";
import entrada from "@/assets/outros/entrada.png";
import escadabaixo from "@/assets/outros/escadabaixo.png";
import frente from "@/assets/outros/frente.png";
import pia1 from "@/assets/outros/pia1.png";
import placa from "@/assets/outros/placa.png";
import quarto1 from "@/assets/outros/quarto1.png";
import quarto1_2 from "@/assets/outros/quarto1_2.png";
import quarto1_3 from "@/assets/outros/quarto1_3.png";
import quarto2 from "@/assets/outros/quarto2.png";
import quarto2_1 from "@/assets/outros/quarto2_1.png";

const outrosImages = [
  frente, entrada, placa,
  dentro1, dentro2, dentro3, dentro4, dentro5,
  quarto1, quarto1_2, quarto1_3,
  quarto2, quarto2_1,
  banho1, pia1,
  escadabaixo
];
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const imoveis = [
  { id: 1, name: "Sala Comercial - Rua Fortaleza 1849 -", type: "Sala Comercial", bairro: "Centro", beds: 1, area: 73, price: "R$ 2.200/mês", img: apt1 },
  // { id: 2, name: "Studio Jardins", type: "Studio", bairro: "Jardins", beds: 1, area: 35, price: "R$ 3.200/mês", img: apt2 },
  // { id: 3, name: "Cobertura Itaim", type: "Cobertura", bairro: "Itaim Bibi", beds: 4, area: 250, price: "R$ 18.000/mês", img: lobbyImg },
  // { id: 4, name: "Flat Moema", type: "Flat", bairro: "Moema", beds: 1, area: 42, price: "R$ 2.900/mês", img: apt1 },
  // { id: 5, name: "Apartamento Pinheiros", type: "Apartamento", bairro: "Pinheiros", beds: 2, area: 85, price: "R$ 5.500/mês", img: apt2 },
  // { id: 6, name: "Studio Vila Olímpia", type: "Studio", bairro: "Vila Olímpia", beds: 1, area: 30, price: "R$ 3.000/mês", img: lobbyImg },
];

export default function OutrosImoveis() {
  const [search, setSearch] = useState("");
  const [tipo, setTipo] = useState("todos");
  const [bairro, setBairro] = useState("todos");

  const filtered = imoveis.filter((i) => {
    const matchSearch = i.name.toLowerCase().includes(search.toLowerCase());
    const matchTipo = tipo === "todos" || i.type === tipo;
    const matchBairro = bairro === "todos" || i.bairro === bairro;
    return matchSearch && matchTipo && matchBairro;
  });

  const bairros = [...new Set(imoveis.map((i) => i.bairro))];
  const tipos = [...new Set(imoveis.map((i) => i.type))];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">Apartamentos <span className="text-gradient-gold">Disponíveis</span></h1>
        <p className="text-muted-foreground mb-8">Confira imóveis disponíveis aqui no condomínio e em outras regiões da cidade.</p>
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar imóvel..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
        </div>
        <Select value={tipo} onValueChange={setTipo}>
          <SelectTrigger className="w-full sm:w-44"><SelectValue placeholder="Tipo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os tipos</SelectItem>
            {tipos.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
          </SelectContent>
        </Select>
        <Select value={bairro} onValueChange={setBairro}>
          <SelectTrigger className="w-full sm:w-52"><SelectValue placeholder="Bairro" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os bairros</SelectItem>
            {bairros.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((imovel, i) => (
          <motion.div
            key={imovel.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="group rounded-xl overflow-hidden bg-card border border-border shadow-luxury hover:-translate-y-1 transition-all duration-300"
          >
            <div className="relative h-48 overflow-hidden">
              <img src={imovel.img} alt={imovel.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground">{imovel.type}</Badge>
            </div>
            <div className="p-5">
              <h3 className="font-semibold text-lg text-card-foreground mb-1">{imovel.name}</h3>
              <p className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                <MapPin className="h-3 w-3" /> {imovel.bairro}
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1"><BedDouble className="h-4 w-4" /> {imovel.beds}</span>
                <span className="flex items-center gap-1"><Maximize className="h-4 w-4" /> {imovel.area}m²</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1 font-bold text-accent"><DollarSign className="h-4 w-4" /> {imovel.price}</span>
                <Button size="sm" asChild>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">Consultar</Button>
                    </DialogTrigger>
                      <DialogContent className="max-w-5xl w-full max-h-[90vh] overflow-y-auto p-4 md:p-6">
                        <DialogHeader>
                          <DialogTitle className="text-xl md:text-2xl font-bold text-navy-dark">Amplo Conjunto Comercial de 73m² - Excelente Localização e Segurança</DialogTitle>
                          <DialogDescription className="text-base md:text-lg text-muted-foreground mt-2">
                            Oportunidade para o seu negócio! Sala comercial com 73m² de área privativa, projetada para oferecer conforto e funcionalidade.
                          </DialogDescription>
                        </DialogHeader>

                        <div className="mt-6 space-y-8">
                          {/* Carousel */}
                          <div className="w-full px-8 md:px-12">
                            <Carousel className="w-full max-w-4xl mx-auto">
                              <CarouselContent>
                                {outrosImages.map((img, index) => (
                                  <CarouselItem key={index} className="basis-full md:basis-1/2 lg:basis-1/3">
                                    <div className="p-1">
                                      <div className="overflow-hidden rounded-xl border border-muted aspect-video relative">
                                          <img 
                                            src={img} 
                                            alt={`Foto ${index + 1}`} 
                                            className="w-full h-full object-cover"
                                          />
                                          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                                            {index + 1} / {outrosImages.length}
                                          </div>
                                      </div>
                                    </div>
                                  </CarouselItem>
                                ))}
                              </CarouselContent>
                              <CarouselPrevious className="-left-4 md:-left-12" />
                              <CarouselNext className="-right-4 md:-right-12" />
                            </Carousel>
                          </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          {/* Features */}
                          <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-navy-dark border-b border-gold/20 pb-2">Características do Imóvel</h3>
                            <ul className="space-y-3">
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-gold" />
                                <span>Hall de entrada receptivo.</span>
                              </li>
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-gold" />
                                <span>3 salas amplas e bem distribuídas.</span>
                              </li>
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-gold" />
                                <span>Copa privativa.</span>
                              </li>
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-gold" />
                                <span>WC e Depósito.</span>
                              </li>
                              <li className="flex items-center gap-3 text-muted-foreground">
                                <CheckCircle2 className="w-5 h-5 text-gold" />
                                <span>Área de serviço.</span>
                              </li>
                            </ul>
                          </div>

                          {/* Differentiators */}
                          <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-navy-dark border-b border-gold/20 pb-2">Diferenciais e Segurança</h3>
                            <p className="text-muted-foreground leading-relaxed">
                              Ambiente moderno com acabamento em gesso, elemento cobogó para iluminação natural e ponto de água nas salas. 
                              Para sua tranquilidade, o imóvel possui alarme, câmeras de segurança e grade de aço elétrica.
                            </p>
                            <p className="font-medium text-navy-dark pt-2">
                              Ideal para consultórios, escritórios de advocacia, agências ou clínicas. Agende sua visita!
                            </p>
                          </div>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-muted-foreground py-12">Nenhum imóvel encontrado com os filtros selecionados.</p>
      )}
    </div>
  );
}
