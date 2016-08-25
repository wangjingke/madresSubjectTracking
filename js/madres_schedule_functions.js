function uploadRedCap(inputFile) {
    var fileUpload = document.getElementById(inputFile);
    var regex = /^([a-zA-Z0-9\s_\\.\-:])+(.csv|.txt)$/;
    if (regex.test(fileUpload.value.toLowerCase())) {
        if (typeof (FileReader) != "undefined") {
            var reader = new FileReader();
            reader.readAsText(fileUpload.files[0]);
            reader.onload = loadHandler;
            function loadHandler(event) {
                var csv = event.target.result;
                redCap = Papa.parse(csv);
            }
        } else {
            alert("This browser does not support HTML5.");
        }
    } else {
        alert("Please upload a valid CSV file.");
    }
    document.getElementById("process").disabled = false;
}

function callRedCap() {
    var encryptedToken = "o5egwyqO6ET5tuMDL/xqj4paDa5nbPTXl3e7y+/QHsZfp/C/GAYQeKeQwVPHm5ha";
    var password = document.getElementById("password").value;
    var token = decipher(encryptedToken, password);
    var parameters = {
        "token": token,
        "content": "report",
        "format": "json",
        "report_id": 4462
    };

    $.ajax({
        url: "https://redcap.sc-ctsi.org/api/",
        type: "POST",
        dataType: "json",
        data: parameters
    }).done(function(data){
        redCap = objectToArray(data);
    });

    function getKeys(obj) {
        var keys = [];
        for(var key in obj){
            if (obj.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    }

    function decipher(encryptedString, password) {
        var key = CryptoJS.enc.Utf8.parse(password);
        var decrypted = CryptoJS.AES.decrypt(encryptedString, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return decrypted.toString(CryptoJS.enc.Utf8);
    }

    function encipher(rawString, password) {
        var key = CryptoJS.enc.Utf8.parse(password);
        var encrypted = CryptoJS.AES.encrypt(rawString, key, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
        });
        return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    }

    function objectToArray(object) {
        // var properties = Object.keys(object[0]);
        var properties = getKeys(object[0]);
        var outputArray = {data: [properties]};
        for (var i = 0; i < object.length; i++) {
            var arrayX = [];
            for (var key in object[i]) {
                if (object[i].hasOwnProperty(key)) {
                    arrayX.push(object[i][key]);
                }
            }
            outputArray.data.push(arrayX);
        }
        return outputArray;
    }
    document.getElementById("process").disabled = false;
}

function getAllIndexes(arr, val) {
    var indexes = [];
    for(var j = 0; j < arr.length; j++) {
        if (arr[j] === val) {indexes.push(j)};
    }
    return indexes;
}

Date.prototype.addDays=function(d){return new Date(this.valueOf()+864E5*d)};
function countDay(day, num) {
    var dayString = day.split("-");
    dayDate = new Date(dayString[0], dayString[1]-1, dayString[2]); // year, month, day
    predict = new Date(dayDate.addDays(num));
    return predict;
}

function dateCut(x) {
    return(x.getFullYear()+"-"+(x.getMonth()+1)+"-"+x.getDate());
}

function unique(list) {
  var result = [];
  $.each(list, function(j, e) {
    if ($.inArray(e, result) == -1) result.push(e);
  });
  return result;
}

function gestationalAge(day, dueDate) {
    for(var i = 0; i <= 281; i++) {
        dayX = countDay(dueDate, i-280);
        if (dateCut(dayX)==dateCut(day)) {
            return(Math.floor(i/7) + "w" + i%7 + "d");
            break;
        }
    }
    return("Out of range")
}

function arrayGrow(length) {
	var empty = [];
	for (var i = 0; i < length; i++) { // local counter
		empty.push("");
	}
	return empty;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}
