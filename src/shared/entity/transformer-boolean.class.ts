import { ENTITY_CONSTANT } from '@constant/entity.constant';
import { ValueTransformer } from 'typeorm';

export class BooleanTransformer implements ValueTransformer {
    to(value: boolean | null | undefined): number {
        return value ? ENTITY_CONSTANT.TRUE_BOOLEAN_VALUE : ENTITY_CONSTANT.FALSE_BOOLEAN_VALUE;
    }

    from(value: number | null | undefined): boolean {
        return value === ENTITY_CONSTANT.TRUE_BOOLEAN_VALUE;
    }
}
