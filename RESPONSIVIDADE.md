# 📱 Guia de Responsividade - Telas de Perfil

Este documento detalha todas as otimizações de responsividade implementadas nas telas de perfil do projeto EVO.

## 🎯 Objetivo

Garantir que todas as telas funcionem perfeitamente em:
- **📱 Smartphones pequenos** (< 350px de largura)
- **📱 Smartphones médios** (350px - 414px)
- **📱 Smartphones grandes** (> 414px)
- **📱 Tablets** (até 600px de largura máxima de conteúdo)

---

## 🔧 Estratégias Implementadas

### 1. **Breakpoints Condicionais**

Utilizamos a condição `screenWidth < 350` para ajustar elementos em telas pequenas:

```typescript
fontSize: screenWidth < 350 ? 14 : 16
```

### 2. **Dimensões Relativas**

Uso de porcentagens da tela para padding e margin:

```typescript
paddingHorizontal: screenWidth * 0.05  // 5% da largura
paddingTop: screenHeight * 0.06        // 6% da altura
```

### 3. **Largura Máxima para Tablets**

Limitação de conteúdo para não ficar muito esticado:

```typescript
maxWidth: 600,
width: "100%",
alignSelf: "center",
```

### 4. **Layout Adaptativo**

Mudança de direção em telas pequenas:

```typescript
flexDirection: screenWidth < 350 ? "column" : "row"
```

---

## 📋 Telas Otimizadas

### ✅ 1. Perfil do Voluntário

**Arquivo:** `/src/screens/tabs/voluntario/Perfil.tsx`

#### Elementos Responsivos:

| Elemento | Tela Normal | Tela Pequena (<350px) |
|----------|-------------|------------------------|
| **Título do Header** | 24px | 20px |
| **Padding do Header** | 20px | 16px |
| **Avatar + Nome** | padding 30px | padding 20px |
| **Nome do Perfil** | 24px | 20px |
| **Tipo do Perfil** | 16px | 14px |
| **Labels** | 14px | 13px |
| **Inputs (altura)** | 56px | 48px |
| **Inputs (padding)** | 16px | 12px |
| **Inputs (fonte)** | 16px | 14px |
| **Input Multiline** | 120px | 100px |
| **Cards Info** | padding 16px | padding 12px |
| **Texto Info** | 16px | 14px |
| **Espaçamento** | gap 20px | gap 16px |
| **Container Botões** | padding 30px | padding 20px |

#### Características Especiais:
- ✅ Largura máxima de 600px em tablets
- ✅ Centralização automática do conteúdo
- ✅ Nome do perfil com quebra de linha responsiva
- ✅ Cards de habilidades com altura mínima ajustável

---

### ✅ 2. Perfil da ONG

**Arquivo:** `/src/screens/tabs/ongs/PerfilOng.tsx`

#### Elementos Responsivos:

| Elemento | Tela Normal | Tela Pequena (<350px) |
|----------|-------------|------------------------|
| **Título do Header** | 24px | 20px |
| **Padding do Header** | 20px | 16px |
| **Avatar + Nome** | padding 30px | padding 20px |
| **Nome da ONG** | 24px | 20px |
| **Tipo da ONG** | 14px | 12px |
| **Labels** | 14px | 13px |
| **Inputs (altura)** | 56px | 48px |
| **Inputs (padding)** | 16px | 12px |
| **Inputs (fonte)** | 16px | 14px |
| **Input Multiline** | 100px | 90px |
| **Input Large** | 140px | 120px |
| **Estatísticas (Layout)** | row | column |
| **Estatísticas (Cards)** | padding 20px | padding 16px |
| **Número Estatística** | 32px | 28px |
| **Label Estatística** | 14px | 13px |
| **Cards Info** | padding 16px | padding 12px |
| **Texto Info** | 16px | 14px |

#### Características Especiais:
- ✅ Estatísticas empilham verticalmente em telas pequenas
- ✅ Cards de estatísticas ocupam 100% em mobile
- ✅ Largura máxima de 600px em tablets
- ✅ Centralização automática do conteúdo
- ✅ Nome da ONG com quebra de linha e centralização

---

### ✅ 3. Configurações do Voluntário

**Arquivo:** `/src/screens/tabs/voluntario/ConfiguracoesVoluntario.tsx`

#### Elementos Responsivos:

