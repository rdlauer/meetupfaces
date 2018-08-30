import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import * as http from 'http';
const keys = require('./keys');
const observableModule = require('tns-core-modules/data/observable');
const vm = new observableModule.Observable();

export function pageLoaded(args: EventData) {
  let page = <Page>args.object;
  page.bindingContext = vm;

  let context = page.navigationContext;
  vm.set('name', context.person.member.name);
  vm.set('photo', context.person.member.photo.highres_link);
  processImage();
}

function compare(a, b) {
  if (a.val > b.val) return -1;
  if (a.val < b.val) return 1;
  return 0;
}

export function processImage() {
  let key = keys.azureKey;
  // get your msft cognitive services api key at https://azure.microsoft.com/en-us/services/cognitive-services/face/

  //console.log(vm.get('photo'));

  http
    .request({
      url:
        'https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect?returnFaceId=true&returnFaceLandmarks=false&returnFaceAttributes=age,gender,emotion&subscription-key=' +
        key,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      content: JSON.stringify({
        url: vm.get('photo')
      })
    })
    .then(
      response => {
        const result = response.content.toJSON();
        console.log(result[0]);
        vm.set('result', result[0]);

        // set the "mood"
        let anger = parseFloat(result[0].faceAttributes.emotion.anger);
        let contempt = parseFloat(result[0].faceAttributes.emotion.contempt);
        let disgust = parseFloat(result[0].faceAttributes.emotion.disgust);
        let fear = parseFloat(result[0].faceAttributes.emotion.fear);
        let happiness = parseFloat(result[0].faceAttributes.emotion.happiness);
        let neutral = parseFloat(result[0].faceAttributes.emotion.neutral);
        let sadness = parseFloat(result[0].faceAttributes.emotion.sadness);
        let surprise = parseFloat(result[0].faceAttributes.emotion.surprise);

        let moodArray = [
          { name: 'anger', val: anger },
          { name: 'contempt', val: contempt },
          { name: 'disgust', val: disgust },
          { name: 'fear', val: fear },
          { name: 'happiness', val: happiness },
          { name: 'neutral', val: neutral },
          { name: 'sadness', val: sadness },
          { name: 'surprise', val: surprise }
        ];

        moodArray.sort(compare);

        vm.set('mood', moodArray[0].name);
      },
      e => {
        console.log(e);
      }
    );
}
