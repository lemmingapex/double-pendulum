import * as settingsGui from "./settings-gui.js";
import * as canvasDrawing from "./canvas-drawing.js";
import RK4 from "./runge-kutta-4.js";

import "./main.css";

class main {
	constructor() {
		this.min_m = 0.1;
		this.max_m = 10.0;
		this.min_m_radius = Math.pow(0.75*this.min_m/Math.PI, 1.0/3.0);
		this.max_m_radius = Math.pow(0.75*this.max_m/Math.PI, 1.0/3.0);

		this.parameters = {
			"h": 0.0125,
			"g": 9.807,
			"m1": 2.0,
			"l1": 1.00,
			"th1": Math.PI/6.0,
			"dth1": 0.0,
			"m2": 1.5,
			"l2": 0.80,
			"th2": -Math.PI/6.0,
			"dth2": 0.0
		};
		this.odeSolver = new RK4();

		// add the settings GUI to the page
		const settingsGUI = new settingsGui.GUI(this.parameters);

		// somewhere to draw
		this.canvas = document.getElementById("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.fpsContainer = document.getElementById("fps");
		this.lastLoopTime = new Date().getTime();
		this.frameTime = 0.0;

		this.runSimulation();
		setInterval(this.runSimulation, 10);

		setInterval(() => {
			this.fpsContainer.innerHTML = (1000.0/this.frameTime).toFixed(1) + " fps";
		}, 500);
	}

	anchor_px_xy = () => {
		return {
			"x": this.canvas.width/2,
			"y": this.canvas.height/2
		}
	};

	radius_px_range = () => {
		return {
			"min": (Math.min(this.canvas.width, this.canvas.height)/100),
			"max": (Math.min(this.canvas.width, this.canvas.height)/35)
		}
	};

	convert_l_to_px = (l) => {
		return l*((Math.min(this.canvas.width, this.canvas.height)/4) - this.radius_px_range().max);;
	};

	convert_m_to_px = (m) => {
		const radius = Math.pow(0.75*m/Math.PI, 1.0/3.0);
		const normlized_radius = ((radius - this.min_m_radius)/(this.max_m_radius - this.min_m_radius));
		const radius_px = normlized_radius*(this.radius_px_range().max-this.radius_px_range().min) + this.radius_px_range().min;
		return radius_px;
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

	calculateDerivatives = (parameters) => {
		const { g, h, m1, l1, th1, dth1, m2, l2, th2, dth2 } = parameters;
		let ddth1 = l1*m2*dth1*dth1*Math.sin((2*th1)-(2*th2));
		ddth1 += 2*l2*m2*dth2*dth2*Math.sin(th1-th2);
		ddth1 += 2*g*m1*Math.sin(th1);
		ddth1 += g*m2*Math.sin(th1);
		ddth1 += g*m2*Math.sin(th1-(2*th2));
		ddth1 /= -l1*(2*m1+m2-m2*Math.cos((2*th1)-(2*th2)));

		let ddth2 = 2*l1*m1*dth1*dth1*Math.sin(th1-th2);
		ddth2 += 2*l1*m2*dth1*dth1*Math.sin(th1-th2);
		ddth2 += l2*m2*dth2*dth2*Math.sin((2*th1)-(2*th2));
		ddth2 -= g*m1*Math.sin(th2);
		ddth2 += g*m1*Math.sin((2*th1)-th2);
		ddth2 -= g*m2*Math.sin(th2);
		ddth2 += g*m2*Math.sin(2*th1-th2);
		ddth2 /= l2*(2*m1+m2-m2*Math.cos((2*th1)-(2*th2)));

		// change in { th1, dth1, th2, dth2 }
		return { dth1, ddth1, dth2, ddth2 };
	}

	runSimulation = () => {
		let startTime = new Date().getTime()

		this.draw();
		this.odeSolver.takeStep(this.parameters, this.calculateDerivatives);

		let thisLoopTime = new Date().getTime()
		let thisFrameTime = thisLoopTime - this.lastLoopTime;
		// low pass filter to smooth the result
		this.frameTime += (thisFrameTime - this.frameTime)/20.0;
		this.lastLoopTime = thisLoopTime;
	};
}

new main();
