export default function (videos = [], action) {
   if (action.type == 'saveVideo') {
        var videosCopy = [...videos, {videoUrl : action.videoUrl, thumbnail: action.thumbnailUrl }];
        return videosCopy
    } else {
        return videos;
    }
}