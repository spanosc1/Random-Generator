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
  TouchableOpacity
} from 'react-native';

import gVal from './global/global';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    height: new Animated.Value(0),
    menuOpen: false,
    menuMaxHeight: gVal.isX ? 300 : 280,
    currentPage: ''
  }

  componentDidMount() {
    this.setState({currentPage: this.props.page});
  }

  toggleMenu() {
    if(!this.state.menuOpen)
    {
      this.setState({menuOpen: true});
      Animated.timing(
        this.state.height,
        {
          toValue: this.state.menuMaxHeight,
          duration: 300,
          easing: Easing.bezier(0.19, 1, 0.22, 1)
        }
      ).start();
    }
    else
    {
      this.setState({menuOpen: false});
      Animated.timing(
        this.state.height,
        {
          toValue: 0,
          duration: 300,
          easing: Easing.bezier(0.19, 1, 0.22, 1)
        }
      ).start();
    }
  }

  navigate(route) {
    this.toggleMenu();
    setTimeout(() => {
      this.props.navigation.navigate(route);
    }, 150);
  }

  render() {
    return (
      <View style={styles.headerContainer}>
        <StatusBar barStyle={'light-content'}/>
        <Animated.View style={[styles.optionsContainer, {height: this.state.height}]}>
          <TouchableOpacity onPress={() => this.navigate('Numbers')} activeOpacity={0.8} style={[styles.headerLink, styles.headerLinkOne]}>
            <Text style={styles.linkText}>Numbers</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.navigate('Colors')} activeOpacity={0.8} style={[styles.headerLink, styles.headerLinkTwo]}>
            <Text style={styles.linkText}>Colors</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.navigate('Tarot')} activeOpacity={0.8} style={[styles.headerLink, styles.headerLinkThree]}>
            <Text style={styles.linkText}>Tarot</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.navigate('Saves')} activeOpacity={0.8} style={[styles.headerLink, styles.headerLinkFour]}>
            <Text style={styles.linkText}>Saves</Text>
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.displayRow}>
          {this.state.currentPage == 'Saves' ||
            <TouchableOpacity onPress={() => this.props.onSave()} activeOpacity={0.8} style={styles.saveButton}>
              <Text style={styles.saveText}>Save</Text>
            </TouchableOpacity>
          }
          <TouchableOpacity onPress={() => this.toggleMenu()} style={styles.menuButton}>
            <View style={styles.line}>
            </View>
            <View style={styles.line}>
            </View>
            <View style={styles.line}>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  headerContainer: {
    width: gVal.dWidth,
    backgroundColor: gVal.color1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    position: 'absolute',
    top: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    zIndex: 10
  },
  optionsContainer: {
    overflow: "hidden",
    backgroundColor: '#ffffff'
  },
  displayRow: {
    paddingTop: gVal.isX ? 38 : 18,
    paddingBottom: 6,
    paddingHorizontal: 10,
    display: "flex",
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  menuButton: {
    height: 35,
    width: 45,
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  line: {
    height: 2,
    width: 30,
    backgroundColor: '#ffffff',
    borderRadius: 2
  },
  saveButton: {
    height: 35,
    width: 45,
    display: "flex",
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  saveText: {
    color: '#ffffff',
    fontSize: 16
  },
  linkText: {
    fontSize: 22,
    color: '#ffffff'
  },
  headerLink: {
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  headerLinkOne: {
    paddingTop: gVal.isX ? 55 : 35,
    backgroundColor: gVal.color2,
    zIndex: 9
  },
  headerLinkTwo: {
    backgroundColor: gVal.color3,
    zIndex: 8
  },
  headerLinkThree: {
    backgroundColor: gVal.color4,
    zIndex: 7
  },
  headerLinkFour: {
    backgroundColor: gVal.color5,
    zIndex: 6
  }
});

export default Header;