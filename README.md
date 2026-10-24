# Trama — e-commerce com Next.js

Loja virtual de moda casual construída com **Next.js 16 (App Router)**, **React 19** e **TypeScript**, publicada como site 100% estático no GitHub Pages. O projeto cobre o fluxo completo de uma loja: vitrine renderizada no build, catálogo com filtros sincronizados com a URL, páginas de produto geradas estaticamente com SEO e Open Graph, carrinho persistido, cálculo de frete por CEP, cupom de desconto, checkout em etapas com validação (Zod + React Hook Form), consulta de endereço no ViaCEP e confirmação de pedido com cartão, Pix ou boleto simulados.

**Demo:** https://brunoicosta.github.io/next-ecommerce-store/

![Página inicial da loja Trama](docs/screenshot.png)

> Projeto de portfólio: nenhum pagamento é processado e nenhum dado sai do navegador.
> Para testar o checkout use o CPF `529.982.247-25`, o cartão `4111 1111 1111 1111`, qualquer validade futura, CVV `123` e o cupom `BEMVINDO10`.

## Funcionalidades

- **Home** com hero, vantagens, categorias em destaque, mais vendidos e novidades, tudo em Server Components (sem JavaScript próprio no cliente).
- **Catálogo** com busca sem acentos, filtros por categoria, faixa de preço, cor, tamanho, avaliação e ofertas, além de ordenação. Os filtros ficam na URL (`/produtos/?categoria=tenis&cor=preto&ordem=menor-preco`), então dá para compartilhar o link, recarregar a página e usar o botão voltar.
- **Página de produto** para cada um dos 40 itens via `generateStaticParams`, com galeria (frente, detalhe e ambiente), seletor de cor que recolore as imagens, seletor de tamanho com validação, quantidade, favoritos e produtos relacionados.
- **SEO:** `generateMetadata` por produto, canonical, Open Graph e Twitter Cards com imagens PNG geradas no build, JSON-LD `Product` (preço e avaliação), `sitemap.xml` e `robots.txt` estáticos.
- **Carrinho** em gaveta lateral e em página própria: quantidade, remoção, subtotal, barra de progresso até o frete grátis, frete calculado por CEP (tabela regional simulada, econômica ou expressa) e cupom `BEMVINDO10` (10% off). O carrinho fica salvo no `localStorage` e sincroniza entre abas.
- **Checkout em 3 etapas:** dados pessoais (CPF validado pelos dígitos verificadores, máscaras de CPF e celular), entrega (CEP com preenchimento automático pelo ViaCEP e escolha do frete) e pagamento (cartão com Luhn, bandeira, validade e parcelas; Pix com 5% de desconto; boleto).
- **Confirmação do pedido** com número, resumo, endereço, código Pix copia e cola com QR Code ilustrativo ou linha digitável do boleto.
- **Favoritos** persistidos com contador no cabeçalho.
- **Estados de interface:** `loading.tsx` com skeletons, `not-found.tsx` (vira o `404.html` do Pages), `error.tsx`, estados vazios e de carregamento em cada tela.
- **Acessibilidade e UX:** HTML semântico, rótulos e mensagens de erro ligados aos campos (`aria-invalid`, `aria-describedby`), gaveta com `<dialog>` nativo (foco preso e Esc), link "pular para o conteúdo", foco visível, `prefers-reduced-motion`, layout mobile first e **tema escuro** sem flash na primeira pintura.

## Stack

