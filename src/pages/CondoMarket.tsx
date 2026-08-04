import { useState } from "react";
import { ShoppingBag, Zap, ShoppingCart, UserCheck, Sparkles, Building } from "lucide-react";
import SeniorModeToggle from "@/components/condo-market/SeniorModeToggle";
import ClassifiedsTab from "@/components/condo-market/ClassifiedsTab";
import MerchantsTab from "@/components/condo-market/MerchantsTab";
import NewClassifiedModal from "@/components/condo-market/NewClassifiedModal";
import RedeemCouponModal from "@/components/condo-market/RedeemCouponModal";
import ResidentRegisterModal from "@/components/condo-market/ResidentRegisterModal";
import ClassifiedDetailModal from "@/components/condo-market/ClassifiedDetailModal";
import { ClassifiedItem, Coupon, Merchant } from "@/components/condo-market/types";
import { Button } from "@/components/ui/button";

// Dados simulados iniciais para o MVP com múltiplas fotos para a tela de detalhes
const INITIAL_CLASSIFIEDS: ClassifiedItem[] = [
  {
    id: "c-1",
    title: "Sofá Retrátil 3 Lugares Verde",
    description: "Sofá em ótimo estado de conservação, ideal para sala de estar. Sem manchas ou rasgos. Revestimento em tecido suede de alta durabilidade, estrutura em madeira de reflorestamento tratada. Motivo da venda: mudança de apartamento.",
    price: 650.0,
    category: "Móveis",
    images: [
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&auto=format&fit=crop&q=80"
    ],
    status: "available",
    createdAt: "2026-08-04T10:00:00Z",
    sellerName: "Dona Vera",
    sellerBlock: "A",
    sellerUnit: "302",
    whatsapp: "(45) 9934-3095",
  },
  {
    id: "c-2",
    title: "Smart TV Samsung 50'' 4K HDR",
    description: "Funcionando perfeitamente. Acompanha controle remoto inteligente original e cabo de força. Tela sem riscos nem pixels queimados, suporte de mesa e aplicativo de streaming já instalados. Morador do bloco B.",
    price: 1400.0,
    category: "Eletrônicos",
    images: [
      "https://images.unsplash.com/photo-1593784991095-a205069470b6?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80"
    ],
    status: "available",
    createdAt: "2026-08-03T15:30:00Z",
    sellerName: "Carlos Eduardo",
    sellerBlock: "B",
    sellerUnit: "104",
    whatsapp: "(45) 9988-1153",
  },
  {
    id: "c-3",
    title: "Bicicleta Caloi Aro 29 com 21 Marchas",
    description: "Pouco usada, pneu seminovo e com revisão recente feita na oficina da rua. Freio a disco, suspensão dianteira. Ótima para andar no condomínio e no parque.",
    price: 480.0,
    category: "Esportes",
    images: [
      "https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=800&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7?w=800&auto=format&fit=crop&q=80"
    ],
    status: "available",
    createdAt: "2026-08-02T18:20:00Z",
    sellerName: "Fernando",
    sellerBlock: "A",
    sellerUnit: "501",
    whatsapp: "(45) 99777-1122",
  },
  {
    id: "c-4",
    title: "Airfryer Mondial 4L Digital 110v",
    description: "Funcionando 100%. Comprei uma maior e estou desapegando desta. Acompanha cesto antiaderente e manual original. Retirada na portaria ou entrego na porta.",
    price: 120.0,
    category: "Eletrodomésticos",
    images: [
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80"
    ],
    status: "available",
    createdAt: "2026-08-01T09:00:00Z",
    sellerName: "Luciana",
    sellerBlock: "B",
    sellerUnit: "203",
    whatsapp: "(45) 99654-3210",
  },
];

