(function ($) {


    var cs = document.getElementById("c-segments"), csctx, size;
    var c = document.getElementById("c-input"), ctx;
    var layersContainer = document.getElementById("layers-container");
    var cc, ccctx; //The current canvas and context.
    var segments; //current number of segments for this layer.
    var $segmentInput = $("#segment-input");
    var newLayerButton = document.getElementById('new-layer-button');
    var prevX, prevY, currX, currY, flag = false, dot_flag = false;
    var layers = [], currentLayer;



    function init() {
        var canvasContainer = $('#canvas-container');
        var wWidth = canvasContainer.width();
        var wHeight = canvasContainer.height()-$('#header').height();
        size = Math.min(wWidth, wHeight)-16;
        cs.width = c.width = size;
        cs.height = c.height = size;
        csctx = cs.getContext('2d');
        ctx = c.getContext('2d');
        ctx.lineWidth = 2;
        newLayer(8);
        changeToLayer(0);
        startListeners();
    }

    function changeToLayer(layerIndex) {
        ctx.clearRect(0, 0, size, size);
        currentLayer = layerIndex;
        segments = layers[layerIndex].segments;
        cc = layers[layerIndex];
        ccctx = cc.getContext('2d');
        updateLayersContainer();
        drawSegments();
    }

    function newLayer(segmentCount) {
        var newCanvas = document.createElement('canvas');
        newCanvas.id = (new Date()).getTime();
        newCanvas.width = size;
        newCanvas.height = size;
        newCanvas.segments = segmentCount;
        layers.push(newCanvas);
        $(c).before(newCanvas);
        updateLayersContainer();
        changeToLayer(layers.length-1);
    }

    function updateLayersContainer(){
        layersContainer = $('#layers-container');
        layersContainer.html("");
        for (var i=0; i<layers.length; i++) {
            layersContainer.append(layers[i].id+"\n");
        }
    }

    function drawSegments() {

        csctx.save();
        csctx.clearRect(0, 0, size, size);
        csctx.strokeStyle = "#D3D3D3";
        csctx.beginPath();
        csctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
        csctx.stroke();

        var x, y;
        for (var i = 0; i < segments; i++) {
            csctx.beginPath();
            csctx.moveTo(size / 2, size / 2);
            x = size / 2 * Math.cos(2 * Math.PI / segments * i) + size / 2;
            y = size / 2 * Math.sin(2 * Math.PI / segments * i) + size / 2;
            csctx.lineTo(x, y);
            csctx.stroke()
        }
        csctx.restore();
    }

    function startListeners() {
        $(c).on("mousemove mousedown mouseup mouseout", function (e) {
            canvasEvent(e)
        });

        $(newLayerButton).on('click', function (e) {
            var num = $segmentInput.val();
            newLayer(num);
        })
    }


    function getCanvasPos(e) {

        var mouseX = e.clientX + window.pageXOffset;
        var mouseY = e.clientY + window.pageYOffset;

        var _x = c.offsetLeft;
        var _y = c.offsetTop;
        var parent = c;
        while(parent = parent.offsetParent) {
            _x += parent.offsetLeft - parent.scrollLeft;
            _y += parent.offsetTop - parent.scrollTop;
        }

        return {
            x : mouseX-_x,
            y : mouseY-_y
        }
    }


    //props: http://stackoverflow.com/a/8398189
    function canvasEvent(e) {
        var pos;
        switch (e.type) {
            case "mousedown":
                prevX = currX;
                prevY = currY;
                pos = getCanvasPos(e);
                currX=  pos.x;
                currY=  pos.y;
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
                    pos = getCanvasPos(e);
                    currX=  pos.x;
                    currY=  pos.y;
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

        ccctx.save();
        ccctx.clearRect(0, 0, size, size); //prevents anti-aliasing/opacity visual issues.
        ccctx.translate(size / 2, size / 2);
        for (var i = 0; i < cc.segments; i++) {
            console.log(size);
            ccctx.rotate(Math.PI * 2 / cc.segments);
            ccctx.drawImage(c, 0, 0, size, size, -size / 2, -size / 2, size, size);
        }
        ccctx.restore();
    }

    init();

}(jQuery));