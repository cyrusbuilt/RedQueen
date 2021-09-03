import { Component, OnInit } from '@angular/core';
import {
  faBell,
  faChartBar,
  faClipboardList,
  faCog,
  faCogs,
  faEdit,
  faEnvelope,
  faHome,
  faSearch,
  faUserCog,
  faCaretLeft,
  faCaretRight,
  faBroadcastTower,
  faNewspaper,
  faKey,
  faLock,
  IconDefinition
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  faCog: IconDefinition = faCog;
  faCogs: IconDefinition = faCogs;
  faSearch: IconDefinition = faSearch;
  faEnvelope: IconDefinition = faEnvelope;
  faBell: IconDefinition = faBell;
  faHome: IconDefinition = faHome;
  faClipboardList: IconDefinition = faClipboardList;
  faChartBar: IconDefinition = faChartBar;
  faUserCog: IconDefinition = faUserCog;
  faPencil: IconDefinition = faEdit;
  faCaretLeft: IconDefinition = faCaretLeft;
  faCaretRight: IconDefinition = faCaretRight;
  faBroadcastTower: IconDefinition = faBroadcastTower;
  faNewspaper: IconDefinition = faNewspaper;
  faKey: IconDefinition = faKey;
  faLock: IconDefinition = faLock;

  constructor() { }

  ngOnInit(): void { }
}
