import {Platform, StyleSheet} from 'react-native';
import CONSTANTS from '../../../utils/constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    height: CONSTANTS.THEME.size.HEIGHT,
  },
  headerContainer: {
    backgroundColor: CONSTANTS.THEME.colors.PRIMARY_COLOR,
  },
  enterCodeText: {
    marginVertical: '2%',
    paddingHorizontal: '5%',
  },
  continueButton: {
    borderRadius: CONSTANTS.THEME.size.s14,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
  },
  buttonStyle: {
    marginTop: '20%',
  },
  inputStyle: {
    height: CONSTANTS.THEME.size.s50,
  },
  inputFormContainer: {
    height: CONSTANTS.THEME.size.HEIGHT * 0.7,
  },
  bottomContainer: {
    borderTopWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: CONSTANTS.THEME.colors.NEUTRAL[300],
  },
  confirmContainer: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    width: CONSTANTS.THEME.size.WIDTH * 0.3,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calenderContainer: {
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.03,
    width: CONSTANTS.THEME.size.WIDTH * 0.94,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    padding: CONSTANTS.THEME.size.s20,
    borderRadius: CONSTANTS.THEME.size.s10,
  },
  dotContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: CONSTANTS.THEME.size.WIDTH * 0.26,
    marginTop: CONSTANTS.THEME.size.HEIGHT * 0.05,
    marginHorizontal: CONSTANTS.THEME.size.WIDTH * 0.37,
    position: 'absolute',
    bottom: 20,
  },
  bannerView: {
    width: CONSTANTS.THEME.size.WIDTH,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    // borderRadius: CONSTANTS.THEME.size.WIDTH * 0.08,
  },
  itemContainer: {
    width: CONSTANTS.THEME.size.WIDTH * 0.28,

    paddingVertical: CONSTANTS.THEME.size.WIDTH * 0.02,
    alignItems: 'center',
    justifyContent: 'center',
    // marginBottom: CONSTANTS.THEME.size.HEIGHT * 0.03,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 10,
    borderColor: CONSTANTS.THEME.colors.NEUTRAL[300],
    // backgroundColor:'pink',
  },
  trandingContainer: {
    paddingHorizontal: CONSTANTS.THEME.size.WIDTH * 0.05,
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    marginTop: CONSTANTS.THEME.size.s20,
  },
  blogContainer: {
    backgroundColor: CONSTANTS.THEME.colors.WHITE_COLOR,
    paddingVertical: CONSTANTS.THEME.size.s20,
  },
  pageContainer: {
    bottom: '8%',
    position: 'absolute',
    width: '100%',
  },
  bannerMainContainer: {
    width: CONSTANTS.THEME.size.WIDTH,
    height: CONSTANTS.THEME.size.HEIGHT * 0.3,
  },
  buyNowButton: {
    position: 'absolute',
    bottom: CONSTANTS.THEME.size.s20,
    left: CONSTANTS.THEME.size.s20,
    paddingHorizontal: CONSTANTS.THEME.size.s10,
    paddingVertical: CONSTANTS.THEME.size.s6,
    borderRadius: CONSTANTS.THEME.size.s6,
    backgroundColor: CONSTANTS.THEME.colors.ORANGE,
  },
  imageStyle: {
    borderRadius: CONSTANTS.THEME.size.WIDTH * 0.15,
    overflow: 'hidden',
    height: CONSTANTS.THEME.size.WIDTH * 0.15,
    width: CONSTANTS.THEME.size.WIDTH * 0.15,
  },
  containerBanner:{
    backgroundColor:'#F0F5FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop:10
},
headerText: {
  fontSize: 18,
  fontWeight: '800',
  color: '#2F6FED',
 },
 descriptionText: {
  fontSize: 14,
  color: '#333',
  width:210,
},
button1: {
  backgroundColor: '#FF7F2A',
  paddingVertical: 8,
  paddingHorizontal: 16,
  width:CONSTANTS.THEME.size.WIDTH * 0.28,
  borderRadius: 10,
  marginTop:10,
  marginLeft:10
},
buttonText: {
  color: '#FFF',
  fontWeight: '600',
    },
textContainer: {
  // flex: 1,
  position:'absolute',
  marginLeft: CONSTANTS.THEME.size.WIDTH * 0.04,
  width: CONSTANTS.THEME.size.WIDTH * 0.6,
  height: 150,
  flexShrink: 0,
  // marginRight: 16,
  marginTop:1
    },
});

export default styles;
