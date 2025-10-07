# Telas de Perfil - Projeto EVO

Este documento descreve todas as telas relacionadas ao módulo de Perfil criadas para o projeto EVO.

## 📋 Visão Geral

Foram criadas **6 novas telas/componentes** completas para gerenciamento de perfil:

### 1. **Perfil do Voluntário** (`/src/screens/tabs/voluntario/Perfil.tsx`)

Tela principal de perfil para usuários do tipo Voluntário.

#### Funcionalidades:
- ✅ Visualização de dados do perfil
- ✅ Modo de edição com alteração de dados
- ✅ Avatar/foto de perfil com ícone placeholder
- ✅ Campos editáveis: nome, email, CPF, contato, habilidades
- ✅ Indicador de carregamento
- ✅ Integração com API (GET e POST)
- ✅ Botão de logout com confirmação
- ✅ Botão para acessar configurações

#### Campos do Perfil:
- **Nome Completo**: Nome do voluntário
- **E-mail**: Email de contato
- **CPF**: Documento de identificação
- **Contato**: Telefone/celular
- **Habilidades**: Descrição das habilidades (multiline)

---

### 2. **Perfil da ONG** (`/src/screens/tabs/ongs/PerfilOng.tsx`)

Tela principal de perfil para usuários do tipo ONG.

#### Funcionalidades:
- ✅ Visualização de dados do perfil da ONG
- ✅ Modo de edição com alteração de dados
- ✅ Avatar/foto de perfil com ícone de organização
- ✅ Campos editáveis: nome, email, CNPJ, área de atuação, endereço, descrição
- ✅ Estatísticas (vagas criadas e voluntários)
- ✅ Indicador de carregamento
- ✅ Integração com API (GET e POST)
- ✅ Botão de logout com confirmação
- ✅ Botão para acessar configurações

#### Campos do Perfil:
- **Nome da ONG**: Nome da organização
- **E-mail**: Email de contato institucional
- **CNPJ**: Cadastro Nacional de Pessoa Jurídica
- **Área de Atuação**: Categorias de atuação
- **Endereço**: Localização física (multiline)
- **Sobre a ONG**: Descrição da missão e projetos (multiline)

#### Estatísticas Exibidas:
- Número de vagas criadas
- Número de voluntários engajados

---

### 3. **Configurações do Voluntário** (`/src/screens/tabs/voluntario/ConfiguracoesVoluntario.tsx`)

Tela de configurações e preferências para voluntários.

#### Seções:

##### 🔒 Segurança
- Alteração de senha
- Validação de senha atual
- Confirmação de nova senha

##### 🔔 Notificações
- Toggle para notificações push
- Toggle para notificações por email
- Toggle para notificações de novas vagas

##### 🔐 Privacidade e Dados
- Acesso à política de privacidade
- Acesso aos termos de uso

##### ⚠️ Zona de Perigo
- Excluir conta (com confirmação)

---

### 4. **Configurações da ONG** (`/src/screens/tabs/ongs/ConfiguracoesOng.tsx`)

Tela de configurações e preferências para ONGs.

#### Seções:

##### 🔒 Segurança
- Alteração de senha
- Validação de senha atual
- Confirmação de nova senha

##### 🔔 Notificações
- Toggle para notificações push
- Toggle para notificações por email
- Toggle para notificações de novos candidatos

##### 🏢 Gestão da ONG
- Gerenciar membros da equipe
- Visualizar relatórios

##### 🔐 Privacidade e Dados
- Acesso à política de privacidade
- Acesso aos termos de uso

##### ⚠️ Zona de Perigo
- Excluir conta da ONG (com confirmação)
- Aviso sobre remoção de todas as vagas

---

### 5. **Componente Avatar** (`/src/components/shared/Avatar.tsx`)

Componente reutilizável para exibição de foto de perfil.

#### Props:
- `uri?`: URL da imagem
- `size?`: Tamanho do avatar (padrão: 120)
- `iconName?`: Nome do ícone placeholder (padrão: "person")
- `iconSize?`: Tamanho do ícone
- `borderColor?`: Cor da borda (padrão: "#295CA9")
- `borderWidth?`: Largura da borda (padrão: 3)
- `backgroundColor?`: Cor de fundo do placeholder (padrão: "#295CA9")
- `onPress?`: Função de callback ao pressionar
- `editable?`: Exibe botão de câmera para edição

#### Características:
- Placeholder com ícone quando não há imagem
- Botão de câmera em modo editável
- Totalmente customizável via props
- Design responsivo

---

### 6. **Atualizações no Hook useAPI** (`/src/data/hooks/useAPI.ts`)

Adicionadas novas funções para suporte às telas de perfil:

#### Nova Função:
- `httpPut`: Método para requisições PUT (atualização de dados)

#### Retorno Atualizado:
```typescript
return { httpGet, httpPost, httpPut, listarVagas }
```

---

## 🎨 Design System

### Cores Principais
- **Azul Principal**: `#295CA9` (botões, ícones, destaque)
- **Verde Sucesso**: `#22C55E` (estatísticas positivas)
- **Vermelho Perigo**: `#DC2626` (logout, exclusão)
- **Cinza Fundo**: `#F9FAFB` (background)
- **Branco**: `#FFFFFF` (cards, inputs)
- **Texto Principal**: `#1A1A1A`
- **Texto Secundário**: `#6B7280`
- **Bordas**: `#E5E7EB`

