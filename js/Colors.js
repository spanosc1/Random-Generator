import React, {Component} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Animated,
  Easing,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Alert
} from 'react-native';

import Header from './Header';

import gVal from './global/global';

import AsyncStorage from '@react-native-community/async-storage';

class Colors extends Component {
  state = {
    x: new Animated.Value(0),
    sideMenuWidth: new Animated.Value(0),
    sideMenuOpen: false,
    prevR: 255,
    prevG: 255,
    prevB: 255,
    nextR: 255,
    nextG: 255,
    nextB: 255,
    hexCode: '#ffffff',
    colorList: [],
    confirmModal: false,
    label: ''
  }

  oneRandom() {
    return Math.round(Math.random() * 255);
  }

  componentDidMount() {
    const newR = this.oneRandom();
    const newG = this.oneRandom();
    const newB = this.oneRandom();
    const hex = this.getHex(newR, newG, newB);
    this.setState({prevR: newR, prevG: newG, prevB: newB, hexCode: hex, colorList: [{R: newR, G: newG, B: newB, H: hex}]});
  }

  generateColor() {
    this.history.scrollToOffset(0);
    if(this.state.sideMenuOpen)
    {
      this.toggleMenu()
    }
    const newR = this.oneRandom();
    const newG = this.oneRandom();
    const newB = this.oneRandom();
    const hex = this.getHex(newR, newG, newB);
    var colorList = this.state.colorList;
    const newColor = {R: newR, G: newG, B: newB, H: hex};
    colorList.unshift(newColor);
    this.setState({nextR: newR, nextG: newG, nextB: newB});
    Animated.timing(
      this.state.x,
      {
        toValue: 100,
        duration: 300
      }
    ).start(() => {
      this.setState({prevR: newR, prevG: newG, prevB: newB, hexCode: hex, colorList: colorList});
      this.state.x.setValue(0);
    });
  }

  getHex(R, G, B) {
    var newR = R.toString(16);
    var newG = G.toString(16);
    var newB = B.toString(16);
    if(newR.length == 1)
    {
      newR = '0' + newR;
    }
    if(newG.length == 1)
    {
      newG = '0' + newG;
    }
    if(newB.length == 1)
    {
      newB = '0' + newB;
    }
    return `#${newR}${newG}${newB}`;
  }

  toggleMenu() {
    if(!this.state.sideMenuOpen)
    {
      Animated.timing(
        this.state.sideMenuWidth,
        {
          toValue: gVal.dWidth/2,
          duration: 300,
          easing: Easing.bezier(0.19, 1, 0.22, 1)
        }
      ).start(() => {
        this.setState({sideMenuOpen: true})
      });
    }
    else
    {
      Animated.timing(
        this.state.sideMenuWidth,
        {
          toValue: 0,
          duration: 300,
          easing: Easing.bezier(0.19, 1, 0.22, 1)
        }
      ).start(() => {
        this.setState({sideMenuOpen: false})
      });
    }
  }

  clearHistory() {
    this.setState({colorList: [this.state.colorList[0]]});
    setTimeout(() => {
      this.toggleMenu();
    }, 300);
  }

  save() {
    this.setState({confirmModal: true}, () => {
      this.t.focus();
    });
  }

  cancelModal() {
    this.setState({confirmModal: false, label: ''});
  }

  confirmSave() {
    this.setState({confirmModal: false});
    AsyncStorage.getItem('saves', (err, results) => {
      if(results)
      {
        var parsed = JSON.parse(results);
        var sliced = parsed.slice(0);
        parsed.unshift({type: 'Colors', label: this.state.label, data: this.state.colorList, date: Date.now()});
      }
      else
      {
        var parsed = [{
          type: 'Colors',
          data: this.state.colorList
        }];
      }
      AsyncStorage.setItem('saves', JSON.stringify(parsed), (error) => {
        Alert.alert('Saved', 'New record saved');
        this.setState({label: ''});
      });
    });
  }

