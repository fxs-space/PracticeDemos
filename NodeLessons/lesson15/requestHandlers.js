

var exec = require('child_process').exec;
var queryString = require('querystring');
var fs = require('fs');
var formidable = require('formidable');

function start(response, postData) {
    console.log('Request handler "start" was called.');

    /**
     * 阻塞与非阻塞
     */
    // function sleep(milliSeconds) {
    //     var startTime = new Date().getTime();
    //     while (new Date().getTime() < startTime + milliSeconds);
    // }

    // sleep(10000);

    // var content = "empty";
    // exec('ls-lah', function (error, stdout, stderr) {
    //     content = stdout;
    // });

    // return "Hello Start";

    // exec('find /', {timeout: 10000, maxBuffer: 20000*1024}, function (error, stdout, stderr) {
    //     response.writeHead(200, {"Content-Type": "text/plain"});
    //     response.write(stdout);
    //     response.end();
    // });


    var body = '<html>' +
        '<head>' +
        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />' +
        '</head>' +
        '<body>' +
        '<form action="/upload" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="upload" multiple="multiple"/>' +
        '<input type="submit" value="Upload file" />' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(body);
    response.end();
}


function upload(response, request, postData) {
    console.log('Request handler "upload" was called.');

    var form = new formidable.IncomingForm();
    console.log("about to parse");
    form.parse(request, function (error, fields, files) {
        console.log("parsing done");
        fs.renameSync(files.upload.path, "/tmp/test.png");

        response.writeHead(200, {"Content-Type": "text/html"});
        // response.write("You've sent the text: " + queryString.parse(postData).text);

        response.write("received image:<br/>");
        response.write("<img src='/show' />");
        response.end();
    });

    // return "Hello Upload";
}

function show(response, postData) {
    console.log("Request handler 'show' was called." );

    fs.readFile("/tmp/test.png", "binary", function (error, file) {
        if (error) {
            response.writeHead(500, {"Content-Type": "text/plain"});
            response.write(error + '\n');
            response.end();
        } else {
            response.writeHead(200, {"Content-Type": "image/png"});
            response.write(file, "binary");
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;