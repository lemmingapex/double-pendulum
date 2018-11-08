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
			"h": 0.00625,
			"g": -9.81,
			"m1": 1.9,
			"l1": 1.00,
			"init_th1_over_pi": 3.0/4.0 + Math.random()/12.0,
			"color1": "#a162d9",
			"m2": 1.6,
			"l2": 0.85,
			"init_th2_over_pi": -1.0/6.0 + Math.random()/12.0,
			"color2": "#0c68cf",
			"alpha": 0.70
		};


		// add the settings GUI to the page
		const settingsGUI = new settingsGui.GUI(this.parameters);

		this.parameters.th1 = this.parameters.init_th1_over_pi*Math.PI;
		this.parameters.dth1 = 0.0;
		this.parameters.th2 = this.parameters.init_th2_over_pi*Math.PI;
		this.parameters.dth2 = 0.0;

		this.odeSolver = new RK4();

		// somewhere to draw
		this.canvas_fg = document.getElementById("canvas_fg");
		this.canvas_fg.width = window.innerWidth;
		this.canvas_fg.height = window.innerHeight;
		this.canvas_bg = document.getElementById("canvas_bg");
		this.canvas_bg.width = window.innerWidth;
		this.canvas_bg.height = window.innerHeight;

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
			"x": this.canvas_bg.width/2,
			"y": this.canvas_bg.height/2
		}
	};

	radius_px_range = () => {
		return {
			"min": (Math.min(this.canvas_bg.width, this.canvas_bg.height)/100),
			"max": (Math.min(this.canvas_bg.width, this.canvas_bg.height)/35)
		}
	};

	convert_l_to_px = (l) => {
		return l*((Math.min(this.canvas_bg.width, this.canvas_bg.height)/4) - this.radius_px_range().max);;
	};

	convert_m_to_px = (m) => {
		const radius = Math.pow(0.75*m/Math.PI, 1.0/3.0);
		const normlized_radius = ((radius - this.min_m_radius)/(this.max_m_radius - this.min_m_radius));
		const radius_px = normlized_radius*(this.radius_px_range().max-this.radius_px_range().min) + this.radius_px_range().min;
		return radius_px;
	};

	convert_alpha_to_normalized_log = (alpha) => {
		const power = 2.0;
		const alphaLogScale = 1.0 - Math.pow(10, -power*alpha);
		const alphaMax = 1.0 - Math.pow(10, -power);
		return 1.0 - alphaLogScale/alphaMax;
	};

	draw = () => {
		this.canvas_bg.getContext("2d").fillStyle = "rgba(221, 221, 221, " + this.convert_alpha_to_normalized_log(this.parameters.alpha) + ")";
		this.canvas_bg.getContext("2d").fillRect(0, 0, this.canvas_bg.width, this.canvas_bg.height);
		this.canvas_fg.getContext("2d").clearRect(0, 0, this.canvas_fg.width, this.canvas_fg.height);
		const anchor_px_xy = this.anchor_px_xy();
		const { m1, l1, th1, m2, l2, th2 } = this.parameters;

		const r1_px = this.convert_m_to_px(m1);

		const l1_px = this.convert_l_to_px(l1);
		const x1_px = anchor_px_xy.x + l1_px*Math.sin(th1);
		const y1_px = anchor_px_xy.y + l1_px*Math.cos(th1);

		const l1_minus_r1_px = this.convert_l_to_px(l1) - r1_px;
		const x1_minus_r1_px = anchor_px_xy.x + l1_minus_r1_px*Math.sin(th1);
		const y1_minus_r1_px = anchor_px_xy.y + l1_minus_r1_px*Math.cos(th1);
		canvasDrawing.drawLine(this.canvas_fg, anchor_px_xy.x, anchor_px_xy.y, x1_minus_r1_px, y1_minus_r1_px);

		const r2_px = this.convert_m_to_px(m2);

		const l2_px = this.convert_l_to_px(l2);
		const x2_px = x1_px + l2_px*Math.sin(th2);
		const y2_px = y1_px + l2_px*Math.cos(th2);

		const x1_plus_r1_px = x1_px + r1_px*Math.sin(th2);
		const y2_plus_r1_px = y1_px + r1_px*Math.cos(th2);

		const l2_minus_r2_px = this.convert_l_to_px(l2) - r2_px;
		const x2_minus_r2_px = x1_px + l2_minus_r2_px*Math.sin(th2);
		const y2_minus_r2_px = y1_px + l2_minus_r2_px*Math.cos(th2);
		canvasDrawing.drawLine(this.canvas_fg, x1_plus_r1_px, y2_plus_r1_px, x2_minus_r2_px, y2_minus_r2_px);

		canvasDrawing.drawCircle(this.canvas_bg, x1_px, y1_px, r1_px, this.parameters.color1);
		canvasDrawing.drawCircle(this.canvas_bg, x2_px, y2_px, r2_px, this.parameters.color2);
	};

	calculateDerivatives = (parameters) => {
		const { g, h, m1, l1, th1, dth1, m2, l2, th2, dth2 } = parameters;
		let ddth1 = l1*m2*dth1*dth1*Math.sin((2*th1)-(2*th2));
		ddth1 += 2*l2*m2*dth2*dth2*Math.sin(th1-th2);
		ddth1 += -2*g*m1*Math.sin(th1);
		ddth1 += -g*m2*Math.sin(th1);
		ddth1 += -g*m2*Math.sin(th1-(2*th2));
		ddth1 /= -l1*(2*m1+m2-m2*Math.cos((2*th1)-(2*th2)));

		let ddth2 = 2*l1*m1*dth1*dth1*Math.sin(th1-th2);
		ddth2 += 2*l1*m2*dth1*dth1*Math.sin(th1-th2);
		ddth2 += l2*m2*dth2*dth2*Math.sin((2*th1)-(2*th2));
		ddth2 += g*m1*Math.sin(th2);
		ddth2 += -g*m1*Math.sin((2*th1)-th2);
		ddth2 += g*m2*Math.sin(th2);
		ddth2 += -g*m2*Math.sin(2*th1-th2);
		ddth2 /= l2*(2*m1+m2-m2*Math.cos((2*th1)-(2*th2)));

		// change in { th1, dth1, th2, dth2 }
		return { dth1, ddth1, dth2, ddth2 };
	}

	runSimulation = () => {
		let startTime = new Date().getTime();

		this.draw();
		this.odeSolver.takeStep(this.parameters, this.calculateDerivatives);

		let thisLoopTime = new Date().getTime();
		let thisFrameTime = thisLoopTime - this.lastLoopTime;
		// low pass filter to smooth the result
		this.frameTime += (thisFrameTime - this.frameTime)/20.0;
		this.lastLoopTime = thisLoopTime;
	};
}

window.onload = function() {
	new main();
};
