(function ($) {


    var bc = document.getElementById("backgroundCanvas"), bctx;
    var mc = document.getElementById("mainCanvas"), mctx, size;
    var c = document.getElementById("drawingCanvas"), ctx;
    var $segmentInput = $("#segment-input"), segmentCount;

    var prevX, prevY, currX, currY, flag = false, dot_flag = false;


    function initCanvas() {
        var wWidth = $(window).width();
        var wHeight = $(window).height();
        size = Math.min(wWidth, wHeight) - 10;
        c.width  = mc.width  = bc.width  = size;
        c.height = mc.height = bc.height = size;
        ctx = c.getContext('2d');
        mctx = mc.getContext('2d');
        bctx = bc.getContext('2d');
        readSegments();
        ctx.lineWidth = 2;
    }

    function readSegments() {
        segmentCount = parseInt($segmentInput.val());

        bctx.save();
        bctx.clearRect(0, 0, size, size);
        bctx.strokeStyle = "#D3D3D3";
        bctx.beginPath();
        bctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        bctx.stroke();
        bctx.restore();

        drawSegments();
    }

    function drawSegments() {
        bctx.save();
        bctx.strokeStyle = "#D3D3D3";

        var x, y;
        for (var i = 0; i < segmentCount; i++) {
            bctx.beginPath();
            bctx.moveTo(size / 2, size / 2);
            x = size / 2 * Math.cos(2 * Math.PI / segmentCount * i) + size / 2;
            y = size / 2 * Math.sin(2 * Math.PI / segmentCount * i) + size / 2;
            bctx.lineTo(x, y);
            bctx.stroke()
        }
        bctx.restore();
    }

    function startListeners() {
        $(c).on("mousemove mousedown mouseup mouseout", function (e) {
            canvasEvent(e)
        });

        $segmentInput.on('change', function () {
            readSegments();
            ctx.clearRect(0,0,size,size);
        })
    }

    //props: http://stackoverflow.com/a/8398189
    function canvasEvent(e) {
        switch (e.type) {
            case "mousedown":
                prevX = currX;
                prevY = currY;
                currX = e.clientX - c.offsetLeft;
                currY = e.clientY - c.offsetTop;
                flag = true;
                dot_flag = true;
                if (dot_flag) {
                    ctx.fillRect(currX, currY, ctx.lineWidth, ctx.lineWidth);
                    revolve();
                    dot_flag = false;
                }
                break;
            case "mouseup":
            case "mouseout":
                flag = false;
                break;
            case "mousemove":
                if (flag) {
                    prevX = currX;
                    prevY = currY;
                    currX = e.clientX - c.offsetLeft;
                    currY = e.clientY - c.offsetTop;
                    ctx.beginPath();
                    ctx.moveTo(prevX, prevY);
                    ctx.lineTo(currX, currY);
                    ctx.stroke();
                    ctx.closePath();
                    revolve();
                }
                break;
            default:
                break;
        }
    }

    function revolve() {
        mctx.save();
        mctx.translate(size / 2, size / 2);
        for (var i = 0; i < segmentCount; i++) {
            mctx.rotate(Math.PI * 2 / segmentCount);
            mctx.drawImage(c, 0, 0, size, size, -size / 2, -size / 2, size, size);
        }
        mctx.restore();
    }

    initCanvas();
    startListeners();

}(jQuery));