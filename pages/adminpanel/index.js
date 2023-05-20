import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import AllusersTable from "./allusersTable";
import PendingusersTable from "./pendingusersTable";
import SupervisorsTable from "./adminSupervisorTable";
import Box from "@mui/material/Box";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function Adminpanel() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="All Users" {...a11yProps(0)} />
        <Tab label="Pending Users" {...a11yProps(1)} />
        <Tab label="Admins / Supervisors" {...a11yProps(2)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <AllusersTable />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PendingusersTable />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <SupervisorsTable />
      </TabPanel>
    </div>
  );
}
