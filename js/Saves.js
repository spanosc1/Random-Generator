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
  Alert
} from 'react-native';

import Header from './Header';

import gVal from './global/global';

import AsyncStorage from '@react-native-community/async-storage';

import moment from 'moment';

class Saves extends Component {
  state = {
    saves: []
  }

  componentDidMount() {
    this._onFocusListener = this.props.navigation.addListener('focus', (payload) => {
      AsyncStorage.getItem('saves', (err, results) => {
        if(results !== null) {
          var parsed = JSON.parse(results);
          parsed.forEach((v, i) => {
            parsed[i] = JSON.stringify(v);
          });
          this.setState({saves: parsed});
        }
      });
    });
  }

  renderNumberList(item) {
    var parsed = JSON.parse(item).data;
    return (
      <FlatList
        contentContainerStyle={styles.numberListContainer}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        data={parsed}
        horizontal={true}
        keyExtractor={(item, index) => `item-${index}`}
        renderItem={({ item, index }) => 
          <View style={styles.numberView}>
            <Text style={styles.numberText}>{item}</Text>
          </View>
        }
      />
    )
  }

  renderColorList(item) {
    var parsed = JSON.parse(item).data;
    return (
      <FlatList
        contentContainerStyle={styles.colorListContainer}
        showsHorizontalScrollIndicator={false}
        bounces={false}
        data={parsed}
        horizontal={true}
        keyExtractor={(item, index) => `item-${index}`}
        renderItem={({ item, index }) => 
          <View style={[{backgroundColor: item.H}, styles.colorView]}>
            <View style={styles.colorTextView}>
              <Text style={styles.colorText}>{item.H}</Text>
              <Text style={styles.colorText}>{`rgb(${item.R}, ${item.G}, ${item.B})`}</Text>
            </View>
          </View>
        }
      />
    )
  }

  renderTarotList(item) {
    var parsed = JSON.parse(item).data;
    return (
      <FlatList
        contentContainerStyle={styles.tarotListContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
        data={parsed}
        keyExtractor={(item, index) => `item-${index}`}
        renderItem={({ item, index }) => 
          <View style={styles.tarotView}>
            <Text style={styles.tarotText}>{item}</Text>
          </View>
        }
      />
    )
  }

  getColor(type)
  {
    switch(type) {
      case 'Numbers':
        return gVal.color2;
        break;
      case 'Colors':
        return gVal.color3;
        break;
      case 'Tarot':
        return gVal.color4;
        break;
      default:
        return gVal.color5;
    }
  }

  deleteOne(i) {
    Alert.alert(
      'Delete',
      'Are you sure you want to delete this save?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => {
          var saves = this.state.saves;
          console.log(saves);
          saves.splice(i, 1);
          this.setState({saves: saves}, () => {
            var newSaves = saves.slice(0);
            newSaves.forEach((v, i) => {
              newSaves[i] = JSON.parse(v);
            });
            AsyncStorage.setItem('saves', JSON.stringify(newSaves));
          });
        }},
      ],
      {cancelable: false},
    );
  }

  deleteAll() {
    Alert.alert(
      'Delete All',
      'Are you sure you want to delete all of your saves?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Delete', onPress: () => {
          AsyncStorage.removeItem('saves');
          this.setState({saves: []});
        }},
      ],
      {cancelable: false},
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header navigation={this.props.navigation} page={'Saves'}/>
        {this.state.saves.length == 0 &&
          <View style={styles.emptyView}>
            <Text style={styles.emptyText}>You have no saves</Text>
          </View>
        }
        {this.state.saves.length == 0 ||
          <TouchableOpacity onPress={() => this.deleteAll()} activeOpacity={0.8} style={styles.clearAllButton}>
            <Text style={styles.clearAllText}>Clear All</Text>
          </TouchableOpacity>
        }
        <FlatList
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          bounces={false}
          data={this.state.saves}
          keyExtractor={(item, index) => `item-${index}`}
          renderItem={({ item, index }) => 
            <>
              <View style={styles.resultView}>
                <View style={[{backgroundColor: /*this.getColor(JSON.parse(item).type)*/ gVal.color1}, styles.resultTypeView]}>
                  <Text style={styles.resultNotes}>{JSON.parse(item).label}</Text>
                  <View style={styles.resultRight}>
                    <Text style={styles.resultType}>{JSON.parse(item).type}</Text>
                    <TouchableOpacity onPress={() => this.deleteOne(index)} activeOpacity={0.8} style={styles.deleteOne}>
                      <Text style={styles.deleteOneText}>X</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={styles.dataView}>
                  {JSON.parse(item).type == 'Numbers' &&
                    this.renderNumberList(item)
                  }
                  {JSON.parse(item).type == 'Colors' &&
                    this.renderColorList(item)
                  }
                  {JSON.parse(item).type == 'Tarot' &&
                    this.renderTarotList(item)
                  }
                </View>
              </View>
              <View style={styles.dateContainer}>
                <Text style={styles.date}>
                  {moment(JSON.parse(item).date).format('M/DD/YYYY | h:mm a')}  
                </Text>
              </View>
            </>
          }
        />
      </View>
    )
  }
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: gVal.backgroundColor,
    height: gVal.dHeight,
    paddingTop: gVal.isX ? 80 : 60,
    paddingHorizontal: 15
  },
  listContainer: {
    paddingBottom: gVal.isX ? 30 : 10
  },
  resultView: {
    display: 'flex',
    borderColor: gVal.color1,
    borderWidth: 1,
    borderRadius: 15,
    marginVertical: 5
  },
  resultTypeView: {
    borderTopLeftRadius: 13,
    borderTopRightRadius: 13,
    paddingVertical: 5,
    paddingHorizontal: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between'
  },
  resultNotes: {
    width: gVal.dWidth/2,
    color: '#ffffff',
    fontSize: 16,
    marginVertical: 5
  },
  resultType: {
    color: '#ffffff',
    fontSize: 16
  },
  resultRight: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  deleteOne: {
    backgroundColor: gVal.decreaseColor,
    height: 30,
    width: 30,
    marginLeft: 5,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  deleteOneText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16
  },
  dataView: {
    overflow: 'hidden',
    borderBottomLeftRadius: 13,
    borderBottomRightRadius: 13
  },
  numberListContainer: {
    padding: 10
  },
  colorListContainer: {

  },
  tarotListContainer: {
    padding: 10
  },
  numberView: {
    paddingHorizontal: 10
  },
  numberText: {
    color: '#ffffff',
    fontSize: 30
  },
  colorView: {
    height: 60,
    width: 150,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    padding: 5
  },
  colorText: {
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold'
  },
  tarotView: {
    paddingHorizontal: 10,
    paddingVertical: 4
  },
  tarotText: {
    color: '#ffffff'
  },
  emptyView: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: gVal.dHeight/2
  },
  emptyText: {
    fontSize: 20,
    color: '#ffffff'
  },
  dateContainer: {
    display: 'flex',
    alignItems: 'flex-end'
  },
  date: {
    color: '#ffffff',
    fontSize: 12
  },
  clearAllButton: {
    backgroundColor: gVal.decreaseColor,
    marginVertical: 10,
    paddingVertical: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3
  },
  clearAllText: {
    color: '#ffffff'
  }
})

export default Saves;