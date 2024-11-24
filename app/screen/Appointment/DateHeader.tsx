import {View, Text, FlatList} from 'react-native';
import React, {FC} from 'react';
import styles from './styles';
import GTButtonContainer from '../../components/GTButtonContainer';
import {Left_Back_icon, Right_Back_Icon} from '../../assets';
import CONSTANTS from '../../utils/constants';
import {months} from '../../utils/CustomData';

interface DateHeaderProps {
  moveToBack?: any;
  date?: any;
  selectYear?: any;
  currentMonthIndex?: any;
  onScrollToIndexFailed?: any;
  moveToForward?: any;
  selectDayArray?: any;
  dateflatlistRef?: any;
  renderItem?: any;
  flatlistRef?: any;
  renderDayItem?: any;
  onScrollToIndexDayFailed?: any;
}

const DateHeader: FC<DateHeaderProps> = ({
  moveToBack,
  date,
  selectYear,
  currentMonthIndex,
  onScrollToIndexFailed,
  moveToForward,
  selectDayArray,
  dateflatlistRef,
  renderItem,
  flatlistRef,
  renderDayItem,
  onScrollToIndexDayFailed,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.monthContainer}>
        <GTButtonContainer
          onHandlePress={moveToBack}
          disabled={
            date.getFullYear() == selectYear &&
            date.getMonth() == currentMonthIndex
          }
          customStyle={styles.moveButton}>
          <Left_Back_icon width={18} height={18} />
        </GTButtonContainer>
        <View style={{width: CONSTANTS.THEME.size.WIDTH * 0.6}}>
          <FlatList
            ref={flatlistRef}
            showsHorizontalScrollIndicator={false}
            horizontal
            data={months}
            onScrollToIndexFailed={onScrollToIndexFailed}
            // onScrollToIndexFailed={error => {
            //   setTimeout(() => {
            //     if (months.length !== 0 && flatlistRef !== null) {
            //       flatlistRef.current.scrollToIndex({
            //         index: error.index,
            //         animated: true,
            //       });
            //     }
            //   }, 100);
            // }}
            keyExtractor={(item, index) => (index + 1).toString()}
            renderItem={renderItem}
          />
        </View>
        <GTButtonContainer
          onHandlePress={moveToForward}
          customStyle={styles.moveButton}>
          <Right_Back_Icon width={18} height={18} />
        </GTButtonContainer>
      </View>
      <View style={{paddingVertical: 16, paddingHorizontal: 16}}>
        <FlatList
          data={selectDayArray}
          ref={dateflatlistRef}
          showsHorizontalScrollIndicator={false}
          horizontal
          renderItem={renderDayItem}
          keyExtractor={(item, index) => (index + 1).toString()}
          onScrollToIndexFailed={onScrollToIndexDayFailed}
          //   onScrollToIndexFailed={error => {
          //     setTimeout(() => {
          //       if (selectDayArray.length !== 0 && dateflatlistRef !== null) {
          //         dateflatlistRef.current.scrollToIndex({
          //           index: error.index,
          //           animated: true,
          //         });
          //       }
          //     }, 100);
          //   }}
        />
      </View>
    </View>
  );
};

export default DateHeader;
