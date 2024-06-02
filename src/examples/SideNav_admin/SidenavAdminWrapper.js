import React from "react";
import Sidenav from "examples/SideNav_admin"; // Импортируйте Sidenav
import routes from "routes"; // Импортируйте маршруты

const SidenavAdmin = (props) => {
  return (
    <Sidenav
      color="info"
      brandName="Admin Panel"
      routes={routes}
      {...props}
    />
  );
};

export default SidenavAdmin;
