requirejs.config({
    "paths": {
        "jquery": "jquery-2.1.1.min",
        "socketio": 'socket.io',
        "qrcode": 'qrcode.min',
        "phonegap": "phonegap"
    },
    shim: {
        'socketio': {
            exports: 'io'
        },
        "qrcode": {
            exports: 'QRCode'
        },
        "phonegap":{
            exports: 'cordova'
        }
    }
});

requirejs(["jquery", "socketio", "qrcode", "phonegap"], function (jQuery, io, QRCode, cordova) {
    var sUrl = "http://shire.epicnetwork.io:3000";
    jQuery("#receive").click(function () {
        var username = localStorage.getItem("guid");
        if (username == "") {
            alert("enter username");
            return false;
        }
        jQuery("#sends").hide();
        jQuery("#receives").show();
        if (jQuery("#qrcode img").length == 0) {
            var qrcode = new QRCode(document.getElementById("qrcode"), {
                width: 200,
                height: 200
            });
            qrcode.makeCode(username);

        }
        var socket = io(sUrl);
        socket.emit('add username', username);
        socket.on('receive message', function (data) {
            jQuery("#horse").hide();
            jQuery("#result").html(data.amount + " received");
        });
        return false;
    });
    jQuery("#send").click(function () {
        try {
            cordova.plugins.barcodeScanner.scan(
                function (result) {
                    if (result.cancelled) return false;
                    var username = localStorage.getItem("guid");
                    var recipient = result.text;
                    var amount = jQuery("#amount").val();
                    if (username == "") {
                        throw "enter username";
                    }
                    if (recipient == "") {
                        throw "enter recipient";
                    }
                    if (amount == "") {
                        throw "enter amount";
                    }
                    var socket = io(sUrl);
                    socket.emit('add username', username);
                    socket.emit('receive message', {
                        username: username,
                        recipient: recipient,
                        amount: amount
                    });
                    jQuery("#result").html("sent " + amount + " through the epic network to " + recipient);
                    jQuery("#amount").val("");
                },
                function (error) {
                    alert("Scanning failed: " + error);
                }
            );
        } catch (err) {
            alert(err);
            return false;
        }

        return false;
    });

    jQuery("#cancelReceive").click(function () {
        jQuery("#receives").hide();
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
