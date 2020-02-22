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
  Alert
} from 'react-native';

import Header from './Header';

import gVal from './global/global';
import cards from './global/cards';

const tarot = cards;
var deck = cards.slice(0);

class Colors extends Component {
  state = {
    allowRepeats: false,
    deckSize: tarot.length,
    result: ['--']
  }

  updateRepeats(value) {
    this.setState({allowRepeats: value, deckSize: tarot.length, result: ['--']});
    deck = cards.slice(0);
  }

  drawCard(num) {
    if(this.state.deckSize < num)
    {
      Alert.alert('Not enough cards', 'Please reset the deck');
    }
    else
    {
      var deckSize = this.state.deckSize;
      var result = [];
      for(var i = 0; i < num; i++)
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
      this.setState({result: result, deckSize: deck.length}); 
    }
  }

  resetDeck() {
    this.setState({deckSize: tarot.length, result: ['--']});
    deck = cards.slice(0);
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation}/>
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
        <FlatList
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={this.state.result}
          keyExtractor={(item, index) => `item-${index}`}
          renderItem={({ item, index }) => 
            <View style={styles.resultView}>
              <Text style={styles.resultText}>{item}</Text>
            </View>
          }
        />
        <TouchableOpacity onPress={() => this.resetDeck()} activeOpacity={0.8} style={styles.resetButton}>
          <Text style={styles.resetText}>
            Reset Deck
          </Text>
        </TouchableOpacity>
        <View style={styles.buttonsRow}>
          <TouchableOpacity onPress={() => this.drawCard(5, this.state.allowRepeats)} activeOpacity={0.8} style={styles.button}>
            <Text style={styles.buttonText}>Draw 5</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.drawCard(3, this.state.allowRepeats)} activeOpacity={0.8} style={styles.button}>
            <Text style={styles.buttonText}>Draw 3</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.drawCard(1, this.state.allowRepeats)} activeOpacity={0.8} style={styles.button}>
            <Text style={styles.buttonText}>Draw 1</Text>
          </TouchableOpacity>
        </View>
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
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  buttonText: {
    color: '#ffffff'
  },
  listContainer: {
    marginTop: 25,
    height: gVal.dHeight/2,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  resultView: {
    marginVertical: 8,
    width: gVal.dWidth - 50
  },
  resultText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ffffff'
  },
  resetButton: {
    position: 'absolute',
    backgroundColor: gVal.decreaseColor,
    bottom: gVal.isX ? 50 : 30,
    width: gVal.dWidth - 30,
    marginLeft: 15,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    paddingVertical: 10
  },
  resetText: {
    color: '#ffffff'
  }
})

export default Colors;