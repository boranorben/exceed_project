$(document).ready(function () {

    var link = "http://158.108.165.223/data/suckceed/";
    var t = 0;
    var s = 0;
    var f = 0;
    var b = 0;
    var front = 0;
    var time = 0;
    var amb = false;
    $.ajax({
        url: link + "front"
    }).done(function (data) {
        front = parseInt(data) - 1;
        distance_front();
        console.log(front);
    })
    var back = 0;
    $.ajax({
        url: link + "back"
    }).done(function (data) {
        back = parseInt(data) - 1;
        distance_back();
        console.log(back);
    })
    var soft_front = 0;
    var soft_back = 0;
    var d_front = 0;
    var d_back = 0;

    $.ajax({
        url: link + "stats"
    }).done(function (data) {
        stats = data;
    })

    var distance_front = function () {
        soft_front = front - (0.15 * front);
    }

    var distance_back = function () {
        soft_back = back - (0.2 * back);
    }




    setInterval(() => {
        var ta = document.getElementById("tb");
        var element = document.getElementById("temp");
        var head = document.getElementById("hd");
        var l = document.getElementById("light");
        $.ajax({
            url: link + "temperature"
        }).done(function (data) {
            var keep = parseInt(data);
            if (keep > 22 && b != 3 && f != 3) {
                $('#temperature').attr('src', 'images/icon/temp-hot.png');
                $('#lighting').attr('src', 'images/icon/lighting-on.png');
                l.innerHTML = "Light is on. Help required immediately!!!";
                head.innerHTML = "DANGER!!! Help required immediately!!!";
                element.innerHTML = "DANGER!!! Your engine is too hot!!!";
                ta.style.backgroundImage = "url('images/danger.jpg')";
                head.style.fontWeight = "900";
                head.style.color = "white";
                t = 3;
            } else {
                $('#temperature').attr('src', 'images/icon/temp.png');
                element.innerHTML = "Temperature is normal.";
                t = 0;
            }
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        var head = document.getElementById("hd");
        var ta = document.getElementById("tb");
        var l = document.getElementById("light");
        if (t == 0 && s == 0 && b == 0 && f == 0) {
            head.style.fontWeight = "9  00";
            head.style.color = "white";
            ta.style.backgroundImage = "url('images/fine.jpg')";
            head.innerHTML = "Everything is safe. You are good to go.";
            $('#lighting').attr('src', 'images/icon/lighting.png');
            l.innerHTML = "Light is off. All is well!!!";
        }
    }, 1000)

    setInterval(() => {
        var element = document.getElementById("sm");
        var head = document.getElementById("hd");
        var ta = document.getElementById("tb");
        var l = document.getElementById("light");
        $.ajax({
            url: link + "smoke"
        }).done(function (data) {
            var keep = parseInt(data);
            if (keep <= 30) {
                s = 0;
                element.innerHTML = "No smoke detected";
                $('#smoke').attr('src', 'images/icon/fire.png');
                $.ajax({
                    url: link + "glass/set/0"
                }).done(function () {
                    console.log("success");
                }).fail(function () {
                    console.log("fail");
                })
            } else if (keep > 30 && f != 2 && b != 2) {
                s = 2;
                element.innerHTML = "DANGER!! Escape from your vehicle now!!!";
                head.innerHTML = "ESCAPE YOUR VEHICLE NOW!!!";
                $('#smoke').attr('src', 'images/icon/fire-red.png');
                $('#lighting').attr('src', 'images/icon/lighting-on.png');
                l.innerHTML = "Light is on. Help required immediately!!!";
                ta.style.backgroundImage = "url('images/danger.jpg')";
                head.style.fontWeight = "900";
                head.style.color = "white";
                $.ajax({
                    url: link + "glass/set/1"
                }).done(function () {
                    console.log("success");
                }).fail(function () {
                    console.log("fail");
                })
            }
        }).fail(function () {
            console.log("failed");
        })
    }, 1000)

    setInterval(() => {
        var head = document.getElementById("hd");
        var ta = document.getElementById("tb");
        var l = document.getElementById("light");
        $.ajax({
            url: link + "front"
        }).done(function (data) {
            var keep = parseInt(data);
            if (keep < front) {
                front = keep;
                d_front = new Date();
                if (keep >= soft_front && s == 0 && t == 0) {
                    f = 1;
                    ta.style.backgroundImage = "url('images/little.jpg')";
                    head.innerHTML = "There has been a small accident!!";
                } else {
                    f = 2;
                    amb = true;
                    head.innerHTML = "Bad accident. Help required immediatelly!!!";
                    ta.style.backgroundImage = "url('images/danger.jpg')";
                    $('#lighting').attr('src', 'images/icon/lighting-on.png');
                    l.innerHTML = "Light is on. Help required immediately!!!";
                }
            }
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        var head = document.getElementById("hd");
        var ta = document.getElementById("tb");
        var l = document.getElementById("light");
        $.ajax({
            url: link + "back"
        }).done(function (data) {
            var keep = parseInt(data);
            if (keep < back) {
                back = parseInt(data);
                d_back = new Date();
                if (keep >= soft_back && s == 0 && t == 0) {
                    b = 1;
                    ta.style.backgroundImage = "url('images/little.jpg')";
                    head.innerHTML = "There has been a small accident!!";
                } else {
                    b = 2;
                    amb = true;
                    head.innerHTML = "Bad accident. Help required immediatelly";
                    ta.style.backgroundImage = "url('images/danger.jpg')";
                    $('#lighting').attr('src', 'images/icon/lighting-on.png');
                    l.innerHTML = "Light is on. Help required immediately!!!";
                }
            }
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        var element = document.getElementById("help");
        if (amb) {
            time++;
            element.innerHTML = "Ambulance is on the way.";
            $('#ambulance').attr('src', 'images/icon/ambulance-otw.png');
        }
        if (time == 10) {
            element.innerHTML = "Ambulance has reached. You are in safe hands now."
            $('#ambulance').attr('src', 'images/icon/ambulance-reached.png');
            $('#lighting').attr('src', 'images/icon/lighting.png');
            time = 0;
            amb = false;
        }
    }, 1000)

    // Get the modal
    var modal = document.getElementById('myModal');

    // Get the button that opens the modal
    var btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    var span = document.getElementsByClassName("close")[0];

    // When the user clicks on the button, open the modal 
    btn.onclick = function () {
        modal.style.display = "block";
    }

    // When the user clicks on <span> (x), close the modal
    span.onclick = function () {
        modal.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});