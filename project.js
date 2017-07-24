$(document).ready(function () {

    var link = "http://158.108.165.223/data/suckceed/";
    var t = 0;
    var s = 0;
    var f = 0;
    var b = 0;
    var front = 21;
    $.ajax({
        url: link + "front"
    }).done(function (data) {
        front = data;
        console.log(front);
    })
    var back = 22;
    $.ajax({
        url: link + "back"
    }).done(function (data) {
        back = data;
        console.log(back);
    })
    var soft_front = 0;
    var medium_front = 0;
    var soft_back = 0;
    var d_front = 0;
    var d_back = 0;
    var stats = 0;

    $.ajax({
        url: link + "stats"
    }).done(function (data) {
        stats = data;
    })

    var distance_front = function () {
        soft_front = front - (0.05 * front);
        medium_front = front - (0.1 * front);
    }

    var distance_back = function () {
        soft_back = back - (0.2 * back);
    }

    distance_front();
    distance_back();

    setInterval(() => {
        var t = document.getElementById("tb");
        var element = document.getElementById("temp");
        var head = document.getElementById("hd");
        $.ajax({
            url: link + "temperature"
        }).done(function (data) {
            if (data > 110 && b != 3 && f != 3) {
                stats++;
                $('#temperature').attr('src', 'images/icon/temp-hot.png');
                $('#lighting').attr('src', 'images/icon/lighting-on.png');
                element.innerHTML = "DANGER!!! Your engine is too hot!!!";
                t.style.backgroundColor = "#e74c3c";
                head.style.fontWeight = "900";
                head.style.color = "white";
                t = 3;
            } else {
                $('#temperature').attr('src', 'images/icon/temp.png');
                t = 0;
            }
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        var head = document.getElementById("hd");
        var ta = document.getElementById("tb");
        if (t == 0 && s == 0 && b == 0 && f == 0) {
            head.style.fontWeight = "100";
            head.style.color = "black";
            ta.style.backgroundColor = "#1abc9c";
            head.innerHTML = "Everything is safe. You are good to go.";
            $('#lighting').attr('src', 'images/icon/lighting.png');
        }
    }, 1000)

    setInterval(() => {
        var element = document.getElementById("sm");
        var head = document.getElementById("hd");
        var ta = document.getElementById("tb");
        $.ajax({
            url: link + "smoke"
        }).done(function (data) {
            if (data <= 380 && data >= 340) {
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
            } else if (f != 2 && b != 2) {
                stats++;
                s = 2;
                element.innerHTML = "DANGER!! Escape from your vehicle now!!!";
                head.innerHTML = "ESCAPE YOUR VEHICLE NOW!!!";
                $('#smoke').attr('src', 'images/icon/fire-red.png');
                $('#lighting').attr('src', 'images/icon/lighting-on.png');
                head.style.fontWeight = "900";
                head.style.color = "white";
                ta.style.backgroundColor = "#e74c3c";
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
        $.ajax({
            url: link + "front"
        }).done(function (data) {
            console.log("soft" + soft_front);
            console.log(data);
            if (data < front) {
                front = data;
                d_front = new Date();
                if (data >= soft_front && s == 0 && t == 0) {
                    f = 1;
                    ta.style.backgroundColor = "#f39c12";
                    head.innerHTML = "There has been a small accident!!";
                } else {
                    f = 2;
                    ta.style.backgroundColor = "#e74c3c";
                    head.innerHTML = "Bad accident. Help required immediatelly!!!";
                    $('#lighting').attr('src', 'images/icon/lighting-on.png');
                }
                distance_front();
            }
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        var head = document.getElementById("hd");
        var ta = document.getElementById("tb");
        $.ajax({
            url: link + "back"
        }).done(function (data) {
            console.log("back" + soft_back);
            console.log(data);
            if (data < back) {
                back = data;
                d_back = new Date();
                if (data >= soft_back && s == 0 && t == 0) {
                    b = 1;
                    ta.style.backgroundColor = "#f39c12";
                    head.innerHTML = "There has been a small accident!!";
                } else {
                    b = 2;
                    ta.style.backgroundColor = "#e74c3c";
                    head.innerHTML = "Bad accident. Help required immediatelly";
                    $('#lighting').attr('src', 'images/icon/lighting-on.png');
                }
                distance_back();
            }
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        var diff;
        if (d_back != 0 && d_front != 0) {
            if (d_back.getMinutes() == d_front.getMinutes()) {
                diff = Math.abs(d_back.getSeconds() - d_front.getSeconds());
                if (diff <= 10) {
                    stats++;
                }
            } else if (Math.abs(d_back.getMinutes() - d_front.getMinutes()) == 1) {
                if (d_back.getMinutes() > d_front.getMinutes()) {
                    diff = d_back.getSeconds() + (60 - d_front.getSeconds());
                } else {
                    diff = d_front.getSeconds() + (60 - d_back.getSeconds());
                }
                if (diff <= 10) {
                    stats++;
                }
            }
            var element = document.getElementById("stats");
            element.innerHTML = stats;
        }
        d_back = 0;
        d_front = 0;
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