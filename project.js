$(document).ready(function () {

    var link = "http://158.108.165.223/data/suckceed/";
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
        var element = document.getElementById("temperature");
        $.ajax({
            url: link + "temperature"
        }).done(function (data) {
            element.innerHTML = data;
            // console.log("temp");
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        var element = document.getElementById("smoke");
        $.ajax({
            url: link + "smoke"
        }).done(function (data) {
            if (data === "yes") {
                element.innerHTML = "DANGER!!!";
            } else {
                element.innerHTML = "NORMAL";
            }
        }).fail(function () {
            console.log("failed");
        })
    }, 1000)

    setInterval(() => {
        $.ajax({
            url: link + "front"
        }).done(function (data) {
            if (data < front) {
                front = data;
                d_front = new Date();
                if (data >= soft_front) {
                    console.log("soft front");
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
                    console.log("soft back");
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