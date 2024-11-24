import {View, FlatList} from 'react-native';
import React, {FC, useState} from 'react';
import styles from './styles';
import GTLabel from '../GTLabel';
import CONSTANTS from '../../utils/constants';
import GTButtonContainer from '../GTButtonContainer';
import {X_CLOSE_ICON} from '../../assets';
import GTButton from '../GTButton';
import {useDispatch, useSelector} from 'react-redux';
import GTCheckBox from '../GTCheckBox';
import {
  setCountryList,
  setFilterCount,
  setGenderList,
  setLanguageList,
  setOfferList,
  setSkillList,
  setSortByList,
  setTopPsychologistList,
} from '../../redux/app-api-slice';

interface GTFilterContainerProps {
  onClosePress?: () => void;
  getFilterValueAll?: any;
  setSortBy?: any;
  setSkillText?: any;
  setLanguageFilter?: any;
  setGenderText?: any;
  setCountryText?: any;
  setOfferFilter?: any;
  setTopPsyText?: any;
  clearFilter?: any;
}

const GTFilterContainer: FC<GTFilterContainerProps> = ({
  onClosePress,
  getFilterValueAll,
  setSortBy,
  setSkillText,
  setLanguageFilter,
  setGenderText,
  setCountryText,
  setOfferFilter,
  setTopPsyText,
  clearFilter,
}) => {
  const filterLabel = [
    CONSTANTS.TEXT.SORT_BY,
    CONSTANTS.TEXT.SKILL,
    CONSTANTS.TEXT.LANGUAGE,
    CONSTANTS.TEXT.GENDER,
    CONSTANTS.TEXT.COUNTRY,
    CONSTANTS.TEXT.OFFER,
    CONSTANTS.TEXT.TOP_PSYCHOLOGIST,
  ];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const {
    sortBy,
    skill,
    language,
    gender,
    country,
    Offer,
    topPsychologist,
    filterCount,
  } = useSelector((state: any) => state.appState);

  const dispatch = useDispatch();

  var filterData = [
    sortBy,
    skill,
    language,
    gender,
    country,
    Offer,
    topPsychologist,
  ];

  const renderLabelItem = ({item, index}: any) => {
    return (
      <GTButtonContainer
        onHandlePress={() => setSelectedIndex(index)}
        customStyle={{
          width: '100%',
          paddingHorizontal: CONSTANTS.THEME.size.s8,
          backgroundColor:
            index == selectedIndex
              ? CONSTANTS.THEME.colors.WHITE_COLOR
              : CONSTANTS.THEME.colors.NEUTRAL[100],
          borderTopWidth:
            selectedIndex == 0 ? 1 : index == selectedIndex ? 0 : 1,
          borderBottomWidth: index == selectedIndex - 1 ? 1 : 0,
          borderColor: CONSTANTS.THEME.colors.NEUTRAL[300],
          borderRightWidth: index == selectedIndex ? 0 : 1,
          paddingVertical: CONSTANTS.THEME.size.s12,
          borderBottomRightRadius:
            selectedIndex == 0 ? 0 : index == selectedIndex - 1 ? 10 : 0,
          borderTopRightRadius:
            selectedIndex == 0 ? 0 : index == selectedIndex + 1 ? 10 : 0,
        }}>
        <GTLabel
          text={item}
          fontSize={CONSTANTS.THEME.size.s12}
          color={CONSTANTS.THEME.colors.SECONDARY_COLOR[80]}
          fontWeight={'400'}
          customStyle={{lineHeight: CONSTANTS.THEME.size.s18}}
        />
      </GTButtonContainer>
    );
  };
  const renderItem = ({item, index}: any) => {
    return (
      <GTCheckBox
        data={item}
        onPressHandle={() => {
          updateFilterDetials({it: item, ii: index});
        }}
        isViewDescription={selectedIndex == 6}
        checkContainer={{
          borderRadius:
            selectedIndex < 2
              ? CONSTANTS.THEME.size.s12
              : CONSTANTS.THEME.size.s4,
          shadowRadius:
            selectedIndex < 2
              ? CONSTANTS.THEME.size.s12
              : CONSTANTS.THEME.size.s4,
        }}
        container={{marginTop: CONSTANTS.THEME.size.s16}}
      />
    );
  };

  const updateFilterDetials = ({it, ii}: any) => {
    var updateValue = filterData[selectedIndex].map((item: any, index: any) => {
      if (index == ii) {
        var filterIndex = filterData[selectedIndex].findIndex(
          (val: any) => val?.isSelected == true,
        );
        updateFilter(it);
        if (filterIndex == -1) {
          dispatch(setFilterCount(filterCount + 1));
        } else if (item.isSelected == true) {
          dispatch(setFilterCount(filterCount == 0 ? 0 : filterCount - 1));
        }

        return {...item, isSelected: !item.isSelected};
      }

      return {...item, isSelected: false};
    });
    switch (selectedIndex) {
      case 0:
        dispatch(setSortByList([...updateValue]));
        break;
      case 1:
        dispatch(setSkillList([...updateValue]));
        break;
      case 2:
        dispatch(setLanguageList([...updateValue]));
        break;
      case 3:
        dispatch(setGenderList([...updateValue]));
        break;
      case 4:
        dispatch(setCountryList([...updateValue]));
        break;
      case 5:
        dispatch(setOfferList([...updateValue]));
        break;
      case 6:
        dispatch(setTopPsychologistList([...updateValue]));
        break;
    }
  };

  const updateFilter = (it: any) => {
    switch (selectedIndex) {
      case 0:
        setSortBy(it?.isSelected ? '' : `sortby=${it.value}`);
        callAllFilter(it?.isSelected);
        break;
      case 1:
        var newChar = it?.value ? it?.value?.replace(' ', '_') : '';
        setSkillText(it?.isSelected ? '' : it?.value ? `skill=${newChar}` : '');
        callAllFilter(it?.isSelected);
        break;
      case 2:
        setLanguageFilter(
          it?.isSelected ? '' : `language=${it?.name.toLowerCase()}`,
        );
        callAllFilter(it?.isSelected);
        break;
      case 3:
        setGenderText(it?.isSelected ? '' : `gender=${it.value}`);
        callAllFilter(it?.isSelected);
        break;
      case 4:
        setCountryText(it?.isSelected ? '' : `country=${it.value}`);
        callAllFilter(it?.isSelected);
        break;
      case 5:
        setOfferFilter(it?.isSelected ? '' : `offer=${it.value}`);
        callAllFilter(it?.isSelected);
        break;
      case 6:
        setTopPsyText(it?.isSelected ? '' : '');
        break;
    }
  };

  const callAllFilter = (data: any) => {
    if (data) {
      //@ts-ignore
      getFilterValueAll(false);
    }
  };

  const clearAllFilter = () => {
    if (filterCount > 0) {
      var i = 0;
      while (i < filterLabel.length) {
        var updateValue = filterData[i].map((item: any, index: any) => {
          return {...item, isSelected: false};
        });
        switch (i) {
          case 0:
            dispatch(setSortByList([...updateValue]));
            break;
          case 1:
            dispatch(setSkillList([...updateValue]));
            break;
          case 2:
            dispatch(setLanguageList([...updateValue]));
            break;
          case 3:
            dispatch(setGenderList([...updateValue]));
            break;
          case 4:
            dispatch(setCountryList([...updateValue]));
            break;
          case 5:
            dispatch(setOfferList([...updateValue]));
            break;
          case 6:
            dispatch(setTopPsychologistList([...updateValue]));
            dispatch(setFilterCount(0));
            break;
        }
        i++;
      }
      //@ts-ignore
      getFilterValueAll(false);
      clearFilter();
    }
  };

  const ListFooterComponent = () => {
    return <View style={styles.footer} />;
  };

  return (
    <View style={{...styles.container}}>
      <GTButtonContainer
        customStyle={styles.closeContainer}
        onHandlePress={onClosePress}>
        <X_CLOSE_ICON
          width={CONSTANTS.THEME.size.s18}
          height={CONSTANTS.THEME.size.s18}
        />
      </GTButtonContainer>
      <View style={{...styles.mainContainer}}>
        <View style={styles.headerContainer}>
          <GTLabel
            text={CONSTANTS.TEXT.FILTER}
            fontSize={CONSTANTS.THEME.size.s22}
            color={CONSTANTS.THEME.colors.Dark_Gunmetal}
            fontWeight={'700'}
            customStyle={{lineHeight: CONSTANTS.THEME.size.s32}}
          />
          <GTLabel
            text={CONSTANTS.TEXT.CLEAR_FILTER}
            fontSize={CONSTANTS.THEME.size.s14}
            color={
              filterCount > 0
                ? CONSTANTS.THEME.colors.PRIMARY_COLOR
                : CONSTANTS.THEME.colors.SECONDARY_COLOR[80]
            }
            onPress={() => clearAllFilter()}
            fontWeight={'400'}
            customStyle={{lineHeight: CONSTANTS.THEME.size.s22}}
          />
        </View>
        <View style={styles.subContainer}>
          <View style={styles.labelContainer}>
            <FlatList
              data={filterLabel}
              renderItem={renderLabelItem}
              bounces={false}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
          <View style={styles.labelValueContainer}>
            <FlatList
              data={[...filterData[selectedIndex]]}
              renderItem={renderItem}
              bounces={false}
              keyExtractor={(item, index) => index.toString()}
              ListFooterComponent={ListFooterComponent}
            />
          </View>
        </View>

        <View style={styles.bottomContainer}>
          <GTButton
            text={CONSTANTS.TEXT.APPLY}
            onHandlePress={() => getFilterValueAll(true)}
            disabled={filterCount == 0}
            backgroundColor={CONSTANTS.THEME.colors.PRIMARY_COLOR}
            color={CONSTANTS.THEME.colors.WHITE_COLOR}
            fontSize={CONSTANTS.THEME.size.s16}
            fontWeight={'600'}
            customStyle={{...styles.buttonContainer}}
          />
        </View>
      </View>
    </View>
  );
};

export default GTFilterContainer;
