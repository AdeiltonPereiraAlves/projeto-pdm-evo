export function formatarData(data:any){
    const dataFormatada = new Date(data).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      return dataFormatada
  }