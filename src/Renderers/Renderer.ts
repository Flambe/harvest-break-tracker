import {Duration} from 'moment';

export default interface Renderer {
    render(remaining: Duration, running: 'work' | 'break' | false): void;
}