### Tipografia
- **Títulos**: 20-24px, bold
- **Subtítulos**: 16-18px, semibold
- **Texto Normal**: 14-16px, regular
- **Labels**: 14px, semibold

### Espaçamento
- Padding horizontal geral: 5% da largura da tela
- Padding vertical de seções: 20-30px
- Gap entre elementos: 12-20px
- Border radius: 8-12px

---

## 🔌 Integração com API

### Endpoints Esperados:

#### Voluntário
- `GET /perfil/voluntario` - Obter dados do perfil
- `POST /perfil/voluntario/atualizar` - Atualizar perfil
- `POST /perfil/alterar-senha` - Alterar senha
- `POST /perfil/excluir` - Excluir conta

#### ONG
- `GET /perfil/ong` - Obter dados do perfil
- `POST /perfil/ong/atualizar` - Atualizar perfil
- `POST /perfil/alterar-senha` - Alterar senha
- `POST /perfil/excluir` - Excluir conta

### Estrutura de Dados:

#### VoluntarioData
```typescript
interface VoluntarioData {
    id: string;
    nome: string;
    email: string;
    cpf: string;
    contato: string;
    habilidades: string;
    fotoPerfil?: string;
}
```

#### OngData
```typescript
interface OngData {
    id: string;
    nome: string;
    email: string;
    cnpj: string;
    areaAtuacao: string;
    endereco: string;
    fotoPerfil?: string;
    descricao?: string;
}
```

---

## 📱 Experiência do Usuário

### Estados da Interface
1. **Carregamento**: Exibe `ActivityIndicator` enquanto busca dados
2. **Visualização**: Exibe dados em cards informativos
3. **Edição**: Transforma cards em inputs editáveis
4. **Salvando**: Desabilita botões durante requisição

### Validações
- Campos obrigatórios verificados antes de salvar
- Confirmação de senha deve coincidir
- Senha mínima de 6 caracteres
- Alertas informativos para erros e sucessos

### Feedback ao Usuário
- Alertas de confirmação para ações críticas (logout, exclusão)
- Mensagens de sucesso após operações bem-sucedidas
- Mensagens de erro detalhadas
- Estados de loading durante operações assíncronas

---

## 🔐 Segurança

### Implementações de Segurança:
- Token JWT em todas as requisições
- Confirmação dupla para exclusão de conta
- Validação de senha atual antes de alterar
- Confirmação de nova senha

---

## 🚀 Próximos Passos (Sugestões)

1. **Upload de Foto de Perfil**
   - Integração com câmera/galeria
   - Crop e redimensionamento de imagem
   - Upload para servidor/cloud

2. **Validações Avançadas**
   - Validação de CPF/CNPJ
   - Máscara para telefone
   - Validação de formato de email

3. **Funcionalidades Extras**
   - Histórico de atividades
   - Badges e conquistas
   - Compartilhamento de perfil

4. **Backend**
   - Implementar endpoints de API
   - Validação server-side
   - Rate limiting

---

## 📝 Notas Técnicas

### Dependências Utilizadas:
- React Native
- TypeScript
- React Navigation
- Context API (AuthContext)
- AsyncStorage (via AuthContext)
- Ionicons (via componente Icone)

### Padrões Seguidos:
- ✅ Componentes funcionais com Hooks
- ✅ TypeScript com interfaces tipadas
- ✅ Context API para estado global
- ✅ Código modular e reutilizável
- ✅ Nomenclatura consistente
- ✅ Comentários em português
- ✅ Estilos inline e StyleSheet

### Compatibilidade:
- ✅ iOS
- ✅ Android
- ⚠️ Web (necessita ajustes de layout responsivo)

---

## 👨‍💻 Estrutura de Arquivos Criados

```
projeto-pdm-evo/
├── src/
│   ├── components/
│   │   └── shared/
│   │       └── Avatar.tsx                    [NOVO]
│   ├── data/
│   │   └── hooks/
│   │       └── useAPI.ts                     [ATUALIZADO]
│   └── screens/
│       └── tabs/
│           ├── voluntario/
│           │   ├── Perfil.tsx                [ATUALIZADO]
│           │   └── ConfiguracoesVoluntario.tsx [NOVO]
│           └── ongs/
│               ├── PerfilOng.tsx             [ATUALIZADO]
│               └── ConfiguracoesOng.tsx      [NOVO]
└── PERFIL_README.md                          [NOVO]
```

---

## ✅ Checklist de Implementação

- [x] Tela de perfil do voluntário
- [x] Tela de perfil da ONG
- [x] Tela de configurações do voluntário
- [x] Tela de configurações da ONG
- [x] Componente Avatar reutilizável
- [x] Integração com API (estrutura)
- [x] Estados de loading
- [x] Validações de formulário
- [x] Modo de edição
- [x] Confirmações de ações críticas
- [x] Botão de logout
- [x] Design responsivo
- [x] Sem erros de lint

---

## 📞 Suporte

Para dúvidas ou sugestões sobre as telas de perfil, consulte a documentação do projeto ou entre em contato com a equipe de desenvolvimento.

---

**Desenvolvido seguindo os padrões do projeto EVO** 🚀

