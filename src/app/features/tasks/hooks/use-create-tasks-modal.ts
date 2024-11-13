import { useQueryState, parseAsBoolean } from "nuqs"


export const useCreateTasksModal = () => {
    const [ isOpen , setIsOpen] = useQueryState(
        "create-task",
        parseAsBoolean.withDefault(false).withOptions({ clearOnDefault: true})
    )


    const open = () => setIsOpen(true);
    const close = () => setIsOpen(false);



    return {
        isOpen,
        open,
        close,
        setIsOpen,
    }
}