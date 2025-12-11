"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Textarea,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
  Avatar,
  AvatarFallback,
  AvatarImage,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
  ThemeToggle,
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Skeleton,
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  User,
  Mail,
  Settings,
  LogOut,
  Download,
  Upload,
  Trash2,
  MoreHorizontal,
  Calendar,
  Bell,
} from "lucide-react";

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  bio: z.string().optional(),
});

export default function StyleguidePage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [switchChecked, setSwitchChecked] = useState(false);
  const [checkboxChecked, setCheckboxChecked] = useState(false);
  const [radioValue, setRadioValue] = useState("option-one");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      bio: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.success("Form submitted!", {
      description: `Username: ${values.username}, Email: ${values.email}`,
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Component Styleguide</h1>
          <p className="text-muted-foreground text-lg">
            A comprehensive showcase of all shadcn/ui components with best practices
          </p>
        </div>

        <Tabs defaultValue="buttons" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
            <TabsTrigger value="buttons">Buttons & Actions</TabsTrigger>
            <TabsTrigger value="forms">Forms & Inputs</TabsTrigger>
            <TabsTrigger value="overlays">Overlays</TabsTrigger>
            <TabsTrigger value="display">Display</TabsTrigger>
          </TabsList>

          {/* Buttons & Actions Tab */}
          <TabsContent value="buttons" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Buttons</CardTitle>
                <CardDescription>
                  Button component with multiple variants and sizes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Button>Default</Button>
                  <Button variant="secondary">Secondary</Button>
                  <Button variant="destructive">Destructive</Button>
                  <Button variant="outline">Outline</Button>
                  <Button variant="ghost">Ghost</Button>
                  <Button variant="link">Link</Button>
                </div>
                <Separator />
                <div className="flex flex-wrap items-center gap-4">
                  <Button size="sm">Small</Button>
                  <Button size="default">Default</Button>
                  <Button size="lg">Large</Button>
                  <Button size="icon">
                    <Settings className="size-4" />
                  </Button>
                </div>
                <Separator />
                <div className="flex flex-wrap items-center gap-4">
                  <Button disabled>Disabled</Button>
                  <Button variant="outline" disabled>
                    Disabled Outline
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Badges</CardTitle>
                <CardDescription>Badge component for labels and tags</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap items-center gap-4">
                  <Badge>Default</Badge>
                  <Badge variant="secondary">Secondary</Badge>
                  <Badge variant="destructive">Destructive</Badge>
                  <Badge variant="outline">Outline</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Theme toggle</CardTitle>
                <CardDescription>
                  Switch between light and dark to preview the theme
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center gap-4">
                <ThemeToggle />
                <p className="text-muted-foreground text-sm">
                  This uses the shared toggle also present in the header.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Dropdown Menu</CardTitle>
                <CardDescription>
                  Context menu with various item types
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline">Open Menu</Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <User className="mr-2 size-4" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="mr-2 size-4" />
                      <span>Settings</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive">
                      <LogOut className="mr-2 size-4" />
                      <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Forms & Inputs Tab */}
          <TabsContent value="forms" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Input Fields</CardTitle>
                <CardDescription>
                  Text input components with labels
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="name@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" placeholder="Enter password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="disabled">Disabled Input</Label>
                  <Input id="disabled" disabled placeholder="Disabled input" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Textarea</CardTitle>
                <CardDescription>Multi-line text input</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Type your message here..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Select</CardTitle>
                <CardDescription>Dropdown selection component</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label>Select an option</Label>
                  <Select defaultValue="option1">
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select option" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="option1">Option 1</SelectItem>
                      <SelectItem value="option2">Option 2</SelectItem>
                      <SelectItem value="option3">Option 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Checkbox & Switch</CardTitle>
                <CardDescription>Toggle and selection components</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={checkboxChecked}
                    onCheckedChange={(checked) =>
                      setCheckboxChecked(checked === true)
                    }
                  />
                  <Label
                    htmlFor="terms"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Accept terms and conditions
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="notifications"
                    checked={switchChecked}
                    onCheckedChange={setSwitchChecked}
                  />
                  <Label htmlFor="notifications">Enable notifications</Label>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Radio Group</CardTitle>
                <CardDescription>Single selection from multiple options</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={radioValue} onValueChange={setRadioValue}>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" />
                    <Label htmlFor="option-one">Option One</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two" />
                    <Label htmlFor="option-two">Option Two</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-three" id="option-three" />
                    <Label htmlFor="option-three">Option Three</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form with Validation</CardTitle>
                <CardDescription>
                  Complete form example with react-hook-form and zod validation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="johndoe" {...field} />
                          </FormControl>
                          <FormDescription>
                            This is your public display name.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormDescription>
                            We'll never share your email.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about yourself"
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            A brief description of yourself.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Submit</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Overlays Tab */}
          <TabsContent value="overlays" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Dialog</CardTitle>
                <CardDescription>Modal dialog component</CardDescription>
              </CardHeader>
              <CardContent>
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button>Open Dialog</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your
                        account and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                      <Button variant="outline" onClick={() => setDialogOpen(false)}>
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => {
                          setDialogOpen(false);
                          toast.error("Account deleted");
                        }}
                      >
                        Delete Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sheet</CardTitle>
                <CardDescription>Slide-out panel component</CardDescription>
              </CardHeader>
              <CardContent>
                <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
                  <SheetTrigger asChild>
                    <Button>Open Sheet</Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Edit Profile</SheetTitle>
                      <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                      </SheetDescription>
                    </SheetHeader>
                    <div className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" placeholder="John Doe" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popover</CardTitle>
                <CardDescription>Popover component for additional content</CardDescription>
              </CardHeader>
              <CardContent>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline">Open Popover</Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="font-medium leading-none">Dimensions</h4>
                      <p className="text-muted-foreground text-sm">
                        Set the dimensions for the layer.
                      </p>
                      <div className="grid gap-2">
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="width">Width</Label>
                          <Input
                            id="width"
                            defaultValue="100%"
                            className="col-span-2 h-8"
                          />
                        </div>
                        <div className="grid grid-cols-3 items-center gap-4">
                          <Label htmlFor="height">Height</Label>
                          <Input
                            id="height"
                            defaultValue="25px"
                            className="col-span-2 h-8"
                          />
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Toast Notifications</CardTitle>
                <CardDescription>
                  Toast notifications using Sonner (toast component is deprecated)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  <Button
                    onClick={() => toast.success("Success! Your changes have been saved.")}
                  >
                    Success Toast
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => toast.error("Error! Something went wrong.")}
                  >
                    Error Toast
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => toast.info("Info: Here's some information.")}
                  >
                    Info Toast
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => toast.warning("Warning: Please check your input.")}
                  >
                    Warning Toast
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Display Tab */}
          <TabsContent value="display" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cards</CardTitle>
                <CardDescription>Card component structure</CardDescription>
              </CardHeader>
              <CardContent>
                <Card>
                  <CardHeader>
                    <CardTitle>Card Title</CardTitle>
                    <CardDescription>Card Description</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>This is the card content area.</p>
                  </CardContent>
                  <CardFooter>
                    <Button>Action</Button>
                  </CardFooter>
                </Card>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Avatar</CardTitle>
                <CardDescription>User avatar component</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Separator</CardTitle>
                <CardDescription>Visual divider component</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium leading-none">Radix Primitives</h4>
                    <p className="text-muted-foreground text-sm">
                      An open-source UI component library.
                    </p>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex h-5 items-center space-x-4 text-sm">
                    <div>Blog</div>
                    <Separator orientation="vertical" />
                    <div>Docs</div>
                    <Separator orientation="vertical" />
                    <div>Source</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Table</CardTitle>
                <CardDescription>Data table component</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>A list of recent invoices.</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">Invoice</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">INV001</TableCell>
                      <TableCell>
                        <Badge variant="outline">Paid</Badge>
                      </TableCell>
                      <TableCell>Credit Card</TableCell>
                      <TableCell className="text-right">$250.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV002</TableCell>
                      <TableCell>
                        <Badge variant="destructive">Pending</Badge>
                      </TableCell>
                      <TableCell>PayPal</TableCell>
                      <TableCell className="text-right">$150.00</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">INV003</TableCell>
                      <TableCell>
                        <Badge variant="outline">Paid</Badge>
                      </TableCell>
                      <TableCell>Bank Transfer</TableCell>
                      <TableCell className="text-right">$350.00</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Skeleton</CardTitle>
                <CardDescription>Loading placeholder component</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <div className="flex items-center space-x-4">
                  <Skeleton className="size-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
