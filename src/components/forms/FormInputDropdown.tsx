import React from 'react';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { useFormContext, Controller } from 'react-hook-form';
import { FormInputProps } from './FormInputProps';

export const FormInputDropdown: React.FC<FormInputProps> = ({ name, label, control, defaultValue, options, width }) => {
	const generateSingleOptions = () => {
		return options.map((option: any) => {
			return (
				<MenuItem key={option.value} value={option.value}>
					{option.label}
				</MenuItem>
			);
		});
	};

	return (
		<FormControl size={'small'} style={{ width: width }}>
			<InputLabel>{label}</InputLabel>
			<Controller
				control={control}
				name={name}
				render={({ field: { onChange, value } }) => (
					<Select onChange={onChange} value={value} defaultValue={defaultValue}>
						{generateSingleOptions()}
					</Select>
				)}
			/>
		</FormControl>
	);
};