const INITIAL_MERCHANTS: Merchant[] = [
  {
    id: "m-1",
    businessName: "Padaria & Confeitaria Pão D'Oro",
    category: "Padaria",
    description: "Pães quentinhos a 2 quadras do condomínio.",
    whatsapp: "(45) 99111-2233",
  },
  {
    id: "m-2",
    businessName: "Petshop Amigo Fiel",
    category: "Petshop",
    description: "Banho, tosa e rações com entrega grátis na portaria.",
    whatsapp: "(45) 99222-3344",
  },
  {
    id: "m-3",
    businessName: "Lava-Car Brilho Express",
    category: "Lava-Car",
    description: "Lavagem completa e espelhamento a 500 metros.",
    whatsapp: "(45) 99333-4455",
  },
];

const INITIAL_COUPONS: Coupon[] = [
  {
    id: "cp-1",
    merchantId: "m-1",
    merchantName: "Canário Bebidas & Convêniencia",
    merchantCategory: "Mercado",
    merchantWhatsapp: "(45) 99111-2233",
    title: "20% Desconto em qualquer produto",
    description: "Válido para compras na padaria hoje.",
    discountValue: "10% OFF",
    totalQuantity: 10,
    remainingQuantity: 2, // Urgente!
    expiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "cp-2",
    merchantId: "m-2",
    merchantName: "Petshop Amigo Fiel",
    merchantCategory: "Petshop",
    merchantWhatsapp: "(45) 99222-3344",
    title: "R$ 20,00 de Desconto no Banho & Tosa",
    description: "Válido para cães de pequeno e médio porte agendados esta semana.",
    discountValue: "R$ 20 OFF",
    totalQuantity: 8,
    remainingQuantity: 5,
    expiresAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    isActive: true,
  },
  {
    id: "cp-3",
    merchantId: "m-3",
    merchantName: "Lava-Car DGD",
    merchantCategory: "Lava-Car",
    merchantWhatsapp: "(45) 99333-4455",
    title: "Lavagem Completa com Cera Grátis",
    description: "Traga seu carro e ganhe aplicação de cera protetora especial.",
    discountValue: "Cera Grátis",
    totalQuantity: 15,
    remainingQuantity: 3,
    expiresAt: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    isActive: true,
  },
];

