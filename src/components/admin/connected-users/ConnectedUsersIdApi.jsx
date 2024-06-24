import { useState, useEffect } from 'react';

export function DisplayUsersToAdminBackoffice() {
    const [connectedUserNames, setConnectedUserNames] = useState([]);

    useEffect(() => {
        const eventSource = new EventSource('http://localhost:3000/events');

        eventSource.onmessage = (event) => {
            const connectedUserNames = JSON.parse(event.data);
            setConnectedUserNames(connectedUserNames);
        };

        // Cleanup function to close the event source when the component unmounts
        return () => eventSource.close();
    }, []);

    return connectedUserNames;
}

