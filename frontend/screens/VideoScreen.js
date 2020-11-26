import React, { useState, useEffect } from 'react';
import { ScrollView, View, Image, Text, TouchableOpacity } from 'react-native';
import { Badge, Card, Overlay } from 'react-native-elements'
import { connect } from 'react-redux';
import { Video } from 'expo-av';

function VideoScreen(props) {
    const [visible, setVisible] = useState(false);

    var videos = props.videos
    console.log(videos)

    var videoCard
    if (videos) {
        videoCard = videos.map((element, i) => {
            return (
                <TouchableOpacity onPress={() => { console.log("hello"); setVisible(!visible) }} >
                    <Card image={{ uri: element.thumbnail }} style={{ width: 315, height: 200 }}  >
                        <View style={{ marginTop: 10 }}>
                            <Badge value="Tag 1" status="warning" />
                            <Badge value="Tag 1" status="warning" />
                            <Badge value="Tag 1" status="warning" />
                        </View>
                        <Overlay isVisible={visible} onBackdropPress={() => { setVisible(false) }}>
                            <Video
                                source={{ uri: element.videoUrl }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                shouldPlay
                                isLooping
                                style={{ width: 300, height: 300 }}
                            />

                        </Overlay>
                    </Card>
                </TouchableOpacity>
            )
        })
    }

    return (
        <ScrollView style={{ flex: 1, marginTop: 30 }}>
            <Text style={{ textAlign: 'center', fontSize: 30, marginTop: 30 }}>My Gallery</Text>
            {videoCard}
        </ScrollView>
    )
}


function mapStateToProps(state) {
    return { videos: state.videos }
}

export default connect(
    mapStateToProps,
    null
)(VideoScreen);
