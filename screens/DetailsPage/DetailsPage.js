import React  from "react";
import { View, Text, TouchableOpacity, FlatList, Button, StyleSheet, ImageBackground } from "react-native";
import axios from 'axios';
import { Audio } from 'expo-av';
import bg from './../../assets/bg.jpg'
import { Ionicons } from '@expo/vector-icons';

class DetailsPage extends React.Component {
    state = {
        Invocations : null,
        playingStatus: 'nosound',
        url: null
          
    }

    static navigationOptions = ({ navigation }) => {
        const title = navigation.state.params.item.TITLE;
        return { headerTitle: title}
    };

    toProductDetailsPage = (productDetails) => {
        this.props.navigation.navigate('Product', {
            productDetails: productDetails
        })
    }

    _playRecording = async () => {
        try {
            const sound = await new Audio.Sound();
            sound.setOnPlaybackStatusUpdate(this._updateScreenForSoundStatus);
            await sound.loadAsync(
                {uri: this.state.url},
                {
                    shouldPlay: true,
                    // isLooping: true,
                },
            );
       
            this.sound = sound;
            await this.sound.playAsync();
            this.setState({ playingStatus: "playing" });
            // Your sound is playing!
          } catch (error) {
            // An error occurred!
          }
    }
    
    _updateScreenForSoundStatus = (status) => {
        console.log('status : ', status)
        if (status.isPlaying && this.state.playingStatus !== "playing") {
          this.setState({ playingStatus: "playing" });
        } else if (!status.isPlaying && this.state.playingStatus === "playing") {
          this.setState({ playingStatus: "donepause" });
        }
        if(status.isLoaded && status.durationMillis == status.positionMillis) {
            this.stopAsync();
            this.sound = null;
            this.setState({
                playingStatus: "nosound",
                url: null
            })
        }

         
      };

    _pauseAndPlayRecording = async () => {
    if (this.sound != null) {
        if (this.state.playingStatus == 'playing') {
        console.log('pausing...');
        await this.sound.pauseAsync();
        console.log('paused!');
        this.setState({
            playingStatus: 'donepause',
        });
        } else {
        console.log('playing...');
        await this.sound.playAsync();
        console.log('playing!');
        this.setState({
            playingStatus: 'playing',
        });
        }
    }
    }
    
    _playAndPause = async (url) => {
    if(this.state.url === null || this.state.url != url) {
        if(this.sound != null){
            await this.sound.pauseAsync();
        }
        this.sound = null;
        console.log(url)
        this.setState({playingStatus: 'nosound', url: url})
            
    } 
    
    switch (this.state.playingStatus) {
        case 'nosound':
         this._playRecording();
        break;
        case 'donepause':
        case 'playing':
         this._pauseAndPlayRecording();
        break;
    }
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

    componentWillUnmount(){
        if(this.sound != null){
             this.stopAsync();     
        }
        this.sound = null;
        console.log('out ::: ')
    }
    
    stopAsync = async () => {
        try {
          await this.sound.stopAsync();
        } catch (error) {
            console.log(error)
        }
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
                                <View
                                    style={styles.itemStyle} 
                                    >
                                    <View style={styles.textContainer}>
                                        <Text style={styles.text}>  {itemData.item.ARABIC_TEXT} </Text>
                                    </View>
                                    <View style={{   justifyContent: 'flex-start', alignItems: 'flex-start', margin: 3}}>     
                                        <TouchableOpacity 
                                        style={{backgroundColor: '#fff', borderWidth:2, borderColor: '#fff', borderRadius: 400, paddingHorizontal: 9, paddingVertical: 2}}
                                        onPress={() => this._playAndPause(itemData.item.AUDIO)}>
                                            {
                                                (this.state.playingStatus == 'playing' && this.state.url == itemData.item.AUDIO)?
                                                <Ionicons name="md-pause"  size={32} color="#000" /> :
                                                <Ionicons name="md-play"  size={32} color="#000" /> 
                                            }
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