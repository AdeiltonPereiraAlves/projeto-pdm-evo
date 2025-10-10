/**
 * Utilitários para máscaras de formatação de dados brasileiros
 */

/**
 * Aplica máscara de CPF: 000.000.000-00
 */
export function mascaraCPF(value: string): string {
    // Remove tudo que não é dígito
    const numeros = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitado = numeros.slice(0, 11);
    
    // Aplica a máscara
    return limitado
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/**
 * Aplica máscara de CNPJ: 00.000.000/0000-00
 */
export function mascaraCNPJ(value: string): string {
    // Remove tudo que não é dígito
    const numeros = value.replace(/\D/g, '');
    
    // Limita a 14 dígitos
    const limitado = numeros.slice(0, 14);
    
    // Aplica a máscara
    return limitado
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

/**
 * Aplica máscara de telefone celular: (00) 00000-0000
 * Ou telefone fixo: (00) 0000-0000
 */
export function mascaraTelefone(value: string): string {
    // Remove tudo que não é dígito
    const numeros = value.replace(/\D/g, '');
    
    // Limita a 11 dígitos
    const limitado = numeros.slice(0, 11);
    
    // Aplica máscara baseada no tamanho
    if (limitado.length <= 10) {
        // Telefone fixo: (00) 0000-0000
        return limitado
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    } else {
        // Celular: (00) 00000-0000
        return limitado
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
    }
}

/**
 * Remove a máscara e retorna apenas os números
 */
export function removerMascara(value: string): string {
    return value.replace(/\D/g, '');
}

/**
 * Valida CPF (algoritmo oficial)
 */
export function validarCPF(cpf: string): boolean {
    const numeros = removerMascara(cpf);
    
    if (numeros.length !== 11) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{10}$/.test(numeros)) return false;
    
    // Validação do primeiro dígito verificador
    let soma = 0;
    for (let i = 0; i < 9; i++) {
        soma += parseInt(numeros.charAt(i)) * (10 - i);
    }
    let digito1 = 11 - (soma % 11);
    if (digito1 > 9) digito1 = 0;
    
    if (parseInt(numeros.charAt(9)) !== digito1) return false;
    
    // Validação do segundo dígito verificador
    soma = 0;
    for (let i = 0; i < 10; i++) {
        soma += parseInt(numeros.charAt(i)) * (11 - i);
    }
    let digito2 = 11 - (soma % 11);
    if (digito2 > 9) digito2 = 0;
    
    if (parseInt(numeros.charAt(10)) !== digito2) return false;
    
    return true;
}

/**
 * Valida CNPJ (algoritmo oficial)
 */
export function validarCNPJ(cnpj: string): boolean {
    const numeros = removerMascara(cnpj);
    
    if (numeros.length !== 14) return false;
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1{13}$/.test(numeros)) return false;
    
    // Validação do primeiro dígito verificador
    let tamanho = numeros.length - 2;
    let numeros_cnpj = numeros.substring(0, tamanho);
    const digitos = numeros.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros_cnpj.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(0))) return false;
    
    // Validação do segundo dígito verificador
    tamanho = tamanho + 1;
    numeros_cnpj = numeros.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    
    for (let i = tamanho; i >= 1; i--) {
        soma += parseInt(numeros_cnpj.charAt(tamanho - i)) * pos--;
        if (pos < 2) pos = 9;
    }
    
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado !== parseInt(digitos.charAt(1))) return false;
    
    return true;
}

/**
 * Valida telefone brasileiro
 */
export function validarTelefone(telefone: string): boolean {
    const numeros = removerMascara(telefone);
    
    // Telefone deve ter 10 (fixo) ou 11 (celular) dígitos
    if (numeros.length < 10 || numeros.length > 11) return false;
    
    // DDD válido (11 a 99)
    const ddd = parseInt(numeros.substring(0, 2));
    if (ddd < 11 || ddd > 99) return false;
    
    return true;
}
export function formatarArrays(dados:any) {
    return {
      ...dados,
      habilidades: dados.habilidades?.join(", ") || "",
     
    };
  }
  export function arrayParaString(array: string[] | null | undefined): string {
    if (!array || array.length === 0) return "";
    return array.join(", "); // Ex: ["Educação", "Tecnologia"] → "Educação, Tecnologia"
  }
  export function stringParaArray(texto: string | null | undefined): string[] {
    if (!texto) return [];
    return texto.split(",").map((item) => item.trim()); // "Educação, Tecnologia" → ["Educação", "Tecnologia"]
  }