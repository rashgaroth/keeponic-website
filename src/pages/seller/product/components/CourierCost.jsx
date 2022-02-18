import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';

import * as service from '../../../../services';
import { API_SERVICE } from '../../../../constants/ApiService';
import { HeaderAuth } from '../../../../services/header';
import { List, Typography } from 'antd';

function usePrevious(value) {
	const ref = useRef();
	useEffect(() => {
		ref.current = value;
	});
	return ref.current;
}

function CourierCost(props) {
	const { weight } = props;
	const profile = useSelector((state) => state.ProfileReducers);
	const [data, setData] = useState([]);
	let prevWeight = usePrevious(weight);
	let body = {
		origin: profile.profile.address[0].origin,
		destination: profile.profile.address[0].origin,
		weight: weight,
		courier: 'jne',
	};

	let url = `${API_SERVICE.keeponic}/ongkos`;

	const loadCost = useCallback(async () => {
		let _response = await service.POST(url, body, HeaderAuth());
		try {
			setData(_response);
		} catch (error) {
			console.log(error);
		}
	}, [weight]);

	useEffect(() => {
		if (prevWeight !== undefined && prevWeight !== weight) {
			loadCost();
		}
	}, [loadCost, weight]);

	return (
		<div>
			<List>
				{data.length !== 0 && data.data.status !== 500 ? (
					<>
						{data.data.data.map((row) => (
							<>
								{/* <List.Item> */}
								<Typography.Text style={{ textTransform: 'uppercase' }}>
									{row.code}
								</Typography.Text>
								<br />
								{row.costs.map((cost) => (
									<>
										<List.Item>
											<p className='mr-2'>{cost.service}</p>
											{cost.cost.map((value) => (
												<Typography.Text style={{ textTransform: 'uppercase' }}>
													{value.value}
												</Typography.Text>
											))}
										</List.Item>
									</>
								))}
								{/* {row.costs[0].cost[0].value} */}
							</>
						))}
					</>
				) : (
					<List.Item>
						<Typography.Text>
							[LAYANAN PENGIRIMAN TIDAK TERSEDIA]
						</Typography.Text>
					</List.Item>
				)}
			</List>
		</div>
	);
}

export default CourierCost;
