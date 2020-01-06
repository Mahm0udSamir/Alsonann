import React  from "react";
import { View, Text, TouchableOpacity, FlatList, Button, StyleSheet, ImageBackground } from "react-native";
import axios from 'axios';
import { Audio } from 'expo-av';
import bg from './../../assets/bg.jpg'
import { Ionicons } from '@expo/vector-icons';

class DetailsPage extends React.Component {
    state = {
        Invocations : null
          
    }
    static navigationOptions = ({ navigation }) => {
        const title = navigation.state.params.item.TITLE;
        return { 
            headerTitle: title,
            // headerRight:() => (
            //          <TouchableOpacity 
            //              onPress={navigation.navigate('PlayListPlayer')}>
            //              <View style={{color: '#ccc'}}>
            //                  <Ionicons name="md-play" size={32} color="gray" />
            //              </View>   
            //          </TouchableOpacity>
            //      )
        }
        
    };

    toPlayListPlayer = (index) => {
        const title = this.props.navigation.state.params.item.TITLE;
        let Invocations = [...this.state.Invocations];
        console.log('Befor Invocations :: ',  Invocations);

        const Invocation = Invocations[index];
        Invocations.splice(index, 1);
        Invocations.unshift(Invocation);
        console.log('After Invocations :: ', Invocations);
        this.props.navigation.navigate('PlayListPlayer', {Invocations: Invocations, title: title} )
    }

     
     

     
     

    componentDidMount() {
        const ID = this.props.navigation.state.params.item.ID;
        axios.get(`https://www.hisnmuslim.com/api/ar/${ID}.json`)
        .then(function (response) {
            // handle success    
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
            for (const key in res) {
                console.log('parsedRes key ', key);
                this.setState({Invocations: res[key]})
            }
         })
        .catch(function (error) {
            // handle error
            console.log(error);  
        })
    }

   
    
     
    
    
    render() {
        
        return (
            <ImageBackground source={bg} style={{width: '100%', height: '100%'}}>
             
                <FlatList
                    data={this.state.Invocations}
                    keyExtractor={item => ''+item.ID}
                    renderItem={
                        (itemData) => {
                            return (
                                <View style={styles.itemStyle}>
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>  {itemData.item.ARABIC_TEXT} </Text>
                                    </View>
                                    <View style={{   justifyContent: 'flex-start', alignItems: 'flex-start', margin: 3}}>     
                                        <TouchableOpacity 
                                        style={{backgroundColor: '#fff', borderWidth:2, borderColor: '#fff', borderRadius: 400, paddingHorizontal: 9, paddingVertical: 2}}
                                        onPress={() => this.toPlayListPlayer(itemData.index)}>
                                            <Ionicons name="md-play" size={32} color="#000" /> 
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )
                        }
                    }
                />
           
            </ImageBackground>
        )
    }
}

export default DetailsPage;  

const styles = StyleSheet.create({
    // container: {
    //     padding: 10
    // },
    itemStyle: {
        width: '100%', 
        borderRadius: 50,
        flexDirection: 'column',  
        // backgroundColor: '#0000008f', 
        backgroundColor: '#140500c2', 
        padding: 15,
        margin: 6,
    },
    
    textContainer: {
        flex: 1,
        width: '100%',
        alignSelf: 'flex-start'
    },
    text: {
        color: 'white',
        fontSize: 22,
        margin: 6,
        textAlign: 'center'
    }
})