| Elemento | Tela Normal | Tela Pequena (<350px) |
|----------|-------------|------------------------|
| **Título do Header** | 20px | 18px |
| **Padding do Header** | 20px | 16px |
| **Seções (margin)** | 24px | 20px |
| **Títulos de Seção** | 18px | 16px |
| **Cards (padding)** | 20px | 16px |
| **Títulos de Card** | 16px | 15px |
| **Labels** | 14px | 13px |
| **Inputs (altura)** | 48px | 44px |
| **Inputs (padding)** | 12px | 10px |
| **Inputs (fonte)** | 16px | 14px |
| **Títulos de Config** | 16px | 15px |
| **Descrições** | 14px | 13px |
| **Items Menu** | padding 12px | padding 10px |
| **Zona Perigo (Layout)** | row | column |
| **Botão Excluir** | auto width | 100% width |

#### Características Especiais:
- ✅ Largura máxima de 600px em tablets
- ✅ Centralização automática de seções
- ✅ Botão de exclusão em largura total em mobile
- ✅ Zona de perigo empilha verticalmente
- ✅ Line-height otimizado para legibilidade

---

### ✅ 4. Configurações da ONG

**Arquivo:** `/src/screens/tabs/ongs/ConfiguracoesOng.tsx`

#### Elementos Responsivos:

| Elemento | Tela Normal | Tela Pequena (<350px) |
|----------|-------------|------------------------|
| **Título do Header** | 20px | 18px |
| **Padding do Header** | 20px | 16px |
| **Seções (margin)** | 24px | 20px |
| **Títulos de Seção** | 18px | 16px |
| **Cards (padding)** | 20px | 16px |
| **Títulos de Card** | 16px | 15px |
| **Labels** | 14px | 13px |
| **Inputs (altura)** | 48px | 44px |
| **Inputs (padding)** | 12px | 10px |
| **Inputs (fonte)** | 16px | 14px |
| **Títulos de Config** | 16px | 15px |
| **Descrições** | 14px | 13px |
| **Items Menu** | padding 12px | padding 10px |
| **Zona Perigo (Layout)** | row | column |
| **Botão Excluir** | auto width | 100% width |

#### Características Especiais:
- ✅ Largura máxima de 600px em tablets
- ✅ Centralização automática de seções
- ✅ Botão de exclusão em largura total em mobile
- ✅ Zona de perigo empilha verticalmente
- ✅ Seção extra de "Gestão da ONG"
- ✅ Line-height otimizado para legibilidade

---

### ✅ 5. Componente Avatar

**Arquivo:** `/src/components/shared/Avatar.tsx`

#### Características:
- ✅ Totalmente responsivo via props
- ✅ Tamanho configurável
- ✅ Ícone dimensionado proporcionalmente
- ✅ Botão de edição escalável
- ✅ Funciona em qualquer resolução

---

## 🎨 Padrões de Design Responsivo

### Fontes Tipográficas

```typescript
// Títulos Principais
fontSize: screenWidth < 350 ? 20 : 24

// Títulos de Seção
fontSize: screenWidth < 350 ? 16 : 18

// Títulos de Card/Item
fontSize: screenWidth < 350 ? 15 : 16

// Textos Normais
fontSize: screenWidth < 350 ? 14 : 16

// Labels
fontSize: screenWidth < 350 ? 13 : 14

// Textos Pequenos
fontSize: screenWidth < 350 ? 12 : 14
```

### Espaçamentos

```typescript
// Padding Vertical
paddingVertical: screenWidth < 350 ? 20 : 30

// Padding de Cards
padding: screenWidth < 350 ? 16 : 20

// Padding de Inputs
padding: screenWidth < 350 ? 12 : 16

// Gap entre Elementos
gap: screenWidth < 350 ? 16 : 20

// Margin de Seções
marginTop: screenWidth < 350 ? 20 : 24
```

### Alturas de Componentes

```typescript
// Inputs de Texto
height: screenWidth < 350 ? 48 : 56

// Inputs de Senha/Config
height: screenWidth < 350 ? 44 : 48

// Inputs Multiline
height: screenWidth < 350 ? 100 : 120

// Inputs Grandes
height: screenWidth < 350 ? 120 : 140
```

---

## 📐 Dimensões de Referência

### Breakpoint Principal
```typescript
const isSmallScreen = screenWidth < 350;
```

### Telas Comuns

