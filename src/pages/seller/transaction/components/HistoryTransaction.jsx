import React from 'react';
import { Tabs } from 'antd';

import WithdrawHistory from './WithdrawHistory';
// import IncomeHistory from './IncomeHistory';
const { TabPane } = Tabs;

const HistoryTransaction = () => {
	return (
		<div className='card-container'>
			<Tabs type='card'>
				<TabPane tab='Riwayat Pencairan' key='1'>
					<WithdrawHistory />
				</TabPane>
				{/* <TabPane tab='Penghasilan' key='2'>
					<IncomeHistory />
				</TabPane> */}
			</Tabs>
		</div>
	);
};

export default HistoryTransaction;
