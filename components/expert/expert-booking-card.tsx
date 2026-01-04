"use client"

import { Booking, updateBookingStatusAction } from "@/app/actions/booking-actions"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, Clock, DollarSign, UserIcon } from "lucide-react"
import { format } from "date-fns"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useRouter } from "next/navigation"

interface ExpertBookingCardProps {
    booking: Booking
}

export function ExpertBookingCard({ booking }: ExpertBookingCardProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [cancelReason, setCancelReason] = useState("")
    const { toast } = useToast()
    const router = useRouter()

    const handleStatusUpdate = async (status: string) => {
        try {
            setIsLoading(true)
            // Since updateBookingStatus is a server action (or server-side caller), but here it's imported from a file using 'cookies()'. 
            // 'cookies()' only works in Server Components or Server Actions.
            // We need a Server Action wrapper or API route for client-side calling.
            // Wait, lib/data/expert-bookings.ts uses `cookies()`, so it MUST be called from a Server Component.
            // BUT we are in a "use client" component.
            // WE NEED TO CREATE AN ACTION FILE for this. 
            // I will fix this in the next step.

            // For now assuming I'll create an action.
            await updateBookingStatusAction(booking.ID, status, cancelReason)

            toast({
                title: "Success",
                description: `Booking ${status} successfully`,
            })
            router.refresh()
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Something went wrong",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "confirmed": return "bg-green-500"
            case "cancelled": return "bg-red-500"
            case "completed": return "bg-blue-500"
            default: return "bg-yellow-500"
        }
    }

    return (
        <Card className="w-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                    <Avatar>
                        <AvatarImage src={booking.user?.image} />
                        <AvatarFallback><UserIcon className="h-4 w-4" /></AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                        <h4 className="text-sm font-semibold">{booking.user?.name || "Unknown User"}</h4>
                        <p className="text-xs text-muted-foreground">{booking.user?.email}</p>
                    </div>
                </div>
                <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
            </CardHeader>
            <CardContent className="grid gap-4 py-4">
                <div className="flex items-center space-x-4 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span>{format(new Date(booking.booking_date), "PPP")}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.start_time} - {booking.end_time}</span>
                </div>
                <div className="flex items-center space-x-4 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>${booking.total_price}</span>
                </div>
                {booking.cancellation_reason && (
                    <div className="rounded-md bg-muted p-2 text-sm text-muted-foreground">
                        Reason: {booking.cancellation_reason}
                    </div>
                )}
            </CardContent>
            {booking.status === "pending" && (
                <CardFooter className="flex justify-end space-x-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm" disabled={isLoading}>
                                Cancel
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Are you sure you want to cancel this booking? This action cannot be undone.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="grid gap-2 py-4">
                                <Label htmlFor="reason">Reason for cancellation</Label>
                                <Textarea
                                    id="reason"
                                    value={cancelReason}
                                    onChange={(e) => setCancelReason(e.target.value)}
                                    placeholder="Please provide a reason..."
                                />
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Back</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleStatusUpdate("cancelled")} disabled={!cancelReason}>
                                    Confirm Cancel
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>

                    <Button
                        size="sm"
                        onClick={() => handleStatusUpdate("confirmed")}
                        disabled={isLoading}
                    >
                        Confirm
                    </Button>
                </CardFooter>
            )}
        </Card>
    )
}

