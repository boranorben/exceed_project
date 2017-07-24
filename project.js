$(document).ready(function () {

    var link = "http://158.108.165.223/data/suckceed/";
    var t = 0;
    var s = 0;
    var f = 0;
    var b = 0;
    var front = 0;
    var time = 0;
    var amb = false;
    var smallModal_closed = false;
    var hardModal_closed = false;
    var smallModal = document.getElementById('smallModal');
    var yesbtn_s = document.getElementById("yesbtn_s");
    var nobtn_s = document.getElementById("nobtn_s");
    var hardModal = document.getElementById('hardModal');
    var yesbtn_h = document.getElementById("yesbtn_h");
    var nobtn_h = document.getElementById("nobtn_h");

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
                $.ajax({
                    url: link + "led/set/1"
                })
                l.innerHTML = "Light is on. Help required immediately!!!";
                head.innerHTML = "DANGER!!! Help required immediately!!!";
                element.innerHTML = "DANGER!!! Your engine is too hot!!!";
                ta.style.backgroundImage = "url('images/danger.jpg')";
                head.style.fontWeight = "900";
                head.style.color = "white";
                t = 3;
                if (!hardModal_closed) {
                    hardModal.style.display = "block";
                    setTimeout(function () {
                        hardModal.style.display = "none";
                    }, 5000);
                    hardModal_closed = true;
                }
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
            $.ajax({
                url: link + "led/set/0"
            })
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
                    url: link + "servo/set/0"
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
                $.ajax({
                    url: link + "led/set/1"
                })
                $.ajax({
                    url: link + "servo/set/1"
                })
                l.innerHTML = "Light is on. Help required immediately!!!";
                ta.style.backgroundImage = "url('images/danger.jpg')";
                head.style.fontWeight = "900";
                head.style.color = "white";
                if (!hardModal_closed) {
                    hardModal.style.display = "block";
                    setTimeout(function () {
                        hardModal.style.display = "none";
                    }, 5000);
                    hardModal_closed = true;
                }
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
                    if (!smallModal_closed) {
                        smallModal.style.display = "block";
                        smallModal_closed = true;
                        setTimeout(function () {
                            smallModal.style.display = "none";
                        }, 5000);
                    }
                } else {
                    f = 2;
                    amb = true;
                    head.innerHTML = "Bad accident. Help required immediatelly!!!";
                    ta.style.backgroundImage = "url('images/danger.jpg')";
                    $('#lighting').attr('src', 'images/icon/lighting-on.png');
                    $.ajax({
                        url: link + "led/set/1"
                    })
                    l.innerHTML = "Light is on. Help required immediately!!!";
                    if (!hardModal_closed) {
                        hardModal.style.display = "block";
                        setTimeout(function () {
                            hardModal.style.display = "none";
                        }, 5000);
                        hardModal_closed = true;
                    }
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
                    if (!smallModal_closed) {
                        smallModal.style.display = "block";
                        smallModal_closed = true;
                        setTimeout(function () {
                            smallModal.style.display = "none";
                        }, 5000);
                    }
                } else {
                    b = 2;
                    amb = true;
                    head.innerHTML = "Bad accident. Help required immediatelly";
                    ta.style.backgroundImage = "url('images/danger.jpg')";
                    $('#lighting').attr('src', 'images/icon/lighting-on.png');
                    $.ajax({
                        url: link + "led/set/1"
                    })
                    l.innerHTML = "Light is on. Help required immediately!!!";
                    if (!hardModal_closed) {
                        hardModal.style.display = "block";
                        setTimeout(function () {
                            hardModal.style.display = "none";
                        }, 5000);
                        hardModal_closed = true;
                    }
                }
            }
        }).fail(function () {
            console.log("fail");
        })
    }, 1000)

    setInterval(() => {
        var element = document.getElementById("help");
        var l = document.getElementById("light");
        if (amb) {
            time++;
            element.innerHTML = "Ambulance is on the way.";
            $('#ambulance').attr('src', 'images/icon/ambulance-otw.png');
        }
        if (time == 10) {
            element.innerHTML = "Ambulance has reached. You are in safe hands now."
            $('#ambulance').attr('src', 'images/icon/ambulance-reached.png');
            $.ajax({
                url: link + "led/set/0"
            })
            b = 0;
            f = 0;
            $('#lighting').attr('src', 'images/icon/lighting.png');
            l.innerHTML = "Light is off. All is well!!!";
            time = 0;
            amb = false;
        }
    }, 1000)

    yesbtn_s.onclick = function () {
        smallModal.style.display = "none";
        amb = true;
    }
    nobtn_s.onclick = function () {
        smallModal.style.display = "none";
        amb = false;
    }

    yesbtn_h.onclick = function () {
        smallModal.style.display = "none";
    }
    nobtn_h.onclick = function () {
        smallModal.style.display = "none";
    yesbtn.onclick = function () {
        modal.style.display = "none";
        amb = true;
    }
    nobtn.onclick = function () {
        modal.style.display = "none";
        amb = false;
    }

});