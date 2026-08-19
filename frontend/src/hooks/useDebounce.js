import { useEffect } from "react";
import { useState } from "react"


export const useDebounce = ({ value, delay = 500 }) => {

    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => {
            clearTimeout(timer)
        };
    }, [delay, value])

    return {
        debounceValue
    }

};

// const [search, setSearch] = useState("");

// const debouncedSearch = useDebounce(search, 500);