import {View, FlatList, BackHandler} from 'react-native';
import React, {useCallback, useEffect, useRef, useState} from 'react';
import {useLazyGetUpcomingAppointmentsApiQuery} from '../../redux/home-api-slice';
import GTIndicator from '../../components/GTIndicator';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import CONSTANTS from '../../utils/constants';
import styles from './styles';
import moment from 'moment';
import GTLabel from '../../components/GTLabel';
import {getDaysArray} from '../../utils/customFunction';
import GTDateView from '../../components/GTDateView';
import GTTodaySchedule from '../../components/GTTodaySchedule';
import Toast from 'react-native-toast-message';
import {months} from '../../utils/CustomData';
import GTAppointmentHeader from '../../components/GTAppointmentHeader/GTAppointmentHeader';
import ListEmptyComponent from '../../components/ListEmptyComponent/ListEmptyComponent';
import DateHeader from './DateHeader';

const Appointment = () => {
  var date = new Date();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [currentMonthIndex, setCurrentMonthIndex] = useState(5);
  const flatlistRef: any = useRef();
  const dateflatlistRef: any = useRef();
  const [getUpcomingAppointmentsApi, {data, isLoading}] =
    useLazyGetUpcomingAppointmentsApiQuery();
  const [selectDay, setSelectDay] = useState(0);
  const [selectMonth, setSelectMonth] = useState(6);
  const [selectYear, setSelectYear] = useState(2024);
  const [selectedYear, setSelectedYear] = useState(2024);
  const [selectDayArray, setSelectDayArray] = useState([]);
  const isFocus = useIsFocused();

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    setSelectDay(date.getDate());
    setSelectYear(date.getFullYear());
    setSelectMonth(date.getMonth());
    setSelectedYear(date.getFullYear());
    setCurrentMonthIndex(date.getMonth());
    getAppintmentList();
    getDayData({year: date.getFullYear(), month: date.getMonth()});
  }, [isFocus]);

  const getDayData = async ({year, month}: any) => {
    var dateArray: any = await getDaysArray(year, month + 1);
    setSelectDayArray(dateArray || []);
  };

  const getAppintmentList = () => {
    getUpcomingAppointmentsApi('')
      .unwrap()
      .then(res => {})
      .catch(e => {
        console.log('error', JSON.stringify(e));
        if (e.originalStatus == 503) {
          Toast.show({
            type: 'error',
            text2: e?.responseMessage || e?.data || '',
          });
        }
      });
  };

  useEffect(() => {
    getDayData({
      year: selectYear || date.getFullYear(),
      month: currentMonthIndex,
    });
    // scroll to current month
    if (flatlistRef.current) {
      flatlistRef.current.scrollToIndex({
        index: currentMonthIndex,
        animated: true,
      });
      if (
        dateflatlistRef.current &&
        currentMonthIndex == date.getMonth() &&
        selectDayArray.length != 0
      ) {
        dateflatlistRef?.current?.scrollToIndex({
          index: date.getDate() - 1,
          animated: true,
        });
      }
    }
  }, [currentMonthIndex, isFocus]);

  useEffect(() => {
    // scroll to current month
    if (
      dateflatlistRef.current &&
      currentMonthIndex == date.getMonth() &&
      selectDayArray.length != 0
    ) {
      dateflatlistRef?.current?.scrollToIndex({
        index: date.getDate() - 1,
        animated: true,
      });
    }
  }, [selectDayArray, isFocus]);

  const moveToBack = () => {
    var moveToBackIndex = currentMonthIndex - 1;
    if (moveToBackIndex < 12 && moveToBackIndex >= 0) {
      setCurrentMonthIndex(moveToBackIndex);
      setTimeout(() => {
        flatlistRef.current.scrollToIndex({
          index: moveToBackIndex,
          animated: true,
        });
      }, 200);
    } else {
      setCurrentMonthIndex(11);
      setSelectYear(pre => pre - 1);
      setTimeout(() => {
        flatlistRef.current.scrollToIndex({
          index: 11,
          animated: true,
        });
      }, 200);
    }
  };

  const moveToForward = () => {
    var moveToForwardIndex = currentMonthIndex + 1;
    if (moveToForwardIndex < 12 && moveToForwardIndex >= 0) {
      setCurrentMonthIndex(moveToForwardIndex);
      setTimeout(() => {
        flatlistRef.current.scrollToIndex({
          index: moveToForwardIndex,
          animated: true,
        });
      }, 200);
    } else {
      setCurrentMonthIndex(0);
      setSelectYear(pre => pre + 1);
      setTimeout(() => {
        flatlistRef.current.scrollToIndex({
          index: 0,
          animated: true,
        });
      }, 200);
    }
  };

  const renderItem = ({item, index}: any) => {
    return (
      <View style={styles.monthView}>
        <GTLabel
          text={`${item} ${selectYear}`}
          fontSize={CONSTANTS.THEME.size.s18}
          fontWeight="700"
          color={CONSTANTS.THEME.colors.Dark_Gunmetal}
        />
      </View>
    );
  };

  const renderDayItem = ({item, index}: any) => {
    const isSelected =
      selectYear == selectedYear &&
      currentMonthIndex == selectMonth &&
      item.date == selectDay;
    const isDisabled =
      selectYear == date.getFullYear() &&
      currentMonthIndex == date.getMonth() &&
      item.date < date.getDate();
    return (
      <GTDateView
        onDatePress={() => {
          setSelectDay(Number(item.date));
          setSelectMonth(currentMonthIndex);
          setSelectedYear(selectYear);
        }}
        disabled={isDisabled}
        date={item.date}
        dateName={item.name}
        dateNameStyle={{
          color: isDisabled
            ? CONSTANTS.THEME.colors.DARK_GRAY
            : CONSTANTS.THEME.colors.Dark_Gunmetal,
        }}
        dateStyle={{
          color: isDisabled
            ? CONSTANTS.THEME.colors.DARK_GRAY
            : CONSTANTS.THEME.colors.Dark_Gunmetal,
        }}
        buttonStyle={{
          ...styles.dateView,
          borderColor: isSelected
            ? CONSTANTS.THEME.colors.PRIMARY_COLOR
            : CONSTANTS.THEME.colors.NEUTRAL[300],
          backgroundColor: isSelected
            ? '#F0F5FF'
            : CONSTANTS.THEME.colors.TRANSPARENT,
        }}
      />
    );
  };
  const renderTodaySchedule = React.memo(({item, index}: any) => {
    const newdate = moment(item.scheduledDateTime).format('hh:mm A');
    const dates = new Date(item.scheduledDateTime);
    var isToday =
      dates.getFullYear() == date.getFullYear() &&
      dates.getMonth() == date.getMonth() &&
      dates.getDate() == date.getDate();
    var isLeftTime = isToday
      ? dates.getHours() == date.getHours()
        ? dates.getMinutes() == date.getMinutes()
          ? `${60 - date.getSeconds()} Sec left to start`
          : `${dates.getMinutes() - date.getMinutes()} Min left to start`
        : ''
      : '';

    var isJoin = isToday
      ? dates.getHours() == date.getHours()
        ? dates.getMinutes() == date.getMinutes()
          ? 60 - date.getSeconds()
          : 200
        : 200
      : 200;

    return (
      <GTTodaySchedule
        container={{
          marginTop: index == 0 ? CONSTANTS.THEME.size.WIDTH * 0.05 : 0,
        }}
        isJoinMeeting={isJoin < 30}
        name={`${item?.scheduledWithPartner_firstName} ${
          item?.scheduledWithPartner_lastName || ''
        }`}
        title={item.title || ''}
        isWaitting={isLeftTime != '' ? isJoin < 30 : false}
        time={
          isToday
            ? isLeftTime != ''
              ? isLeftTime
              : `${newdate}`
            : `${newdate}`
        }
        price={18}
        userImage={item.scheduledWithPartner_profilePicture || ''}
      />
    );
  });

  const filterNewArray = useCallback(() => {
    let newArray =
      data?.data?.filter((item: any) => {
        const newdate = new Date(item.scheduledDateTime);
        if (
          newdate.getFullYear() == selectYear &&
          newdate.getMonth() == currentMonthIndex &&
          newdate.getDate() == (selectDay != 0 ? selectDay : date.getDate())
        ) {
          return item;
        }
      }) || [];

    return newArray;
  }, [selectYear, currentMonthIndex, selectDay]);

  return (
    <View style={styles.container}>
      <GTAppointmentHeader
        insets={insets}
        onHandleLeftPress={() => {}}
        headerText="Appointment"
      />
      <DateHeader
        moveToBack={moveToBack}
        date={date}
        selectYear={selectYear}
        currentMonthIndex={currentMonthIndex}
        onScrollToIndexFailed={(error: any) => {
          setTimeout(() => {
            if (months.length !== 0 && flatlistRef !== null) {
              flatlistRef.current.scrollToIndex({
                index: error.index,
                animated: true,
              });
            }
          }, 100);
        }}
        moveToForward={moveToForward}
        selectDayArray={selectDayArray}
        dateflatlistRef={dateflatlistRef}
        renderItem={renderItem}
        flatlistRef={flatlistRef}
        renderDayItem={renderDayItem}
        onScrollToIndexDayFailed={(error: any) => {
          setTimeout(() => {
            if (selectDayArray.length !== 0 && dateflatlistRef !== null) {
              dateflatlistRef.current.scrollToIndex({
                index: error.index,
                animated: true,
              });
            }
          }, 100);
        }}
      />
      <View style={styles.subContainer}>
        {filterNewArray()?.length > 0 && (
          <FlatList
            bounces={false}
            showsVerticalScrollIndicator={false}
            data={filterNewArray()}
            //@ts-ignore
            renderItem={renderTodaySchedule}
            keyExtractor={(item, index) => (index + 1).toString()}
            ListEmptyComponent={ListEmptyComponent}
          />
        )}
      </View>

      {isLoading && <GTIndicator />}
    </View>
  );
};

export default Appointment;
