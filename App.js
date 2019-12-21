import React from 'react';
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import HomePage from './screens/HomePage/HomePage';
import DetailsPage from './screens/DetailsPage/DetailsPage';

export default class App extends React.Component {
  render() {
    return (
      <AppContainer />
    );
  }
}

const AppStackNavigator = createStackNavigator({
  Home: {
    screen: HomePage,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: 'Categories'
      }
    }
  },
  Details: {
    screen: DetailsPage
  },
  // Product: {
  //   screen: ProductDetailsPage,
  // },
  
  
});

const AppContainer = createAppContainer(AppStackNavigator);