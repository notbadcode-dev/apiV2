import { EXECUTE_HOOK_ZONE } from '@constant/hook.constant';
import { CronJob } from 'cron';
import { LoggerMethodDecorator } from './decorator/logger-method.decorator';

class HookService {
    //#region Attributes

    private jobs: { [key: string]: CronJob } = {};

    //#endregion

    //#region Public methods

    @LoggerMethodDecorator
    public schedule(cronTime: string | Date, onTick: () => void, onComplete?: () => void, name?: string): void {
        if (name && this.jobs[name]) {
            this.jobs[name].stop();
        }

        const JOB = new CronJob(cronTime, onTick, onComplete, true, EXECUTE_HOOK_ZONE);
        if (name) {
            this.jobs[name] = JOB;
        }
    }

    //#endregion
}

export default new HookService();
