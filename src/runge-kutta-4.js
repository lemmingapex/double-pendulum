import { cloneDeep } from "lodash";

export default class RK4 {
	step = (pars, kx, h) => {
		pars.th1 += kx.dth1*h;
		pars.dth1 += kx.ddth1*h;
		pars.th2 += kx.dth2*h;
		pars.dth2 += kx.ddth2*h;
	};

	takeStep = (parameters , evaluate) => {
		const h = parameters.h;
		// evaluate at time t
		let pars = cloneDeep(parameters);
		const k1 = evaluate(pars);

		// evaluate at time t+h/2
		pars = cloneDeep(parameters);
		this.step(pars, k1, h/2.0);
		const k2 = evaluate(pars);

		// evaluate at time t+h/2
		pars = cloneDeep(parameters);
		this.step(pars, k2, h/2.0);
		const k3 = evaluate(pars);

		// evaluate at time t+h
		pars = cloneDeep(parameters);
		this.step(pars, k3, h);
		const k4 = evaluate(pars);

		parameters.th1 += (k1.dth1 + 2.0*k2.dth1 + 2.0*k3.dth1 + k4.dth1)*h/6.0;
		parameters.th1 %= 2*Math.PI;
		parameters.dth1 += (k1.ddth1 + 2.0*k2.ddth1 + 2.0*k3.ddth1 + k4.ddth1)*h/6.0;
		parameters.th2 += (k1.dth2 + 2.0*k2.dth2 + 2.0*k3.dth2 + k4.dth2)*h/6.0;
		parameters.th2 %= 2*Math.PI;
		parameters.dth2 += (k1.ddth2 + 2.0*k2.ddth2 + 2.0*k3.ddth2 + k4.ddth2)*h/6.0;
	};
}
