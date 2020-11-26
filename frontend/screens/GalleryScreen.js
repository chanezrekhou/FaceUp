import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, Text } from 'react-native';
import { Badge, Card } from 'react-native-elements'
import { connect } from 'react-redux';


function GalleryScreen(props) {
    console.log(window.console)

    var photos = props.photos
    console.log(photos.gender)
    var photoCard
    if (photos) {
         photoCard = photos.map((element, i) => {
        return (
            <Card image={{uri: element.url}} style={{ width: 315, height: 200 }}  >
                <View style={{ marginTop: 10 }}>
                    <Badge value={element.gender} status="warning" />
                    <Badge value={element.age} status="warning" />
                </View>
            </Card>
        )
    })
    }

    return (
        <ScrollView style={{ flex: 1, marginTop: 30 }}>
            <Text style={{ textAlign: 'center', fontSize: 30, marginTop: 30 }}>My Gallery</Text>
            {photoCard}
        </ScrollView>
    )
}


function mapStateToProps(state) {
    return { photos: state.photos }
}

export default connect(
    mapStateToProps,
    null
)(GalleryScreen);
