// XHR2/FormData
function xhr(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200) {
            callback(request.responseText);
        }
    };

    request.open('POST', url);

    var formData = new FormData();
    formData.append('file', data);
    request.send(formData);
}

// generating random string
function generateRandomString() {
    if (window.crypto) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
            token = '';
        for (var i = 0, l = a.length; i < l; i++) token += a[i].toString(36);
        return token;
    } else {
        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    }
}

function StartCapture() {
    var recorder = new CanvasRecorder(document.body, { disableLogs: true, useWhammyRecorder: true });
    recorder.record();

    window.setTimeout(StopCapture(recorder), 20000);
}

function StopCapture(recorder) {
    recorder.stop(async function(blob) {
        var fileName = generateRandomString() + '.webm';
        var file = new File([blob], fileName, {
            type: 'video/webm'
        });
        await xhr('/uploadFile', file, function(responseText) {
            var fileURL = JSON.parse(responseText).fileURL;

            console.info('fileURL', fileURL);
        });
        await browser.close()
    });
}
