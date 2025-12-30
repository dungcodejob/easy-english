import { APP_ROUTES } from '@/shared/constants';
import { FieldGroup } from '@/shared/ui/shadcn/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { PasswordInput } from '@shared/ui/common/password-input';
import { Button } from '@shared/ui/shadcn/button';
import { Card, CardContent } from '@shared/ui/shadcn/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@shared/ui/shadcn/form';
import { Input } from '@shared/ui/shadcn/input';
import { cn } from '@shared/utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { useRegister } from '../hooks/use-register';

const registerFormSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
  name: z.string().min(1, { message: "Name is required" }),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

type RegisterFormSchema = z.infer<typeof registerFormSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<'div'>) {
  const { t } = useTranslation();
  const { mutateAsync: register, isPending } = useRegister();

  const form = useForm<RegisterFormSchema>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterFormSchema) => {
    // Exclude confirmPassword from API payload
    const { confirmPassword, ...registerData } = data;
    register(registerData);
  };

  return (
    <div className={cn('flex flex-col gap-6', className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <Form {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="flex flex-col items-center text-center">
                  <h1 className="text-2xl font-bold">
                    {t('auth.register.title')}
                  </h1>
                  <p className="text-balance text-muted-foreground">
                    {t('auth.register.subtitle')}
                  </p>
                </div>

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.register.name')}</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.register.email')}</FormLabel>
                      <FormControl>
                        <Input placeholder="m@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.register.password')}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                 <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('auth.register.verify_password')}</FormLabel>
                      <FormControl>
                        <PasswordInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isPending}>
                  {t('auth.register.submit')}
                </Button>
                
                <div className="text-center text-sm space-x-1">
                  <span>{t('auth.register.already_have_account')}</span>
                  <a href={APP_ROUTES.AUTH.LOGIN} className="underline underline-offset-4">
                    {t('auth.register.login')}
                  </a>
                </div>
              </FieldGroup>
            </form>
          </Form>
          <div className="relative hidden bg-muted md:block">
            <img src="https://ui.shadcn.com/placeholder.svg" alt="register" className='absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale' />
          </div>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary space-x-1">
        <span>{t('auth.register.terms')}</span>
        <a href="/">{t('auth.register.terms_of_service')}</a>
        <span>{t('common.and')}</span>
        <a href="/">{t('auth.register.privacy_policy')}</a>.
      </div>
    </div>
  );
}
