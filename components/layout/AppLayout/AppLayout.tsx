"use client";

import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { ShellDonateButton } from "@/components/layout/ShellDonateButton";
import {
  Button,
  PrimaryNavIconConfig,
  PrimaryNavIconInstall,
  PrimaryNavTabs,
  ThemeModeToggle,
} from "@/components/design-system";
import { useIsMobileBreakpoint } from "@/hooks/useLayoutMode";
import { BRAND_LOGO_SRC } from "@/constants/brand.constants";
import { scrimTokens } from "@/theme/tokens";
import { DonateDialogContainer } from "@/containers/DonateDialogContainer";
import { LogoutConfirmDialogContainer } from "@/containers/LogoutConfirmDialogContainer";
import { selectIsAuthed } from "@/store/auth/authSlice";
import { useAppSelector } from "@/store/hooks";
import { Styled } from "./AppLayout.styled";

type PrimaryRouteId = "install" | "config";

type AppLayoutProps = Readonly<{
  children: ReactNode;
}>;

function routeIdFromPathname(pathname: string): PrimaryRouteId {
  return pathname.startsWith("/config") ? "config" : "install";
}

function hrefForRoute(id: PrimaryRouteId): string {
  return id === "config" ? "/config" : "/install";
}

/** Persistent product chrome: header, primary nav, account line, theme toggle. */
export function AppLayout({ children }: AppLayoutProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const isMobileBreakpoint = useIsMobileBreakpoint();
  const isAuthed = useAppSelector(selectIsAuthed);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const [navDrawerPath, setNavDrawerPath] = useState(pathname);
  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false);
  const [donateDialogOpen, setDonateDialogOpen] = useState(false);
  const isNavDrawerVisible = isMobileBreakpoint && navDrawerOpen && navDrawerPath === pathname;

  const activeRoute = routeIdFromPathname(pathname);

  const navTabs = useMemo(
    () => [
      {
        id: "install",
        label: t("Shell.NavLabel_Install"),
        icon: <PrimaryNavIconInstall />,
      },
      {
        id: "config",
        label: t("Shell.NavLabel_Config"),
        icon: <PrimaryNavIconConfig />,
      },
    ],
    [t],
  );

  const closeNavDrawer = useCallback(() => {
    setNavDrawerOpen(false);
  }, []);

  const handleDonate = useCallback(() => {
    closeNavDrawer();
    setDonateDialogOpen(true);
  }, [closeNavDrawer]);

  const toggleNavDrawer = useCallback(() => {
    if (isNavDrawerVisible) {
      closeNavDrawer();
      return;
    }
    setNavDrawerPath(pathname);
    setNavDrawerOpen(true);
  }, [closeNavDrawer, isNavDrawerVisible, pathname]);

  const handleNavChange = useCallback(
    (id: string) => {
      const next = id as PrimaryRouteId;
      router.push(hrefForRoute(next));
      closeNavDrawer();
    },
    [closeNavDrawer, router],
  );

  const handleLogoutClick = useCallback(() => {
    closeNavDrawer();
    setLogoutConfirmOpen(true);
  }, [closeNavDrawer]);

  const handleLogoutConfirmClose = useCallback(() => {
    setLogoutConfirmOpen(false);
  }, []);

  const handleDonateDialogClose = useCallback(() => {
    setDonateDialogOpen(false);
  }, []);

  useEffect(() => {
    if (!isNavDrawerVisible) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeNavDrawer();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [closeNavDrawer, isNavDrawerVisible]);

  const showInlineNav = !isMobileBreakpoint;
  const showDrawerNav = isMobileBreakpoint;

  return (
    <Styled.Shell>
      <Styled.Header role="banner">
        {showDrawerNav ? (
          <Styled.MenuToggle
            type="button"
            aria-expanded={isNavDrawerVisible}
            aria-controls="app-primary-nav-drawer"
            aria-label={
              isNavDrawerVisible ? t("Shell.Menu_AriaLabel_Close") : t("Shell.Menu_AriaLabel_Open")
            }
            onClick={toggleNavDrawer}
          >
            <Styled.MenuIcon $open={isNavDrawerVisible} aria-hidden>
              <span />
              <span />
              <span />
            </Styled.MenuIcon>
          </Styled.MenuToggle>
        ) : null}

        <Styled.Brand>
          <Styled.BrandLogo src={BRAND_LOGO_SRC} alt={t("Shell.Brand_ProductName")} />
        </Styled.Brand>

        {showInlineNav ? (
          <Styled.NavRegion>
            <nav aria-label={t("Shell.AriaLabel_PrimaryNav")}>
              <PrimaryNavTabs tabs={navTabs} value={activeRoute} onChange={handleNavChange} />
            </nav>
          </Styled.NavRegion>
        ) : null}

        <Styled.HeaderActions>
          <Styled.DonateDesktop>
            <ShellDonateButton onDonate={handleDonate} />
          </Styled.DonateDesktop>

          {isAuthed ? (
            <Styled.ShellLogoutButton
              appearance="ghost"
              onClick={handleLogoutClick}
              startIcon={<LogoutIcon fontSize="small" />}
            >
              {t("Shell.ButtonLabel_LogOut")}
            </Styled.ShellLogoutButton>
          ) : null}

          <ThemeModeToggle />
        </Styled.HeaderActions>
      </Styled.Header>

      <Styled.NavDrawer
        id="app-primary-nav-drawer"
        anchor="left"
        open={isNavDrawerVisible}
        onClose={closeNavDrawer}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          backdrop: {
            sx: { backgroundColor: scrimTokens.backdrop },
          },
        }}
      >
        <Styled.DrawerSheetTop>
          <Styled.DrawerBrand>
            <Styled.BrandLogo src={BRAND_LOGO_SRC} alt={t("Shell.Brand_ProductName")} />
          </Styled.DrawerBrand>
        </Styled.DrawerSheetTop>

        <Styled.DrawerBody>
          <nav aria-label={t("Shell.AriaLabel_PrimaryNav")}>
            <PrimaryNavTabs
              variant="drawer"
              tabs={navTabs}
              value={activeRoute}
              onChange={handleNavChange}
            />
          </nav>

          <Styled.DrawerDonateWrap>
            <ShellDonateButton onDonate={handleDonate} fullWidth />
          </Styled.DrawerDonateWrap>
        </Styled.DrawerBody>
      </Styled.NavDrawer>

      <Styled.Main>{children}</Styled.Main>

      {isMobileBreakpoint ? (
        <Styled.BottomDonate>
          <ShellDonateButton
            onDonate={handleDonate}
            fullWidth
            className="view-bottom-donate__btn"
          />
        </Styled.BottomDonate>
      ) : null}

      <LogoutConfirmDialogContainer open={logoutConfirmOpen} onClose={handleLogoutConfirmClose} />
      <DonateDialogContainer open={donateDialogOpen} onClose={handleDonateDialogClose} />
    </Styled.Shell>
  );
}
