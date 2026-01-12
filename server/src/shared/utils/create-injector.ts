import { ClassProvider, Inject, Type } from '@nestjs/common';

type InjectFn = () => PropertyDecorator & ParameterDecorator;
type ProviderFn = () => ClassProvider;

export function createInjection<T>(service: Type<T>): [InjectFn, ProviderFn] {
  const token = Symbol(`provide${service.name}`);

  const inject = () => Inject(token);
  const provide = (): ClassProvider => ({
    provide: token,
    useClass: service,
  });

  return [inject, provide];
}
