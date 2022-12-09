export default function useGetChatMessage() {
    return function (userId, sendUserId) {
        return fetch(`http://localhost:8245/chat-message/${userId}&${sendUserId}`, {
            method: 'GET',
            mode: "cors"
        })
            .then(data => data.json())
    }
}