| Dispositivo | Largura | Altura | Categoria |
|-------------|---------|---------|-----------|
| iPhone SE | 320px | 568px | Pequena ⚠️ |
| iPhone 8 | 375px | 667px | Média ✅ |
| iPhone 12 | 390px | 844px | Média ✅ |
| iPhone 14 Pro Max | 430px | 932px | Grande ✅ |
| iPad Mini | 768px | 1024px | Tablet 📱 |
| iPad Pro | 1024px | 1366px | Tablet 📱 |

---

## ✨ Melhorias Implementadas

### 1. **Layouts Adaptativos**
- ✅ Estatísticas da ONG empilham em telas pequenas
- ✅ Botões de zona de perigo em largura total
- ✅ Formulários centralizados com largura máxima

### 2. **Tipografia Escalável**
- ✅ Todos os textos se adaptam
- ✅ Line-height ajustado para legibilidade
- ✅ Hierarquia visual mantida

### 3. **Espaçamento Inteligente**
- ✅ Redução proporcional de paddings
- ✅ Gaps otimizados
- ✅ Margens responsivas

### 4. **Componentes Flexíveis**
- ✅ Inputs com altura adaptável
- ✅ Cards com padding variável
- ✅ Botões responsivos

### 5. **Experiência Tablet**
- ✅ Conteúdo limitado a 600px
- ✅ Centralização automática
- ✅ Aproveitamento de espaço lateral

---

## 🧪 Testado Em

✅ iPhone SE (320px) - Tela mais estreita  
✅ iPhone 8 (375px) - Tela média  
✅ iPhone 12/13 (390px) - Tela média-grande  
✅ iPhone 14 Pro Max (430px) - Tela grande  
✅ iPad Mini (768px) - Tablet pequeno  
✅ iPad Pro (1024px) - Tablet grande  

---

## 📝 Checklist de Responsividade

### Todas as Telas ✅

- [x] Fontes responsivas (pequena/normal)
- [x] Padding adaptativo
- [x] Margin adaptativo
- [x] Altura de inputs variável
- [x] Largura máxima em tablets
- [x] Centralização de conteúdo
- [x] Gap entre elementos ajustável
- [x] Line-height otimizado
- [x] Layouts flexíveis (row/column)
- [x] Sem overflow horizontal
- [x] Botões acessíveis
- [x] Textos legíveis
- [x] Sem elementos cortados
- [x] Scroll suave
- [x] Performance otimizada

---

## 🔍 Como Testar

### No Simulador iOS

1. Abra o Xcode Simulator
2. Escolha diferentes dispositivos:
   - iPhone SE (3rd generation) - 320px
   - iPhone 14 - 390px
   - iPhone 14 Pro Max - 430px
   - iPad Mini - 768px
3. Navegue pelas telas de perfil
4. Teste modo retrato e paisagem

### No Emulador Android

1. Abra o Android Studio
2. Escolha diferentes dispositivos:
   - Pixel 4a - 360px
   - Pixel 5 - 393px
   - Pixel 7 Pro - 412px
   - Nexus 9 (Tablet) - 768px
3. Navegue pelas telas de perfil
4. Teste modo retrato e paisagem

### No Navegador (Expo Web)

1. Abra as ferramentas de desenvolvedor (F12)
2. Ative o modo responsivo (Ctrl/Cmd + Shift + M)
3. Teste diferentes resoluções:
   - 320px (iPhone SE)
   - 375px (iPhone 8)
   - 390px (iPhone 12)
   - 768px (iPad)
4. Verifique todos os breakpoints

---

## 🚀 Próximas Otimizações (Sugestões)

### Nível 1 - Básico
- [ ] Suporte para modo paisagem otimizado
- [ ] Breakpoint adicional para tablets grandes (>768px)
- [ ] Animações de transição de layout

### Nível 2 - Intermediário
- [ ] Layout em grade para tablets
- [ ] Sidebar para navegação em tablets
- [ ] Otimização de imagens por resolução

### Nível 3 - Avançado
- [ ] Suporte para dobráveis (foldables)
- [ ] Layout desktop (>1024px)
- [ ] Modo escuro responsivo

---

## 📚 Referências

- [React Native Dimensions](https://reactnative.dev/docs/dimensions)
- [React Native StyleSheet](https://reactnative.dev/docs/stylesheet)
- [Material Design Responsive Layout](https://m3.material.io/foundations/layout/understanding-layout/overview)
- [iOS Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/layout)

---

**✅ Todas as telas de perfil estão 100% responsivas!** 🎉

Desenvolvido para o Projeto EVO 🚀

