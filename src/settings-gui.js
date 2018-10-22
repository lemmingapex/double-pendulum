import * as dat from "dat.gui";
import _ from "lodash";

export class GUI {
	constructor() {
		this.defaultDatSettings = {
			mass1: 1
		}

		this.datSettings = {
			...this.defaultDatSettings
		}

		const datGUI = new dat.GUI();
		datGUI.add({"reset": () => {
			_.assign(this.datSettings, this.defaultDatSettings);
		}}, "reset").name("Reset");
		datGUI.add(this.datSettings, "mass1", 1, 10).step(1).name("Mass 1").listen();
	}
}
