//  Region Import External Lib (e.g React, Reactstrap, etc)
import React from 'react';
import { Row, Col } from 'reactstrap';
import { Card, Avatar, Space, Typography } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

//  Region Import Redux Action Type and Redux Action

//  Region Import Utility/Helper Function

//  Region Import Components
import CardMarketSkeleton from './CardMarketSkeleton';

//  Region Import Assets
import BannerPlaceholder from '../../../../assets/images/banner_placeholder.jpg';
//  Region Import Style

//  Region Import Constants
import { COLORS } from '../../../../constants/colors';

function CardMarketProfile(props) {
	let data = props.data;
	let address = props.address;

	return (
		<>
			{props.loading ? (
				<CardMarketSkeleton />
			) : (
				<Row>
					<Col lg={12}>
						<Card bordered={false}>
							<Row>
								<Col lg={3}>
									<Card bordered={false} style={{ textAlign: 'center' }}>
										<Space align='center' direction='vertical' size={10}>
											<Avatar
												size={{
													xs: 50,
													sm: 50,
													md: 50,
													lg: 64,
													xl: 70,
													xxl: 80,
												}}
												icon={<ShopOutlined />}
												src={data.avatar}
											/>
											<Card.Meta
												className='mt-1'
												title={
													<Typography.Title level={4}>
														{data.market_name}
													</Typography.Title>
												}
												description={
													address &&
													address !== null && (
														<span className='mdi mdi-map-marker'>
															<Typography.Text
																style={{ fontSize: 14, color: COLORS.gray }}
															>
																{`${address.subdistrict}, ${address.province}`}
															</Typography.Text>
														</span>
													)
												}
											/>
										</Space>
									</Card>
								</Col>
								<Col>
									<Row>
										<Card
											bordered={false}
											style={{
												width: '100%',
												maxHeight: 200,
											}}
											cover={
												<img
													alt='avatar'
													style={{
														objectFit: 'cover',
														width: '100%',
														minHeight: 200,
														maxHeight: 200,
														borderRadius: 10,
													}}
													src={`${
														data.banner !== ''
															? data.banner
															: `${BannerPlaceholder}`
													}`}
												/>
											}
										/>
									</Row>
									<Row className='mt-2'>
										<div
											className='text-center'
											style={{
												width: '100%',
												paddingTop: 10,
												paddingBottom: 10,
												borderRadius: 5,
												backgroundColor: COLORS.LightGray,
											}}
										>
											<Typography.Text
												style={{ fontSize: 14, fontStyle: 'italic' }}
											>
												{`" ${
													data.description !== null
														? data.description
														: 'Deskripsi tidak ada'
												} " `}
											</Typography.Text>
										</div>
									</Row>
								</Col>
							</Row>
						</Card>
					</Col>
				</Row>
			)}
		</>
	);
}

// mapStateToProps here if needed

// mapDispatchToProps here if needed

export default CardMarketProfile;
