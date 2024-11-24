import {
  View,
  ViewStyle,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, {FC, useRef} from 'react';
import {
  Left_Back_icon,
  Right_Back_Icon,
  LeftIcon,
  RightIcon,
} from '../../assets';
import style from './style';
import CONSTANTS from '../../utils/constants';
import GTCategoryItem from '../GTCategoryItem';
import GTItemHeader from '../GTItemHeader';

interface GTCategoryListProps {
  rightText?: string;
  title?: string;
  data?: any;
  isFewItemShow?: boolean;
  numberOfItem?: number;
  numColumns?: number;
  estimatedItemSize?: number;
  container?: ViewStyle;
  listContainer?: ViewStyle;
  itemContainer?: ViewStyle;
  onPress?: any;
  rightTextOnPress?: () => void;
}

const GTCategoryList: FC<GTCategoryListProps> = ({
  rightText,
  title,
  data,
  isFewItemShow,
  numberOfItem = 9,
  numColumns = 3,
  container,
  listContainer,
  itemContainer,
  onPress,
  rightTextOnPress,
}) => {
  const {width, height} = Dimensions.get('window');
  const scrollViewRef = useRef();
  const scrollButtons = [
    {
      onPress: () => {
        scrollViewRef.current.scrollToOffset({
          offset: 0,
        });
      },
    },
    {
      onPress: () => {
        scrollViewRef.current.scrollToEnd();
      },
    },
  ];
  const renderItem = ({item, index}: any) => {
    if (true || isFewItemShow) {
      if (numberOfItem > index) {
        return (
          <GTCategoryItem
            onPress={() => {
              onPress({categoryItem: item, categoryIndex: index});
            }}
            text={item?.name}
            container={{
              ...itemContainer,
              marginRight: CONSTANTS.THEME.size.WIDTH * 0.03,
              // marginTop: index > 2 ? 0 : CONSTANTS.THEME.size.HEIGHT * 0.05,
              ...style.itemContainer,
              width: data.length > 3 ? width / 5 : width / (data.length + 1),
              height: 'auto',
              margin: 0,
              // backgroundColor:'pink',
            }}
            resizeMode={'contain'}
            textColor={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
            uri={item?.image || ''}
            imageItemStyle={{...style.imageStyle, width: 300, height: 300}}
            fontSize={CONSTANTS.THEME.size.s14}
          />
        );
      }
    } else {
      return (
        <GTCategoryItem
          text={item?.title}
          container={{
            ...itemContainer,
            // marginTop: index > 2 ? 0 : CONSTANTS.THEME.size.HEIGHT * 0.03,
            ...style.itemContainer,
          }}
          resizeMode={'contain'}
          uri={item?.uri}
          textColor={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
          imageItemStyle={style.imageStyle}
          fontSize={CONSTANTS.THEME.size.s14}
          onPress={() => {
            onPress(item);
          }}
        />
      );
    }
  };
  ///
  return (
    <View style={[style.mainContainer, container, {paddingBottom: 0}]}>
      <GTItemHeader
        title={title}
        rightText={data.length > 9 && false ? rightText : ''}
        containerStyle={style.headerStyle}
        rightTextOnPress={rightTextOnPress}
      />
      <View
        style={[
          style.listContainer,
          listContainer,
          {justifyContent: 'center', alignItems: 'center'},
        ]}>
        {/* {data.map((item: any, index: any) => renderItem({item, index}))} */}
        <FlatList
          bounces={false}
          // showsVerticalScrollIndicator={false}
          ref={scrollViewRef}
          showsHorizontalScrollIndicator={false}
          // numColumns={numColumns}
          data={data}
          horizontal
          //@ts-ignore
          renderItem={renderItem}
        />
        {/* <View style={{
          // backgroundColor:'grey',
          // height:'100%',
          width:'110%',
          justifyContent:'space-between',
          alignItems:'center',
          position:'absolute',
          flexDirection:'row',

        }}> */}
        {/* {scrollButtons.map((item,index)=>{
            return(
              <TouchableOpacity 
              key={index}
              onPress={item.onPress} style={[{
                // backgroundColor:'black',
                width:50,
                height:50,
                position:'absolute',
                top:30,
              },index==0?{left:-15}:{right:-15}]}>{index==0?<LeftIcon/>:<RightIcon/>}</TouchableOpacity>
            )
          })} */}

        {/* </View> */}
      </View>
    </View>
  );
};

export default GTCategoryList;
