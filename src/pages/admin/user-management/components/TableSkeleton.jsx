import React from 'react';
import {
	TableContainer,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
} from '@material-ui/core';
import { Row, Col } from 'reactstrap';
import { Skeleton } from '@material-ui/lab';
import { COLORS } from '../../../../constants/colors';

function TableSkeleton(props) {
	return (
		<TableContainer>
			<Table aria-label='simple table' size='small'>
				<TableHead>
					<TableRow>
						<TableCell
							style={{
								backgroundColor: COLORS.LightGray,
								height: 36,
							}}
						>
							{''}
						</TableCell>
						<TableCell style={{ backgroundColor: COLORS.LightGray }}>
							{''}
						</TableCell>
						<TableCell style={{ backgroundColor: COLORS.LightGray }}>
							{''}
						</TableCell>
						<TableCell
							align='justify'
							style={{ backgroundColor: COLORS.LightGray }}
						>
							{''}
						</TableCell>
						<TableCell
							align='justify'
							style={{ backgroundColor: COLORS.LightGray }}
						>
							{''}
						</TableCell>
						<TableCell
							align='justify'
							style={{ backgroundColor: COLORS.LightGray }}
						>
							{''}
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell colSpan='6' style={{ alignContent: 'center' }}>
							<Row className='mt-2 '>
								<Col lg={1} sm={3} xs={4}>
									<Skeleton variant='circle' width='90%' height='100%' />
								</Col>
								<Col lg={11} sm={8} xs={7}>
									<Skeleton
										variant='rect'
										height={'15px'}
										style={{ borderRadius: 5 }}
									/>
									<Skeleton
										variant='rect'
										height={'15px'}
										width='20%'
										style={{ borderRadius: 5 }}
										className='mt-2'
									/>
								</Col>
							</Row>
							<Row className='mt-4  '>
								<Col lg={1} sm={3} xs={4}>
									<Skeleton variant='circle' width='90%' height='100%' />
								</Col>
								<Col lg={11} sm={8} xs={7}>
									<Skeleton
										variant='rect'
										height={'15px'}
										style={{ borderRadius: 5 }}
									/>
									<Skeleton
										variant='rect'
										height={'15px'}
										width='20%'
										style={{ borderRadius: 5 }}
										className='mt-2'
									/>
								</Col>
							</Row>
							<Row className='my-4 '>
								<Col lg={1} sm={3} xs={4}>
									<Skeleton variant='circle' width='90%' height='100%' />
								</Col>
								<Col lg={11} sm={8} xs={7}>
									<Skeleton
										variant='rect'
										height={'15px'}
										style={{ borderRadius: 5 }}
									/>
									<Skeleton
										variant='rect'
										height={'15px'}
										width='20%'
										style={{ borderRadius: 5 }}
										className='mt-2'
									/>
								</Col>
							</Row>
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>
		</TableContainer>
	);
}

export default TableSkeleton;
