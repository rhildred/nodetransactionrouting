requirejs.config({
    "paths": {
        "jquery": "//ajax.googleapis.com/ajax/libs/jquery/2.0.0/jquery.min",
        "socketio": '/socket.io/socket.io',
        "qrcode": 'qrcode.min'
    },
    shim: {
        'socketio': {
            exports: 'io'
        },
        "qrcode": {
            exports: 'QRCode'
        }
    }
});

requirejs(["jquery", "socketio", "qrcode"], function (jQuery, io, QRCode) {
    jQuery("#receive").click(function () {
        var username = localStorage.getItem("guid");
        if (username == "") {
            alert("enter username");
            return false;
        }
        jQuery("#sends").hide();
        jQuery("#receives").show();
        if(jQuery("#qrcode img").length == 0){
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width: 200,
                height: 200
            });
            qrcode.makeCode(username);

        }
        var socket = io();
        socket.emit('add username', username);
        socket.on('receive message', function (data) {
            jQuery("#horse").hide();
            jQuery("#result").html(data.amount + " received");
        });
        return false;
    });
    jQuery("#submit").click(function () {
        var username = localStorage.getItem("guid");
        var recipient = jQuery("#recipient").val();
        var amount = jQuery("#amount").val();
        if (username == "") {
            alert("enter username");
            return false;
        }
        if (recipient == "") {
            alert("enter recipient");
            return false;
        }
        if (amount == "") {
            alert("enter amount");
            return false;
        }
        var socket = io();
        socket.emit('add username', username);
        socket.emit('receive message', {
            username: username,
            recipient: recipient,
            amount: amount
        });
        return false;
    });
    jQuery("#send").click(function () {
        jQuery("#sends").show();
        jQuery("#receives").hide();
        return false;
    });
    jQuery("#cancelReceive").click(function () {
        jQuery("#receives").hide();
        return false;
    });
    jQuery("#cancelSend").click(function () {
        jQuery("#sends").hide();
        return false;
    });

    function generateUUID() {
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
        return uuid;
    };

    jQuery("#signup").submit(function () {
        var sGuid = generateUUID();
        localStorage.setItem("guid", sGuid);
        jQuery("#signup").hide();
        jQuery("#sendReceive").show();
        jQuery("#username").html(localStorage.getItem("guid"));
        return false;
    });

    if (null != localStorage.getItem("guid")) {
        jQuery("#signup").hide();
        jQuery("#sendReceive").show();
        jQuery("#username").html(localStorage.getItem("guid"));
    }
});
