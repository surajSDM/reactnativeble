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
  Platform,
  TouchableOpacity,
} from 'react-native';
import {BleManager} from 'react-native-ble-plx';
import {request, PERMISSIONS} from 'react-native-permissions';
// import BleManager from 'react-native-ble-manager';
const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
const Bluetooth = new BleManager();
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      devices: [],
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
    this.RequestPermission();
    this.enableBle();
    this.startScan();
  }
  RequestPermission = () => {
    request(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
        ios: PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL,
      }),
    )
      .then(res => {
        console.log('PERMISSIONS', res);
      })
      .catch(error => {
        console.log('PERMISSIONS error', error);
      });
  };
  enableBle = () => {
    console.log('enabling Ble');

    Bluetooth.enable()
      .then(res => {
        console.log('enableBle response====>', res);
      })
      .catch(e => {
        console.log('enableBle error====>', e);
      });
  };

  handler = peripheral => {
    console.log('inside BleManagerDiscoverPeripheral handler');

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
    // BleManager.scan([], 2).then(res => {
    //   console.log('scan started', res);
    // });
    Bluetooth.startDeviceScan(
      [],
      {allowDuplicates: false},
      (error, devices) => {
        // Success code
        if (error) {
          console.log('Scan error', error);
        }
        console.log(devices.name, 'Scan started', devices);
        if (devices.name) {
          var d = this.state.devices.filter(i => i.id === devices.id);
          if (!d.length) {
            this.setState(state => ({
              devices: [...state.devices, devices],
            }));
          }
        }
      },
    );
  };

  stopScan = () => {
    Bluetooth.stopDeviceScan();
  };

  connect = id => {
    this.stopScan();
    Bluetooth.connectToDevice(id, {autoConnect: true})
      .then(res => {
        console.log('Device connection:', res);
      })
      .catch(e => {
        console.log('Device connection error:', e);
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
                    <TouchableOpacity
                      onPress={() => this.connect(item.id)}
                      key={Math.random()}
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        padding: 10,
                        margin: 5,
                        backgroundColor: '#fff',
                      }}>
                      <Text>{index + 1}</Text>
                      <Text>{item.name}</Text>
                    </TouchableOpacity>
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
