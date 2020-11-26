import React from 'react';
import HomeScreen from './screens/HomeScreen';
import GalleryScreen from './screens/GalleryScreen';
import SnapScreen from './screens/SnapScreen';
import VideoScreen from './screens/VideoScreen';
import { Ionicons } from '@expo/vector-icons';
import {createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';
import photos from './reducers/photos';
import videos from './reducers/videos';

const store = createStore(combineReducers({photos, videos}));

var BottomNavigator = createBottomTabNavigator({
  GalleryScreen: GalleryScreen,
  VideoScreen : VideoScreen,  
  SnapScreen: SnapScreen,
},
{
  defaultNavigationOptions: ({ navigation }) => ({
    tabBarIcon: ({ tintColor }) => {
      var iconName;
      if (navigation.state.routeName == 'GalleryScreen') {
        iconName = 'md-photos';
      } else if (navigation.state.routeName == 'SnapScreen') {
        iconName = 'ios-camera';
      } else if (navigation.state.routeName == 'VideoScreen') {
        iconName = 'md-photos'
      }
      return <Ionicons name={iconName} size={25} color={tintColor} />;
    },
  }),
  tabBarOptions: {
    activeTintColor: '#469589',
    inactiveTintColor: '#FFFFFF',
    style: {
      backgroundColor: '#111323',
    }
  }
 
});

StackNavigator = createStackNavigator({ 
Home:  HomeScreen,  
BottomNavigator: BottomNavigator
}, 
{headerMode: 'none'}
);   

const Navigation = createAppContainer(StackNavigator);

export default function App() {
  return (
    <Provider store={store}>
      <Navigation />
    </Provider>
  );
 }