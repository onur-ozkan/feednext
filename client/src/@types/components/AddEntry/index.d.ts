export interface AddEntryProps {
    accessToken: string,
    titleId: string,
    setEntryList: React.Dispatch<React.SetStateAction<{
        entries: EntryAttributes[],
        count: number
    }>>
}
