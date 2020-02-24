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
  Switch,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal
} from 'react-native';

import Header from './Header';

import gVal from './global/global';
import cards from './global/cards';

import Slider from '@react-native-community/slider';

import AsyncStorage from '@react-native-community/async-storage';

const tarot = cards;
var deck = cards.slice(0);

class Colors extends Component {
  state = {
    allowRepeats: false,
    deckSize: tarot.length,
    result: [],
    num: 1,
    confirmModal: false,
    label: ''
  }

  updateRepeats(value) {
    this.setState({allowRepeats: value, deckSize: tarot.length, result: []});
    deck = cards.slice(0);
  }

  drawCard() {
    if(this.state.deckSize < this.state.num)
    {
      Alert.alert('Not enough cards', 'Please reset the deck');
    }
    else
    {
      var deckSize = this.state.deckSize;
      var result = [];
      for(var i = 0; i < this.state.num; i++)
      {
        var index = Math.floor(Math.random() * deckSize);
        var direction = Math.floor(Math.random() * 2);
        var directionName = direction == 0 ? '' : '(Inverted) ';
        var draw = directionName + deck[index].name;
        result.push(draw);
        if(!this.state.allowRepeats)
        {
          deck.splice(index, 1);
          deckSize--;
        }
      }
      this.setState({result: result, deckSize: deck.length, fontSize: 32}); 
    }
  }

  updateNum(num) {
    this.setState({num});
  }

  resetDeck() {
    this.setState({deckSize: tarot.length, result: []});
    deck = cards.slice(0);
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
        parsed.unshift({type: 'Tarot', label: this.state.label, data: this.state.result, date: Date.now()});
      }
      else
      {
        var parsed = [{
          type: 'Tarot',
          data: this.state.result
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
        <Header navigation={this.props.navigation} page={'Tarot'} onSave={() => this.save()}/>
        <View style={styles.deckTextView}>
          <View style={styles.deckText}>
            <Text style={styles.deck}>Deck: </Text>
            <Text style={styles.deckSize}>{this.state.deckSize}</Text>
          </View>
          <View style={styles.allowRepeatsView}>
            <Text style={styles.allowRepeats}>
              Allow Repeats 
            </Text>
            <Switch
              value={this.state.allowRepeats}
              onValueChange={(value) => this.updateRepeats(value)}
              style={styles.switch}
            />
          </View>
        </View>
        <View style={styles.flatListContainer}>
          <FlatList
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            bounces={false}
            data={this.state.result}
            keyExtractor={(item, index) => `item-${index}`}
            renderItem={({ item, index }) => 
              <View style={styles.resultView}>
                <Text style={styles.resultText}>{index + 1}. {item}</Text>
              </View>
            }
          />
        </View>
        <View style={styles.optionsContainer}>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={15}
            step={1}
            value={this.state.num}
            onValueChange={(num) => this.updateNum(num)}
          />
          <View style={styles.sliderLabels}>
            <Text style={styles.sliderLabel}>1</Text>
            <Text style={styles.sliderLabel}>5</Text>
            <Text style={styles.sliderLabel}>10</Text>
            <Text style={styles.sliderLabel}>15</Text>
          </View>
          <TouchableOpacity onPress={() => this.drawCard()} activeOpacity={0.8} style={styles.button}>
            <Text style={styles.buttonText}>Draw {this.state.num}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.resetDeck()} activeOpacity={0.8} style={styles.resetButton}>
            <Text style={styles.resetText}>
              Reset Deck
            </Text>
          </TouchableOpacity>          
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
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: gVal.backgroundColor,
    height: gVal.dHeight,
    paddingTop: gVal.isX ? 90 : 70,
    paddingHorizontal: 15
  },
  deckTextView: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  deckText: {
    display: 'flex',
    flexDirection: 'row'
  },
  deck: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 4
  },
  deckSize: {
    color: '#ffffff',
    fontSize: 32,
    fontWeight: 'bold'
  },
  allowRepeatsView: {
    display: 'flex',
    flexDirection: 'row'
  },
  allowRepeats: {
    color: '#ffffff',
    fontSize: 16,
    marginRight: 4,
    fontWeight: 'bold'
  },
  buttonsRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    width: gVal.dWidth - 30,
    marginLeft: 15,
    bottom: gVal.isX ? 105 : 85
  },
  button: {
    backgroundColor: gVal.color4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 10,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  buttonText: {
    color: '#ffffff'
  },
  flatListContainer: {
    marginTop: 25,
    height: gVal.dHeight/2
  },
  resultView: {
    marginVertical: 8,
    width: gVal.dWidth - 50
  },
  resultText: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 24
  },
  resetButton: {
    backgroundColor: gVal.decreaseColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 10,
    marginVertical: 5
  },
  resetText: {
    color: '#ffffff'
  },
  sliderLabels: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
    marginVertical: 5
  },
  sliderLabel: {
    color: '#ffffff'
  },
  optionsContainer: {
    position: 'absolute',
    bottom: gVal.isX ? 20 : 0,
    display: 'flex',
    width: gVal.dWidth,
    paddingHorizontal: 15,
    paddingVertical: 20
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