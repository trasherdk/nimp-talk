import NodeImage from '../NodeImage.js';
import PosterizeProperties from './PosterizeProperties.jsx';
import OutputImage from '../OutputImage.js';
import InputImage from '../InputImage.js';
import InputNumber from '../InputNumber.js';


export default class Posterize extends NodeImage {
  constructor(className, graph, x, y, settings) {
    super(className, graph, x, y, 'Posterize', PosterizeProperties, settings);

    this.inputs = [
      new InputImage(this, 0, 'Input'),
      new InputNumber(this, 1, 'Amount', 'hasAmountInput')
    ];
    this.outputs = [
      new OutputImage(this, 0, 'Output')
    ];

    this.amount = typeof settings.amount !== 'undefined' ? settings.amount : 5;
  }


  run(inputThatTriggered) {
    if (this.inputs[0].image) {
      this.bg.classList.add('running');
      this.runTimer = Date.now();

      let amount = this.amount;

      if (this.inputs[1].number != null) {
        amount = this.inputs[1].number;
      }

      if (this.isInsideALoop) {
        let image = this.inputs[0].image.clone();
        image.posterize(amount);
        this.image = image;
        super.run(inputThatTriggered);

      } else {
        Jimp.read(this.inputs[0].image).then(image => {
          image.posterize(amount, (error, image) => {
            if (error) {
              console.log(error);
            } else {
              this.image = image;
              super.run(inputThatTriggered);
            }
          });
        })
      }
    } else {
      this.runTimer = Date.now();
      this.image = null;
      super.run(inputThatTriggered);
    }
  }


  toJson() {
    let json = super.toJson();

    json.settings.amount = this.amount;

    return json;
  }
}
