import * as dat from "dat.gui";
import { assign, cloneDeep } from "lodash";

export class GUI {
	constructor(parameters) {
		this.defaultDatSettings = cloneDeep(parameters);
		this.parameters = parameters;

		const datGUI = new dat.GUI();
		datGUI.add({"reset": () => {
			assign(this.parameters, this.defaultDatSettings);
		}}, "reset").name("Reset");
		datGUI.add(this.parameters, "h", 0.0015, 0.0250).step(0.0005).name("Time Step").listen();
		datGUI.add(this.parameters, "g", 0.01, 50.0).step(0.01).name("Gravity").listen();
		datGUI.add(this.parameters, "m1", 0.1, 10.0).step(0.1).name("Mass 1 (kg)").listen();
		datGUI.add(this.parameters, "l1", 0.10, 1.00).step(0.01).name("Length 1 (m)").listen();
		datGUI.add(this.parameters, "m2", 0.1, 10.0).step(0.1).name("Mass 2 (kg)").listen();
		datGUI.add(this.parameters, "l2", 0.10, 1.00).step(0.01).name("Length 2 (m)").listen();
	}
}
