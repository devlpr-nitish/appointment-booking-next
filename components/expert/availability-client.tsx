"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Calendar } from "lucide-react"
import { AvailabilityList } from "@/components/expert/availability-list"
import { AvailabilityForm } from "@/components/expert/availability-form"
import { useToast } from "@/hooks/use-toast"
import {
    getAvailabilityAction,
    createAvailabilityAction,
    updateAvailabilityAction,
    deleteAvailabilityAction
} from "@/app/actions/expert"
import type { AvailabilitySlot, CreateAvailabilityData } from "@/lib/data/availability"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AvailabilityClient() {
    const [slots, setSlots] = useState<AvailabilitySlot[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showForm, setShowForm] = useState(false)
    const [editingSlot, setEditingSlot] = useState<AvailabilitySlot | null>(null)
    const [deleteId, setDeleteId] = useState<number | null>(null)
    const { toast } = useToast()

    // Load availability slots
    useEffect(() => {
        loadAvailability()
    }, [])

    const loadAvailability = async () => {
        try {
            setIsLoading(true)
            const result = await getAvailabilityAction()
            if (result.success) {
                setSlots(result.data)
            } else {
                toast({
                    title: "Error",
                    description: result.message || "Failed to load availability.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to load availability. Please try again.",
                variant: "destructive",
            })
        } finally {
            setIsLoading(false)
        }
    }

    const handleCreate = async (data: CreateAvailabilityData) => {
        try {
            setIsSubmitting(true)
            const result = await createAvailabilityAction(data)

            if (!result.success) {
                throw new Error(result.message)
            }

            setSlots([...slots, result.data])
            setShowForm(false)
            toast({
                title: "Success",
                description: "Availability added successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to add availability.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleUpdate = async (data: CreateAvailabilityData) => {
        if (!editingSlot) return

        try {
            setIsSubmitting(true)
            const result = await updateAvailabilityAction(editingSlot.id, data)

            if (!result.success) {
                throw new Error(result.message)
            }

            setSlots(slots.map((slot) => (slot.id === editingSlot.id ? result.data : slot)))
            setEditingSlot(null)
            toast({
                title: "Success",
                description: "Availability updated successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to update availability.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleDelete = async () => {
        if (!deleteId) return

        try {
            setIsSubmitting(true)
            const result = await deleteAvailabilityAction(deleteId)

            if (!result.success) {
                throw new Error(result.message)
            }

            setSlots(slots.filter((slot) => slot.id !== deleteId))
            setDeleteId(null)
            toast({
                title: "Success",
                description: "Availability deleted successfully.",
            })
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to delete availability.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleEdit = (slot: AvailabilitySlot) => {
        setEditingSlot(slot)
        setShowForm(false)
    }

    const handleCancel = () => {
        setShowForm(false)
        setEditingSlot(null)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Calendar className="h-6 w-6" />
                        Manage Availability
                    </h2>
                    <p className="text-muted-foreground mt-1">Set your weekly availability schedule</p>
                </div>
                {!showForm && !editingSlot && (
                    <Button onClick={() => setShowForm(true)} disabled={isLoading}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Availability
                    </Button>
                )}
            </div>

            {/* Form */}
            {(showForm || editingSlot) && (
                <AvailabilityForm
                    onSubmit={editingSlot ? handleUpdate : handleCreate}
                    onCancel={handleCancel}
                    initialData={editingSlot || undefined}
                    isLoading={isSubmitting}
                />
            )}

            {/* List */}
            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            ) : (
                <AvailabilityList slots={slots} onEdit={handleEdit} onDelete={setDeleteId} isLoading={isSubmitting} />
            )}

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={deleteId !== null} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete this availability slot. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isSubmitting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            {isSubmitting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}
