"use client"
import * as z from "zod";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { UserInfo } from "@prisma/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { updateUserInfoAction } from "@/actions/userinfo";


interface DescriptionFormProps {
    initialData: UserInfo
    userId: string;
};

const formSchema = z.object({
    description: z.string().min(1, { message: "Description is required" })
});

const DescriptionForm = ({ initialData, userId }: DescriptionFormProps) => {

    const router = useRouter();
    const [isEditing, setIsEditing] = useState<boolean>(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description!
        },
    });

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const { success, message } = await updateUserInfoAction(userId, initialData?.id, values);
            if (success) {
                router.refresh();
                setIsEditing(false);
                toast({
                    title: message,
                });
            }
        } catch (error: any) {
            console.log(error);
            return toast({
                title: "Something wemt wrong!",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="mt-6 border bg-slate-100 dark:bg-gray-900 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Your Description
                <Button onClick={() => setIsEditing(!isEditing)} variant={'outline'} >
                    {isEditing ?
                        (
                            <>Cancel</>
                        )
                        :
                        (
                            <>
                                <Pencil className="h-4 w-4 mr-2" />
                                Edit
                            </>
                        )}
                </Button>
            </div>
            {!isEditing && (
                <p className="text-sm mt-2" >
                    {initialData?.description || "No description"}
                </p>
            )}
            {isEditing && (
                <Form {...form} >
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4" >
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            rows={10}
                                            disabled={isSubmitting}
                                            placeholder="Enter about yourself."
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="submit" disabled={!isValid || isSubmitting} >
                                Save
                            </Button>
                        </div>
                    </form>
                </Form>
            )}
        </div>
    );
};

export default DescriptionForm;