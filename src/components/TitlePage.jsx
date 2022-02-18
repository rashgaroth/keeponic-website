import React from 'react';

export default function TitlePage(props) {
	return (
		<div className='page-title-box'>
			{props.breadcrumb}
			<div className='float-right page-title'>{props.button}</div>
			<h4 className='page-title'>
				{props.title}
				<span className='ml-3'></span>
			</h4>
		</div>
	);
}