export default function CondoMarket() {
  const [isSeniorMode, setIsSeniorMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"classifieds" | "merchants">("classifieds");

  // Dados com estado para permitirem adição/atualização
  const [classifieds, setClassifieds] = useState<ClassifiedItem[]>(INITIAL_CLASSIFIEDS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [merchants] = useState<Merchant[]>(INITIAL_MERCHANTS);

  // Estados dos Modais
  const [isNewClassifiedOpen, setIsNewClassifiedOpen] = useState(false);
  const [selectedCouponToRedeem, setSelectedCouponToRedeem] = useState<Coupon | null>(null);
  const [selectedClassifiedItem, setSelectedClassifiedItem] = useState<ClassifiedItem | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; block: string; unit: string } | null>(null);

  const handleAddClassified = (newItem: ClassifiedItem) => {
    setClassifieds([newItem, ...classifieds]);
  };

  const handleRedeemCoupon = (coupon: Coupon) => {
    setSelectedCouponToRedeem(coupon);
    // Diminuir a quantidade disponível no cupom
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === coupon.id
          ? { ...c, remainingQuantity: Math.max(0, c.remainingQuantity - 1) }
          : c
      )
    );
  };

  return (
    <div className={`min-h-screen bg-background pb-16 transition-all duration-300 ${isSeniorMode ? "text-lg" : ""}`}>
      {/* Banner Principal / Hero do CondoMarket */}
      <section className="bg-primary text-primary-foreground py-10 px-4 border-b border-navy-light/30 shadow-luxury">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles className="h-4 w-4 text-amber-300" /> Plataforma Hiperlocal do Condomínio
              </div>
              <h1 className={`font-black tracking-tight ${isSeniorMode ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}>
                CondoMarket <span className="text-gradient-gold">Morada do Sol II</span>
              </h1>
              <p className={`text-primary-foreground/80 max-w-2xl ${isSeniorMode ? "text-xl leading-relaxed" : "text-base"}`}>
                Desapegue de itens seminovos com vizinhos do mesmo prédio e aproveite cupons de desconto relâmpago no comércio local.
              </p>
            </div>

            {/* Ações da Barra Superior (Modo Sênior & Login Morador) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              <SeniorModeToggle
                isSeniorMode={isSeniorMode}
                onToggle={() => setIsSeniorMode(!isSeniorMode)}
              />

              <Button
                variant="outline"
                onClick={() => setIsRegisterOpen(true)}
                className={`w-full sm:w-auto bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 font-bold ${
                  isSeniorMode ? "h-14 px-6 text-lg" : "h-10"
                }`}
              >
                <UserCheck className="h-5 w-5 mr-2" />
                {currentUser ? `${currentUser.name} (Apto ${currentUser.unit})` : "Identificar Morador"}
              </Button>
            </div>
          </div>

          {/* Abas de Navegação (Desapegos vs Promoções) */}
          <div className="flex items-center gap-3 mt-8 border-t border-primary-foreground/10 pt-6">
            <button
              onClick={() => setActiveTab("classifieds")}
              className={`flex items-center gap-2 font-bold px-5 py-3 rounded-xl transition-all ${
                activeTab === "classifieds"
                  ? "bg-accent text-accent-foreground shadow-luxury font-black"
                  : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
              } ${isSeniorMode ? "text-xl px-8 py-4" : "text-base"}`}
            >
              <ShoppingCart className={isSeniorMode ? "h-6 w-6" : "h-5 w-5"} />
              <span>Desapegos de Vizinhos ({classifieds.length})</span>
            </button>

            <button
              onClick={() => setActiveTab("merchants")}
              className={`flex items-center gap-2 font-bold px-5 py-3 rounded-xl transition-all ${
                activeTab === "merchants"
                  ? "bg-amber-500 text-slate-950 shadow-luxury font-black"
                  : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
              } ${isSeniorMode ? "text-xl px-8 py-4" : "text-base"}`}
            >
              <Zap className={isSeniorMode ? "h-6 w-6 fill-slate-950" : "h-5 w-5 fill-current"} />
              <span>Promoções Relâmpago ({coupons.length})</span>
            </button>
          </div>
        </div>
      </section>

      {/* Conteúdo Principal por Aba */}
      <main className="container mx-auto px-4 mt-8">
        {activeTab === "classifieds" ? (
          <ClassifiedsTab
            items={classifieds}
            isSeniorMode={isSeniorMode}
            onOpenNewModal={() => {
              if (!currentUser) {
                setIsRegisterOpen(true);
              } else {
                setIsNewClassifiedOpen(true);
              }
            }}
            onSelectItem={(item) => setSelectedClassifiedItem(item)}
          />
        ) : (
          <MerchantsTab
            coupons={coupons}
            merchants={merchants}
            isSeniorMode={isSeniorMode}
            onRedeemCoupon={handleRedeemCoupon}
          />
        )}
      </main>

      {/* Modais */}
      <ClassifiedDetailModal
        item={selectedClassifiedItem}
        isOpen={!!selectedClassifiedItem}
        onClose={() => setSelectedClassifiedItem(null)}
        isSeniorMode={isSeniorMode}
      />

      <NewClassifiedModal
        isOpen={isNewClassifiedOpen}
        onClose={() => setIsNewClassifiedOpen(false)}
        onAddClassified={handleAddClassified}
        isSeniorMode={isSeniorMode}
        currentUser={currentUser}
      />

      <RedeemCouponModal
        coupon={selectedCouponToRedeem}
        isOpen={!!selectedCouponToRedeem}
        onClose={() => setSelectedCouponToRedeem(null)}
        isSeniorMode={isSeniorMode}
      />

      <ResidentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={(name, block, unit) => setCurrentUser({ name, block, unit })}
        isSeniorMode={isSeniorMode}
      />
    </div>
  );
}

