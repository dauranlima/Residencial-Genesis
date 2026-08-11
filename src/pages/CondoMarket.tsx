import { useState, useEffect } from "react";
import { ShoppingBag, Zap, ShoppingCart, UserCheck, Package, LogOut, Building2, Briefcase, Sparkles } from "lucide-react";
import ClassifiedsTab from "@/components/condo-market/ClassifiedsTab";
import MerchantsTab from "@/components/condo-market/MerchantsTab";
import ServicesTab from "@/components/condo-market/ServicesTab";
import MyClassifiedsTab from "@/components/condo-market/MyClassifiedsTab";
import NewClassifiedModal from "@/components/condo-market/NewClassifiedModal";
import NewPromotionModal from "@/components/condo-market/NewPromotionModal";
import RedeemCouponModal from "@/components/condo-market/RedeemCouponModal";
import ResidentRegisterModal from "@/components/condo-market/ResidentRegisterModal";
import ClassifiedDetailModal from "@/components/condo-market/ClassifiedDetailModal";
import MerchantRedemptionsModal from "@/components/condo-market/MerchantRedemptionsModal";
import SuperAdminMerchantsModal from "@/components/condo-market/SuperAdminMerchantsModal";
import EditClassifiedModal from "@/components/condo-market/EditClassifiedModal";
import ServiceProfileModal from "@/components/condo-market/ServiceProfileModal";
import RegisterServiceProfileModal from "@/components/condo-market/RegisterServiceProfileModal";
import AddReviewModal from "@/components/condo-market/AddReviewModal";
import AdminAuthPinModal from "@/components/AdminAuthPinModal";
import { ClassifiedItem, Coupon, Merchant, CurrentUser, ClassifiedStatus, ResidentServiceProfile } from "@/components/condo-market/types";
import { Button } from "@/components/ui/button";
import {
  fetchClassifiedsFromSupabase,
  fetchPromotionsFromSupabase,
  redeemPromotionInSupabase,
  updateClassifiedStatusInSupabase,
  fetchUserRedeemedCouponIdsFromSupabase,
  fetchMerchantsFromSupabase,
  deletePromotionInSupabase,
} from "@/lib/condoMarketService";
import { fetchResidentServicesFromSupabase } from "@/lib/residentServicesService";
import { toast } from "sonner";


