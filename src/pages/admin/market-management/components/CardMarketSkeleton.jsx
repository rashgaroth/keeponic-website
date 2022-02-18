//  Region Import External Lib (e.g React, Reactstrap, etc)
import React from 'react';
import { Row, Col } from 'reactstrap';
import { Card } from 'antd';
import { Skeleton } from '@material-ui/lab';

function CardMarketSkeleton() {
	//  render
	return (
		<>
			<Row>
				<Col lg={12}>
					<Card bordered={false}>
						<Row>
							<Col lg={3}>
								<Card bordered={false} style={{ textAlign: 'center' }}>
									<Skeleton variant='circle' width={50} height={50} />
									<Skeleton
										className='mt-3'
										variant='rect'
										height={'10px'}
										width='100%'
										style={{ borderRadius: 5 }}
									/>
								</Card>
							</Col>
							<Col>
								<Row>
									<Skeleton
										variant='rect'
										height={100}
										width='100%'
										style={{ borderRadius: 5 }}
									/>
								</Row>
								<Row className='mt-2'>
									<Skeleton
										variant='rect'
										height={'15px'}
										width='100%'
										style={{ borderRadius: 5 }}
									/>
								</Row>
							</Col>
						</Row>
					</Card>
				</Col>
			</Row>
		</>
	);
}
export default CardMarketSkeleton;
