import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React from 'react';
import { Controller } from 'react-hook-form';


const ControlledAutocomplete = ({ options = [], renderInput, getOptionLabel, onChange: ignored, control, defaultValue, name, renderOption }) => {
  return (
    <Controller
      render={({ ...props }) => (
        <Autocomplete
          options={options}
          getOptionLabel={getOptionLabel}
          renderOption={renderOption}
          renderInput={renderInput}
      
          {...props}
        /> 
      )}
      
      defaultValue={defaultValue}
      name={name}
      control={control}
    />
  );
}

export default {ControlledAutocomplete};