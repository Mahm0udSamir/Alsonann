import React  from "react";
import { View, Text, TouchableOpacity, FlatList, Image, StyleSheet } from "react-native";
import axios from 'axios';

class HomePage extends React.Component {
    state = {
        categories: []
    }

    

    toDetailsPage = (item) => {
        this.props.navigation.navigate('Details', {item: item})
    }
      
    componentDidMount() {
        axios.get('https://www.hisnmuslim.com/api/ar/husn_ar.json')
        .then(function (response) {
            // handle success
            console.log(response.data) 
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
            console.log('parsedRes ', res);
            this.setState({categories: res["العربية"]})
         })
        .catch(function (error) {
            // handle error
            console.log(error);  
        })
        // return fetch('https://www.hisnmuslim.com/api/ar/husn_ar.json')
        //     .catch(() => {
        //         alert("Something went wroing");
        //     })   
        //     .then(res => res.text())     
        //     .then((text) => {
        //         if (Platform.OS === 'android') {
        //           text = text.replace(/\r?\n/g, '').replace(/[\u0080-\uFFFF]/g, ''); // If android , I've removed unwanted chars. 
        //         }
        //         return text;
        //       })
        //     .then(parsedRes => {
        //         console.log('parsedRes ', JSON.parse( parsedRes));
        //     })
    }
    

    render() {
        return (
            <View style={styles.container}>
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
                
            </View>
        )
    }
}

export default HomePage;

const styles = StyleSheet.create({
    container: {
        padding: 10
    },
    itemStyle: {
       width: '100%', 
       
       flexDirection: 'row', 
       margin: 5
    },
    
    textContainer: {
         flex: 1, 
         backgroundColor: 'rgba(0, 0, 0, 0.5)', 
         alignSelf: 'flex-end' 
    },
    text: {
        color: 'white', 
        fontSize: 20, 
        margin: 6 
    }
})