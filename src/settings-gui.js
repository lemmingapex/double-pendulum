import * as dat from "dat.gui";
import { assign, cloneDeep } from "lodash";

export class GUI {
	constructor(parameters) {
		this.defaultDatSettings = cloneDeep(parameters);
		this.parameters = parameters;

		const reset = () => {
			assign(this.parameters, this.defaultDatSettings);
		};

		const restart = () => {
			this.parameters.th1 = this.parameters.init_th1_over_pi*Math.PI;
			this.parameters.dth1 = 0.0;
			this.parameters.th2 = this.parameters.init_th2_over_pi*Math.PI;
			this.parameters.dth2 = 0.0;
		};

		const datGUI = new dat.GUI();
		datGUI.add({"reset": reset}, "reset").name("Reset Settings");
		datGUI.add(this.parameters, "init_th1_over_pi", -1.00, 1.00).step(0.01).name("Inital θ1/π").listen();
		datGUI.add(this.parameters, "init_th2_over_pi", -1.00, 1.00).step(0.01).name("Inital θ2/π").listen();
		datGUI.add({"restart": restart}, "restart").name("Restart Sim");
		datGUI.add(this.parameters, "h", 0.0015, 0.0250).step(0.0005).name("Time Step").listen();
		datGUI.add(this.parameters, "g", -32.00, 32.00).step(0.001).name("Gravity (m/s²)").listen();
		datGUI.add(this.parameters, "m1", 0.1, 10.0).step(0.1).name("Mass 1 (kg)").listen();
		datGUI.add(this.parameters, "l1", 0.10, 1.00).step(0.01).name("Length 1 (m)").listen();
		datGUI.addColor(this.parameters, "color1").name("Color 1").listen();
		datGUI.add(this.parameters, "m2", 0.1, 10.0).step(0.1).name("Mass 2 (kg)").listen();
		datGUI.add(this.parameters, "l2", 0.10, 1.00).step(0.01).name("Length 2 (m)").listen();
		datGUI.addColor(this.parameters, "color2").name("Color 2").listen();
		datGUI.add(this.parameters, "alpha", 0.00, 1.00).step(0.01).name("Trails").listen();
	}
}
