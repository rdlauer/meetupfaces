import { EventData } from 'data/observable';
import { Page } from 'ui/page';
import * as frameModule from 'ui/frame';
import * as http from 'http';
const observableModule = require('tns-core-modules/data/observable');
const vm = new observableModule.Observable();

export function pageLoaded(args: EventData) {
  let page = <Page>args.object;
  page.bindingContext = vm;
  fetchAllPeople();
}

function fetchAllPeople() {
  http
    .getJSON(
      'https://api.meetup.com/JS-NYC/events/246938509/rsvps?response=yes&only=member'
    )
    .then(
      function(u: any) {
        vm.set('items', u);
      },
      function(e) {
        console.log(e);
      }
    );
}

export function fetchPerson(args) {
  let person = vm.get('items')[args.index];
  //console.log(person);

  let navigationOptions = {
    moduleName: './person-page',
    context: { person: person }
  };

  frameModule.topmost().navigate(navigationOptions);
}
