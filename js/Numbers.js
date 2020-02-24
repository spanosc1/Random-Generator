import React, {Component} from 'react';

import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
  Alert
} from 'react-native';

import Header from './Header';

import gVal from './global/global';

import AsyncStorage from '@react-native-community/async-storage';

var running = false;

class Numbers extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    min: '0',
    max: '100',
    numberOfResults: '1',
    numberList: [],
    running: false,
    confirmModal: false,
    label: ''
  }

  componentDidMount() {
    this.generateResults()
  }

  increaseMin() {
    var number = parseInt(this.state.min);
    number++;
    this.setState({min: JSON.stringify(number)});
  }

  decreaseMin() {
    var number = parseInt(this.state.min);
    number--;
    this.setState({min: JSON.stringify(number)});
  }

  increaseMax() {
    var number = parseInt(this.state.max);
    number++;
    this.setState({max: JSON.stringify(number)});
  }

  decreaseMax() {
    var number = parseInt(this.state.max);
    number--;
    this.setState({max: JSON.stringify(number)});
  }

  increaseResults() {
    var number = parseInt(this.state.numberOfResults);
    number++;
    this.setState({numberOfResults: JSON.stringify(number)});
  }

  decreaseResults() {
    var number = parseInt(this.state.numberOfResults);
    if(number > 1)
    {
      number--;
      this.setState({numberOfResults: JSON.stringify(number)});
    }
  }

  generateResults() {
    this.history.scrollToOffset(0);
    if(!running)
    {
      var min = parseInt(this.state.min);
      var max = parseInt(this.state.max);
      var num = parseInt(this.state.numberOfResults);
      running = true;
      this.setState({running: true});
      var numbers = this.state.numberList;
      for(var i = 0; i < this.state.numberOfResults; i++)
      {
        numbers.unshift(JSON.stringify(Math.round(Math.random() * (max - min + 1)) + min));
      }
      this.setState({numberList: numbers, running: false}, () => {
        running = false;
      });
    }
  }

  clearResults() {
    this.setState({numberList: []});
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
        parsed.unshift({type: 'Numbers', label: this.state.label, data: this.state.numberList, date: Date.now()});
      }
      else
      {
        var parsed = [{
          type: 'Numbers',
          data: this.state.numberList
        }];
      }
      AsyncStorage.setItem('saves', JSON.stringify(parsed), (error) => {
        Alert.alert('Saved', 'New record saved');
        this.setState({label: ''});
      });
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} page={'Numbers'} onSave={() => this.save()}/>
        <View style={styles.inputRow}>
          <View style={styles.inputMinView}>
            <Text style={styles.inputHeader}>Min</Text>
            <TouchableOpacity onPress={() => this.increaseMin()} activeOpacity={0.8} style={styles.increaseButton}>
              <Text style={styles.increaseIcon}>+</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.numInput}
              keyboardType={'number-pad'}
              value={this.state.min}
              onChangeText={(min) => this.setState({min})}
            />
            <TouchableOpacity onPress={() => this.decreaseMin()} activeOpacity={0.8} style={styles.decreaseButton}>
              <Text style={styles.decreaseIcon}>-</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputMaxView}>
            <Text style={styles.inputHeader}>Max</Text>
            <TouchableOpacity onPress={() => this.increaseMax()} activeOpacity={0.8} style={styles.increaseButton}>
              <Text style={styles.increaseIcon}>+</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.numInput}
              keyboardType={'number-pad'}
              value={this.state.max}
              onChangeText={(max) => this.setState({max})}
            />
            <TouchableOpacity onPress={() => this.decreaseMax()} activeOpacity={0.8} style={styles.decreaseButton}>
              <Text style={styles.decreaseIcon}>-</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputResultsView}>
            <Text style={styles.inputHeader}>Rolls</Text>
            <TouchableOpacity onPress={() => this.increaseResults()} activeOpacity={0.8} style={styles.increaseButtonSmall}>
              <Text style={styles.increaseIcon}>+</Text>
            </TouchableOpacity>
            <TextInput
              style={styles.numInputSmall}
              keyboardType={'number-pad'}
              value={this.state.numberOfResults}
              onChangeText={(numberOfResults) => this.setState({numberOfResults})}
            />
            <TouchableOpacity onPress={() => this.decreaseResults()} activeOpacity={0.8} style={styles.decreaseButtonSmall}>
              <Text style={styles.decreaseIcon}>-</Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity onPress={() => this.generateResults()} activeOpacity={0.8} style={this.state.running ? styles.rollButtonDisabled : styles.rollButton}>
          <Text style={styles.rollButtonText}>Roll</Text>
        </TouchableOpacity>
        {this.state.numberList.length == 0 &&
          <View style={styles.itemViewLatest}>
            <Text style={styles.itemTextLatest}>--</Text>
          </View>
        }
        <FlatList
          ref={(history) => this.history = history}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={this.state.numberList}
          keyExtractor={(item, index) => `item-${index}`}
          renderItem={({ item, index }) => 
            <View style={index == 0 ? styles.itemViewLatest : styles.itemView}>
              <Text style={index == 0 ? styles.itemTextLatest : styles.itemText}>{item}</Text>
            </View>
          }
        />
        <TouchableOpacity onPress={() => this.clearResults()} activeOpacity={0.8} style={styles.clearButton}>
          <Text style={styles.clearText}>Clear Results</Text>
        </TouchableOpacity>
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
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    height: gVal.dHeight,
    paddingTop: gVal.isX ? 90 : 70,
    paddingHorizontal: 15,
    backgroundColor: gVal.backgroundColor
  },
  inputRow: {
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  inputHeader: {
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
    color: '#ffffff'
  },
  inputMinView: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  inputMaxView: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  inputResultsView: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  increaseButton: {
    backgroundColor: gVal.increaseColor,
    height: 30,
    width: 100,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  decreaseButton: {
    backgroundColor: gVal.decreaseColor,
    height: 30,
    width: 100,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  increaseIcon: {
    fontSize: 20,
    color: '#ffffff'
  },
  decreaseIcon: {
    fontSize: 20,
    color: '#ffffff'
  },
  numInput: {
    backgroundColor: gVal.color1,
    textAlign: 'center',
    color: '#ffffff',
    width: 100,
    fontSize: 18,
    paddingVertical: 14
  },
  increaseButtonSmall: {
    backgroundColor: gVal.increaseColor,
    height: 30,
    width: 60,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  decreaseButtonSmall: {
    backgroundColor: gVal.decreaseColor,
    height: 30,
    width: 60,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  numInputSmall: {
    backgroundColor: gVal.color1,
    textAlign: 'center',
    color: '#ffffff',
    width: 60,
    fontSize: 18,
    paddingVertical: 14
  },
  rollButton: {
    marginTop: 15,
    padding: 10,
    borderRadius: 15,
    backgroundColor: gVal.color2,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  rollButtonDisabled: {
    marginTop: 15,
    padding: 10,
    borderRadius: 15,
    backgroundColor: gVal.color1,
    display: "flex",
    alignItems: "center",
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    opacity: 0.5
  },
  rollButtonText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: 'bold'
  },
  listContainer: {
    paddingBottom: gVal.isX ? 100 : 80,
    alignItems: "center"
  },
  itemView: {
    paddingVertical: 5
  },
  itemText: {
    fontSize: 20,
    color: '#ffffff'
  },
  itemViewLatest: {
    paddingTop: 70,
    paddingBottom: 40,
    alignItems: 'center'
  },
  itemTextLatest: {
    fontSize: 80,
    color: '#ffffff'
  },
  clearButton: {
    backgroundColor: gVal.decreaseColor,
    position: 'absolute',
    width: gVal.dWidth - 30,
    marginHorizontal: 15,
    bottom: gVal.isX ? 50 : 30,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 10,
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

export default Numbers;