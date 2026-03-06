"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { createRequest, getCategories, Category } from "@/lib/data/negotiation";
import {
    Briefcase,
    Clock,
    IndianRupee,
    FileText,
    Calendar,
    CheckCircle2,
    ArrowRight,
    Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const formSchema = z.object({
    category_id: z.string().min(1, "Please select a category"),
    amount: z.number().min(1, "Amount must be greater than 0"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    preferred_time: z.string().optional(),
    duration: z.number().min(15).max(480).optional(),
});

type FormValues = z.infer<typeof formSchema>;

function SuccessState({ onViewRequest, requestId }: { onViewRequest: () => void; requestId: string }) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center py-12 px-6 space-y-5"
        >
            <div className="relative">
                <div className="h-20 w-20 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center">
                    <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
                </div>
                <span className="absolute -right-1 -top-1 flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                </span>
            </div>
            <div className="space-y-2">
                <h2 className="text-2xl font-bold tracking-tight">Request Sent!</h2>
                <p className="text-muted-foreground max-w-sm">
                    Your request is live. Experts matching your category are already reviewing it in real-time.
                </p>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground bg-muted/50 rounded-full px-4 py-2">
                <span className="relative flex h-2 w-2 mr-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Waiting for expert offers...
            </div>
            <Button
                onClick={onViewRequest}
                className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2 mt-2"
                size="lg"
            >
                View Negotiation
                <ArrowRight className="h-4 w-4" />
            </Button>
        </motion.div>
    );
}

export function CreateRequestForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [createdRequestId, setCreatedRequestId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchCategories() {
            try {
                const data = await getCategories();
                setCategories(data);
            } catch (error) {
                toast({ variant: "destructive", title: "Error", description: "Failed to load categories" });
            }
        }
        fetchCategories();
    }, [toast]);

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category_id: "",
            amount: undefined,
            description: "",
            preferred_time: "",
            duration: 60,
        },
    });

    async function onSubmit(values: FormValues) {
        setIsLoading(true);
        try {
            const req = await createRequest(
                values.category_id,
                values.amount,
                values.description,
                values.preferred_time || undefined,
                values.duration,
            );
            setCreatedRequestId(req.id);
            setIsSuccess(true);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: error.message || "Failed to create request",
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (isSuccess && createdRequestId) {
        return (
            <SuccessState
                requestId={createdRequestId}
                onViewRequest={() => router.push(`/requests/${createdRequestId}`)}
            />
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Category & Duration row */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="category_id"
                        render={({ field }) => (
                            <FormItem className="col-span-2 sm:col-span-1">
                                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                                    <Briefcase className="h-3.5 w-3.5 text-muted-foreground" />
                                    Category / Expertise
                                </FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger className="h-10">
                                            <SelectValue placeholder="Select expertise" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem className="col-span-2 sm:col-span-1">
                                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                                    Duration (minutes)
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="60"
                                        className="h-10"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                {/* Description */}
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                                <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                                Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Describe what you need help with..."
                                    className="min-h-[100px] resize-none text-sm"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Preferred time & Price row */}
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="preferred_time"
                        render={({ field }) => (
                            <FormItem className="col-span-2 sm:col-span-1">
                                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                    Preferred Time
                                    <span className="text-xs text-muted-foreground font-normal">(optional)</span>
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        type="datetime-local"
                                        className="h-10 text-sm"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem className="col-span-2 sm:col-span-1">
                                <FormLabel className="flex items-center gap-1.5 text-sm font-medium">
                                    <IndianRupee className="h-3.5 w-3.5 text-muted-foreground" />
                                    Proposed Price
                                </FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <span className="text-sm font-medium text-muted-foreground">₹</span>
                                        </div>
                                        <Input
                                            type="number"
                                            placeholder="500"
                                            className="pl-7 h-10 text-sm font-semibold"
                                            {...field}
                                            onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground gap-2 font-medium"
                >
                    {isLoading ? (
                        <span className="flex items-center gap-2">
                            <span className="h-4 w-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                            Sending Request...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4" />
                            Send Request
                        </span>
                    )}
                </Button>
            </form>
        </Form>
    );
}