// Parceiros locais fixos do condomínio (exibidos na vitrine)
const CONDOCENTER_MERCHANTS: Merchant[] = [
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

export default function CondoMarket() {
  const [isSeniorMode, setIsSeniorMode] = useState(false);
  const [activeTab, setActiveTab] = useState<"classifieds" | "merchants" | "services" | "my_classifieds">("classifieds");

  // Dados reais persistidos no Supabase (zero mock)
  const [classifieds, setClassifieds] = useState<ClassifiedItem[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [merchants, setMerchants] = useState<Merchant[]>(CONDOCENTER_MERCHANTS);
  const [serviceProfiles, setServiceProfiles] = useState<ResidentServiceProfile[]>([]);

  // Estados de carregamento
  const [isLoadingClassifieds, setIsLoadingClassifieds] = useState(true);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(true);
  const [isLoadingServices, setIsLoadingServices] = useState(true);

  // Estados dos Modais
  const [isNewClassifiedOpen, setIsNewClassifiedOpen] = useState(false);
  const [isAdminPinOpen, setIsAdminPinOpen] = useState(false);
  const [isSuperAdminRegisterOpen, setIsSuperAdminRegisterOpen] = useState(false);
  const [isNewPromotionOpen, setIsNewPromotionOpen] = useState(false);
  const [selectedCouponToRedeem, setSelectedCouponToRedeem] = useState<Coupon | null>(null);
  const [selectedCouponForRedemptions, setSelectedCouponForRedemptions] = useState<Coupon | null>(null);
  const [selectedClassifiedItem, setSelectedClassifiedItem] = useState<ClassifiedItem | null>(null);
  const [editingClassifiedItem, setEditingClassifiedItem] = useState<ClassifiedItem | null>(null);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  // Modais de Serviços
  const [selectedServiceProfile, setSelectedServiceProfile] = useState<ResidentServiceProfile | null>(null);
  const [isRegisterServiceOpen, setIsRegisterServiceOpen] = useState(false);
  const [reviewTargetProfile, setReviewTargetProfile] = useState<ResidentServiceProfile | null>(null);
  
  const [currentMerchant, setCurrentMerchant] = useState<Merchant | null>(() => {
    try {
      const saved = localStorage.getItem("condo_market_current_merchant");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(() => {
    try {
      const saved = localStorage.getItem("condo_market_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [redeemedCouponIds, setRedeemedCouponIds] = useState<string[]>([]);

  // Carregar cupons resgatados do morador logado (do localStorage e do Supabase)
  useEffect(() => {
    let isMounted = true;
    if (currentUser) {
      // 1. LocalStorage fallback instantâneo
      let localIds: string[] = [];
      try {
        const key = `condo_market_redeemed_${currentUser.phone || currentUser.unit || currentUser.name}`;
        const saved = localStorage.getItem(key);
        if (saved) {
          localIds = JSON.parse(saved);
        }
      } catch (e) {
        console.error("Erro ao carregar cupons resgatados do localStorage:", e);
      }
      setRedeemedCouponIds(localIds);

      // 2. Busca oficial do banco Supabase (tabela coupon_redemptions)
      if (currentUser.phone) {
        fetchUserRedeemedCouponIdsFromSupabase(currentUser.phone).then((dbIds) => {
          if (isMounted && dbIds && dbIds.length > 0) {
            setRedeemedCouponIds((prev) => Array.from(new Set([...prev, ...dbIds])));
          }
        });
      }
    } else {
      setRedeemedCouponIds([]);
    }
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Carregar dados reais do Supabase na inicialização
  useEffect(() => {
    loadClassifieds();
    loadPromotions();
    loadMerchants();
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setIsLoadingServices(true);
      const data = await fetchResidentServicesFromSupabase();
      setServiceProfiles(data);
    } catch (e) {
      console.error("Erro ao carregar serviços dos moradores:", e);
    } finally {
      setIsLoadingServices(false);
    }
  };

  const loadMerchants = async () => {

    try {
      const dbMerchants = await fetchMerchantsFromSupabase();
      if (dbMerchants && dbMerchants.length > 0) {
        setMerchants(dbMerchants);
      }
    } catch (e) {
      console.error("Erro ao carregar parceiros comerciais do Supabase:", e);
    }
  };

  const loadClassifieds = async () => {
    try {
      setIsLoadingClassifieds(true);
      const data = await fetchClassifiedsFromSupabase();
      setClassifieds(data);
    } catch (error) {
      console.error("Erro ao carregar anúncios:", error);
      toast.error("Erro ao carregar desapegos do Supabase.");
    } finally {
      setIsLoadingClassifieds(false);
    }
  };

  const loadPromotions = async () => {
    try {
      setIsLoadingCoupons(true);
      const data = await fetchPromotionsFromSupabase();
      setCoupons(data);
    } catch (error) {
      console.error("Erro ao carregar promoções:", error);
      toast.error("Erro ao carregar promoções do Supabase.");
    } finally {
      setIsLoadingCoupons(false);
    }
  };

  const handleAddClassified = (newItem: ClassifiedItem) => {
    setClassifieds((prev) => [newItem, ...prev]);
  };

  const handleAddPromotion = (newCoupon: Coupon) => {
    setCoupons((prev) => [newCoupon, ...prev]);
  };

  const handleRedeemCoupon = async (coupon: Coupon) => {
    // 1. Exigir identificação prévia do morador
    if (!currentUser) {
      toast.warning("Para resgatar um cupom grátis, é necessário se identificar como morador primeiro.");
      setIsRegisterOpen(true);
      return;
    }

    // 2. Permitir apenas 1 resgate por morador por cupom
    if (redeemedCouponIds.includes(coupon.id)) {
      toast.error("Você já resgatou este cupom! Cada morador pode resgatar apenas 1 vez por promoção.");
      return;
    }

    // Salvar localmente o ID do cupom resgatado para este morador
    const newRedeemed = [...redeemedCouponIds, coupon.id];
    setRedeemedCouponIds(newRedeemed);
    try {
      const key = `condo_market_redeemed_${currentUser.phone || currentUser.unit || currentUser.name}`;
      localStorage.setItem(key, JSON.stringify(newRedeemed));
    } catch (e) {
      console.error("Erro ao salvar cupom resgatado no localStorage:", e);
    }

    setSelectedCouponToRedeem(coupon);
    
    // Atualizar local e sincronizar decremento + cadastro da moradora no Supabase
    setCoupons((prev) =>
      prev.map((c) =>
        c.id === coupon.id
          ? { ...c, remainingQuantity: Math.max(0, c.remainingQuantity - 1) }
          : c
      )
    );

    try {
      await redeemPromotionInSupabase(coupon.id, coupon.remainingQuantity, currentUser);
    } catch (error) {
      console.error("Erro ao resgatar cupom no Supabase:", error);
    }
  };

  const handleResidentSuccess = (name: string, block: string, unit: string, phone: string) => {
    const user: CurrentUser = { name, block, unit, phone };
    setCurrentUser(user);
    try {
      localStorage.setItem("condo_market_user", JSON.stringify(user));
    } catch (e) {
      console.error("Erro ao salvar dados no localStorage:", e);
    }
    toast.success(`Bem-vindo(a), ${name}! Morador identificado com sucesso.`);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("condo_market_user");
    } catch (e) {
      console.error("Erro ao remover dados do morador no localStorage:", e);
    }
    toast.info("Você deslogou da sua conta de morador.");
  };

  const handleMerchantLogout = () => {
    setCurrentMerchant(null);
    try {
      localStorage.removeItem("condo_market_current_merchant");
    } catch (e) {
      console.error("Erro ao remover comerciante no localStorage:", e);
    }
    toast.info("Sessão do comerciante encerrada. Digite o PIN de 8 dígitos para conectar outro parceiro.");
  };

  const handleOpenNewPromotionModal = () => {
    if (currentMerchant) {
      setIsNewPromotionOpen(true);
    } else {
      setIsAdminPinOpen(true);
    }
  };

  const handleDeleteCoupon = async (couponToDelete: Coupon) => {
    setCoupons((prev) => prev.filter((c) => c.id !== couponToDelete.id));
    toast.success(`Oferta "${couponToDelete.title}" excluída com sucesso.`);

    try {
      await deletePromotionInSupabase(couponToDelete.id);
    } catch (error) {
      console.error("Erro ao excluir oferta no Supabase:", error);
    }
  };

  const handleUpdateStatus = async (itemId: string, newStatus: ClassifiedStatus) => {
    // Atualização otimista local
    setClassifieds((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status: newStatus } : item))
    );
    if (selectedClassifiedItem && selectedClassifiedItem.id === itemId) {
      setSelectedClassifiedItem((prev) => (prev ? { ...prev, status: newStatus } : null));
    }

    const labels: Record<ClassifiedStatus, string> = {
      available: "Disponível",
      reserved: "Reservado",
      sold: "Vendido",
      cancelled: "Cancelado",
    };

    if (newStatus === "available") {
      toast.success("Anúncio ativado novamente! Ele voltou a ser exibido na aba 'Desapego de Vizinhos'.");
    } else {
      toast.success(`Anúncio atualizado para "${labels[newStatus]}"`);
    }
    await updateClassifiedStatusInSupabase(itemId, newStatus);
  };

  const handleFinalize = async () => {
    if (selectedClassifiedItem) {
      await handleUpdateStatus(selectedClassifiedItem.id, "sold");
    }
    setSelectedClassifiedItem(null);
    setActiveTab("my_classifieds");
    toast.success("Anúncio finalizado com sucesso! Ele foi removido da aba pública e está salvo em 'Meus Anúncios'.");
  };

  const handleUpdateClassified = (updatedItem: ClassifiedItem) => {
    setClassifieds((prev) =>
      prev.map((item) => (item.id === updatedItem.id ? updatedItem : item))
    );
    if (selectedClassifiedItem && selectedClassifiedItem.id === updatedItem.id) {
      setSelectedClassifiedItem(updatedItem);
    }
  };

  const handleDeleteClassified = (itemId: string) => {
    setClassifieds((prev) => prev.filter((item) => item.id !== itemId));
    if (selectedClassifiedItem && selectedClassifiedItem.id === itemId) {
      setSelectedClassifiedItem(null);
    }
  };

  // Contagem de anúncios do morador logado
  const myClassifiedsCount = currentUser
    ? classifieds.filter((item) => {
        const isOwnerByPhone =
          currentUser.phone &&
          item.whatsapp &&
          currentUser.phone.replace(/\D/g, "") === item.whatsapp.replace(/\D/g, "");
        const isOwnerByUnit =
          currentUser.unit === item.sellerUnit &&
          currentUser.name.toLowerCase() === item.sellerName.toLowerCase();
        return isOwnerByPhone || isOwnerByUnit;
      }).length
    : 0;

  const publicClassifiedsCount = classifieds.filter((i) => i.status !== "cancelled" && i.status !== "sold").length;

  return (
    <div className={`min-h-screen bg-background pb-16 transition-all duration-300 ${isSeniorMode ? "text-lg" : ""}`}>
      {/* Banner Principal / Hero do viziGO */}
      <section className="bg-primary text-primary-foreground py-10 px-4 border-b border-navy-light/30 shadow-luxury">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                <Building2 className="h-4 w-4 text-amber-300" /> Condomínio
              </div>
              <h1 className={`font-black tracking-tight ${isSeniorMode ? "text-4xl md:text-5xl" : "text-3xl md:text-4xl"}`}>
                Residencial <span className="text-gradient-gold">Morada do Sol II</span>
              </h1>
              <p className={`text-primary-foreground/80 max-w-2xl ${isSeniorMode ? "text-xl leading-relaxed" : "text-base"}`}>
                Desapegue de itens seminovos com vizinhos do mesmo prédio e aproveite cupons de desconto relâmpago no comércio local.
              </p>
            </div>

            {/* Ações da Barra Superior (Login Morador) */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {currentUser ? (
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    onClick={() => setIsRegisterOpen(true)}
                    className={`bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 font-bold ${
                      isSeniorMode ? "h-14 px-6 text-lg" : "h-10"
                    }`}
                    title="Clique para alternar perfil de morador"
                  >
                    <UserCheck className="h-5 w-5 mr-2 text-amber-400" />
                    <span>{currentUser.name} (Apto {currentUser.unit})</span>
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleLogout}
                    className={`font-bold flex items-center gap-1.5 shadow-sm transition-all hover:bg-red-600 ${
                      isSeniorMode ? "h-14 px-6 text-lg rounded-xl" : "h-10 px-3.5 text-sm"
                    }`}
                    title="Sair da conta"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sair</span>
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsRegisterOpen(true)}
                  className={`w-full sm:w-auto bg-primary-foreground/10 text-primary-foreground border-primary-foreground/20 hover:bg-primary-foreground/20 font-bold ${
                    isSeniorMode ? "h-14 px-6 text-lg" : "h-10"
                  }`}
                >
                  <UserCheck className="h-5 w-5 mr-2 text-amber-400" />
                  <span>Identificar Morador</span>
                </Button>
              )}
            </div>
          </div>

          {/* Abas de Navegação (Desapegos vs Promoções vs Serviços vs Meus Anúncios) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mt-8 border-t border-primary-foreground/10 pt-6">
            <button
              onClick={() => {
                setActiveTab("classifieds");
                setTimeout(() => {
                  (document.getElementById("condo-market-main-content") || document.getElementById("market-categories-section"))?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 50);
              }}
              className={`flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-xl transition-all w-full sm:w-auto cursor-pointer ${
                activeTab === "classifieds"
                  ? "bg-accent text-accent-foreground shadow-luxury font-black"
                  : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
              } ${isSeniorMode ? "text-xl px-8 py-4" : "text-base"}`}
            >
              <ShoppingCart className={isSeniorMode ? "h-6 w-6" : "h-5 w-5"} />
              <span>Marketplace ({publicClassifiedsCount})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("merchants");
                setTimeout(() => {
                  (document.getElementById("condo-market-main-content") || document.getElementById("market-categories-section"))?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 50);
              }}
              className={`flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-xl transition-all w-full sm:w-auto cursor-pointer ${
                activeTab === "merchants"
                  ? "bg-amber-500 text-slate-950 shadow-luxury font-black"
                  : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
              } ${isSeniorMode ? "text-xl px-8 py-4" : "text-base"}`}
            >
              <Zap className={isSeniorMode ? "h-6 w-6 fill-slate-950" : "h-5 w-5 fill-current"} />
              <span>Comércios Locais ({coupons.length})</span>
            </button>

            <button
              onClick={() => {
                setActiveTab("services");
                setTimeout(() => {
                  (document.getElementById("condo-market-main-content") || document.getElementById("market-categories-section"))?.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }, 50);
              }}
              className={`flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-xl transition-all w-full sm:w-auto cursor-pointer border border-emerald-500/40 ${
                activeTab === "services"
                  ? "bg-emerald-500 text-slate-950 shadow-luxury font-black"
                  : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
              } ${isSeniorMode ? "text-xl px-8 py-4" : "text-base"}`}
            >
              <Briefcase className={isSeniorMode ? "h-6 w-6" : "h-5 w-5"} />
              <span>Serviços dos Moradores ({serviceProfiles.length})</span>
            </button>

            {currentUser && (
              <button
                onClick={() => {
                  setActiveTab("my_classifieds");
                  setTimeout(() => {
                    (document.getElementById("condo-market-main-content") || document.getElementById("market-categories-section"))?.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }, 50);
                }}
                className={`flex items-center justify-center gap-2 font-bold px-5 py-3 rounded-xl transition-all w-full sm:w-auto cursor-pointer border border-amber-500/40 ${
                  activeTab === "my_classifieds"
                    ? "bg-amber-500 text-slate-950 shadow-luxury font-black"
                    : "bg-primary-foreground/10 text-primary-foreground/80 hover:bg-primary-foreground/20"
                } ${isSeniorMode ? "text-xl px-8 py-4" : "text-base"}`}
              >
                <Package className={isSeniorMode ? "h-6 w-6" : "h-5 w-5"} />
                <span>Meus Anúncios ({myClassifiedsCount})</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Conteúdo Principal por Aba */}
      <main className="container mx-auto px-4 mt-8" id="condo-market-main-content">

        {activeTab === "classifieds" ? (
          <ClassifiedsTab
            items={classifieds}
            isLoading={isLoadingClassifieds}
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
        ) : activeTab === "services" ? (
          <ServicesTab
            profiles={serviceProfiles}
            isLoading={isLoadingServices}
            isSeniorMode={isSeniorMode}
            onSelectProfile={(p) => setSelectedServiceProfile(p)}
            onOpenRegisterModal={() => {
              if (!currentUser) {
                setIsRegisterOpen(true);
              } else {
                setIsRegisterServiceOpen(true);
              }
            }}
          />
        ) : activeTab === "merchants" ? (
          <MerchantsTab
            coupons={coupons}
            merchants={merchants}
            isLoading={isLoadingCoupons}
            isSeniorMode={isSeniorMode}
            redeemedCouponIds={redeemedCouponIds}
            currentMerchant={currentMerchant}
            onRedeemCoupon={handleRedeemCoupon}
            onOpenNewPromotionModal={handleOpenNewPromotionModal}
            onViewRedemptions={(coupon) => setSelectedCouponForRedemptions(coupon)}
            onDeleteCoupon={handleDeleteCoupon}
            onMerchantLogout={handleMerchantLogout}
            onOpenAdminAuth={() => setIsAdminPinOpen(true)}
          />
        ) : currentUser ? (
          <MyClassifiedsTab
            items={classifieds}
            currentUser={currentUser}
            isSeniorMode={isSeniorMode}
            onOpenNewModal={() => setIsNewClassifiedOpen(true)}
            onSelectItem={(item) => setSelectedClassifiedItem(item)}
            onUpdateStatus={handleUpdateStatus}
          />
        ) : null}
      </main>

      {/* Modais */}
      <ClassifiedDetailModal
        item={selectedClassifiedItem}
        isOpen={!!selectedClassifiedItem}
        onClose={() => setSelectedClassifiedItem(null)}
        isSeniorMode={isSeniorMode}
        currentUser={currentUser}
        onUpdateStatus={handleUpdateStatus}
        onFinalize={handleFinalize}
        onEdit={(item) => setEditingClassifiedItem(item)}
      />

      <EditClassifiedModal
        item={editingClassifiedItem}
        isOpen={!!editingClassifiedItem}
        onClose={() => setEditingClassifiedItem(null)}
        onUpdateClassified={handleUpdateClassified}
        onDeleteClassified={handleDeleteClassified}
        isSeniorMode={isSeniorMode}
      />

      <NewClassifiedModal
        isOpen={isNewClassifiedOpen}
        onClose={() => setIsNewClassifiedOpen(false)}
        onAddClassified={handleAddClassified}
        isSeniorMode={isSeniorMode}
        currentUser={currentUser}
      />

      <ServiceProfileModal
        profile={selectedServiceProfile}
        isOpen={!!selectedServiceProfile}
        onClose={() => setSelectedServiceProfile(null)}
        onOpenReviewModal={(profileToReview) => setReviewTargetProfile(profileToReview)}
      />

      <RegisterServiceProfileModal
        isOpen={isRegisterServiceOpen}
        onClose={() => setIsRegisterServiceOpen(false)}
        currentUser={currentUser}
        onSuccess={(newProfile) => {
          setServiceProfiles((prev) => [newProfile, ...prev.filter((p) => p.id !== newProfile.id)]);
          setSelectedServiceProfile(newProfile);
        }}
      />

      <AddReviewModal
        isOpen={!!reviewTargetProfile}
        onClose={() => setReviewTargetProfile(null)}
        profile={reviewTargetProfile}
        currentUser={currentUser}
        onSuccess={(updatedProfile) => {
          setServiceProfiles((prev) =>
            prev.map((p) => (p.id === updatedProfile.id ? updatedProfile : p))
          );
          if (selectedServiceProfile?.id === updatedProfile.id) {
            setSelectedServiceProfile(updatedProfile);
          }
        }}
      />


      <AdminAuthPinModal
        isOpen={isAdminPinOpen}
        onClose={() => setIsAdminPinOpen(false)}
        onSuperAdminSuccess={() => setIsSuperAdminRegisterOpen(true)}
        onMerchantSuccess={(merchant) => {
          setCurrentMerchant(merchant);
          setIsNewPromotionOpen(true);
        }}
      />

      <SuperAdminMerchantsModal
        isOpen={isSuperAdminRegisterOpen}
        onClose={() => setIsSuperAdminRegisterOpen(false)}
        onSelectMerchantToAuthenticate={(merchant) => {
          setCurrentMerchant(merchant);
          loadMerchants();
          setIsNewPromotionOpen(true);
        }}
        onMerchantListUpdated={() => {
          loadMerchants();
        }}
        isSeniorMode={isSeniorMode}
      />

      <NewPromotionModal
        isOpen={isNewPromotionOpen}
        onClose={() => setIsNewPromotionOpen(false)}
        onAddPromotion={handleAddPromotion}
        isSeniorMode={isSeniorMode}
        currentMerchant={currentMerchant}
      />

      <RedeemCouponModal
        coupon={selectedCouponToRedeem}
        isOpen={!!selectedCouponToRedeem}
        onClose={() => setSelectedCouponToRedeem(null)}
        isSeniorMode={isSeniorMode}
      />

      <MerchantRedemptionsModal
        coupon={selectedCouponForRedemptions}
        isOpen={!!selectedCouponForRedemptions}
        onClose={() => setSelectedCouponForRedemptions(null)}
      />

      <ResidentRegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onSuccess={handleResidentSuccess}
        isSeniorMode={isSeniorMode}
      />
    </div>
  );
}
