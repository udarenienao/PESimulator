

function ChangePic() {
    let pic = document.getElementById('instruction');
    let r = /\d+/g;
    let i = Number(pic.src.match(r).pop());
    if (imageExists(`pictures/kitten${i+1}.png`)){
        pic.src = `pictures/kitten${i+1}.png`;
    } else {
        let btn = document.getElementById('next');
        btn.style.visibility = "hidden";
    }
}

function imageExists(image_url){
    let http = new XMLHttpRequest();

    http.open('HEAD', image_url, false);
    http.send();

    return http.status !== 404;

}


