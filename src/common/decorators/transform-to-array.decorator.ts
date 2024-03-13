import { applyDecorators } from '@nestjs/common';
import { isDefined } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export function TransformToArray() {
  return applyDecorators(Transform(toArrayTransform));
}

function toArrayTransform({ value }: TransformFnParams) {
  if (!isDefined(value)) return undefined;

  return typeof value === 'string' ? value.split(',') : value;
}
