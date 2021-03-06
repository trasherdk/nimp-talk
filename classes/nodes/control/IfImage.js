import NodeImage from '../NodeImage.js';
import IfImageProperties from './IfImageProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class IfImage extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Image If', IfImageProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Test', 'hasAInput')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.a = typeof settings.a !== 'undefined' ? settings.a : 1;
  }


  toJson() {
    let json = super.toJson();

    json.settings.a = this.a;

    return json;
  }


  run(inputThatTriggered) {
    let a = this.a;

    if (this.inputs[1].number != null) {
      a = this.inputs[1].number;
    }

    if (a) {
      if (this.inputs[0].image) {
        this.bg.classList.add('running');
        this.runTimer = Date.now();

        if (this.isInsideALoop) {
          let image = this.inputs[0].image.clone();
          this.image = image;
          super.run(inputThatTriggered);

        } else {
          Jimp.read(this.inputs[0].image).then(image => {
            this.image = image;
            super.run(inputThatTriggered);
          })
        }
      } else {
        this.runTimer = Date.now();
        this.image = null;
        super.run(inputThatTriggered);
      }
    }
  }
}