| Camada      | Tecnologia                                                          |
| ----------- | ------------------------------------------------------------------- |
| Framework   | Next.js 16.3.5 (App Router, Turbopack, `output: "export"`)          |
| UI          | React 19.2.8, Tailwind CSS 4.3.3, lucide-react 1.47                 |
| Linguagem   | TypeScript 5.9 (strict)                                             |
| Estado      | Zustand 5.0.15 com `persist`                                        |
| Formulários | React Hook Form 7.88 + Zod 4.6 (`@hookform/resolvers` 5.9)          |
| Testes      | Vitest 5.0, Testing Library (React 16.3, user-event 14.6), jsdom 30 |
| Qualidade   | ESLint 9 (`eslint-config-next`), Prettier 3 com plugin do Tailwind  |
| CI/CD       | GitHub Actions + GitHub Pages                                       |
| API externa | [ViaCEP](https://viacep.com.br) (pública, sem chave)                |

## Arquitetura e decisões

- **Exportação estática para o GitHub Pages.** `output: "export"`, `basePath: "/next-ecommerce-store"`, `trailingSlash: true` (cada rota vira `pasta/index.html`) e `images.unoptimized`. Sem servidor em produção não existem Server Actions, Route Handlers dinâmicos nem leitura de `searchParams` no servidor, e o projeto foi desenhado em torno disso:
  - o que é conteúdo (home, produtos, metadados, sitemap, imagens OG) é gerado no build;
  - o que depende do usuário (filtros, carrinho, checkout, pedido) roda no cliente;
  - a página de catálogo usa `useSearchParams` dentro de `Suspense`, cujo fallback já é uma grade real pré-renderizada, então o HTML exportado não chega vazio.
- **Imagens de produto em SVG gerado.** Cada categoria tem uma silhueta vetorial colorida pela paleta da variante. Não há dependência de banco de imagens nem requisições extras, a demo não quebra e a troca de cor é instantânea. As mesmas peças são renderizadas pelo Satori (`next/og`) para criar as imagens Open Graph em PNG.
- **Imagens OG via Route Handler `og.png`.** A convenção `opengraph-image` exporta arquivos sem extensão, que o Pages serviria como `application/octet-stream`. Route Handlers `force-static` em pastas `og.png` mantêm a extensão e o `Content-Type` correto.
- **Preços em centavos (inteiros)** para evitar erros de ponto flutuante. Toda a regra de negócio (frete, cupom, desconto Pix, parcelas, criação do pedido) fica em funções puras com testes.
- **Carrinho guarda só referências** (`productId`, cor, tamanho e quantidade). Nome e preço vêm sempre do catálogo, então um `localStorage` antigo nunca mostra preço desatualizado.
- **Hidratação segura dos stores persistidos.** Os stores Zustand usam `skipHydration` e são reidratados após a montagem. O HTML estático e a primeira renderização no cliente ficam idênticos, sem erros de hidratação, e `useSyncExternalStore` indica quando os dados locais já estão disponíveis.
- **Filtros na URL com `useOptimistic`.** `router.replace` roda dentro de uma transição; o estado otimista mantém checkboxes e radios responsivos enquanto a URL é atualizada.
- **Schemas Zod compostos de validadores puros** (CPF, Luhn, validade, CEP). Os validadores são testados isoladamente e reaproveitados nos schemas e nas máscaras de input.
- **Dados de pagamento nunca são persistidos.** O progresso do checkout vai para o `sessionStorage`; do cartão, o pedido guarda apenas bandeira e últimos 4 dígitos.
- **Organização por feature** (`features/catalog`, `cart`, `checkout`, `wishlist`, `seo`), com componentes de UI genéricos em `components/ui` e utilitários em `lib`.

### Como seria com SSR na Vercel

Com um servidor (Vercel ou `next start`), a mesma base evoluiria assim:

- remover `output: "export"`/`basePath` e ligar o otimizador de imagens (`next/image` com fotos reais de um CDN);
- ler `searchParams` no Server Component da página `/produtos` e filtrar no servidor (com `revalidate` ou cache por tag), mantendo a URL como fonte de verdade;
- buscar o catálogo de um CMS/banco com ISR (`revalidate`) e `revalidateTag` acionado por webhook ao alterar estoque ou preço;
- trocar o fluxo de pagamento simulado por Server Actions que validam o carrinho com os mesmos schemas Zod no servidor, recalculam preço e frete (sem confiar no cliente) e criam o pedido no banco;
- integrar frete real (Correios/transportadoras) e gateway de pagamento (Pix e cartão) em Route Handlers que recebem webhooks de confirmação;
- autenticação, histórico de pedidos e carrinho no servidor por usuário, usando cookies.

## Como rodar

Pré-requisitos: Node.js 22 e npm 10.

```bash
npm install
npm run dev          # http://localhost:3000/next-ecommerce-store
```

Outros scripts:

```bash
npm run lint         # ESLint
npm run typecheck    # gera os tipos de rotas e roda tsc --noEmit
npm test             # Vitest (unitários e de componentes)
npm run build        # exportação estática em ./out
npm start            # serve ./out em http://localhost:3000/next-ecommerce-store
npm run format       # Prettier
```

> Observação: no Windows, o Next 16 exporta os arquivos de prefetch de segmentos com `\` no caminho, o que gera 404 inofensivos de prefetch no preview local. O deploy é feito pelo GitHub Actions em Linux, onde os arquivos saem corretos.

## Estrutura de pastas

```
src/
├── app/                      # rotas (App Router)
│   ├── page.tsx              # home (Server Component)
│   ├── produtos/             # catálogo com filtros
│   ├── produto/[slug]/       # página de produto + og.png gerado no build
│   ├── carrinho/  checkout/  favoritos/  pedido/confirmado/
│   ├── og.png/               # imagem Open Graph da loja
│   ├── sitemap.ts  robots.ts
│   └── loading.tsx  not-found.tsx  error.tsx  layout.tsx
├── components/
│   ├── layout/               # cabeçalho, rodapé, menu mobile, tema
│   ├── providers/            # reidratação dos stores persistidos
│   └── ui/                   # botão, campos, sheet, preço, avaliação...
├── features/
│   ├── catalog/              # dados tipados, consultas, filtros, cards, arte SVG
│   ├── product/              # galeria e seletores de variante
│   ├── cart/                 # store, regras de preço/frete/cupom, gaveta e página
│   ├── checkout/             # schemas, validadores, ViaCEP, etapas, pedido
│   ├── wishlist/             # favoritos
│   ├── home/                 # seções da home
│   └── seo/                  # JSON-LD e cartão Open Graph
├── lib/                      # formatação, rotas, configuração do site, tema
└── test/                     # setup do Vitest
```

## Próximos passos

- Testes end-to-end com Playwright cobrindo compra completa e acessibilidade (axe).
- Avaliações de clientes por produto e filtros com contagem por opção.
- Estoque por variante (tamanho e cor esgotados).
- Histórico de pedidos com a lista já salva localmente.
- Versão SSR na Vercel com catálogo em CMS e pagamento real, conforme descrito acima.

## Autor

**Bruno Vinicius Isaac Costa** — https://github.com/BrunoICosta

Licença [MIT](LICENSE).
