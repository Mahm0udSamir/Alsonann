import React  from "react";
import { View, Text, TouchableOpacity, FlatList, ImageBackground, StyleSheet } from "react-native";
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import Autocomplete from 'react-native-autocomplete-input';
import bg from './../../assets/bg.jpg'

class HomePage extends React.Component {
    state = {
        categories: [],
        query: '',
        showSearchInput: false
    }

    static navigationOptions =  ({ navigation }) => {
       return {
           headerRight:() => (
                    <TouchableOpacity 
                        onPress={navigation.getParam('headerRight')}>
                        <View style={{color: '#ccc'}}>
                            <Ionicons name="md-search" size={32} color="gray" />
                        </View>   
                    </TouchableOpacity>
                )
            }
      };

    setHeaderRight = () => {
         this.setState({showSearchInput: !this.state.showSearchInput})
    }
   
     

    toDetailsPage = (item) => {
        this.props.navigation.navigate('Details', {item: item})
    }
      
    componentDidMount(){
        this.props.navigation.setParams({
            headerRight: this.setHeaderRight
          });



        axios.get('https://www.hisnmuslim.com/api/ar/husn_ar.json')
        .then(function (response) {
            // handle success
            // console.log(response.data) 
            return response.data;
        })
        .then((text) => {
            if (Platform.OS === 'android') {
                text = text.replace(/\r?\n/g, '')  
                    // .replace(/[\u0600-\u06FF]/g) // If android , I've removed unwanted chars. 
                    .replace(/[\u0080-\uFFFF]/, ''); // If android , I've removed unwanted chars. 
            }
            return text;
        })
        .then(parsedRes => {
            let res = JSON.parse( parsedRes);
            // console.log('parsedRes ', res);
            this.setState({categories: res["العربية"]})
         })
        .catch(function (error) {
            // handle error
            console.log(error);  
        })
       
    }
    _filterData = (query) => {
        if (query === '') {
            return [];
          }
      
          const regex = new RegExp(`${query.trim()}`, 'i');
          return this.state.categories.filter(item => item.TITLE.search(regex) >= 0);
    }

    render() {
        const { query } = this.state;
        const data = this._filterData(query);
         
        const comp = (a, b) => a.toLowerCase().trim() === b.toLowerCase().trim();

        const searchInput = (
            <View style={styles.autocompleteContainer}>
            <Autocomplete
                            listStyle={{backgroundColor: '#fff0', borderWidth: 0}}
                            autoCapitalize="none"
                            autoCorrect={false}
                            data={ data}
                            defaultValue={query}
                            onChangeText={text => {
                                console.log(text)
                                this.setState({ query: text })
                            }}
                            placeholder="بحث"
                            keyExtractor={item => ''+item.ID }  
                            renderItem={(itemData) => {
                                // console.log(itemData)
                                return (
                                    <TouchableOpacity
                                       style={styles.itemStyle}  
                                       onPress={() => {
                                            // this.setState({ query: itemData.item.TITLE }
                                            this.toDetailsPage(itemData.item)
                                        }}
                                        >
                                            <View style={styles.textContainer}>
                                                <Text style={styles.text}>{itemData.item.TITLE}</Text>
                                            </View>
                                    </TouchableOpacity>
                            )}}
                        />

            </View>
          ) 
        return (
            <ImageBackground source={bg} style={{width: '100%', height: '100%'}}>
                {(this.state.showSearchInput ) ?
                searchInput: 
            
                (   
                  
                    <FlatList
                       
                        data={this.state.categories}
                        keyExtractor={item => ''+item.ID }  
                        renderItem={
                            (itemData) => {
                                return (
                                    <TouchableOpacity 
                                        style={styles.itemStyle} 
                                        onPress={() => this.toDetailsPage(itemData.item)}>
                                        <View style={styles.textContainer}>
                                            <Text style={styles.text}>  {itemData.item.TITLE} </Text>   
                                        </View>    
                                    </TouchableOpacity>
                                )
                            }
                        }
                    />
                  
                    )
            } 
            </ImageBackground>
        )
    }
   
}

export default HomePage;

const styles = StyleSheet.create({
    autocompleteContainer: {
        width: '100%',
        height: '100%',
        // color: '#fff',
        // backgroundColor: 'red'
    },
   
    itemStyle: {
       width: '100%', 
       borderRadius: 50,
       flexDirection: 'row',  
    //    backgroundColor: '#0000008f', 
        backgroundColor: '#140500c2', 
        padding: 15,
 
       margin: 5
    },
    
    textContainer: {
         flex: 1, 
         alignSelf: 'flex-end' 
    },
    text: {
        color: '#fff', 
        fontSize: 22,
        margin: 6,
        textAlign: 'center'
    }
})