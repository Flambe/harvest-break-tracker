import SysTray, {Menu} from 'systray';
import icon from './icon';
import moment, {Duration} from 'moment';
import {durationToHuman} from './Utils';

export default class Systray {
	private systray: SysTray | null = null;

	private menu: Menu = {
		icon,
		title: '',
		tooltip: '',
		items: [{
			title: 'Exit',
			tooltip: '',
			checked: false,
			enabled: true
		}]
	};

	public set title(title: string) {
		this.menu.title = title;

		if (this.systray) {
			this.systray.sendAction({
				type: 'update-menu',
				menu: this.menu,
				seq_id: 1,
			});
		} else {
			this.start(title);
		}
	}

	public set remaining(remaining: Duration) {
		let title = (remaining as any) <= 0 ? ' +' : ' ';

		title += durationToHuman(remaining) + ' | ';

		if (remaining.asMinutes() <= -30) {
			title += 'go home';
		} else {
			title += moment()
				.add(remaining)
				.format('HH:mm');
		}

		this.title = title;
	}

	public start(title: string) {
		this.menu.title = title;

		this.systray = new SysTray({menu: this.menu});

		this.systray.onClick(() => this.systray && this.systray.kill());
	}
}
