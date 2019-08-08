import React from 'react';
import PropTypes from 'prop-types';
// import logo from './logo.svg';
import './App.css';

import { AppBar, Tabs, Tab, Typography, Box } from "@material-ui/core";

import NavBar from './components/navBar'
import LoanList from './components/loan/loanList';
import RepayHistory from './components/loan/repayHistory';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      <Box p={3}>{children}</Box>
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function App() {
  const [value, setValue] = React.useState('one');

  function handleChange(event, newValue) {
    setValue(newValue);
  }
  return (
    <div>
      <NavBar />
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="wrapped label tabs example">
          <Tab
            value="one"
            label="ALL LOANS"
            wrapped
            {...a11yProps('one')}
          />
          <Tab value="two" label="REPAY HISTORY" {...a11yProps('two')} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index="one">
        <LoanList/>
      </TabPanel>
      <TabPanel value={value} index="two">
        <RepayHistory></RepayHistory>
      </TabPanel>
    </div>
  )  
}

export default App;
