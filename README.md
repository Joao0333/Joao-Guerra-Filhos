# João Guerra & Filhos, Lda. — Guia de Edição do Website

Bem-vindo ao teu novo site! Este documento explica onde editar cada coisa.

---

## 📁 Estrutura de Ficheiros

```
JoaoGuerra&Filhos/
├── index.html          ← Todo o conteúdo do site (textos, estrutura)
├── css/
│   └── style.css       ← Cores, tipografia, espaçamentos, layout
├── js/
│   └── main.js         ← Animações, menu mobile, scroll
├── images/
│   ├── logo.png            ← [SUBSTITUIR] Logótipo da empresa
│   ├── metals/
│   │   ├── estanho.jpg     ← [SUBSTITUIR] Foto Estanho
│   │   ├── chumbo.jpg      ← [SUBSTITUIR] Foto Chumbo
│   │   ├── antimonio.jpg   ← [SUBSTITUIR] Foto Antimônio
│   │   ├── cobre.jpg       ← [SUBSTITUIR] Foto Cobre
│   │   ├── bismuto.jpg     ← [SUBSTITUIR] Foto Bismuto
│   │   └── niquel.jpg      ← [SUBSTITUIR] Foto Níquel
│   └── products/
│       ├── soldas.jpg      ← [SUBSTITUIR] Foto Soldas
│       ├── anodos.jpg      ← [SUBSTITUIR] Foto Ânodos
│       ├── antifriction.jpg← [SUBSTITUIR] Foto Metal Anti-Fricção
│       └── ligas.jpg       ← [SUBSTITUIR] Foto Ligas
└── README.md           ← Este ficheiro
```

---

## ✏️ Como Editar Textos

Abre `index.html` no Notepad, VS Code, ou qualquer editor de texto.

Procura os comentários HTML como `<!-- TEXTO DA EMPRESA: ... -->` para encontrar exatamente onde estão os textos a substituir.

### Secção Empresa
Procura: `<!-- TEXTO DA EMPRESA: Substitui os parágrafos abaixo -->`  
Cada `<p>...</p>` é um parágrafo.

### Secção Matéria-Prima
Os textos de cada metal estão dentro de `<p class="metal-card__desc">`.

### Secção Produtos
Os textos de cada produto estão dentro de `<p class="product-card__desc">`.

### Contactos — Horário
Procura: `<!-- HORÁRIO: Substitui pelo horário real -->`

---

## 🖼️ Como Substituir Imagens

### Logótipo (Navbar)
1. Coloca o ficheiro `logo.png` (ou `.svg`) em `images/logo.png`
2. Em `index.html`, procura:
   ```html
   <!-- LOGÓTIPO: Substitui o bloco .logo-icon abaixo pelo teu logo real: -->
   ```
3. Descomenta a linha `<img src="images/logo.png" ...>` e remove o `<div class="logo-icon">...</div>`

### Imagens dos Metais (Estanho, Chumbo, etc.)
1. Coloca a imagem em `images/metals/estanho.jpg` (por exemplo)
2. Em `index.html`, procura o comentário do metal correspondente:
   ```html
   <!-- IMAGEM ESTANHO: Substitui o bloco abaixo por: -->
   ```
3. Substitui o bloco `<div class="metal-card__placeholder">` por:
   ```html
   <img src="images/metals/estanho.jpg" alt="Lingotes de Estanho" loading="lazy" />
   ```

### Imagens dos Produtos
Mesmo processo — procura `<!-- IMAGEM SOLDAS: -->`, `<!-- IMAGEM ÂNODOS: -->`, etc.

---

## 🎨 Como Alterar Cores

Abre `css/style.css` e vai para o início do ficheiro onde estão as **CSS Variables**:

```css
:root {
  --green-600:    #22a648; /* ← Verde principal (botões, destaques) */
  --dark:         #111111; /* ← Preto (textos, navbar no footer) */
  --color-bg:     #ffffff; /* ← Fundo branco */
  ...
}
```

Muda apenas estas variáveis e tudo o site actualiza automaticamente.

---

## 🗺️ Mapa do Google

O mapa actual usa um embed aproximado da Zona Industrial de Nelas.  
Para o mapa exacto da empresa:

1. Vai a [https://maps.google.com](https://maps.google.com)
2. Pesquisa a morada exacta
3. Clica em **Partilhar** → **Incorporar mapa**
4. Copia o código `<iframe ...>`
5. Em `index.html`, substitui o `<iframe id="google-map" ...>` pelo novo código

---

## 🚀 Como Abrir o Site

Basta fazer duplo clique no ficheiro **`index.html`** — abre directamente no browser.

Não precisas de servidor ou instalações adicionais.

---

## 📱 Responsividade

O site adapta-se automaticamente a:
- **Desktop**: Layout completo com todas as colunas
- **Tablet** (≤1024px): Grid ajustado, stats do hero ocultam
- **Mobile** (≤768px): Layout de coluna única, menu hamburger
- **Mobile pequeno** (≤480px): Botões em coluna, cards empilhados

---

## 🔧 NIF da Empresa

No footer há um placeholder `<!--SUBSTITUIR-->` para colocares o NIF.  
Procura em `index.html`:
```html
NIF: <!--SUBSTITUIR-->
```

---

*Site desenvolvido com HTML5, CSS3 e JavaScript vanilla. Sem dependências externas.*
