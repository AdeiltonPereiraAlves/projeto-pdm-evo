import { useCallback } from 'react'

const URL_BASE = 'http://192.168.0.106:3001' // process.env.URL_BASE

export default function useAPI() {
    const httpGet = useCallback(async function (uri: string): Promise<any> {
        const res = await fetch(`${URL_BASE}/${uri}`)
        const data = await res.json()
        return data
    }, [])

    const httpPost = useCallback(async function (uri: string, body: any): Promise<Response> {
        console.log('httpPost called with:', uri, body);
        try {
            const response = await fetch(`${URL_BASE}/${uri}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });
            console.log('httpPost response:', response);
            return response;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }, [])

    return { httpGet, httpPost }
}
