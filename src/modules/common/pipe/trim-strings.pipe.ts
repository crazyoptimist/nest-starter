import { PipeTransform, ArgumentMetadata } from '@nestjs/common';

abstract class AbstractTransformPipe implements PipeTransform {
  protected abstract transformValue(value: any): any;

  protected except(): string[] {
    return [];
  }

  private isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  private transformObject(values: Object) {
    Object.keys(values).forEach((key) => {
      if (this.except().includes(key)) {
        return;
      }

      if (this.isObject(values[key])) {
        values[key] = this.transformObject(values[key]);
      } else {
        values[key] = this.transformValue(values[key]);
      }
    });
    return values;
  }

  transform(values: Object, metadata: ArgumentMetadata) {
    const { type } = metadata;
    if (this.isObject(values) && type === 'body') {
      return this.transformObject(values);
    }
    return values;
  }
}

export class TrimStringsPipe extends AbstractTransformPipe {
  except() {
    return ['password', 'passwordConfirmation'];
  }

  protected transformValue(value: any) {
    return typeof value === 'string' ? value.trim() : value;
  }
}
