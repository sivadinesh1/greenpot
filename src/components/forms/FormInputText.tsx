import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import TextField from '@material-ui/core/TextField';
import { FormInputProps } from './FormInputProps';

export const FormInputText = ({ name, control, label, variant, onChange }: FormInputProps) => {
	return (
		<Controller
			name={name}
			control={control}
			render={({ field: { value }, fieldState: { error }, formState }) => (
				<TextField
					helperText={error ? error.message : null}
					size='small'
					error={!!error}
					onChange={onChange}
					value={value}
					fullWidth
					label={label}
					// variant={variant === undefined ? 'outlined' : variant}
					variant='standard'
					InputLabelProps={{ shrink: true }}
				/>
			)}
		/>
	);
};

// export const FormInputText = ({ name, control, label, variant, onChange }: FormInputProps) => {
// 	return (
// 		<Controller
// 			name={name}
// 			control={control}
// 			//	render={({ field: { customOnChange, value }, fieldState: { error }, formState }) => (
// 			render={({ field: { onChange, value }, fieldState: { error }, formState }) => (
// 				<TextField
// 					helperText={error ? error.message : null}
// 					size='small'
// 					error={!!error}
// 					// onChange={onChange}
// 					onChange={onChange}
// 					value={value}
// 					fullWidth
// 					label={label}
// 					// variant={variant === undefined ? 'outlined' : variant}
// 					variant='standard'
// 					InputLabelProps={{ shrink: true }}
// 				/>
// 			)}
// 		/>
// 	);
// };
