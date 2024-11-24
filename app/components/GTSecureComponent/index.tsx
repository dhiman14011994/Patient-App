import React from 'react';
import {FlatList, Text, View} from 'react-native';
import {styles} from './Style';
import {PrivateIcon, SecureIcon, VerifiedIcon} from '../../assets';

const data = [
  {
    label: 'Private & Confidential',
  },
  {
    label: 'Verified Astrologers',
  },
  {
    label: 'Secure Payments',
  },
];
const SecureComponent = () => {
  return (
    <View
      style={{
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'row',
      }}>
      {data.map((item, index) => {
        return (
          <View style={styles.secureTabContainer}>
            {index == 0 ? (
              <PrivateIcon />
            ) : index == 1 ? (
              <VerifiedIcon />
            ) : (
              <SecureIcon />
            )}
            <Text style={styles.secureTabText}>{item.label}</Text>
            {index != 2 && (
              <View
                style={{
                  backgroundColor: '#E1E6EF',
                  width: 2,
                  height: '80%',
                  position: 'absolute',
                  alignSelf: 'center',
                  right: 0,
                  top: 20,
                }}></View>
            )}
          </View>
        );
      })}
    </View>
  );
};

export default SecureComponent;
