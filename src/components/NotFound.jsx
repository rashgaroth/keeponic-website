import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Result } from 'antd';

class NotFound extends Component {
	render() {
		return (
			<Result
				status='404'
				title='404'
				subTitle='Maaf, halaman yang kamu tuju tidak ada. Silahkan kembali ke halaman sebelumnya :)'
				style={{ minHeight: '75vh' }}
			/>
		);
	}
}

export default connect()(NotFound);
