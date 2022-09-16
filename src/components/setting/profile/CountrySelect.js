// import React, {useState} from 'react';
// import Box from '@mui/material/Box';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
// import { countryList } from 'data/countryList';
// import { useTheme } from '@mui/material/styles';

// const CountrySelect = (props) => {

//   const handleChange = (event) => {
//     props.handleCountry(event.target.value);
//   };
// const ITEM_HEIGHT = 48;
// const ITEM_PADDING_TOP = 8;

// const MenuProps = {
//   PaperProps: {
//     style: {
//       maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//       width: 250,
//     },
//   },
//   };

// function getStyles(name, country, theme) {
//   return {
//     fontWeight:
//       country.indexOf(name) === -1
//         ? theme.typography.fontWeightRegular
//         : theme.typography.fontWeightMedium,
//   };
// }
  
//   const theme = useTheme()

//   return (
//     <div style={{width:"100%", marginTop:"10px"}}>
//       <FormControl fullWidth style={{height: "50px"}}>
//         <InputLabel id="country-select-label">국적</InputLabel>
//         <Select
//           labelId="countrye-select-label"
//           id="country-select"
//           value={props.country}
//           label="country"
//           onChange={handleChange}
//           style={{ height: "45px" }}
//           MenuProps={MenuProps}
//         >
//           {countryList.map((data, index) => {
//             return(
//               <MenuItem
//                 key={index}
//                 value={data.name}
//                 style={getStyles(data.name, props.country, theme)}
//               >
//                 {data.name}
//               </MenuItem>
//             )
//           })}
//         </Select>
//       </FormControl>
//     </div>
//   );
// }

// export default CountrySelect

import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { countryList } from 'data/countryList';

const CountrySelect = (props) => {
  const onChange = (event) => {
    props.handleCountry(event.target.outerText);
  };
  return (
    <div style={{ width: "100%", marginTop: "10px" }}>
      <Autocomplete
        id="country-select"
        // sx={{ height:"50px" }}
        options={countryList}
        autoHighlight
        getOptionLabel={(option) => option.label}
        value={props.country}
        onChange={(event, newValue) => {
          props.handleCountry(newValue);
        }}
        // inputValue={props.country}
        // onInputChange={(event, newInputValue) => {
        //   props.handleCountry(newInputValue);
        // }}
        renderOption={(props, option) => (
          <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
            <img
              loading="lazy"
              width="20"
              src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
              srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
              alt=""
            />
            {option.label}
          </Box>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a country"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password', // disable autocomplete and autofill
            }}
          />
        )}
      />
    </div>
  );
}


export default CountrySelect