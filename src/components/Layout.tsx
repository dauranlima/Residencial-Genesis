import { ReactNode, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import UnderDevelopmentModal from "./UnderDevelopmentModal";
import FooterConsentBanner from "./FooterConsentBanner";
import { isPathEnabled, subscribeToPageStatusChanges } from "@/lib/pageStatusService";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login" || location.pathname === "/adm-login";
  const isAdminPage = location.pathname.startsWith("/admin") || location.pathname.startsWith("/super-admin") || location.pathname.startsWith("/adm-");
  const isLandingPage = location.pathname === "/";
  const shouldHideLayout = isLoginPage || isAdminPage || isLandingPage;

  const [isUnderDev, setIsUnderDev] = useState(isLandingPage ? false : !isPathEnabled(location.pathname));

  useEffect(() => {
    const checkStatus = () => {
      setIsUnderDev(!isPathEnabled(location.pathname));
    };

    checkStatus();
    const unsubscribe = subscribeToPageStatusChanges(checkStatus);
    return () => unsubscribe();
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideLayout && <Header />}
      <main className="flex-1">{isUnderDev ? null : children}</main>
      {!shouldHideLayout && <Footer />}
      <UnderDevelopmentModal />
      {!shouldHideLayout && <FooterConsentBanner />}
    </div>
  );
}
