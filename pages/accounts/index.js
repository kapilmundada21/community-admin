import Head from 'next/head';
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

export default function Accounts() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Head>
        <title>{`Accounts | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
      </Head>
      <Tabs value={value} onChange={handleChange} centered className=' mt-3 -mb-6 ml-8 md:ml-0'>
        <Tab label="All Users" {...a11yProps(0)} />
        <Tab label="Pending" {...a11yProps(1)} />
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
