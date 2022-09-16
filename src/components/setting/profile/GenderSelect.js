import * as React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const GenderSelect = (props) => {

  const onChange = (e) => {
    props.onGenderChange(e.target.value)
  }
  return (
    <div style={{width:"100%", marginTop:"10px"}}>
      <FormControl>
        <FormLabel id="demo-row-radio-buttons-group-label">성별</FormLabel>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="row-radio-buttons-group"
          value={props.gender}
          onChange={onChange}
        >
          <FormControlLabel value="male" control={<Radio />} label="남성" />
          <FormControlLabel value="female" control={<Radio />} label="여성" />
          <FormControlLabel value="other" control={<Radio />} label="기타" />
        </RadioGroup>
      </FormControl>
    </div>  
  );
}
export default GenderSelect