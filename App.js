/* eslint-disable react-native/no-inline-styles */
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  FlatList,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
// const BLE = new BleManager();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
    };
  }

  componentDidMount() {
    console.log('Ble====>', BleManager, BleManager.checkState());

    BleManager.isPeripheralConnected().then(res =>
      console.log('connecton status', res),
    );
    BleManager.start({showAlert: false}).then(() => {
      // Success code
      console.log('Module initialized');
      BleManager.scan([], 5, false).then(res => {
        // Success code
        console.log('Scan started', res);
      });
    });
    // BleManager.state()
    //   .then(state => {
    //     console.log('state====>', state);
    //     if (state === 'PoweredOn') {
    //       BLE.startDeviceScan(
    //         [],
    //         {allowDuplicates: false},
    //         (error, devices) => {
    //           if (error) {
    //             console.warn('Ble Scan error', error);
    //             return;
    //           }
    //           // console.log('Devices===>', devices);
    //           if (devices.isConnectable) {
    //             this.setState({devices: [...this.state.devices, devices]});
    //           }
    //         },
    //       );
    //     }
    //   })
    //   .catch(e => {
    //     console.error('error', e);
    //   });
  }
  render() {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <View>
              <Text style={{textAlign: 'center', padding: 10, fontSize: 20}}>
                List of BLE DEVICES
              </Text>
              <FlatList
                data={this.state.devices}
                renderItem={({item, index}) => {
                  console.log('devices========>', item);
                  return (
                    <View
                      key={Math.random()}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10,
                      }}>
                      <Text>{index + 1}</Text>
                      <Text>{item.name}</Text>
                    </View>
                  );
                }}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#f1f1f1',
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: 'transparent',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: 'black',
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: 'black',
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
