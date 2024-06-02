import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs } from "firebase/firestore";
import db from "../../../firebase";
import Grid from "@mui/material/Grid";
import { Card, Button, Icon } from "@mui/material";
import VuiBox from "components/VuiBox";
import VuiTypography from "components/VuiTypography";
import Table from "examples/Tables/Table";
import AddGroupModal from "../AddGroupModalComponent";
import AddStudentToGroupModal from "../AddStudenttoGroupModalComponent";

const useGroupsTableData = () => {
  const [rows, setRows] = useState([]);

  const fetchGroups = useCallback(async () => {
    const groupsSnapshot = await getDocs(collection(db, "groups"));
    const groupsList = groupsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    const groupsRows = groupsList.map((group) => ({
      name: (
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {group.name}
        </VuiTypography>
      ),
      size: (
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {group.size}
        </VuiTypography>
      ),
      completion: (
        <VuiTypography variant="button" color="white" fontWeight="medium">
          {Math.floor((group.students.length / group.size) * 100)}%
        </VuiTypography>
      ),
      action: (
        <VuiButton variant="outlined" color="info" onClick={() => handleAddStudentToGroup(group.id)}>
          Add Student
        </VuiButton>
      ),
      hasBorder: true,
    }));

    setRows(groupsRows);
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  return {
    columns: [
      { name: "name", align: "left" },
      { name: "size", align: "left" },
      { name: "completion", align: "center" },
      { name: "action", align: "center" },
    ],
    rows,
    fetchGroups,
  };
};

const GroupsTable = () => {
  const { columns, rows, fetchGroups } = useGroupsTableData();
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const handleAddGroup = () => {
    setAddGroupModalOpen(true);
  };

  const handleAddStudentToGroup = (groupId) => {
    setSelectedGroupId(groupId);
    setAddStudentModalOpen(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <VuiBox py={3}>
        <Card>
          <VuiBox display="flex" justifyContent="space-between" alignItems="center">
            <VuiTypography variant="lg" color="white">
              Groups Table
            </VuiTypography>
            <Button variant="contained" color="primary" onClick={handleAddGroup}>
              Add Group
            </Button>
          </VuiBox>
          <VuiBox
            sx={{
              "& th": {
                borderBottom: ({ borders: { borderWidth }, palette: { grey } }) =>
                  `${borderWidth[1]} solid ${grey[700]}`,
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
      <AddGroupModal open={addGroupModalOpen} handleClose={() => setAddGroupModalOpen(false)} fetchGroups={fetchGroups} />
      <AddStudentToGroupModal
        open={addStudentModalOpen}
        handleClose={() => setAddStudentModalOpen(false)}
        fetchGroups={fetchGroups}
        groupId={selectedGroupId}
      />
    </DashboardLayout>
  );
};

export default GroupsTable;
