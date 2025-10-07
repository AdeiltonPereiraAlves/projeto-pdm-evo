# Utilitários de Máscaras Brasileiras

Este módulo fornece funções para aplicar máscaras de formatação em dados brasileiros (CPF, CNPJ, Telefone).

## 📋 Funções Disponíveis

### `mascaraCPF(value: string): string`

Aplica máscara de CPF no formato: `000.000.000-00`

**Exemplo:**
```typescript
import { mascaraCPF } from "@/utils/masks";

const cpf = mascaraCPF("12345678901");
// Retorna: "123.456.789-01"

const cpfParcial = mascaraCPF("123456");
// Retorna: "123.456"
```

**Características:**
- Remove automaticamente caracteres não numéricos
- Limita a 11 dígitos
- Aplica a formatação progressivamente conforme o usuário digita
- `maxLength` recomendado: **14** (11 dígitos + 3 caracteres de formatação)

---

### `mascaraCNPJ(value: string): string`

Aplica máscara de CNPJ no formato: `00.000.000/0000-00`

**Exemplo:**
```typescript
import { mascaraCNPJ } from "@/utils/masks";

const cnpj = mascaraCNPJ("12345678000195");
// Retorna: "12.345.678/0001-95"

const cnpjParcial = mascaraCNPJ("123456");
// Retorna: "12.345.6"
```

**Características:**
- Remove automaticamente caracteres não numéricos
- Limita a 14 dígitos
- Aplica a formatação progressivamente conforme o usuário digita
- `maxLength` recomendado: **18** (14 dígitos + 4 caracteres de formatação)

---

### `mascaraTelefone(value: string): string`

Aplica máscara de telefone brasileiro. Suporta:
- **Celular:** `(00) 00000-0000` (11 dígitos)
- **Fixo:** `(00) 0000-0000` (10 dígitos)

**Exemplo:**
```typescript
import { mascaraTelefone } from "@/utils/masks";

// Celular
const celular = mascaraTelefone("11987654321");
// Retorna: "(11) 98765-4321"

// Fixo
const fixo = mascaraTelefone("1133334444");
// Retorna: "(11) 3333-4444"

// Parcial
const parcial = mascaraTelefone("11987");
// Retorna: "(11) 987"
```

**Características:**
- Remove automaticamente caracteres não numéricos
- Limita a 11 dígitos
- Detecta automaticamente se é celular (11 dígitos) ou fixo (10 dígitos)
- Aplica a formatação progressivamente conforme o usuário digita
- `maxLength` recomendado: **15** (11 dígitos + 4 caracteres de formatação)

---

### `removerMascara(value: string): string`

Remove toda a formatação e retorna apenas os números.

**Exemplo:**
```typescript
import { removerMascara } from "@/utils/masks";

const cpfSemMascara = removerMascara("123.456.789-01");
// Retorna: "12345678901"

const telefoneSemMascara = removerMascara("(11) 98765-4321");
// Retorna: "11987654321"
```

**Uso:**
- Útil antes de enviar dados para o backend
- Remove pontos, hífens, barras, parênteses, espaços, etc.

---

## 🔍 Validações

### `validarCPF(cpf: string): boolean`

Valida CPF usando o algoritmo oficial da Receita Federal.

**Exemplo:**
```typescript
import { validarCPF } from "@/utils/masks";

const cpfValido = validarCPF("123.456.789-01");
// Retorna: true ou false

const cpfValidoSemMascara = validarCPF("12345678901");
// Retorna: true ou false (aceita com ou sem máscara)
```

**Validações realizadas:**
- ✅ Verifica se tem 11 dígitos
- ✅ Rejeita sequências repetidas (111.111.111-11, etc.)
- ✅ Valida primeiro dígito verificador
- ✅ Valida segundo dígito verificador

---

### `validarCNPJ(cnpj: string): boolean`

Valida CNPJ usando o algoritmo oficial da Receita Federal.

**Exemplo:**
```typescript
import { validarCNPJ } from "@/utils/masks";

const cnpjValido = validarCNPJ("12.345.678/0001-95");
// Retorna: true ou false

const cnpjValidoSemMascara = validarCNPJ("12345678000195");
// Retorna: true ou false (aceita com ou sem máscara)
```

**Validações realizadas:**
- ✅ Verifica se tem 14 dígitos
- ✅ Rejeita sequências repetidas (11.111.111/1111-11, etc.)
- ✅ Valida primeiro dígito verificador
- ✅ Valida segundo dígito verificador

---

### `validarTelefone(telefone: string): boolean`

Valida se o telefone está no formato brasileiro correto.

**Exemplo:**
```typescript
import { validarTelefone } from "@/utils/masks";

const celularValido = validarTelefone("(11) 98765-4321");
// Retorna: true

const fixoValido = validarTelefone("(11) 3333-4444");
// Retorna: true

const invalido = validarTelefone("(11) 9876");
// Retorna: false (incompleto)
```

