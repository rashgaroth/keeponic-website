import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import * as BS from 'react-icons/bs';

const useStyles = makeStyles((theme) => ({
	fabBottom: {
		margin: 0,
		top: 'auto',
		right: 20,
		bottom: 20,
		left: 'auto',
		position: 'fixed',
	},
}));

export default function FloatingActionButtonSize() {
	const classes = useStyles();

	return (
		<div>
			<a
				href='https://linktr.ee/bahrijar'
				target='_blank'
				rel='noopener noreferrer'
			>
				<Fab
					variant='extended'
					size='small'
					color='primary'
					aria-label='add'
					className={classes.fabBottom}
				>
					<BS.BsQuestionSquareFill className={classes.extendedIcon} />
					&nbsp;Isi Kuesioner
				</Fab>
			</a>
		</div>
	);
}
