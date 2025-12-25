import useAPI from "@/data/hooks/useAPI";






export default function useInscricoes() {
    const {httpGet, httpDelete } = useAPI()
     async function fetchInscricoes(token: string) {
            try {
                const res = await httpGet('listar/inscricoes', token!);
                return res.inscricoes || [];
               
            } catch (error) {
                console.log('Erro ao buscar inscrições:', error);
            } 
        }
    async function cancelarInscricao(id: string, token: string) {
        try {
            const res = await httpDelete(`inscricao/${id}`, token);
            return res;
        } catch (error) {
            console.log('Erro ao cancelar inscrições:', error);
            
        }
    }
    return {fetchInscricoes,cancelarInscricao}

}