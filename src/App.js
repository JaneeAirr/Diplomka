import { useMemo, useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
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
import { adminRoutes, teacherRoutes, studentRoutes } from "routes";

export default function App() {
  const [controller, dispatch] = useVisionUIController();
  const { miniSidenav, direction, layout, openConfigurator, sidenavColor } = controller;
  const [onMouseEnter, setOnMouseEnter] = useState(false);
  const [rtlCache, setRtlCache] = useState(null);
  const location = useLocation();
  const { pathname } = location;
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

  const renderRoutes = (routes) =>
    routes.map((route) => (
      <Route key={route.key} path={route.route} element={<route.component />} />
    ));

  const renderSideNav = () => {
    if (pathname.startsWith('/admin')) {
      return <SidenavAdmin routes={adminRoutes} />;
    } else if (pathname.startsWith('/teacher')) {
      return <SidenavTeacher routes={teacherRoutes} />;
    } else if (pathname.startsWith('/student')) {
      return <SidenavStudent routes={studentRoutes} />;
    }
    return null;
  };

  return direction === "rtl" ? (
    <CacheProvider value={rtlCache}>
      <ThemeProvider theme={themeRTL}>
        <CssBaseline />
        {pathname !== '/authentication/sign-in' && pathname !== '/authentication/sign-up' && renderSideNav()}
        <Routes>
          <Route path="/authentication/sign-in" element={<SignIn />} />
          <Route path="/authentication/sign-up" element={<SignUp />} />
          {renderRoutes(adminRoutes)}
          {renderRoutes(teacherRoutes)}
          {renderRoutes(studentRoutes)}
          <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
        </Routes>
        {layout === "dashboard" && pathname !== '/authentication/sign-in' && pathname !== '/authentication/sign-up' && <Configurator />}
      </ThemeProvider>
    </CacheProvider>
  ) : (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {pathname !== '/authentication/sign-in' && pathname !== '/authentication/sign-up' && renderSideNav()}
      <Routes>
        <Route path="/authentication/sign-in" element={<SignIn />} />
        <Route path="/authentication/sign-up" element={<SignUp />} />
        {renderRoutes(adminRoutes)}
        {renderRoutes(teacherRoutes)}
        {renderRoutes(studentRoutes)}
        <Route path="*" element={<Navigate to="/authentication/sign-in" />} />
      </Routes>
      {layout === "dashboard" && pathname !== '/authentication/sign-in' && pathname !== '/authentication/sign-up' && <Configurator />}
    </ThemeProvider>
  );
}
