import { API_URL } from '@env';
import { useCallback } from 'react';

const URL_BASE = API_URL

export default function useAPI() {

    const httpGet = useCallback(async function (uri: string, token?: string): Promise<any> {

        const headers: HeadersInit = {}
        if (token) {
            headers.Authorization = `Bearer ${token}`
        }

        const res = await fetch(`${URL_BASE}/${uri}`, { headers })
        console.log('httpGet response:', res);
        const data = await res.json()
        console.log('httpGet data:', data);
        return data
    }, [])

    const httpPost = useCallback(async function (uri: string, body: any, token?: string): Promise<Response> {
        console.log('httpPost called with:', URL_BASE, uri, body);
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

    const httpPut = useCallback(
        async (uri: string, body: any, token?: string) => {
            console.log('httpPut called with:', uri, body);

            try {
                const headers: HeadersInit = {
                    'Content-Type': 'application/json',
                };

                if (token) {
                    headers.Authorization = `Bearer ${token}`;
                }

                const response = await fetch(`${URL_BASE}/${uri}`, {
                    method: 'PUT',
                    headers,
                    body: JSON.stringify(body),
                });

                const data = await response.json(); // 🔥 AQUI ESTAVA O ERRO

                console.log('httpPut parsed response:', data);

                return {
                    ok: response.ok,
                    status: response.status,
                    data,
                };
            } catch (error) {
                console.error('Erro na requisição:', error);
                throw error;
            }
        },
        []
    );


    const listarVagas = useCallback(async function (token: string): Promise<any> {
        try {
            console.log('listarVagas called with token:', token, URL_BASE);
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
    //patch

   const httpPatch = useCallback(async function (uri: string, body: any, token?: string): Promise<Response> {
    try {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(`${URL_BASE}/${uri}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify(body),
        });

        // NÃO faça response.json() aqui
        // Apenas retorne o objeto Response
        console.log('httpPatch response status:', response.status);
        console.log('httpPatch response ok:', response.ok);
        
        return response; // ← Retorne o Response, não o JSON
        
    } catch (error) {
        console.error('Erro na requisição:', error);
        throw error;
    }
}, []);
    const httpDelete = useCallback(async function (uri: string, token?: string): Promise<Response> {
        console.log('httpDelete called with:', uri);
        try {
            const headers: HeadersInit = {}

            if (token) {
                headers.Authorization = `Bearer ${token}`
            }

            const response = await fetch(`${URL_BASE}/${uri}`, {
                method: 'DELETE',
                headers,
            });
            console.log('httpDelete response:', response);
            return response;
        } catch (error) {
            console.error('Erro na requisição:', error);
            throw error;
        }
    }, [])

    const buscarStatusInscricao = async (uri: string, token?: string): Promise<Response> => {
        const headers: HeadersInit = { "Content-Type": "application/json" };
        if (token) headers.Authorization = `Bearer ${token}`;
        return fetch(`${URL_BASE}/${uri}`, { method: "GET", headers });
    };


    //   const buscarOngId = useCallback(async function (uri: string, token?: string, ): Promise<any> {

    //     const headers: HeadersInit = {}
    //     if (token) {
    //         headers.Authorization = `Bearer ${token}`
    //     }

    //     const res = await fetch(`${URL_BASE}/${uri}`, { headers })
    //     const data = await res.json()
    //     return data
    // }, [])
    return { httpGet, httpPost, httpPut, httpDelete, listarVagas, buscarStatusInscricao, httpPatch }
}
