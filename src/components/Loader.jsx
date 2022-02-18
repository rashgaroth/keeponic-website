import React, { Component } from 'react';
import { Spin } from 'antd';
/**
 * Renders the preloader
 */
class PreLoaderWidget extends Component {
	render() {
		return (
			<>
				<div className='d-flex justify-content-center vh-100'>
					<div className='m-auto'>
						<Spin />
					</div>
				</div>
			</>
		);
	}
}

export default PreLoaderWidget;
