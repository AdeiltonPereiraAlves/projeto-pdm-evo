import { useCallback } from 'react'

const URL_BASE = 'http://192.168.0.101:3001' // process.env.URL_BASE

export default function useAPI() {
    const httpGet = useCallback(async function (uri: string, token?: string): Promise<any> {
        const headers: HeadersInit = {}
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }
        
        const res = await fetch(`${URL_BASE}/${uri}`, { headers })
        const data = await res.json()
        return data
    }, [])

    const httpPost = useCallback(async function (uri: string, body: any, token?: string): Promise<Response> {
        console.log('httpPost called with:', uri, body);
        try {
            const headers: HeadersInit = {
                'Content-Type': 'application/json',
            }
            
            if (token) {
                headers.Authorization = `Bearer ${token}`
            }
            
            const response = await fetch(`${URL_BASE}/${uri}`, {
                method: 'POST',
                headers,
                body: JSON.stringify(body),
            });
            console.log('httpPost response:', response);
            return response;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }, [])

    const listarVagas = useCallback(async function (token: string): Promise<any> {
        console.log('listarVagas called with token:', token);
        try {
            const response = await fetch(`${URL_BASE}/listar/vagas`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('listarVagas response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('listarVagas data:', data);
                
                // Verificar se a resposta tem o formato esperado
                if (Array.isArray(data)) {
                    return data;
                } else if (data && Array.isArray(data.vagas)) {
                    return data.vagas;
                } else if (data && Array.isArray(data.data)) {
                    return data.data;
                } else {
                    console.warn('Formato de resposta inesperado:', data);
                    return [];
                }
            } else {
                const errorText = await response.text();
                console.error('Erro na resposta:', response.status, errorText);
                throw new Error(`Erro ao listar vagas: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao listar vagas:', error);
            throw error;
        }
    }, [])

    // pega vaga por id
    const vagaPorId = useCallback(async function (token: string): Promise<any> {
        console.log('listarVagas called with token:', token);
        try {
            const response = await fetch(`${URL_BASE}/listar/vagas`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            console.log('listarVagas response:', response);
            
            if (response.ok) {
                const data = await response.json();
                console.log('listarVagas data:', data);
                
                // Verificar se a resposta tem o formato esperado
                // if (Array.isArray(data)) {
                //     return data;
                // } else if (data && Array.isArray(data.vagas)) {
                //     return data.vagas;
                // } else if (data && Array.isArray(data.data)) {
                //     return data.data;
                // } else {
                //     console.warn('Formato de resposta inesperado:', data);
                //     return [];
                // }
            } else {
                const errorText = await response.text();
                console.error('Erro na resposta:', response.status, errorText);
                throw new Error(`Erro ao listar vagas: ${response.status}`);
            }
        } catch (error) {
            console.error('Erro ao listar vagas:', error);
            throw error;
        }
    }, [])
    return { httpGet, httpPost, listarVagas }
}
