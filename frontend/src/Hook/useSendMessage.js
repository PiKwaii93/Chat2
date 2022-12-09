export default function useSendMessage() {
    return function (userId, sendMessage, sendUser) {
        return fetch(`http://localhost:8245/message/${userId}&${sendUser}`, {
            method: 'POST',
            body: JSON.stringify(sendMessage)
        })
            .then(data => data.json())
            .then(data => data)
    }
}