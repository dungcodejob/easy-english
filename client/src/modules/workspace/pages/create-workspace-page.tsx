import { Button } from '@/shared/ui/shadcn/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/shadcn/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/shadcn/form';
import { Input } from '@/shared/ui/shadcn/input';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { Textarea } from '@/shared/ui/shadcn/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { LanguagePicker } from '../components/language-picker';
import { useCreateWorkspace } from '../hooks/create-workspace';
import { Language } from '../types/workspace.types';

const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required'),
  description: z.string().optional(),
  language: z.enum(Language).refine(val => val !== undefined, {
    message: 'Please select a language',
  }),
});

export const Route = createFileRoute(`/_(onboarding)/onboarding/workspace`)({
  component: CreateWorkspacePage,
});

type CreateWorkspaceSchema = z.infer<typeof createWorkspaceSchema>;

export default function CreateWorkspacePage() {
  const navigate = useNavigate();
  const { mutateAsync: createWorkspace, isPending } = useCreateWorkspace()


  const form = useForm<CreateWorkspaceSchema>({
    resolver: zodResolver(createWorkspaceSchema),
    defaultValues: {
      name: '',
      description: '',
      // No default language - require explicit selection
    },
  });

  const selectedLanguage = form.watch('language');

  const onSubmit = async (data: CreateWorkspaceSchema) => {
    try {
      await createWorkspace(data);
      navigate({ to: '/' });
    } catch (error) {
      console.error('Failed to create workspace:', error);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your First Workspace</CardTitle>
        <CardDescription>
          A workspace is where all your learning materials will live.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Language Selection Section */}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Workspace Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My English Learning" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <div className="space-y-1">
                <h3 className="text-sm font-semibold">What language are you learning?</h3>
                <p className="text-sm text-muted-foreground">
                  Choose the primary language for your workspace. You can create another workspace for a different language later.
                </p>
              </div>

              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>

                    <FormControl>
                      <LanguagePicker
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>


            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description about this workspace" 
                      className="resize-none" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isPending || !selectedLanguage}
            >
              {isPending ? <>
               <Spinner />
                Creating...
              </> : 'Create Workspace'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
