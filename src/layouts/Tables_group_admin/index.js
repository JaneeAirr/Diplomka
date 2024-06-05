import React, { useState, useEffect, useCallback } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import db from "../../firebase";
import { Card, Button, IconButton, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VuiBox from "components/VuiBox";
import DashboardLayout from "../../examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "../../examples/Navbars/DashboardNavbar";
import VuiTypography from "components/VuiTypography";
import Table from "examples/Tables/Table";
import AddGroupModal from "./AddGroupModalComponent";
import EditGroupModal from "./EditGroupModalComponent";
import AddStudentToGroupModal from "./AddStudenttoGroupModalComponent";
import ShowGroupModal from "./ModalComponenttoDisplayStudents";

const useGroupsTableData = (handleAddStudentToGroup, handleShowGroup, handleEditGroup, fetchGroups) => {
  const [rows, setRows] = useState([]);

  const fetchGroupData = useCallback(async () => {
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
      course: (
        <VuiTypography variant="button" color="white" fontWeight="medium" textAlign="center">
          {group.course}
        </VuiTypography>
      ),
      completion: (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '100%' }}>
          <VuiTypography variant="button" color="white" fontWeight="medium" textAlign="center">
            {Math.floor((group.students.length / group.size) * 100)}%
          </VuiTypography>
          <Box sx={{ width: '400%', mt: 1 }}>
            <Box sx={{ position: 'relative', width: '100%', height: 6, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 3 }}>
              <Box sx={{
                position: 'absolute',
                width: `${(group.students.length / group.size) * 100}%`,
                height: '100%',
                backgroundColor: '#1E88E5',
                borderRadius: 3,
              }} />
            </Box>
          </Box>
        </Box>
      ),
      action: (
        <div>
          <IconButton color="info" onClick={() => handleShowGroup(group.id, group.name)}>
            <VisibilityIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDeleteGroup(group.id)}>
            <DeleteIcon />
          </IconButton>
          <IconButton color="primary" onClick={() => handleEditGroup(group.id)}>
            <EditIcon />
          </IconButton>
          <Button variant="outlined" color="info" onClick={() => handleAddStudentToGroup(group.id)}>
            Add Student
          </Button>
        </div>
      ),
      hasBorder: true,
    }));

    setRows(groupsRows);
  }, [handleAddStudentToGroup, handleShowGroup, handleEditGroup]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData, fetchGroups]);

  const handleDeleteGroup = async (groupId) => {
    try {
      await deleteDoc(doc(db, "groups", groupId));
      fetchGroupData();
    } catch (error) {
      console.error("Error deleting group:", error);
    }
  };

  return {
    columns: [
      { name: "name", align: "left" },
      { name: "size", align: "left" },
      { name: "course", align: "center" },  // Center align course column
      { name: "completion", align: "center" },  // Center align completion column
      { name: "action", align: "center" },
    ],
    rows,
    fetchGroupData,
  };
};

const GroupsTable = () => {
  const [addGroupModalOpen, setAddGroupModalOpen] = useState(false);
  const [editGroupModalOpen, setEditGroupModalOpen] = useState(false);
  const [addStudentModalOpen, setAddStudentModalOpen] = useState(false);
  const [showGroupModalOpen, setShowGroupModalOpen] = useState(false);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [selectedGroupName, setSelectedGroupName] = useState("");

  const fetchGroups = useCallback(async () => {
    const groupsSnapshot = await getDocs(collection(db, "groups"));
    return groupsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }, []);

  const handleAddStudentToGroup = useCallback((groupId) => {
    setSelectedGroupId(groupId);
    setAddStudentModalOpen(true);
  }, []);

  const handleShowGroup = useCallback((groupId, groupName) => {
    setSelectedGroupId(groupId);
    setSelectedGroupName(groupName);
    setShowGroupModalOpen(true);
  }, []);

  const handleEditGroup = useCallback((groupId) => {
    setSelectedGroupId(groupId);
    setEditGroupModalOpen(true);
  }, []);

  const { columns, rows, fetchGroupData } = useGroupsTableData(handleAddStudentToGroup, handleShowGroup, handleEditGroup, fetchGroups);

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
                textAlign: 'center',  // Center align the table headers
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
      <AddGroupModal open={addGroupModalOpen} handleClose={() => setAddGroupModalOpen(false)} fetchGroups={fetchGroupData} />
      <EditGroupModal open={editGroupModalOpen} handleClose={() => setEditGroupModalOpen(false)} fetchGroups={fetchGroupData} groupId={selectedGroupId} />
      <AddStudentToGroupModal
        open={addStudentModalOpen}
        handleClose={() => setAddStudentModalOpen(false)}
        fetchGroups={fetchGroupData}
        groupId={selectedGroupId}
      />
      <ShowGroupModal
        open={showGroupModalOpen}
        handleClose={() => setShowGroupModalOpen(false)}
        groupId={selectedGroupId}
        groupName={selectedGroupName}
        fetchGroups={fetchGroupData}
      />
    </DashboardLayout>
  );
};

export default GroupsTable;
