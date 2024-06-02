import React from "react";
import Sidenav from "examples/SideNav_Teacher"; // Импортируйте Sidenav
import routes from "routes"; // Импортируйте маршруты

const SidenavTeacher = (props) => {
  return (
    <Sidenav
      color="info"
      brandName="Teacher Panel"
      routes={routes}
      {...props}
    />
  );
};

export default SidenavTeacher;
