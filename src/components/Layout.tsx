import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import UnderDevelopmentModal from "./UnderDevelopmentModal";
import FooterConsentBanner from "./FooterConsentBanner";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/adm-login";
  const isAdminPage = location.pathname.startsWith("/admin") || location.pathname.startsWith("/super-admin") || location.pathname.startsWith("/adm-");
  const shouldHideLayout = isLoginPage || isAdminPage;

  const isUnderDevelopment = !["/", "/condo-market", "/localizacao", "/adm-login", "/super-admin"].includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideLayout && <Header />}
      <main className="flex-1">{isUnderDevelopment ? null : children}</main>
      {!shouldHideLayout && <Footer />}
      <UnderDevelopmentModal />
      {!shouldHideLayout && <FooterConsentBanner />}
    </div>
  );
}
