import React from "react";
import { Button, Card, Box } from "@mui/material";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Table from "examples/Tables/Table";
import useAuthorsTableData from "./data/authorsTableData";

const StudentsTable = () => {
  const { columns, rows, exportToCSV } = useAuthorsTableData();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Card>
          <VuiBox display="flex" justifyContent="space-between" alignItems="center">
            <VuiTypography variant="lg" color="white">
              Students Table
            </VuiTypography>
            <Button variant="contained" color="primary" onClick={exportToCSV}>
              Export CSV
            </Button>
          </VuiBox>
          <VuiBox
            sx={{
              "& th": {
                borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                  `${borderWidth[1]} solid ${grey[700]}`,
                textAlign: 'center',
              },
              "& .MuiTableRow-root:not(:last-child)": {
                "& td": {
                  borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                    `${borderWidth[1]} solid ${grey[700]}`,
                },
              },
            }}
          >
            <Table columns={columns} rows={rows} />
          </VuiBox>
        </Card>
      </VuiBox>
    </DashboardLayout>
  );
};

export default StudentsTable;
