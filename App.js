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
  NativeModules,
  NativeEventEmitter,
  Alert,
} from 'react-native';
import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
// const BLE = new BleManager();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      is_scanning: false, // whether the app is currently scanning for peripherals or not
      peripherals: null, // the peripherals detected
      connected_peripheral: null, // the currently connected peripheral
      user_id: null, // the ID of the current user
      attendees: null, // the attendees currently synced with the app
      promptVisible: false, // whether the prompt for the user's name is visible or not
      has_attended: false, // whether the current user has already attended
    };
    this.peripherals = [];
  }

  componentDidMount() {
    // console.log('Ble====>', BleManager, BleManager.checkState());
    BleManager.enableBluetooth()
      .then(() => {
        console.log('Bluetooth is already enabled');
      })
      .catch(error => {
        Alert.alert('You need to enable bluetooth to use this app.');
      });

    BleManager.start({showAlert: false}).then(() => {
      console.log('Module initialized');
    });

    // BleManager.isPeripheralConnected().then(res =>
    //   console.log('connecton status', res),
    // );

    bleManagerEmitter.addListener('BleManagerDiscoverPeripheral', this.handler);

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

  handler = peripheral => {
    var peripherals = this.peripherals; // get the peripherals
    // check if the peripheral already exists
    var el = peripherals.filter(el => {
      return el.id === peripheral.id;
    });

    if (!el.length) {
      peripherals.push({
        id: peripheral.id, // mac address of the peripheral
        name: peripheral.name, // descriptive name given to the peripheral
      });
      this.peripherals = peripherals; // update the array of peripherals
    }
  };

  startScan = () => {
    this.peripherals = [];
    this.setState({
      is_scanning: true,
    });
    BleManager.scan([], 2).then(() => {
      console.log('scan started');
    });
  };

  render() {
    console.log('state=======>', this.state);

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
