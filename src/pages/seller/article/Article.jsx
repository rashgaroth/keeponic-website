//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import * as Io5 from 'react-icons/io5';
import { Box } from '@material-ui/core';
import {
	Button,
	Card,
	Col,
	Row,
	Tooltip,
	Tag,
	Radio,
	Modal,
	Alert,
	Empty,
} from 'antd';
import {
	EditOutlined,
	DeleteOutlined,
	CheckCircleOutlined,
	ClockCircleOutlined,
} from '@ant-design/icons';
import { Pagination, Skeleton } from '@material-ui/lab';

//  Region Import Redux Action Type and Redux Action
import {
	getArticles,
	onChangePage,
	filterArticle,
	deleteArticle,
} from '../../../redux/actions';
//  Region Import Utility/Helper Function

//  Region Import Components

//  Region Import Assets
import ImagePlaceholder from '../../../assets/images/image_placeholder.svg';
//  Region Import Style

//  Region Import Constants

class Article extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
		};
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		const { getArticles, filterArticle, onChangePage } = this.props;
		filterArticle('isPublished', '');
		onChangePage('page', 0);
		getArticles();
	}
	//  Function declaration (handle, onchange, etc)

	// handleClickCard = (id) => {
	// 	window.location.href = `${process.env.PUBLIC_URL}/product/detail/${id}`;
	// };

	handleDelete = (id) => {
		// eslint-disable-next-line array-callback-return
		this.props.articles.map((row) => {
			if (row.id === id) {
				Modal.confirm({
					title: 'Hapus Artikel ini?',
					centered: true,
					content: (
						<>
							<Box className='my-1' display='flex' alignItems='center'>
								<Box>
									<img
										src={row.image !== '' ? row.image : ImagePlaceholder}
										className='responsive mr-1'
										width='68'
										height='57'
										alt=''
										style={{
											borderWidth: 1,
											borderColor: '#E9E9E9',
											borderStyle: 'solid',
											borderRadius: 5,
										}}
									/>
								</Box>
								<Box>
									<p style={{ fontSize: 13, fontWeight: 500, marginTop: 5 }}>
										{row.title}
									</p>
								</Box>
							</Box>
							<Alert
								style={{
									fontSize: 13,
									fontWeight: 500,
								}}
								showIcon={false}
								message='*Artikel tidak bisa dikembalikan setelah dihapus'
								banner
							/>
						</>
					),
					okText: 'Konfirmasi',
					cancelText: 'Batal',
					onOk: () => {
						this.props.deleteArticle(id);
					},
				});
			}
		});
	};

	onRadioChange = (e) => {
		this.props.filterArticle('isPublished', e.target.value);
		this.props.onChangePage('page', 0);
		this.props.getArticles();
	};

	handleChangePagination = (e, nextPage) => {
		const { getArticles } = this.props;
		this.props.onChangePage('page', nextPage - 1);
		getArticles();
	};

	render() {
		const { articles, loading, totalPages, page } = this.props;
		return (
			<>
				<Row>
					<Col span={24}>
						<div className='page-title-box'>
							<div className='float-right page-title'>
								<Link to={`${process.env.PUBLIC_URL}/article/add`}>
									<Button icon={<Io5.IoAdd />} type='primary'>
										Tambah Artikel
									</Button>
								</Link>
							</div>
							<h4 className='page-title'>
								Artikel
								<span className='ml-3'></span>
							</h4>
						</div>
					</Col>
				</Row>
				<Radio.Group
					defaultValue=''
					buttonStyle='solid'
					onChange={this.onRadioChange}
					className='mb-4'
				>
					<Radio.Button value=''>Semua</Radio.Button>
					<Radio.Button value='1'>Diterbitkan</Radio.Button>
					<Radio.Button value='0'>Tertunda</Radio.Button>
				</Radio.Group>

				{loading ? (
					<>
						<Row gutter={[16, 16]}>
							<Col xs={12} lg={6}>
								<Skeleton style={{ marginTop: -60, height: 250 }} />
							</Col>
							<Col xs={12} lg={6}>
								{' '}
								<Skeleton style={{ marginTop: -60, height: 250 }} />
							</Col>
							<Col xs={12} lg={6}>
								{' '}
								<Skeleton style={{ marginTop: -60, height: 250 }} />
							</Col>
							<Col xs={12} lg={6}>
								<Skeleton style={{ marginTop: -60, height: 250 }} />
							</Col>
							<Col xs={12} lg={6}>
								<Skeleton style={{ marginTop: -60, height: 250 }} />
							</Col>
							<Col xs={12} lg={6}>
								{' '}
								<Skeleton style={{ marginTop: -60, height: 250 }} />
							</Col>
							<Col xs={12} lg={6}>
								{' '}
								<Skeleton style={{ marginTop: -60, height: 250 }} />
							</Col>
							<Col xs={12} lg={6}>
								<Skeleton style={{ marginTop: -60, height: 250 }} />
							</Col>
						</Row>
					</>
				) : (
					<>
						<Row gutter={[16, 16]}>
							{articles && articles.length === 0 && (
								<Col lg={24}>
									<Empty
										className='mt-4 mb-5'
										description='Artikel tidak ada'
									/>
								</Col>
							)}
							{articles &&
								articles.map((row) => (
									<Col xs={12} lg={6} key={row.id}>
										<Card
											hoverable
											// onClick={(e) => {
											// 	e.stopPropagation();
											// 	this.handleClickCard(146);
											// }}
											cover={
												<img
													alt='example'
													style={{ height: 139, objectFit: 'cover' }}
													src={row.image !== '' ? row.image : ImagePlaceholder}
												/>
											}
											actions={[
												<Tooltip mouseEnterDelay={0.2} title='Hapus Artikel'>
													<DeleteOutlined
														key='delete'
														onClick={(e) => {
															e.stopPropagation();
															this.handleDelete(row.id);
														}}
													/>
												</Tooltip>,
												<Tooltip mouseEnterDelay={0.2} title='Ubah Artikel'>
													<Link
														to={`${process.env.PUBLIC_URL}/article/detail/${row.id}`}
													>
														<EditOutlined key='edit' />
													</Link>
												</Tooltip>,
											]}
										>
											<Tooltip mouseEnterDelay={0.2} title={row.title}>
												<Card.Meta
													title={row.title}
													description={
														<Row className='float-right'>
															<Tag
																icon={
																	row.status ? (
																		<CheckCircleOutlined />
																	) : (
																		<ClockCircleOutlined />
																	)
																}
																color={row.status ? '#61934A' : '#FFA82F'}
																style={{ borderRadius: 5 }}
															>
																{row.status ? 'Diterbitkan' : 'Tertunda'}
															</Tag>
														</Row>
													}
												/>
											</Tooltip>
										</Card>
									</Col>
								))}
						</Row>
						<Row>
							<Col lg={24} xs={24} md={24}>
								<Card className='mt-3 d-flex flex-row-reverse'>
									<Pagination
										count={totalPages}
										variant='outlined'
										page={page + 1}
										shape='rounded'
										onChange={this.handleChangePagination}
									/>
								</Card>
							</Col>
						</Row>
					</>
				)}
			</>
		);
	}
}

const mapStateToProps = (state) => {
	const {
		articles,
		q,
		totalItems,
		page,
		row,
		status,
		loading,
		totalPages,
	} = state.ArticleReducers;

	return {
		articles,
		q,
		totalItems,
		page,
		row,
		loading,
		status,
		totalPages,
	};
};

export default connect(mapStateToProps, {
	getArticles,
	onChangePage,
	filterArticle,
	deleteArticle,
})(Article);
