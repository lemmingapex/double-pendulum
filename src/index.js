import "./main.css";
import * as settingsGui from "./settings-gui.js";
import * as canvasDrawing from "./canvas-drawing.js";

// add the settings GUI to the page
const settingsGUI = new settingsGui.GUI();

// somewhere to draw
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// draw something
canvasDrawing.drawLine(canvas, 100, 100, 200, 400);
canvasDrawing.drawCircle(canvas, 200, 400, 40);

// do everything important here... :)
