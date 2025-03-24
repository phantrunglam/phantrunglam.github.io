var boxIndexUnderPosition = -1;
var currentScale = 0.5;
var targetScale = 1.0;
var currentAlpha = 0.0;
var targetAlpha = 1.0;
var lastTime;
var firstFrame = true;
var canvas;
var context;
var maleBoxColor = '#AACCDD';
var lighterMaleBoxColor;
var femaleBoxColor = '#CCEEFF';
var lighterFemaleBoxColor;
var unknownGenderBoxColor;
var lighterUnknownGenderBoxColor;
var linesColor = '#000000';
var animateInterval;

function initPersonChart() {
    canvas = document.getElementById('person_chart_canvas_id');

    if (canvas.getContext) {
        context = canvas.getContext('2d');
    } else {
        alert('Canvas not supported on this browser!');
    }

    canvas.addEventListener("mousedown", mouseDown, false);
    canvas.addEventListener("mousemove", mouseMove, false);
    canvas.addEventListener("touchstart", touchStart, { passive: true });
    canvas.addEventListener("touchmove", touchMove, { passive: true });

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

function drawLinesForBox(box) {
    for (var i = 0; i < box.ancestorBoxIndexes.length; i++) {
        var index = box.ancestorBoxIndexes[i];
        context.beginPath();
        context.moveTo(box.left, box.top + box.height / 2.0);  // Ancestors bên trái
        context.lineTo(personChartData[index].left + personChartData[index].width, personChartData[index].top + personChartData[index].height / 2.0);
        context.strokeStyle = linesColor;
        context.stroke();
    }

    for (var i = 0; i < box.childBoxIndexes.length; i++) {
        var index = box.childBoxIndexes[i];
        context.beginPath();
        context.moveTo(box.left + box.width, box.top + box.height / 2.0); // Descendants bên phải
        context.lineTo(personChartData[index].left, personChartData[index].top + personChartData[index].height / 2.0);
        context.strokeStyle = linesColor;
        context.stroke();
    }

    for (var i = 0; i < box.partnerBoxIndexes.length; i++) {
        var index = box.partnerBoxIndexes[i];
        context.beginPath();
        if (box.top < personChartData[index].top) {
            context.moveTo(box.left + box.width / 2.0, box.top + box.height);
            context.lineTo(personChartData[index].left + personChartData[index].width / 2.0, personChartData[index].top);
        } else {
            context.moveTo(box.left + box.width / 2.0, box.top);
            context.lineTo(personChartData[index].left + personChartData[index].width / 2.0, personChartData[index].top + personChartData[index].height);
        }
        context.strokeStyle = linesColor;
        context.stroke();
    }
}
