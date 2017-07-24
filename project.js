$(document).ready(function () {

    var link = "http://158.108.165.223/data/suckceed/";
    var t = true;
    var s = true;
    var f = true;
    var b = true;
    var front = 0;
    var back = 0;
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
        $.ajax({
            url: link + "front"
        }).done(function (data) {
            front = data;
            soft_front = data - (0.05 * data);
            medium_front = data - (0.1 * data);
        }).fail(function () {
            console.log("fail");
        })
    }

    var distance_back = function () {
        $.ajax({
            url: link + "back"
        }).done(function (data) {
            back = data;
            soft_back = data - (0.2 * data);
        }).fail(function () {
            console.log("fail");
        })
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
            if (data > 110) {
                $('#temperature').attr('src', 'images/icon/temp-red.png');
                element.innerHTML = "DANGER!!! Your engine is too hot!!!";
                t.style.backgroundColor = "#e74c3c"; 
                head.style.fontWeight = "900";
                head.style.color = "white";
                t = false;
            } else {
                $('#temperature').attr('src', 'images/icon/temp.png');
                t = true;
            }
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        if(t && s && b && f) {
            head.style.fontWeight = "100";
            head.style.color = "black";
            ta.style.backgroundColor = "#1abc9c";
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
                s = true;
                element.innerHTML = "No smoke detected";
                $('#smoke').attr('src', 'images/icon/fire.png');                
                $.ajax({
                    url: link + "glass/set/0"
                }).done(function () {
                    console.log("success");
                }).fail(function () {
                    console.log("fail");
                })
            } else {
                s = false;
                element.innerHTML = "DANGER!! Escape from your vehicle now!!!";
                head.innerHTML = "ESCAPE YOUR VEHICLE NOW!!!";
                $('#smoke').attr('src', 'images/icon/fire-red.png');
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
            if (data < front) {
                front = data;
                d_front = new Date();
                if (data >= soft_front) {
                    f = false;
                    ta.style.backgroundColor = "#f39c12"; 
                    head.innerHTML = "There has been a small accident!!";
                } else if (data >= medium_front) {
                    console.log("medium");
                } else {
                    console.log("hard front");
                }
            }
            console.log(front);
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        $.ajax({
            url: link + "back"
        }).done(function (data) {
            if (data < back) {
                back = data;
                d_back = new Date();
                if (data >= soft_back) {
                    back = false;

                } else {
                    console.log("hard back");
                }
            }
            console.log(back);
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
    }, 30000)
});