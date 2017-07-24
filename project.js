$(document).ready(function() {

    var link = "http://158.108.165.223/data/suckceed/";

    setInterval(() => {
        var element = document.getElementById("smoke");
        $.ajax({
            url : link + "smoke"
        }).done(function(data) {
            if(data === "yes") {
                element.innerHTML = "DANGER!!!";    
            } else {
                element.innerHTML = "NORMAL";
            }
        }).fail(function(data) {
            console.log("failed");
        }) 
    },1000)
});