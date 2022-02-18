import React, { Component } from 'react';
import { Spin } from 'antd';
/**
 * Renders the preloader
 */
class LoaderTwo extends Component {
	render() {
		return (
			<>
				<div className='d-flex justify-content-center'>
					<div className='m-auto'>
						<Spin />
					</div>
				</div>
			</>
		);
	}
}

export default LoaderTwo;
