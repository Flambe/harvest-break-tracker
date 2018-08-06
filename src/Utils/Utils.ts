const breaks = {
    Break: null,
    'Non-Project Time': ['German']
};

export default class Utils {
    public static isBreak(entry): boolean {
        if (breaks[entry.project.name] !== undefined) {
            if (!breaks[entry.project.name] || breaks[entry.project.name].indexOf(entry.task.name) > -1) {
                return true;
            }
        }

        return false;
    }
}