import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ActivityIndicator, ScrollView } from 'react-native'
import { Button, Overlay, Avatar } from 'react-native-elements'
import { Camera } from 'expo-camera';
import { MaterialIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { withNavigationFocus } from 'react-navigation';
import { PinchGestureHandler, State } from "react-native-gesture-handler";
import * as MediaLibrary from 'expo-media-library'
import * as FaceDetector from 'expo-face-detector';
import { connect } from 'react-redux';
import { Audio } from 'expo-av';
import * as VideoThumbnails from 'expo-video-thumbnails';


function SnapScreen(props) {
    const [hasPermission, setHasPermission] = useState(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [flashMode, setFlashMode] = useState(Camera.Constants.FlashMode.off);
    const [visible, setVisible] = useState(false);
    const [zoom, setZoom] = useState(0)
    const [faces, setFaces] = useState([])
    const [onRecord, setOnRecord] = useState(false)
    const [video, setVideo] = useState({});

    var backgroundColor
    if (onRecord === false) {
        backgroundColor = "red"
    } else (
        backgroundColor = "black"
    )

    var camera = useRef(null);
    const faceDetected = ({ faces }) => {
        setFaces(faces);
    }
    var landMarks
    var text
    var nameIcon
    var color
    if (faces.length > 0) {

        if ((faces[0].smilingProbability * 100) > 50) {
            nameIcon = "md-happy"
            color = 'yellow'
        } else {
            color = 'red'
            nameIcon = "md-sad"
        }
        landMarks = <View
            style={{
                position: 'absolute !important',
                left: faces[0].bounds.origin.x,
                top: faces[0].bounds.origin.y,
                borderWidth: 2,
                borderColor: { color },
                width: faces[0].bounds.size.width,
                height: faces[0].bounds.size.height
            }} >
        </View>

        text = <View style={{ position: 'absolute !important', left: faces[0].bounds.origin.x, top: faces[0].bounds.origin.y - 100, }}>
            <Text style={{ fontSize: 30, color: "black" }}>Face Detected ! <Ionicons name={nameIcon} size={30} color={color} /> {Math.floor(faces[0].smilingProbability * 100)} %  </Text>
        </View>
    }

    useEffect(() => {
        (async () => {
            const { status } = await Camera.requestPermissionsAsync();
            const { status1 } = await MediaLibrary.requestPermissionsAsync();
            const { status3 } = await Audio.getPermissionsAsync();
            setHasPermission(status === 'granted');
        })();

    }, []);

    if (hasPermission && props.isFocused) {
        return (
            <View style={{ flex: 1 }}>
                <Camera style={{ flex: 1, justifyContent: "flex-end" }} type={type} flashMode={flashMode} autoFocus={Camera.Constants.AutoFocus.on} ref={ref => (camera = ref)} zoom={zoom}
                    onFacesDetected={faceDetected}
                    faceDetectorSettings={{
                        mode: FaceDetector.Constants.Mode.fast,
                        detectLandmarks: FaceDetector.Constants.Landmarks.all,
                        runClassifications: FaceDetector.Constants.Classifications.all,
                        minDetectionInterval: 100,
                        tracking: true,
                    }}>
                    {text}
                    {landMarks}

                    <Overlay isVisible={visible}>
                        <Text>Loading...</Text>
                        <ActivityIndicator />
                    </Overlay>
                    <View style={{ paddingBottom: 30, display: 'flex', flexDirection: "row", justifyContent: "flex-end", alignSelf: "center" }}>
                        <Button
                            buttonStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }} title="Flip"
                            icon={<Ionicons name="ios-reverse-camera" size={24} color="white" />}
                            onPress={() => {
                                setType(
                                    type == Camera.Constants.Type.back
                                        ? Camera.Constants.Type.front
                                        : Camera.Constants.Type.back
                                );
                            }}>
                        </Button>
                        <Avatar rounded size="medium" overlayContainerStyle={{ justifyContent: "center", backgroundColor: backgroundColor, borderWidth: 5, borderColor: "white" }}
                            onPress={
                                async () => {
                                    if (camera) {
                                        if (onRecord == false) {
                                            console.log("je commence à filmer")
                                            setOnRecord(true)
                                            let newVideo = await camera.recordAsync({ quality: '2160p' })
                                            setVideo(newVideo)
                                        } else {
                                            console.log("j'arrete de filmer")
                                            setOnRecord(false)
                                            await camera.stopRecording()
                                            const thumbnail = await VideoThumbnails.getThumbnailAsync(video.uri, { time: 15000, })
                                            //Envoi de la video sur mon back 
                                            var data = new FormData();
                                            data.append('video', {
                                                uri: video.uri,
                                                type: 'video/mov',
                                                name: 'user_video.mov'
                                            });
                                            data.append('thumbnail', {
                                                uri: thumbnail.uri,
                                                type: 'thumbnail/jpg',
                                                name: 'thumbnail.jpg'
                                            });

                                            var videoFromBack = await fetch("http://172.17.1.83:3000/uploadvideo", {
                                                method: 'post',
                                                body: data
                                            })
                                            var response = await videoFromBack.json();
                                            console.log("response frm back", response)
                                            props.onSubmitVideo(response.resultCloudinary.url, response.miniCloudinary.url)
                                        }
                                    }
                                }
                            } />

                        <Button
                            buttonStyle={{ backgroundColor: "rgba(0, 0, 0, 0)" }} title="Flash"
                            icon={<Ionicons name="ios-flash" size={24} color="white" />}
                            onPress={() => {
                                setFlashMode(
                                    flashMode == Camera.Constants.FlashMode.off
                                        ? Camera.Constants.FlashMode.torch
                                        : Camera.Constants.FlashMode.off
                                );
                            }}>
                        </Button>
                    </View>
                </Camera>

                <Button
                    icon={
                        <MaterialIcons
                            name="camera"
                            size={20}
                            color="#FFFFFF"
                        />
                    }

                    title="Snap"
                    buttonStyle={{ backgroundColor: "#469589" }}
                    type="solid"
                    onPress={
                        async () => {
                            setVisible(true)
                            if (camera) {
                                setFlashMode(Camera.Constants.FlashMode.on)
                                let photo = await camera.takePictureAsync({ quality: 0.7, base64: true, exif: true })
                                const asset = await MediaLibrary.createAssetAsync(photo.uri);

                                //Envoi de la photo sur mon back 
                                var data = new FormData();

                                data.append('avatar', {
                                    uri: photo.uri,
                                    type: 'image/jpeg',
                                    name: 'user_avatar.jpg',
                                });

                                var PhotoFromBack = await fetch("http://172.17.1.83:3000/upload", {
                                    method: 'post',
                                    body: data
                                })
                                var response = await PhotoFromBack.json();
                                props.onSubmitPhoto(response.resultCloudinary.url, response.gender, response.age)
                                setVisible(false)
                            }
                        }
                    }
                />
            </View>
        )
    }
    else {
        return <View style={{ flex: 1 }} />;
    }
}


const snapScreen = withNavigationFocus(SnapScreen)
function mapDispatchToProps(dispatch) {
    return {
        onSubmitPhoto: function (url, gender, age) {
            dispatch({ type: 'savePhoto', url: url, gender: gender, age : age })
        },
        onSubmitVideo: function (videoUrl, thumbnailUrl) {
            dispatch({ type: 'saveVideo', videoUrl: videoUrl, thumbnailUrl: thumbnailUrl })
        }
    }
}

export default connect(
    null,
    mapDispatchToProps
)(snapScreen);