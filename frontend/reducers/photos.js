export default function (photos = [], action) {
    if (action.type == 'savePhoto') {
        console.log("from reducer", action.gender)
        var photosCopy = [...photos, {url : action.url, gender : action.gender, age : action.age}];
        return photosCopy;
    } else {
        return photos;
    }
}