**Validações realizadas:**
- ✅ Verifica se tem 10 ou 11 dígitos
- ✅ Valida DDD (deve estar entre 11 e 99)

---

## 💡 Uso em Componentes React Native

### Exemplo Completo

```tsx
import { mascaraCPF, mascaraTelefone, validarCPF, validarTelefone, removerMascara } from "@/utils/masks";
import { useState } from "react";
import { Alert, TextInput, View, Text } from "react-native";

export default function FormularioExemplo() {
    const [cpf, setCpf] = useState("");
    const [telefone, setTelefone] = useState("");

    const handleSubmit = () => {
        // Validar antes de enviar
        if (!validarCPF(cpf)) {
            Alert.alert("Erro", "CPF inválido");
            return;
        }

        if (!validarTelefone(telefone)) {
            Alert.alert("Erro", "Telefone inválido");
            return;
        }

        // Remover máscaras antes de enviar ao backend
        const dados = {
            cpf: removerMascara(cpf),
            telefone: removerMascara(telefone),
        };

        console.log(dados);
        // { cpf: "12345678901", telefone: "11987654321" }
    };

    return (
        <View>
            <Text>CPF</Text>
            <TextInput
                value={cpf}
                onChangeText={(text) => setCpf(mascaraCPF(text))}
                keyboardType="numeric"
                placeholder="000.000.000-00"
                maxLength={14}
            />

            <Text>Telefone</Text>
            <TextInput
                value={telefone}
                onChangeText={(text) => setTelefone(mascaraTelefone(text))}
                keyboardType="phone-pad"
                placeholder="(00) 00000-0000"
                maxLength={15}
            />
        </View>
    );
}
```

---

## 🎯 Boas Práticas

### 1. **Sempre use `maxLength`**

Limite o tamanho do input para evitar que o usuário digite além do necessário:

```tsx
<TextInput
    value={cpf}
    onChangeText={(text) => setCpf(mascaraCPF(text))}
    maxLength={14} // ✅ Recomendado
/>
```

### 2. **Use `keyboardType` apropriado**

Facilite a digitação mostrando o teclado numérico:

```tsx
// Para CPF e CNPJ
<TextInput
    keyboardType="numeric" // ✅ Apenas números
/>

// Para Telefone
<TextInput
    keyboardType="phone-pad" // ✅ Teclado de telefone
/>
```

### 3. **Valide antes de enviar ao backend**

```tsx
const handleSubmit = () => {
    if (!validarCPF(cpf)) {
        Alert.alert("Erro", "CPF inválido");
        return;
    }
    
    // Continue com o envio...
};
```

### 4. **Remova máscaras antes de enviar**

O backend geralmente espera apenas os números:

```tsx
const dados = {
    cpf: removerMascara(cpf), // "12345678901"
    telefone: removerMascara(telefone), // "11987654321"
};
```

### 5. **Aplique máscaras nos dados recebidos**

Ao buscar dados do backend, aplique as máscaras para exibição:

```tsx
const carregarDados = async () => {
    const data = await api.get("/perfil");
    
    // Aplica máscaras para exibição
    setPerfil({
        ...data,
        cpf: mascaraCPF(data.cpf),
        telefone: mascaraTelefone(data.telefone),
    });
};
```

---

## 📦 Onde Está Sendo Usado

As máscaras estão implementadas em:

- ✅ `/src/screens/tabs/voluntario/Perfil.tsx` - CPF e Telefone
- ✅ `/src/screens/tabs/ongs/PerfilOng.tsx` - CNPJ
- ✅ `/src/screens/stack/Auth/Cadastro.tsx` - CPF, CNPJ e Telefone

---

## 🧪 Testando as Máscaras

### CPF Válidos para Teste
```
123.456.789-09 ✅
111.444.777-35 ✅
```

### CPF Inválidos
```
111.111.111-11 ❌ (sequência repetida)
123.456.789-00 ❌ (dígito verificador errado)
```

### CNPJ Válidos para Teste
```
11.222.333/0001-81 ✅
```

### CNPJ Inválidos
```
11.111.111/1111-11 ❌ (sequência repetida)
11.222.333/0001-00 ❌ (dígito verificador errado)
```

---

## 🔄 Fluxo Recomendado

```
[Usuário Digita]
       ↓
[Aplica Máscara] → mascaraCPF / mascaraTelefone / mascaraCNPJ
       ↓
[Exibe Formatado no Input]
       ↓
[Usuário Submete]
       ↓
[Valida] → validarCPF / validarTelefone / validarCNPJ
       ↓
[Remove Máscara] → removerMascara
       ↓
[Envia ao Backend]
```

---

## 📝 Notas Técnicas

- Todas as funções aceitam strings com ou sem máscaras
- As funções de máscara são idempotentes (aplicar múltiplas vezes não quebra)
- As validações seguem os algoritmos oficiais da Receita Federal
- Performance otimizada com regex simples
- Sem dependências externas

---

**Desenvolvido para o Projeto EVO** 🚀

