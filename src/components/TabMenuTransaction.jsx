import React from 'react';
import { connect } from 'react-redux';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Tabs, Tab, Typography, Box, TextField } from '@material-ui/core';

import { Row, Col } from 'reactstrap';

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

function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role='tabpanel'
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography>{children}</Typography>
				</Box>
			)}
		</div>
	);
}

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

function TabMenuTransaction(props) {
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
					<AntTab label='Semua Produk' {...a11yProps(0)} />
					<AntTab label='Dijual' {...a11yProps(1)} />
					<AntTab label='Diarsipkan' {...a11yProps(2)} />
				</AntTabs>
				<Row>
					<Col lg={12} md={6} xs={12}>
						<TabPanel>
							<Row>
								<Col lg={4} md={4} xs={12}>
									<TextField
										id='outlined-basic'
										variant='outlined'
										placeholder='Cari nama produk... '
										size='small'
										color='#61934A'
										fullWidth
									/>
								</Col>
								<Col lg={4} md={4} xs={12}>
									<TextField
										id='outlined-basic'
										variant='outlined'
										placeholder='Kategori'
										size='small'
										color='#61934A'
										fullWidth
									/>
								</Col>
							</Row>
						</TabPanel>
						{/* <TabPanel value={props.value} index={1}>
              <Row>
                 <Col lg={4} md={4} xs={12}>
                 <TextField id="outlined-basic" variant="outlined" placeholder="Cari nama p" size="small" color="#61934A" fullWidth/>
                 </Col>
                 <Col lg={4} md={4} xs={12}>
                 <TextField id="outlined-basic" variant="outlined" placeholder="Kategori" size="small" color="#61934A" fullWidth/>
                 </Col>
              </Row>
            </TabPanel> */}
						{/* <TabPanel value={value} index={0}>
              <TextField id="outlined-basic" variant="outlined" placeholder="Cari nama produk..." size="small" color="#61934A" fullWidth/>
            </TabPanel> */}
					</Col>
				</Row>
			</div>
		</div>
	);
}

export default connect()(TabMenuTransaction);
