'use strict';

/**
 * @Author: lq
 * @desc:
 */

import React from 'react';
import {FlatList, SafeAreaView, StyleSheet, View} from 'react-native';
import {useStyle, useTheme} from '../../../shared/ThemeColors';
import PhotonTokenOptionItem from './comps/PhotonTokenOptionItem';
import {PhotonSeparator} from '../../../shared/comps/PhotonSeparator';

const PhotonTokenOption = () => {
  const styles = useStyle(createSty),
    theme = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.pageContainer}>
        <FlatList
          data={[0, 1, 2]}
          renderItem={() => <PhotonTokenOptionItem />}
          ItemSeparatorComponent={() => (
            <PhotonSeparator
              style={{
                backgroundColor: theme.c_F0F0F0_000000,
                marginVertical: 0,
              }}
            />
          )}
          keyExtractor={(item, index) => `RecordPhoton${index}`}
        />
      </View>
    </SafeAreaView>
  );
};
const createSty = theme =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.c_F8F9FD_000000,
    },
    pageContainer: {
      marginTop: 10,
      flex: 1,
      backgroundColor: theme.c_FFFFFF_111717,
      paddingHorizontal: 15,
    },
  });
export default PhotonTokenOption;
