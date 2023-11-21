import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PharmacieProductsList from './PharmacieProductsList';
import PharmacieACPList from './PharmacieACPList';
import ValidationList from './ValidationList';
import SearchBlockFV from './SearchBlockFV';
import SearchBlockACP from './SearchBlockACP';
import SearchBlockPlanning from './SearchBlockPlanning';

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function PharmacienBody() {
  const [value, setValue] = React.useState(0);
  let [searchArgs, setSearchArgs] = React.useState({});
  let [search, setSearch] = React.useState(false);
  let [searchArgsACP, setSearchArgsACP] = React.useState({});
  let [searchACP, setSearchACP] = React.useState(false);
  let [searchPlanning, setSearchPlanning] = React.useState(false);
  let [searchArgsPlanning, setSearchArgsPlanning] = React.useState({});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="tabs">
          <Tab label="Validation" {...a11yProps(0)} />
          <Tab label="Ajustement" {...a11yProps(1)} />
          <Tab className="planning-tab" label="Planning" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <SearchBlockFV searchArgs={searchArgs} setSearch={setSearch} />
        <ValidationList searchArgs={searchArgs} search={search} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <SearchBlockACP searchArgs={searchArgsACP} setSearch={setSearchACP} />
        <PharmacieACPList searchArgs={searchArgsACP} search={searchACP} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <SearchBlockPlanning searchArgs={searchArgsPlanning} setSearch={setSearchPlanning} />
        <PharmacieProductsList searchArgs={searchArgsPlanning} search={searchPlanning} />
      </CustomTabPanel>
    </Box>
  );
}