export const drawLine = (canvas, x1, y1, x2, y2) => {
	const context = canvas.getContext("2d");
	context.lineWidth = 2;
	context.beginPath();
	context.lineCap = "round";
	context.moveTo(x1, y1);
	context.lineTo(x2, y2);
	context.strokeStyle = "#2299ff";
	context.stroke();
	return canvas;
};

export const drawCircle = (canvas, x, y, r) => {
	const context = canvas.getContext("2d");
	context.beginPath();
	context.arc(x, y, r, 0, 2*Math.PI, 0);
	context.fillStyle = "#ee3399";
	context.fill();
	return canvas;
};
