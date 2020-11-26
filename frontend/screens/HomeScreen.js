import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground } from 'react-native';
import { Button, Input } from 'react-native-elements'
import Icon from 'react-native-vector-icons/FontAwesome';


function HomeScreen({navigation}) {
    const [pseudo, setPseudo] = useState('');
  
    return (
        <ImageBackground source={require('../assets/home.jpg')} style={styles.container}>

        <Input
          containerStyle={{ marginBottom: 25, width: '70%' }}
          inputStyle={{ marginLeft: 10 }}
          placeholder='John'
          leftIcon={
            <Icon
              name='user'
              size={24}
              color="#469589"
            />
          }
          onChangeText={(val) => setPseudo(val)}
        />
        <Button  onPress={() => {navigation.navigate('GalleryScreen') }} buttonStyle={{ backgroundColor: "#469589" }} title="Go to Gallery" type="solid" containerStyle={{ backgroundColor: '#469589' }}/>

      </ImageBackground>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
  });


export default HomeScreen