import NodeImage from '../NodeImage.js';
import DisplaceProperties from './DisplaceProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';

export default class Displace extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Displace', DisplaceProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputImage(this, 1, 'Map'),
      new InputNumber(this, 2, 'Offset', 'hasOffsetInput')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.offset = typeof settings.offset !== 'undefined' ? settings.offset : 20;
  }


  toJson() {
    let json = super.toJson();

    json.settings.offset = this.offset;

    return json;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image && this.inputs[1].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let offset = this.offset;

      if (this.inputs[2].number != null) {
        offset = this.inputs[2].number;
      }

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        image.displace(this.inputs[1].image, offset);
        this.image = image;
        super.run(inputThatTriggered);
      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.displace(this.inputs[1].image, offset, (error, image) => {
            if (error) {
              console.log(error);
            } else {
              this.image = image;
              super.run(inputThatTriggered);
            }
          })
        })
      }

    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }
}
