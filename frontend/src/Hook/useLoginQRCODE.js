export default function useLoginQRCODE() {
    return function (JWT) {
        return fetch(`http://localhost:8245/QrCode/${JWT}`, {
            method: 'POST',
        })
            .then(data => data.json())
            .then(data => data)
    }
}