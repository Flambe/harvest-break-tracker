import updateNotifier from 'update-notifier';

export default function () {
    const pkg = require('../../package.json');
    const updateCheckInterval = 1000 * 60 * 60 * 12;

    // Checks for available update and returns an instance
    const notifier = updateNotifier({pkg, updateCheckInterval});

    // Notify using the built-in convenience method
    notifier.notify({isGlobal: true});
}