//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Row, Col, Container } from 'reactstrap';
import { Button, Card, Input, Form } from 'antd';
import ReactQuill, { Quill } from 'react-quill';
import ImageResize from '@looop/quill-image-resize-module-react';
//  Region Import Redux Action Type and Redux Action
import { addFaq } from '../../../redux/actions';
//  Region Import Utility/Helper Function

//  Region Import Components

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
	'clean',
	'video',
];

class FaqAdd extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			content: undefined,
		};
		this.formRef = createRef();
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)

	//  Function declaration (handle, onchange, etc)

	handleChangeTitle = (e) => {
		this.setState({
			title: e.target.value,
		});
	};
	handleChangeContent = (e) => {
		this.setState({
			content: e,
		});
	};

	onFinish = (values) => {
		this.props.addFaq(values);
		this.formRef.current.resetFields();
	};

	//  render
	render() {
		const { title, content } = this.state;

		return (
			<>
				<Container className='mt-3'>
					<Row>
						<Col>
							<Card id='information' bordered={false} style={{ width: '100%' }}>
								<Form
									// ref={this.formInformationRef}
									layout='vertical'
									ref={this.formRef}
									validateMessages={validateMessages}
									scrollToFirstError={true}
									onFinish={this.onFinish}
									autoComplete='off'
									initialValues={{
										title: '',
										content: '',
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
													>{`${title.length} / 100`}</div>
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
											Publish
										</Button>
									</Form.Item>
								</Form>
							</Card>
						</Col>
					</Row>
				</Container>
			</>
		);
	}
}

// mapStateToProps here if needed

// mapDispatchToProps here if needed

export default connect(null, { addFaq })(FaqAdd);
