//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import { Button, Card, Input, Form, Spin } from 'antd';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from '@looop/quill-image-resize-module-react';
//  Region Import Redux Action Type and Redux Action
import { getFaqDetail, putFaq } from '../../../redux/actions';
//  Region Import Utility/Helper Function

//  Region Import Components
import CustomImage from './components/CustomImage';
//  Region Import Assets
import IconRequired from '../../../assets/images/IconRequired';
//  Region Import Style
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.bubble.css';

//  Region Import Constants
import { COLORS } from '../../../constants/colors';
const validateMessages = {
	required: 'Kolom tidak boleh kosong.',
};

Quill.register('modules/imageResize', ImageResize);
Quill.register('formats/image', CustomImage);

const quillContainerData = [
	[{ header: ['0', '2', '3'] }],
	['bold', 'italic', 'underline', 'strike', 'blockquote'],
	[
		{ align: '' },
		{ align: 'center' },
		{ align: 'right' },
		{ align: 'justify' },
	],
	[{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
	['link', 'image', 'video'],
	['clean'],
];

const quillFormats = [
	'header',
	'bold',
	'italic',
	'underline',
	'strike',
	'blockquote',
	'align',
	'list',
	'bullet',
	'indent',
	'link',
	'image',
	'alt',
	'height',
	'width',
	'style',
	'clean',
	'video',
];

class FaqEdit extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			dataTitle: '',
			content: '',
			createdDate: '',
		};
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		const { getFaqDetail } = this.props;
		getFaqDetail(this.props.match.params.id);
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.faq !== this.props.faq) {
			// You might need to have a deep comparison here if columns is not immutable or a nested obejct. You can use _.isEqual from lodash in that case
			this.setState({
				dataTitle: nextProps.faq.title,
				createdDate: nextProps.faq.created_date,
				content: nextProps.faq.content,
			});
		}
	}
	//  Function declaration (handle, onchange, etc)

	handleChangeTitle = (e) => {
		this.setState({
			dataTitle: e.target.value,
		});
	};
	handleChangeContent = (e) => {
		this.setState({
			content: e,
		});
	};

	onFinish = (values) => {
		this.props.putFaq(values, this.props.match.params.id);
	};

	//  render
	render() {
		const { dataTitle, content } = this.state;
		const { loading } = this.props;
		if (dataTitle === '') {
			return <Spin style={{ marginTop: -100 }}></Spin>;
		}
		return (
			<>
				<Spin spinning={loading} delay={200}>
					<Container className='mt-3'>
						<Row>
							<Col>
								<Card
									id='information'
									bordered={false}
									style={{ width: '100%' }}
								>
									<Form
										// ref={this.formInformationRef}
										layout='vertical'
										validateMessages={validateMessages}
										scrollToFirstError={true}
										onFinish={this.onFinish}
										autoComplete='off'
										initialValues={{
											title: dataTitle,
											content: content,
										}}
									>
										<Form.Item
											name='title'
											label='Judul'
											tooltip={{
												title: '',
												icon: <IconRequired />,
											}}
											rules={[
												{ required: true },
												{
													min: 10,
													message:
														'Judul artikel terlalu singkat. Masukkan minimal 10 karakter.',
												},
											]}
										>
											<Input
												placeholder=''
												onChange={(e) => this.handleChangeTitle(e)}
												minLength={10}
												maxLength={100}
												suffix={
													<>
														<div
															className=''
															style={{ color: COLORS.gray }}
														>{`${dataTitle.length} / 100`}</div>
													</>
												}
											/>
										</Form.Item>
										<Form.Item
											name='content'
											label='Isi'
											tooltip={{
												title: '',
												icon: <IconRequired />,
											}}
											rules={[
												{ required: true },
												{
													min: 40,
													message:
														'Isi terlalu singkat. Masukkan minimal 40 karakter',
												},
											]}
										>
											<ReactQuill
												theme='snow'
												modules={{
													toolbar: {
														container: quillContainerData,
													},
													imageResize: {
														parchment: Quill.import('parchment'),
														modules: ['Resize', 'DisplaySize', 'Toolbar'],
													},
												}}
												formats={quillFormats}
												preserveWhitespace={true}
												value={content}
												onChange={(e) => this.handleChangeContent(e)}
											/>
										</Form.Item>
										<Form.Item>
											<Button
												className='mt-3'
												type='primary'
												htmlType='submit'
												// loading={loading}
											>
												Ubah FAQ
											</Button>
										</Form.Item>
									</Form>
								</Card>
							</Col>
						</Row>
					</Container>
				</Spin>
			</>
		);
	}
}

// mapStateToProps here if needed
const mapStateToProps = (state) => {
	const { faq, status, loading } = state.FaqManagementReducers;

	return {
		faq,
		loading,
		status,
	};
};
// mapDispatchToProps here if needed

export default connect(mapStateToProps, { putFaq, getFaqDetail })(FaqEdit);
