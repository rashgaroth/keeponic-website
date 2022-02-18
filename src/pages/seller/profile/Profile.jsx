//  Region Import External Lib (e.g React, Reactstrap, etc)
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tabs, Card, Spin } from 'antd';
import { Col, Row } from 'reactstrap';
import {
	IdcardOutlined,
	AppstoreOutlined,
	SafetyOutlined,
} from '@ant-design/icons';
//  Region Import Redux Action Type and Redux Action
import { getUserProfile } from '../../../redux/actions';
//  Region Import Utility/Helper Function

//  Region Import Components
import TitlePage from '../../../components/TitlePage';

import Akun from './components/Akun';
import Toko from './components/Toko';
import ChangePassword from './components/ChangePassword';

//  Region Import Assets

//  Region Import Style

//  Region Import Constants

class Profile extends Component {
	//  constructor declaration
	constructor(props) {
		super(props);
		this.state = {
			loadingAvatar: false,
			imageAvatar: this.props.profile.avatar,
			name: '',
			email: '',
			phone: '',
		};
	}

	//  react lifecycle (componentDidMount, componentDidUpdate, etc)
	componentDidMount() {
		this.props.getUserProfile();
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.profile !== this.props.profile) {
			this.setState({
				imageAvatar: nextProps.profile.avatar,
				name: nextProps.profile.name,
			});
		}
	}

	//  Function declaration (handle, onchange, etc)

	handleChangeName = (e) => {
		this.setState({
			name: e.target.value,
		});
	};

	//  render
	render() {
		return (
			<>
				<Row>
					<Col lg={12}>
						<TitlePage title={`Pengaturan`} />
					</Col>
				</Row>
				<Spin spinning={this.props.loading}>
					<Card bordered={false}>
						<Tabs tabPosition='left'>
							<Tabs.TabPane
								tab={
									<span>
										<IdcardOutlined />
										Akun
									</span>
								}
								key='1'
							>
								<Akun />
							</Tabs.TabPane>
							<Tabs.TabPane
								tab={
									<span>
										<AppstoreOutlined />
										Toko
									</span>
								}
								key='2'
							>
								<Toko />
							</Tabs.TabPane>
							<Tabs.TabPane
								tab={
									<span>
										<SafetyOutlined />
										Ganti Password
									</span>
								}
								key='3'
							>
								<ChangePassword />
							</Tabs.TabPane>
						</Tabs>
					</Card>
				</Spin>
			</>
		);
	}
}

// mapStateToProps here if needed
const mapStateToProps = (state) => {
	const { profile, loading } = state.ProfileReducers;

	return {
		profile,
		loading,
	};
};
// mapDispatchToProps here if needed

export default connect(mapStateToProps, {
	getUserProfile,
})(Profile);
