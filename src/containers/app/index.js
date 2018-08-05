import React from 'react';
// import classnames from 'classnames';
import { Switch, Route, Redirect } from 'react-router';
import { HashRouter, Link } from 'react-router-dom';
import InitiativeTracker from '../initiative';
import MonsterLookup from '../monsters';
import EncounterGenerator from '../encounter';
import PartyManager from '../party';

import IconInitiative from './initiative.svg';
import IconMonster from './monster.svg';
import IconClash from './sword-clash.svg';
import IconParty from './party.svg';

import './app.css';

const App = () => (
	<HashRouter>
		<div className="layout">
			<aside className="navigation">
				<ol>
					<li>
						<Link to="/initiative">
							<img
								src={IconInitiative}
								alt="Initiative Tracker"
								className="navigation__icon"
							/>
						</Link>
					</li>
					<li>
						<Link to="/party">
							<img
								src={IconParty}
								alt="Party Editor"
								className="navigation__icon"
							/>
						</Link>
					</li>
					<li>
						<Link to="/monsters">
							<img
								src={IconMonster}
								alt="Monster Lookup"
								className="navigation__icon"
							/>
						</Link>
					</li>
					<li>
						<Link to="/encounter">
							<img
								src={IconClash}
								alt="Encounter Generator"
								className="navigation__icon"
							/>
						</Link>
					</li>
				</ol>
			</aside>

			<div className="layout-content">
				<div className="layout-content__content">
					<Switch>
						<Redirect from="/" to="/initiative" exact />
						<Route path="/initiative" component={InitiativeTracker} />
						<Route path="/party" component={PartyManager} />
						<Route path="/monsters" component={MonsterLookup} />
						<Route path="/encounter" component={EncounterGenerator} />
						{/* <Route component={NoMatch}/> */}
					</Switch>
				</div>
			</div>
		</div>
	</HashRouter>
);

export default App;
