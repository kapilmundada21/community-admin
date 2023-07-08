import Head from 'next/head';
import React, { useState } from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import AllNews from "./allNews";
import PendingNews from "./pendingNews";

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

export default function News() {
  const [value, setValue] = useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <Head>
        <title>{`News | ${process.env.NEXT_PUBLIC_WEBSITE_NAME}`}</title>
      </Head>
      <Tabs value={value} onChange={handleChange} centered className="w-full py-5 fixed bg-white z-10">
        <Tab label="All News" {...a11yProps(0)} />
        <Tab label="Pending News" {...a11yProps(1)} />
      </Tabs>

      <TabPanel value={value} index={0}>
        <AllNews />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PendingNews />
      </TabPanel>
    </div>
  );
}
