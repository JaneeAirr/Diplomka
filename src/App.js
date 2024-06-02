import { useMemo, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Icon from "@mui/material/Icon";
import VuiBox from "components/VuiBox";
import Configurator from "examples/Configurator";
import theme from "assets/theme";
import themeRTL from "assets/theme/theme-rtl";
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import { useVisionUIController, setMiniSidenav, setOpenConfigurator } from "context";
import SignIn from "layouts/authentication/sign-in";
import SignUp from "layouts/authentication/sign-up";
import DashboardAdmin from "layouts/Dashboard_admin";
import DashboardTeacher from "layouts/Dashboard_Teacher";
import DashboardStudent from "layouts/Dashboard_Student";
import SidenavAdmin from "examples/SideNav_admin/SidenavAdminWrapper";
import SidenavTeacher from "examples/SideNav_Teacher/SidenavTeacherWrapper";
import SidenavStudent from "examples/SideNav_Student/SidenavSdudentWrapper";
import routes from "routes";

export default function App() {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const { pathname } = useLocation();
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));

  useMemo(() => {
    const cacheRtl = createCache({
      key: "rtl",
      stylisPlugins: [rtlPlugin],
    });

    setRtlCache(cacheRtl);
  }, []);

  const handleOnMouseEnter = () => {
    if (miniSidenav && !onMouseEnter) {
      setMiniSidenav(dispatch, false);
      setOnMouseEnter(true);
    }
  };

  const handleOnMouseLeave = () => {
    if (onMouseEnter) {
      setMiniSidenav(dispatch, true);
      setOnMouseEnter(false);
    }
  };

  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator);

  useEffect(() => {
    document.body.setAttribute("dir", direction);
  }, [direction]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
  }, [pathname]);

  const getRoutes = (allRoutes) =>
    allRoutes.map((route) => {
      if (route.collapse) {
        return getRoutes(route.collapse);
      }

      if (route.route) {
        return <Route exact path={route.route} element={<route.component />} key={route.key} />;
      }

      return null;
    });

  const renderDashboard = () => {
    if (userRole === "admin") {
      return <DashboardAdmin />;
    } else if (userRole === "teacher") {
      return <DashboardTeacher />;
    } else if (userRole === "student") {
      return <DashboardStudent />;
    } else {
      return <Navigate to="/authentication/sign-in" />;
    }
  };

  const renderSideNav = () => {
    if (userRole === "admin") {
      return <SidenavAdmin />;
    } else if (userRole === "teacher") {
      return <SidenavTeacher />;
    } else if (userRole === "student") {
      return <SidenavStudent />;
    } else {
      return null;
    }
  };

  const showSidenav = !["/authentication/sign-in", "/authentication/sign-up"].includes(pathname);

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {showSidenav && renderSideNav()}
        <Routes>
          <Route path="/authentication/sign-in" element={<SignIn />} />
          <Route path="/authentication/sign-up" element={<SignUp />} />
          <Route path="/admin/*" element={renderDashboard()} />
          <Route path="/teacher/*" element={renderDashboard()} />
          <Route path="/student/*" element={renderDashboard()} />
          <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
        </Routes>
        {layout === "dashboard" && (
          <>
            <Configurator />
          </>
        )}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {showSidenav && renderSideNav()}
      <Routes>
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route path="/authentication/sign-up" element={<SignUp />} />
        <Route path="/admin/*" element={renderDashboard()} />
        <Route path="/teacher/*" element={renderDashboard()} />
        <Route path="/student/*" element={renderDashboard()} />
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
      {layout === "dashboard" && (
        <>
          <Configurator />
        </>
      )}
    </ThemeProvider>
  );
}
