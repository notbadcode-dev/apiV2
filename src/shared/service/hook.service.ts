import { EXECUTE_HOOK_ZONE } from '@constant/hook.constant';
import { CronJob } from 'cron';
import { LoggerMethodDecorator } from './decorator/logger-method.decorator';

class HookService {
    private jobs: { [key: string]: CronJob } = {};

    @LoggerMethodDecorator
    public schedule(cronTime: string | Date, onTick: () => void, onComplete?: () => void, name?: string): void {
        if (name && this.jobs[name]) {
            this.jobs[name].stop();
        }

        const job = new CronJob(cronTime, onTick, onComplete, true, EXECUTE_HOOK_ZONE);
        if (name) {
            this.jobs[name] = job;
        }
    }
}

export default new HookService();
