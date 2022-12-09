export default function useBackendPing() {
    return function (userId, sendMessage, sendUser) {
        return fetch(`http://localhost:8245/ping/${userId}&${sendMessage}&${sendUser}`, {
            method: 'POST',
        })
            .then(data => data.json())
            .then(data => data)
    }
}