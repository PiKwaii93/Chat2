export default function useGetOneUser() {
    return function (userId) {
        return fetch(`http://localhost:8245/one-user/${userId}`, {
            method: 'GET',
            mode: "cors"
        })
            .then(data => data.json())
    }
}