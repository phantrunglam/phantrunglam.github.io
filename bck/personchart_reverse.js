var boxIndexUnderPosition = -1;
var currentScale = 0.5;
var targetScale = 1.0;
var currentAlpha = 0.0;
var targetAlpha = 1.0;
var lastTime;
var firstFrame = true;
var canvas;
var context;
var maleBoxColor = '#EECCAA';
var lighterMaleBoxColor;
var femaleBoxColor = '#CCEEAA';
var lighterFemaleBoxColor;
var unknownGenderBoxColor;
var lighterUnknownGenderBoxColor;
var linesColor = '#504000';
var animateInterval;

// Hàm đảo ngược tọa độ ngang
function flipHorizontalCoordinates() {
    var canvasWidth = canvas.width / (window.devicePixelRatio || 1);
    personChartData.forEach(box => {
        box.left = canvasWidth - box.left - box.width;
    });
}

function initPersonChart() {
    canvas = document.getElementById('person_chart_canvas_id');
    
    if (canvas.getContext) {
        context = canvas.getContext('2d');
    }
    else {
        alert('Canvas not supported on this browser!');
    }
    
    // Đảo tọa độ trước khi vẽ
    flipHorizontalCoordinates();
    
    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("touchstart", touchStart, false);
    canvas.addEventListener("touchmove", touchMove, true);
    
    retinaSupport();
    
    lighterMaleBoxColor = lighterHexColor(maleBoxColor, 0);
    lighterFemaleBoxColor = lighterHexColor(femaleBoxColor, 0);
    
    unknownGenderBoxColor = '#DDD';
    lighterUnknownGenderBoxColor = lighterHexColor(unknownGenderBoxColor, 0);
    
    lastDate = new Date();
    currentScale = 0.5;
    targetScale = 1.0;
    animateInterval = setInterval(animate, 50);
}

// ... (giữ nguyên các hàm retinaSupport, animate, drawPersonChart, drawBoxForPerson)

function drawLinesForBox(box) {
    // Đường nối đến con (sang phải)
    for (var i = 0; i < box.childBoxIndexes.length; i++) {
        var index = box.childBoxIndexes[i];
        context.beginPath();
        context.moveTo(box.left + box.width, box.top + box.height / 2.0);
        context.lineTo(
            personChartData[index].left,
            personChartData[index].top + personChartData[index].height / 2.0
        );
        context.strokeStyle = linesColor;
        context.stroke();
    }

    // Đường nối đến tổ tiên (sang trái)
    for (var i = 0; i < box.ancestorBoxIndexes.length; i++) {
        var index = box.ancestorBoxIndexes[i];
        context.beginPath();
        context.moveTo(box.left, box.top + box.height / 2.0);
        context.lineTo(
            personChartData[index].left + personChartData[index].width,
            personChartData[index].top + personChartData[index].height / 2.0
        );
        context.strokeStyle = linesColor;
        context.stroke();
    }

    // Đường nối vợ/chồng (giữ nguyên)
    for (var i = 0; i < box.partnerBoxIndexes.length; i++) {
        var index = box.partnerBoxIndexes[i];
        context.beginPath();
        
        if (box.top < personChartData[index].top) {
            context.moveTo(box.left + box.width / 2.0, box.top + box.height);
            context.lineTo(
                personChartData[index].left + personChartData[index].width / 2.0,
                personChartData[index].top
            );
        } else {
            context.moveTo(box.left + box.width / 2.0, box.top);
            context.lineTo(
                personChartData[index].left + personChartData[index].width / 2.0,
                personChartData[index].top + personChartData[index].height
            );
        }
        
        context.strokeStyle = linesColor;
        context.stroke();
    }
}

// Sửa hàm kiểm tra vị trí chuột
function indexOfRectUnderPosition(p) {
    var rect = canvas.getBoundingClientRect();
    var scaleX = canvas.width / rect.width;
    var flippedX = canvas.width - (p.x * scaleX);
    var scaledY = p.y * (canvas.height / rect.height);
    
    for (var i = 0; i < personChartData.length; i++) {
        var box = personChartData[i];
        if (flippedX > box.left && flippedX < box.left + box.width && 
            scaledY > box.top && scaledY < box.top + box.height) {
            return i;
        }
    }
    return -1;
}

// ... (giữ nguyên các hàm getTouchPosition, touchMove, touchStart, 
// getMousePosition, mouseMove, mouseDown, pointInRect, lighterHexColor)
