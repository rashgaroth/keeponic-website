import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

import { Button } from 'antd';

import i18n from '../../../../i18n';
import * as Io5 from 'react-icons/io5';
import * as service from '../../../../services';
import { HeaderAuth } from '../../../../services/header';
import moment from 'moment';

import { API_SERVICE } from '../../../../constants/ApiService';

export const ExportToExcel = () => {
	const auth = useSelector((state) => state.AuthReducers);
	const [data, setData] = useState(null);
	const fileName = `sales-report-${moment().format('YYYY')}`;
	const fileType =
		'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
	const fileExtension = '.xlsx';

	const exportToCSV = (apiData, fileName) => {
		const ws = XLSX.utils.json_to_sheet(apiData);
		const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
		const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, fileName + fileExtension);
	};

	let url = `${API_SERVICE.keeponic}/seller/reports/${auth.user.market_id}`;

	useEffect(() => {
		const getData = async () => {
			const _response = await service.GET(url, HeaderAuth());
			setData(_response.data.data);
		};
		getData();
	}, []);

	return (
		<Button
			onClick={(e) => exportToCSV(data, fileName)}
			type='primary'
			icon={<Io5.IoDocument style={{ marginRight: 5 }} />}
			disabled={data !== null ? false : true}
		>
			{i18n.t('sales_report')}
		</Button>
	);
};
