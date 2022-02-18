import React from 'react';

const IncomeHistory = () => {
	return (
		<div className='table-responsive'>
			<table className='table table-hover mb-0'>
				<thead>
					<tr>
						<th>Tanggal</th>
						<th>Invoice</th>
						<th>Deskripsi</th>
						<th>Jumlah</th>
					</tr>
				</thead>
				<tbody>
					{/* {data.map((row) => (
						<tr>
							<td>{row.date}</td>
							<td>{row.description}</td>
							<td>{row.amount}</td>
							<td>{row.status}</td>
						</tr>
					))} */}
				</tbody>
			</table>
		</div>
	);
};

export default IncomeHistory;
