import NodeColor from '../NodeColor.js';
import SplitComplimentColorsProperties from './SplitComplimentColorsProperties.jsx';
import OutputColor from '../OutputColor.js';
const tinycolor = require("tinycolor2");
import InputColor from '../InputColor.js';


export default class SplitComplimentColors extends NodeColor {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Split Compliment Colors', SplitComplimentColorsProperties, settings);

    this.inputs = [
      new InputColor(this, 0, 'Input'),
    ];
    this.outputs = [
      new OutputColor(this, 0, 'Split Compliment 1'),
      new OutputColor(this, 1, 'Split Compliment 2'),
      new OutputColor(this, 2, 'Split Compliment 3'),
    ];
  }


  toJson() {
    let json = super.toJson();

    return json;
  }


  run(inputThatTriggered) {
    this.bg.classList.add('running');
    this.runTimer = Date.now();

    if (this.inputs[0].color) {
      this.color = this.inputs[0].color.clone();

      this.colors = this.color.splitcomplement();

    } else {
      this.color = tinycolor('#000');

      this.colors = [
        tinycolor('#000'),
        tinycolor('#000'),
        tinycolor('#000'),
      ]
    }

    super.run(inputThatTriggered);
  }


  renderPreview() {
    new Jimp(3, 1, this.color.toHex8String(), (error, image) => {
      if (error) {
        console.log(error);
      } else {

        const c0 = this.colors[0].toRgb();
        image.bitmap.data[0] = c0.r;
        image.bitmap.data[1] = c0.g;
        image.bitmap.data[2] = c0.b;
        image.bitmap.data[3] = 255;

        const c1 = this.colors[1].toRgb();
        image.bitmap.data[4] = c1.r;
        image.bitmap.data[5] = c1.g;
        image.bitmap.data[6] = c1.b;
        image.bitmap.data[7] = 255;

        const c2 = this.colors[2].toRgb();
        image.bitmap.data[8] = c2.r;
        image.bitmap.data[9] = c2.g;
        image.bitmap.data[10] = c2.b;
        image.bitmap.data[11] = 255;

        image.getBufferAsync(Jimp.MIME_JPEG).then(i => {
          this.preview.setAttributeNS(null, 'href', 'data:'+Jimp.MIME_JPEG+';base64,'+i.toString('base64'));
        });
      }
    })
  }


  passToChildren() {
    this.outputs[0].connections.forEach(conn => {
      conn.color = this.colors[0];
      conn.runNode();
    })

    this.outputs[1].connections.forEach(conn => {
      conn.color = this.colors[1];
      conn.runNode();
    })

    this.outputs[2].connections.forEach(conn => {
      conn.color = this.colors[2];
      conn.runNode();
    })
  }
}
