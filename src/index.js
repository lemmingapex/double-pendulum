import * as settingsGui from "./settings-gui.js";
import * as canvasDrawing from "./canvas-drawing.js";

import "./main.css";

class main {
	constructor() {
		this.parameters = {
			"h": 0.025,
			"g": -9.807,
			"m1": 1.0,
			"l1": 1.00,
			"th1": Math.PI/4.0,
			"dth1": 0.0,
			"ddth1": 0.0,
			"m2": 0.5,
			"l2": 0.50,
			"th2": -Math.PI/4.0,
			"dth2": 0.0,
			"ddth2": 0.0
		};

		// add the settings GUI to the page
		const settingsGUI = new settingsGui.GUI(this.parameters);

		// somewhere to draw
		this.canvas = document.getElementById("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;

		this.runSimulation();
		setInterval(this.runSimulation, 10);
	}

	anchor_px_xy = () => {
		return {
			"x": this.canvas.width/2,
			"y": this.canvas.height/2
		}
	};

	// length_px_range = {
	// 	"min": Math.min(canvas.width, canvas.height)/12,
	// 	"max": Math.min(canvas.width, canvas.height)/6
	// };

	convert_l_to_px = (l) => {
		// const { min, max } = this.length_px_range;
		// TODO : calculate distance based on pixel values
		return (l*200);
	};

	// radius_px_range = {
	// 	"min": 10,
	// 	"max": 20
	// };

	convert_m_to_px = (m) => {
		// TODO : calculate radius based on mass, assume a constant density
		// return Math.pow(0.75*m/Math.PI, 1.0/3.0);
		return 15.0;
	};

	draw = () => {
		canvas.getContext("2d").clearRect(0,0,this.canvas.width,this.canvas.height);
		const anchor_px_xy = this.anchor_px_xy();
		const { m1, l1, th1, m2, l2, th2 } = this.parameters;
		const x1 = l1*Math.sin(th1);
		const y1 = l1*Math.cos(th1);
		const x1_px = anchor_px_xy.x + this.convert_l_to_px(x1);
		const y1_px = anchor_px_xy.y + this.convert_l_to_px(y1);
		canvasDrawing.drawLine(canvas, anchor_px_xy.x, anchor_px_xy.y, x1_px, y1_px);

		const x2 = l2*Math.sin(th2);
		const y2 = l2*Math.cos(th2);
		const x2_px = x1_px + this.convert_l_to_px(x2);
		const y2_px = y1_px + this.convert_l_to_px(y2);
		canvasDrawing.drawLine(canvas, x1_px, y1_px, x2_px, y2_px);

		const r1_px = this.convert_m_to_px(m1);
		canvasDrawing.drawCircle(canvas, x1_px, y1_px, r1_px);

		const r2_px = this.convert_m_to_px(m2);
		canvasDrawing.drawCircle(canvas, x2_px, y2_px, r2_px);
	};

	runSimulation = () => {
		this.draw();
		this.takeStep();
	};

	takeStep = () => {
		console.log("take a step");
		const { g, h, m1, l1, m2, l2 } = this.parameters;

		// do all the important stuff here
		this.parameters.th1 += .001;
		this.parameters.th2 -= .01;
	}
}

new main();
