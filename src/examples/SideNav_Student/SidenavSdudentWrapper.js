import React from "react";
import Sidenav from "examples/SideNav_Student"; // Импортируйте Sidenav
import routes from "routes"; // Импортируйте маршруты

const SidenavTeacher = (props) => {
  return (
    <Sidenav
      color="info"
      brandName="Student Panel"
      routes={routes}
      {...props}
    />
  );
};

export default SidenavTeacher;
