import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import frente from "@/assets/galeriaCond/frente.png";
import interfone from "@/assets/galeriaCond/interfone.png";
import garagem from "@/assets/galeriaCond/garagem.png";
import postal from "@/assets/galeriaCond/postal.png";
import areacomum from "@/assets/galeriaCond/areacomum.png";
import areacomum2 from "@/assets/galeriaCond/areacomum2.png";


const images = [
  { src: frente, title: "Frente" },
  { src: interfone, title: "Interfone" },
  { src: garagem, title: "Garagem" },
  { src: postal, title: "Postal" },
  { src: areacomum, title: "Area Comum" },
  { src: areacomum2, title: "Area Comum 2" },
];

export default function Galeria() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold mb-2">
          <span className="text-gradient-gold">Galeria</span> de Fotos do Condomínio
        </h1>
        <p className="text-muted-foreground mb-8">Conheça nossos espaços.</p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="cursor-pointer group relative rounded-xl overflow-hidden aspect-[4/3]"
            onClick={() => setSelected(i)}
          >
            <img src={img.src} alt={img.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-300 flex items-end">
              <span className="text-primary-foreground font-medium p-4 opacity-0 group-hover:opacity-100 transition-opacity">{img.title}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selected !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-primary/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <button onClick={() => setSelected(null)} className="absolute top-6 right-6 text-primary-foreground hover:text-accent transition-colors">
              <X className="h-8 w-8" />
            </button>
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={images[selected].src}
              alt={images[selected].title}
              className="max-w-full max-h-[85vh] rounded-xl object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
