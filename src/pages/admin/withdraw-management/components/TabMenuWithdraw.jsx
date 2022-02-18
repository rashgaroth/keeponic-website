import React from 'react';
import { connect } from 'react-redux';

import { withTranslation } from 'react-i18next';

import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Tabs, Tab } from '@material-ui/core';

const AntTabs = withStyles({
	root: {
		borderBottom: '1px solid #e8e8e8',
	},
	indicator: {
		backgroundColor: '#61934A',
	},
})(Tabs);

const AntTab = withStyles((theme) => ({
	root: {
		textTransform: 'none',
		minWidth: 72,
		fontWeight: theme.typography.fontWeightRegular,
		marginRight: theme.spacing(4),
		'&:hover': {
			color: '#61934A',
			opacity: 1,
		},
		'&$selected': {
			color: '#61934A',
			fontWeight: theme.typography.fontWeightMedium,
		},
		'&:focus': {
			color: '#61934A',
		},
	},
	selected: {},
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
	root: {
		flexGrow: 1,
	},
	padding: {
		padding: theme.spacing(3),
	},
	demo1: {
		backgroundColor: theme.palette.background.paper,
		borderRadius: 5,
	},
}));

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function TabMenuOrder(props) {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<div className={classes.demo1}>
				<AntTabs
					value={props.value}
					onChange={props.handleOnChange}
					aria-label='ant example'
					scrollButtons='on'
					variant='scrollable'
				>
					<AntTab label={'Perlu Ditransfer'} {...a11yProps(1)} />
					<AntTab label={'Ditransfer'} {...a11yProps(2)} />
					{/* <AntTab label={i18n.t('order_finished')} {...a11yProps(3)} /> */}
				</AntTabs>
			</div>
		</div>
	);
}

export default connect()(withTranslation()(TabMenuOrder));
