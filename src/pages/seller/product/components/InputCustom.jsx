import React, { useState } from 'react';
import { Input } from 'antd';

const InputCustom = ({
	value = {},
	onChange,
	prefix,
	suffix,
	addonBefore,
	maxLength,
	name,
}) => {
	const [number, setNumber] = useState(0);

	const triggerChange = (changedValue) => {
		onChange({
			number,
			...value,
			...changedValue,
		});
	};

	const onNumberChange = (e) => {
		const newNumber = parseInt(e.target.value || '0');

		if (Number.isNaN(number)) {
			return;
		}

		if (!('number' in value)) {
			setNumber(newNumber);
		}

		triggerChange({
			number: newNumber,
		});
	};

	return (
		<Input
			name={name}
			type='text'
			value={value.number || 0}
			onChange={onNumberChange}
			maxLength={maxLength || 10}
			prefix={prefix}
			suffix={suffix}
			addonBefore={addonBefore}
		/>
	);
};

export default InputCustom;
