'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Loader2, Github, Mail } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  rememberMe: z.boolean().default(false),
})

const resetFormSchema = z.object({
  email: z.string().email('Invalid email address'),
})

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isResetLoading, setIsResetLoading] = useState(false)
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  })

  const resetForm = useForm<z.infer<typeof resetFormSchema>>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsLoading(true)
      // TODO: Implement AWS Cognito authentication
      // const response = await signIn(values.email, values.password)
      
      // If remember me is checked, store the token in localStorage
      if (values.rememberMe) {
        // TODO: Implement token storage
        // localStorage.setItem('authToken', response.token)
      }

      toast({
        title: 'Success',
        description: 'Successfully logged in',
      })
      
      router.push('/journal')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Invalid credentials. Please try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function onResetPassword(values: z.infer<typeof resetFormSchema>) {
    try {
      setIsResetLoading(true)
      // TODO: Implement AWS Cognito password reset
      // await resetPassword(values.email)
      
      toast({
        title: 'Success',
        description: 'Password reset link sent to your email',
      })
      
      setIsResetDialogOpen(false)
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to send reset link. Please try again.',
      })
    } finally {
      setIsResetLoading(false)
    }
  }

  async function handleSocialLogin(provider: 'github' | 'google') {
    try {
      setIsLoading(true)
      // TODO: Implement social login with AWS Cognito
      // await socialSignIn(provider)
      
      toast({
        title: 'Success',
        description: `Successfully logged in with ${provider}`,
      })
      
      router.push('/journal')
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: `Failed to login with ${provider}`,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container flex items-center justify-center min-h-screen py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <h2 className="text-2xl font-bold text-center">Welcome back</h2>
          <p className="text-sm text-muted-foreground text-center">
            Enter your credentials to sign in
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Social Login Buttons */}
          <div className="space-y-2">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin('github')}
              disabled={isLoading}
            >
              <Github className="mr-2 h-4 w-4" />
              Continue with GitHub
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin('google')}
              disabled={isLoading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Continue with Google
            </Button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          {/* Email/Password Form */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                        disabled={isLoading}
                      />
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
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              {/* Remember Me Checkbox */}
              <FormField
                control={form.control}
                name="rememberMe"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">
                      Remember me
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Sign In
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-between w-full text-sm">
            <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="link" className="px-0">
                  Forgot password?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Reset Password</DialogTitle>
                </DialogHeader>
                <Form {...resetForm}>
                  <form onSubmit={resetForm.handleSubmit(onResetPassword)} className="space-y-4">
                    <FormField
                      control={resetForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              {...field}
                              disabled={isResetLoading}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={isResetLoading}>
                      {isResetLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Reset Link
                    </Button>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
            <Link href="/register" className="text-primary hover:underline">
              Create account
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
