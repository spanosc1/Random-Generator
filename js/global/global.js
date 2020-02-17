import {Platform, Dimensions} from 'react-native';

const deviceHeight = Dimensions.get("window").height;
const deviceWidth = Dimensions.get("window").width;

const isX = (Platform.OS == 'ios' && (deviceHeight == 812 || deviceHeight == 896));

var global = {
	plat: Platform.OS,
	isX: isX,
	dWidth: deviceWidth,
	dHeight: deviceHeight,
	backgroundColor: '#121212',
	color1: '#202020',
	color2: '#4C98CF',
	color3: '#4874A8',
	color4: '#5A5287',
	color5: '#554269',
	increaseColor: '#5ed188',
	decreaseColor: '#d13b3b'
}

export default global;