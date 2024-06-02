import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../firebase";
import Grid from "@mui/material/Grid";
import { Card, Button, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VuiBox from "components/VuiBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import VuiTypography from "components/VuiTypography";
import Table from "examples/Tables/Table";
import AddGroupModal from "./AddGroupModalComponent";
import AddStudentToGroupModal from "./AddStudenttoGroupModalComponent";
import ShowGroupModal from "./ModalComponenttoDisplayStudents";

const useGroupsTableData = (handleAddStudentToGroup, handleShowGroup) => {
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
        <div>
          <IconButton color="info" onClick={() => handleShowGroup(group.id, group.name)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteGroup(group.id)}>
            <DeleteIcon />
          </IconButton>
          <Button variant="outlined" color="info" onClick={() => handleAddStudentToGroup(group.id)}>
            Add Student
          </Button>
        </div>
      ),
      hasBorder: true,
    }));

    setRows(groupsRows);
  }, [handleAddStudentToGroup, handleShowGroup]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteDoc(doc(db, "groups", groupId));
      fetchGroups();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

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
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [showGroupModalOpen, setShowGroupModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");

  const handleAddStudentToGroup = useCallback((groupId) => {
    setSelectedGroupId(groupId);
    setAddStudentModalOpen(true);
  }, []);

  const handleShowGroup = useCallback((groupId, groupName) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
    setShowGroupModalOpen(true);
  }, []);

  const { columns, rows, fetchGroups } = useGroupsTableData(handleAddStudentToGroup, handleShowGroup);

  const handleAddGroup = () => {
    setAddGroupModalOpen(true);
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
      <ShowGroupModal
        open={showGroupModalOpen}
        handleClose={() => setShowGroupModalOpen(false)}
        groupId={selectedGroupId}
        groupName={selectedGroupName}
      />
    </DashboardLayout>
  );
};

export default GroupsTable;
