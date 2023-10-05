var canvas = document.createElement("canvas");
canvas.style = "position: absolute; z-index: 100; pointer-events: none;";
canvas.width = window.screen.width;
canvas.height = window.screen.height;

document.body.appendChild(canvas);

var centerPoint = null;
var radiusPoint = null;

const calculateDistance = (point1, point2) => {
  const a = point1.x - point2.x;
  const b = point1.y - point2.y;
  return Math.sqrt(a * a + b * b);
};

const drawMainCircle = () => {
  const ctx = canvas.getContext("2d");
  const radius = calculateDistance(centerPoint, radiusPoint);

  ctx.beginPath();
  ctx.arc(centerPoint.x, centerPoint.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = "rgba(255, 0, 0, 0.1)";
  ctx.fill();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "red";
  ctx.stroke();

  ctx.closePath();
};

const calculateRadiusPoints = () => {
  const angle = Math.atan2(
    radiusPoint.y - centerPoint.y,
    radiusPoint.x - centerPoint.x
  );

  const angle1 = angle + (2 * Math.PI) / 3;
  const angle2 = angle - (2 * Math.PI) / 3;

  const radius = Math.sqrt(
    Math.pow(radiusPoint.x - centerPoint.x, 2) +
      Math.pow(radiusPoint.y - centerPoint.y, 2)
  );
  const point1 = {
    x: centerPoint.x + radius * Math.cos(angle1),
    y: centerPoint.y + radius * Math.sin(angle1),
  };

  const point2 = {
    x: centerPoint.x + radius * Math.cos(angle2),
    y: centerPoint.y + radius * Math.sin(angle2),
  };

  return [point1, point2];
};

const drawDot = (point, color) => {
  const ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.closePath();
};

const drawRadiusPoints = () => {
  if (centerPoint) {
    drawDot(centerPoint, "rgba(0, 0, 255)");
  }
  if (radiusPoint) {
    drawDot(radiusPoint, "rgba(0, 255, 0)");
  }

  if (radiusPoint && centerPoint) {
    calculateRadiusPoints().forEach((point) => {
      drawDot(point, "rgba(0, 255, 0)");
    });
  }
};

const drawCanvas = () => {
  if (centerPoint && radiusPoint) {
    drawMainCircle();
  }
  drawRadiusPoints();
};

const clearCanvas = () => {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
};

const getMousePos = (e) => {
  // Headers break mouse coordinates
  const headers = document.getElementsByTagName("header");
  const offset = headers.length ? headers[0].offsetHeight : 0;

  return {
    x: e.clientX,
    y: e.clientY - offset,
  };
};

document.onclick = (e) => {
  if (e.ctrlKey) {
    centerPoint = getMousePos(e);
  } else if (e.shiftKey) {
    radiusPoint = getMousePos(e);
  }

  if ((centerPoint || radiusPoint) && (e.ctrlKey || e.shiftKey)) {
    clearCanvas();
    drawCanvas();
    e.preventDefault();
  }
};

document.onkeyup = (e) => {
  if (e.key === "Escape") {
    centerPoint = null;
    radiusPoint = null;
    clearCanvas();
  }
};
