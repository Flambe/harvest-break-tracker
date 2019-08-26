import SysTray, {ClickEvent, Menu} from 'systray';
import icon from './icon';
import moment, {Duration} from 'moment';
import {durationToHuman} from './Utils';

export default class Systray {
	private systray: SysTray | null = null;
	private _running: string = '';
	private menu: Menu = {
		icon,
		title: '',
		tooltip: '',
		items: [
			{
				title: 'Refresh now',
				tooltip: '',
				checked: false,
				enabled: true
			},
			{
				title: 'Exit',
				tooltip: '',
				checked: false,
				enabled: true
			},
		]
	};

	public set title(title: string) {
		this.menu.title = ` ${title}`;

		if (this.systray) {
			this.systray.sendAction({
				type: 'update-menu',
				menu: this.menu,
				seq_id: 10,
			});
		} else {
			this.start();
		}
	}

	public set running(running: 'work' | 'break' | false) {
		if ('work' === running) {
			this._running = '* ';
			return;
		}

		if ('break' === running) {
			this._running = 'B ';
			return;
		}

		this._running = '';
	}

	public set remaining(remaining: Duration) {
		let title = this._running + ((remaining as any) <= 0 ? '+' : '');

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

	public set refresh(refresh: (manual: boolean) => Promise<void>) {
		this._refresh = refresh;
	}

	private _refresh: (manual: boolean) => Promise<void> = async (manual: boolean) => undefined;

	private start() {
		this.systray = new SysTray({menu: this.menu});

		this.systray.onClick((action: ClickEvent) => {
			if (action.seq_id === 0) {
				this._refresh(true);
			} else if (action.seq_id === 1 && this.systray) {
				this.systray.kill();
			}
		});
	}
}
