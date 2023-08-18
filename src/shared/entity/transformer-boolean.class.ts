import { ValueTransformer } from 'typeorm';

export class BooleanTransformer implements ValueTransformer {
    to(value: boolean | null | undefined): number {
        return value ? 1 : 0;
    }

    from(value: number | null | undefined): boolean {
        return value === 1;
    }
}
