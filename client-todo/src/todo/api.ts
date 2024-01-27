export const fetcher = async (...args: [input: RequestInfo, init?: RequestInit]) => {
    const response = await fetch(...args)
    const { data: todos, error } = await response.json();

    if (error) {
        throw new Error(error.message);
    }
    return todos;
}