  render() {
    var color = this.state.x.interpolate({
      inputRange: [0, 100],
      outputRange: [`rgba(${this.state.prevR}, ${this.state.prevG}, ${this.state.prevB}, 1)`, `rgba(${this.state.nextR}, ${this.state.nextG}, ${this.state.nextB}, 1)`]
    });
    return (
      <Animated.View style={[{backgroundColor: color}, styles.container]}>
        <Header navigation={this.props.navigation} page={'Colors'} onSave={() => this.save()}/>
        <View style={styles.infoContainer}>
          <Text style={styles.colorInfo}>{this.state.hexCode}</Text>
          <Text style={styles.colorInfo}>rgb({this.state.prevR}, {this.state.prevG}, {this.state.prevB})</Text>
        </View>
        <TouchableOpacity onPress={() => this.generateColor()} activeOpacity={0.8} style={styles.newColorButton}>
          <Text style={styles.newColorText}>New Color</Text>
        </TouchableOpacity>
        <View style={styles.sideMenu}>
          <TouchableOpacity onPress={() => this.toggleMenu()} style={styles.sideMenuButton} activeOpacity={0.8}>
            <View style={styles.line1}></View>
            <View style={styles.line2}></View>
          </TouchableOpacity>
          <Animated.View style={[{width: this.state.sideMenuWidth}, styles.history]}>
            <FlatList
              ref={(history) => this.history = history}
              contentContainerStyle={styles.listContainer}
              data={this.state.colorList}
              showsVerticalScrollIndicator={false}
              bounces={false}
              keyExtractor={(item, index) => `item-${index}`}
              renderItem={({ item, index }) => 
                <View style={[styles.historyItem, {backgroundColor: `rgba(${item.R}, ${item.G}, ${item.B}, 1)`}]}>
                  <Text style={styles.colorHistoryInfo}>{item.H}</Text>
                  <Text style={styles.colorHistoryInfo}>rgba({item.R}, {item.G}, {item.B})</Text>
                </View>
              }
            />
            <TouchableOpacity onPress={() => this.clearHistory()} activeOpacity={0.8} style={styles.clearButton}>
              <Text style={styles.clearText}>Clear</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
        <Modal
          visible={this.state.confirmModal}
          animationType={'fade'}
          transparent={true}
          onRequestClose={() => {
            this.cancelModal();
          }}
        >
          <View style={styles.modalBackground}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeaderRow}>
                <Text style={styles.modalHeaderText}>Add a label</Text>
                <TouchableOpacity onPress={() => this.cancelModal()} style={styles.cancelButton}>
                  <Text style={styles.cancelText}>X</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>
                <TextInput
                  ref={(t) => this.t = t}
                  style={styles.modalText}
                  multiline={true}
                  value={this.state.label}
                  onChangeText={(label) => this.setState({label: label})}
                />
                <TouchableOpacity onPress={() => this.confirmSave()} activeOpacity={0.8} style={styles.saveButton}>
                  <Text style={styles.saveText}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </Animated.View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    height: gVal.dHeight,
    paddingTop: gVal.isX ? 90 : 70,
    paddingHorizontal: 15
  },
  newColorButton: {
    width: gVal.dWidth - 30,
    marginHorizontal: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 15,
    position: "absolute",
    bottom: gVal.isX ? 50 : 30,
    backgroundColor: gVal.color1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  newColorText: {
    color: '#ffffff'
  },
  infoContainer: {
    position: 'absolute',
    paddingVertical: 10,
    paddingHorizontal: 20,
    bottom: gVal.isX ? 90 : 70,
  },
  colorInfo: {
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold'
  },
  sideMenu: {
    position: 'absolute',
    right: 0,
    height: gVal.dHeight*2/3,
    top: gVal.dHeight/6,
    display: "flex",
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  sideMenuButton: {
    borderTopLeftRadius: 15,
    borderBottomLeftRadius: 15,
    height: gVal.dHeight*2/3,
    width: 30,
    backgroundColor: gVal.color1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  line1: {
    width: 15,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    marginBottom: 4,
    transform: [
      { rotateZ: '-50deg'},
    ]
  },
  line2: {
    width: 15,
    height: 2,
    borderRadius: 2,
    backgroundColor: '#ffffff',
    marginTop: 4,
    transform: [
      { rotateZ: '50deg'},
    ]
  },
  listContainer: {
    width: gVal.dWidth/2
  },
  history: {
    height: gVal.dHeight*2/3,
    backgroundColor: gVal.backgroundColor,
    overflow: 'hidden'
  },
  historyItem: {
    height: 100,
    width: gVal.dWidth/2,
    paddingTop: 55,
    paddingHorizontal: 10
  },
  colorHistoryInfo: {
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  clearButton: {
    height: 30,
    width: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: "absolute",
    backgroundColor: gVal.decreaseColor,
    borderRadius: 15,
    right: 10,
    top: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  clearText: {
    color: '#ffffff'
  },
  modalBackground: {
    height: gVal.dHeight,
    width: gVal.dWidth,
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: gVal.dHeight/10
  },
  modalContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    padding: 10
  },
  modalHeaderRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minWidth: gVal.dWidth/2
  },
  cancelButton: {
    backgroundColor: gVal.decreaseColor,
    height: 30,
    width: 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  cancelText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16
  },
  modalBody: {
    paddingVertical: 10
  },
  modalText: {
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 6,
    width: gVal.dWidth*0.75
  },
  saveButton: {
    backgroundColor: gVal.color5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    marginTop: 10
  },
  saveText: {
    color: '#ffffff'
  }
})

export default Colors;