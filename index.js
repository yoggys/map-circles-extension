const config = {
  font: "Arial",
  fontColor: "rgba(255, 0, 0)",
  fontSize: 20,
  centerDotColor: "rgba(0, 0, 255)",
  radiusDotColor: "rgba(0, 255, 0)",
  circleFillColor: "rgba(255, 0, 0, 0.1)",
  circleBorderColor: "rgba(255, 0, 0)",
  circleBorderWidth: 3,
};

var canvas = document.createElement("canvas");
canvas.style = "position: absolute; z-index: 1000; pointer-events: none;";
canvas.width = window.screen.width;
canvas.height = window.screen.height;

document.body.appendChild(canvas);

var centerPoint = null;
var radiusPoint = null;

const calculateRadius = (point1, point2) => {
  const a = point1.x - point2.x;
  const b = point1.y - point2.y;
  return Math.sqrt(a * a + b * b);
};

const drawMainCircle = () => {
  if (!(centerPoint && radiusPoint)) return;
  const ctx = canvas.getContext("2d");
  const radius = calculateRadius(centerPoint, radiusPoint);

  ctx.beginPath();
  ctx.arc(centerPoint.x, centerPoint.y, radius, 0, 2 * Math.PI);
  ctx.fillStyle = config.circleFillColor;
  ctx.fill();
  ctx.strokeStyle = config.circleBorderColor;
  ctx.lineWidth = config.circleBorderWidth;
  ctx.stroke();
  ctx.closePath();

  drawDistance(ctx, radius);
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
    drawDot(centerPoint, config.centerDotColor);
  }
  if (radiusPoint) {
    drawDot(radiusPoint, config.radiusDotColor);
  }

  if (radiusPoint && centerPoint) {
    calculateRadiusPoints().forEach((point) => {
      drawDot(point, config.radiusDotColor);
    });
  }
};

const drawDistance = (ctx, radius) => {
  // Based on scale on the page
  let scale = document.querySelector('[jsaction="scale.click"]');
  if (scale) {
    scale_width = scale
      .getElementsByTagName("div")[0]
      .style.width.replace("px", "");
    scale = scale.innerText.split(" ");
    value = scale[0];
    unit = scale[1];

    value_per_pixel = value / scale_width;
    radius_in_unit = radius * value_per_pixel;

    const result = `Radius: ${radius_in_unit.toFixed(2)} ${unit}`;

    ctx.font = `${config.fontSize}px ${config.font}`;
    ctx.fontColor = config.fontColor;
    ctx.fillStyle = config.fontColor;
    ctx.textAlign = "center";

    ctx.fillText(
      result,
      centerPoint.x,
      centerPoint.y - radius - config.fontSize
    );
  }
};

const drawCanvas = () => {
  drawMainCircle();
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
