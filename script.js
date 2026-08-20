/* ================================================================
   Dy Encantos — LÓGICA DO SITE
   ================================================================
   Este arquivo controla TUDO que acontece na página: os dados dos
   produtos, os ícones, a navegação entre "páginas" (Home, Catálogo,
   Produto, Contato) e a montagem do HTML na tela.

   O site é uma SPA (Single Page Application) simples, sem
   frameworks: não existem vários arquivos .html — o conteúdo é
   trocado dinamicamente dentro da <div id="app"> do index.html.

   Índice rápido (use Ctrl+F / Cmd+F para pular direto à seção):

   1.  CONFIGURAÇÃO GERAL (WhatsApp, marca, Instagram)
   2.  ÍCONES SVG (desenhos em traço único usados nos produtos)
   3.  DADOS DOS PRODUTOS (o "banco de dados" do catálogo)
   4.  ELEMENTOS SVG COMPARTILHADOS (ícone do WhatsApp/Instagram, etc.)
   5.  ESTADO DA APLICAÇÃO E NAVEGAÇÃO (router simples)
   6.  COMPONENTE: CABEÇALHO (menu fixo + menu mobile)
   7.  COMPONENTE: RODAPÉ
   8.  PÁGINA: HOME
   9.  COMPONENTE: CARTÃO DE PRODUTO (usado em várias páginas)
   10. PÁGINA: CATÁLOGO (filtros + ordenação + grade)
   11. PÁGINA: PRODUTO (detalhe de uma peça)
   12. PÁGINA: CONTATO (formulário -> WhatsApp)
   13. RENDERIZAÇÃO PRINCIPAL (junta tudo e desenha na tela)
   ================================================================ */


/* ----------------------------------------------------------------
   1. CONFIGURAÇÃO GERAL
   Altere aqui os dados de contato da Dyeni. É o único lugar que
   você precisa mexer para trocar WhatsApp, Instagram ou nome da marca.
---------------------------------------------------------------- */

// TODO: Dyeni, troque pelo número real (DDI + DDD + número, só dígitos)
const WHATSAPP = '555192211145';

const IG_HANDLE = '@dyenisilva_artesanato';
const BRAND = 'Dy Encantos';

/**
 * Monta um link "wa.me" pronto para abrir o WhatsApp com uma
 * mensagem já preenchida.
 */
function waLink(msg){
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(msg)}`;
}

/**
 * Abre o WhatsApp em nova aba com uma mensagem de encomenda
 * pré-formatada (nome da peça, referência e cor escolhida).
 * Usado pelos botões "Encomendar via WhatsApp" espalhados pelo site.
 */
function openWhatsApp(productName, ref, color){
  const msg = `Olá! Gostaria de encomendar a peça *${productName}* — REF: ${ref}${color ? ` nas cores: ${color}` : ''}. Poderia me informar o prazo e detalhes? 😊`;
  window.open(waLink(msg), '_blank');
}


/* ----------------------------------------------------------------
   2. ÍCONES SVG
   Cada produto tem um ícone desenhado em traço único (estilo
   "bordado"), na cor dourada da marca. Isso substitui fotos reais
   até a Dyeni enviar as fotos verdadeiras de cada peça (ver seção 3).
---------------------------------------------------------------- */

const ICON_COLOR = '#8C6821';

/** Envolve o conteúdo de um ícone em uma tag <svg> padrão 120x120. */
function iconWrap(inner){
  return `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">${inner}</svg>`;
}

const ICONS = {
  // Sousplat/doily: círculos concêntricos + "pétalas" ao redor
  doily: iconWrap(`
    <g stroke="${ICON_COLOR}" stroke-width="1.4">
      <circle cx="60" cy="60" r="17" stroke-dasharray="2 4"/>
      <circle cx="60" cy="60" r="30"/>
      ${Array.from({length:10}).map((_,i)=>{
        const a = (i/10)*2*Math.PI;
        const x1=60+30*Math.cos(a), y1=60+30*Math.sin(a);
        const x2=60+42*Math.cos(a), y2=60+42*Math.sin(a);
        return `<path d="M${x1.toFixed(1)} ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}"/>`;
      }).join('')}
      <circle cx="60" cy="60" r="42"/>
    </g>
    <circle cx="60" cy="60" r="6" fill="${ICON_COLOR}"/>
  `),

  // Touca de ursinho: capuz + orelhinhas + pompom
  bearHat: iconWrap(`
    <g stroke="${ICON_COLOR}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="40" cy="34" r="9"/>
      <circle cx="80" cy="34" r="9"/>
      <path d="M28 62 C28 34 42 22 60 22 C78 22 92 34 92 62 L92 78 C92 84 86 90 60 90 C34 90 28 84 28 78 Z"/>
      <circle cx="46" cy="58" r="3" fill="${ICON_COLOR}" stroke="none"/>
      <circle cx="74" cy="58" r="3" fill="${ICON_COLOR}" stroke="none"/>
      <path d="M50 70 Q60 78 70 70"/>
      <circle cx="60" cy="16" r="7"/>
    </g>
  `),

  // Polvo amigurumi: cabeça redonda + 6 tentáculos ondulados
  octopus: iconWrap(`
    <g stroke="${ICON_COLOR}" stroke-width="1.6" stroke-linecap="round" fill="none">
      <circle cx="60" cy="42" r="24"/>
      <path d="M42 36 Q46 30 52 34" />
      <path d="M78 36 Q74 30 68 34" />
      <path d="M50 48 Q54 52 58 48" />
      ${[-28,-17,-6,6,17,28].map((dx)=>{
        const x = 60+dx;
        return `<path d="M${x} 62 C${x-6} 74, ${x+10} 80, ${x-2} 96" />`;
      }).join('')}
    </g>
  `),

  // Chaveiro: argola + saquinho + duas cerejas penduradas
  keychain: iconWrap(`
    <g stroke="${ICON_COLOR}" stroke-width="1.6" stroke-linecap="round" fill="none">
      <circle cx="60" cy="20" r="9"/>
      <path d="M60 29 L60 44"/>
      <rect x="40" y="44" width="40" height="34" rx="10"/>
      <path d="M46 44 C46 34 74 34 74 44"/>
      <path d="M50 78 C46 88 40 92 34 96"/>
      <path d="M70 78 C74 88 80 92 86 96"/>
      <circle cx="34" cy="100" r="7"/>
      <circle cx="86" cy="100" r="7"/>
    </g>
  `),

  // Coração com rosa aplicada ao centro
  heartRose: iconWrap(`
    <g stroke="${ICON_COLOR}" stroke-width="1.6" fill="none" stroke-linejoin="round">
      <path d="M60 96 C24 70 20 46 34 34 C46 24 60 32 60 46 C60 32 74 24 86 34 C100 46 96 70 60 96 Z"/>
      <path d="M60 52 m-9 0 a9 9 0 1 0 18 0 a9 9 0 1 0 -18 0" stroke-dasharray="4 3"/>
      <path d="M60 43 q6 4 0 9 q6 -1 6 4" stroke-width="1.2"/>
    </g>
  `),

  // Descanso em formato de trevo (4 círculos sobrepostos + cabo)
  clover: iconWrap(`
    <g stroke="${ICON_COLOR}" stroke-width="1.5" fill="none">
      <circle cx="46" cy="46" r="17"/>
      <circle cx="74" cy="46" r="17"/>
      <circle cx="46" cy="74" r="17"/>
      <circle cx="74" cy="74" r="17"/>
      <path d="M60 78 L60 100" stroke-linecap="round"/>
    </g>
  `),

  // Vaso com arranjo de flores
  flowerVase: iconWrap(`
    <g stroke="${ICON_COLOR}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M46 70 L42 100 L78 100 L74 70 Z"/>
      <path d="M46 70 Q60 76 74 70"/>
      <path d="M60 70 L60 40"/>
      <path d="M44 46 L60 40 L60 22"/>
      <path d="M76 50 L60 42"/>
      <circle cx="60" cy="18" r="7"/>
      <circle cx="42" cy="42" r="6"/>
      <circle cx="78" cy="46" r="6"/>
    </g>
  `),

  // Par de sapatinhos de bebê
  booties: iconWrap(`
    <g stroke="${ICON_COLOR}" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round">
      <path d="M30 50 C30 40 38 34 46 34 C54 34 58 40 58 48 L58 66 C58 76 48 82 36 80 C28 78 26 70 28 62 Z"/>
      <path d="M30 50 C24 50 20 54 22 60"/>
      <path d="M62 50 C62 40 70 34 78 34 C86 34 90 40 90 48 L90 66 C90 76 80 82 68 80 C60 78 58 70 60 62 Z"/>
      <path d="M62 50 C56 50 52 54 54 60"/>
      <path d="M38 40 L50 40" stroke-dasharray="2.5 3"/>
      <path d="M70 40 L82 40" stroke-dasharray="2.5 3"/>
    </g>
  `),
};


/* ----------------------------------------------------------------
   3. DADOS DOS PRODUTOS
   Este array é o "banco de dados" do catálogo. Cada objeto é uma
   peça, com todas as informações usadas nos cards e na página de
   detalhe.

   Campos importantes:
   - icon:  chave do objeto ICONS (seção 2) usada enquanto não há foto real
   - photo: (opcional) nome do arquivo em /assets — se presente, a foto
            é usada no lugar do ícone (ver função productMedia, seção 9)
   - featured: aparece na seção "Peças em evidência" da Home
   - popular:  exibe a etiqueta "Popular" no card

   Para adicionar uma peça nova, copie um objeto inteiro, mude o
   "id" (precisa ser único) e ajuste os demais campos.
---------------------------------------------------------------- */
const PRODUCTS = [
  {
    id: '1', ref: 'DY-001', name: 'Centro de Mesa',
    category: 'Decoração', material: 'Barbante 100% algodão', technique: 'Crochê Tradicional',
    colors: [
      { name: 'Malve', hex: '#867886' },
      { name: 'Marfim', hex: '#F1E7CF' },
      { name: 'Mostarda', hex: '#C99A3B' },
      { name: 'Terracota', hex: '#B5652F' },
    ],
    customSizes: true, dimensions: 'Sob medida', weight: '160 g',
    care: [
      'Lavagem à mão com água fria',
      'Sabão neutro ou de coco',
      'Não torcer — prensar suavemente',
      'Secar à sombra em superfície plana',
    ],
    days: 30, popular: true, featured: true, icon: 'doily',
    photo: 'assets/centro_de_mesa.jpg', // foto real já disponível
    desc: 'Centro de mesa circular em crochê feito á mão, com desing elegante. Confeccionado em fio 100% algodão. Ideal para compor a decoração de mesas, aparadores e outros ambientes deixando o espaço mais acolhedor e elegante.',
  },
  {
    id: '2', ref: 'DY-002', name: 'Herry Potter',
    category: 'Amigurumi', material: 'Algodão 100%', technique: 'Crochê Tradicional',
    colors: [
      { name: 'Creme', hex: '#F1E7CF' },
      { name: 'Caramelo', hex: '#C99A3B' },
      { name: 'Rosa Bebê', hex: '#E8B6C4' },
      { name: 'Azul Bebê', hex: '#AFC9DE' },
    ],
    customSizes: false, dimensions: 'RN / 0–3m / 3–6m / 6–12m', weight: '55 g',
    care: [
      'Lavagem à mão, água morna',
      'Sabonete neutro hipoalergênico',
      'Enxaguar bem, sem resíduo de sabão',
      'Secar à sombra',
    ],
    days: 5, popular: true, featured: true, icon: 'bearHat',
    photo: 'assets/harry_potter.jpg', // foto real já disponível
    desc: 'Boneco de crochê feito à mão (amigurumi) do Harry Potter. A peça traz os detalhes marcantes do personagem, como os óculos redondos, a cicatriz de raio na testa, o cabelo marrom texturizado e o clássico cachecol nas cores vermelho e amarelo da Grifinória. Vem acompanhado de uma base de apoio branca para exibição. Ideal para decoração ou para presentear fãs da saga.',
  },
  {
    id: '3', ref: 'DY-003', name: 'Polvo Arco-Íris',
    category: 'Amigurumi', material: 'Algodão 100%', technique: 'Amigurumi',
    colors: [
      { name: 'Arco-Íris', hex: '#C99A3B' },
      { name: 'Pastel Mix', hex: '#AFC9DE' },
      { name: 'Rosa e Lilás', hex: '#E8B6C4' },
      { name: 'Neutro', hex: '#D9C79E' },
    ],
    customSizes: false, dimensions: '15 cm alt × 18 cm diâm (tentáculos)', weight: '65 g',
    care: [
      'Lavagem à mão, água morna',
      'Enchimento antialérgico certificado',
      'Secar completamente antes de usar',
    ],
    days: 6, popular: true, featured: true, icon: 'octopus',
    photo: 'assets/polvo.jpg', // foto real já disponível
    desc: 'Polvinho amigurumi com tentáculos coloridos e olhinhos bordados. Uma peça fofa, segura para bebês e um mimo para presentear.',
  },
  {
    id: '4', ref: 'DY-004', name: 'Chaveiro Capivara',
    category: 'Acessórios', material: 'Algodão 100%', technique: 'Amigurumi',
    colors: [
      { name: 'Cereja Clássica', hex: '#B5652F' },
      { name: 'Rosa', hex: '#E8B6C4' },
      { name: 'Menta', hex: '#A9C2A0' },
      { name: 'Lilás', hex: '#C6AFD1' },
    ],
    customSizes: false, dimensions: '9 cm alt × 6 cm larg', weight: '22 g',
    care: [
      'Lavagem à mão com água fria',
      'Sabão neutro',
      'Secar à sombra pendurado',
    ],
    days: 4, featured: true, icon: 'keychain',
    photo: 'assets/chaveiro-2.jpg', // foto real já disponível
    desc: 'Chaveiro em crochê com uma capivara fofinha e cheia de detalhes, feito à mão com todo carinho. 🧶🤎 Delicado e divertido, é perfeito para levar suas chaves, pendurar na bolsa ou usar como um mimo especial no dia a dia. Feito artesanalmente em fio de algodão, unindo charme, delicadeza e aquele toque único que só uma peça feita à mão tem.',
  },
  {
    id: '5', ref: 'DY-005', name: 'Bolsa de Crochê',
    category: 'Presentes', material: 'Barbante 100% algodão', technique: 'Crochê Tradicional',
    colors: [
      { name: 'Vermelho + Branco', hex: '#B5652F' },
      { name: 'Rosa + Branco', hex: '#E8B6C4' },
      { name: 'Marfim + Dourado', hex: '#C99A3B' },
    ],
    customSizes: true, dimensions: ' 25cm de Largura por 19cm de Altura', weight: '140 g',
    care: [
      'Lavar à mão em água fria',
      'Sabão neutro',
      'Secar estendido, à sombra',
      'Não usar alvejante',
    ],
    days: 10, popular: true, icon: 'heartRose',
    photo: 'assets/bolsa.jpg', // foto real já disponível
    desc: 'Bolsa artesanal confeccionada em fio de malha premium, feita à mão com todo cuidado e carinho em cada detalhe. Leve, prática e versátil, perfeita para complementar seus looks e acompanhar você em diferentes ocasiões. Disponível em diferentes cores, conforme disponibilidade. 🤎', },
  {
    id: '6', ref: 'DY-006', name: 'Descansos Trevo (kit c/ 4)',
    category: 'Decoração', material: 'Algodão 100%', technique: 'Crochê Tradicional',
    colors: [
      { name: 'Verde Musgo', hex: '#7C8F5E' },
      { name: 'Sálvia', hex: '#9CA778' },
      { name: 'Terracota', hex: '#B5652F' },
      { name: 'Marfim', hex: '#F1E7CF' },
    ],
    customSizes: false, dimensions: 'Ø 11 cm cada peça', weight: '90 g (kit completo)',
    care: [
      'Lavagem à mão, água morna',
      'Sabão neutro',
      'Secar à sombra em superfície plana',
    ],
    days: 5, icon: 'clover',
    desc: 'Kit com 4 descansos de panela ou copo em formato de trevo, feitos à mão em algodão resistente. Compõem lindamente a mesa posta e são ótimos para presentear em conjunto.',
  },
  {
    id: '7', ref: 'DY-007', name: 'Arranjo de Girassóis em Vaso',
    category: 'Decoração', material: 'Fio de Malha', technique: 'Crochê Tradicional',
    colors: [
      { name: 'Girassol Clássico', hex: '#C99A3B' },
      { name: 'Rosas & Verde', hex: '#B5652F' },
      { name: 'Margaridas Brancas', hex: '#F1E7CF' },
    ],
    customSizes: true, dimensions: 'Vaso 10 cm alt × arranjo 22 cm alt', weight: '220 g',
    care: [
      'Não lavar — higienizar com pano levemente úmido',
      'Manter longe de luz solar direta',
      'Sacudir levemente para tirar poeira',
    ],
    days: 12, featured: true, icon: 'flowerVase',
    desc: 'Arranjo de flores em crochê — girassóis, rosas ou margaridas, à sua escolha — fixado em vaso de cimento ou cerâmica. Uma peça decorativa que nunca murcha, feita à mão com atenção a cada pétala.',
  },
  {
    id: '8', ref: 'DY-008', name: 'Sapatinhos de Bebê Laço',
    category: 'Linha Infantil', material: 'Algodão 100%', technique: 'Crochê Tradicional',
    colors: [
      { name: 'Rosa Bebê', hex: '#E8B6C4' },
      { name: 'Azul Bebê', hex: '#AFC9DE' },
      { name: 'Amarelo Manteiga', hex: '#E8D89C' },
      { name: 'Marfim', hex: '#F1E7CF' },
    ],
    customSizes: true, dimensions: 'RN / 0–3m / 3–6m / 6–9m', weight: '35 g (par)',
    care: [
      'Lavagem à mão, água fria',
      'Sabonete infantil hipoalergênico',
      'Secar à sombra, peça a peça',
    ],
    days: 6, popular: true, icon: 'booties',
    desc: 'Sapatinhos em crochê com laçinho e acabamento delicado, feitos em algodão macio e seguro para a pele sensível do bebê. Um clássico para chás de bebê, maternidade e presentes de nascimento.',
  },
];

// Listas usadas nos filtros da página de Catálogo.
// Se criar uma categoria/material/técnica nova nos produtos acima,
// lembre de adicioná-la aqui também para que o filtro apareça.
const CATEGORIES = ['Todos', 'Decoração', 'Linha Infantil', 'Amigurumi', 'Acessórios', 'Presentes'];
const MATERIALS = ['Todos', 'Algodão 100%', 'Fio de Malha'];
const TECHNIQUES = ['Todos', 'Crochê Tradicional', 'Amigurumi'];


/* ----------------------------------------------------------------
   4. ELEMENTOS SVG COMPARTILHADOS
   Ícone do WhatsApp (usado nos botões) e do Instagram (usado na
   página de Contato), além do "fio decorativo" e do motivo do hero.
---------------------------------------------------------------- */

// Ícone do WhatsApp — classe "ico-fill" faz o SVG herdar a cor do texto
// quando está dentro de um botão (.btn svg{fill:currentColor} no CSS).
const WA_SVG = `<svg class="ico-fill" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>`;

// Ícone do Instagram — classe "ico-stroke" deixa o desenho "vazado"
// (só o contorno colorido, sem preenchimento) — ver regra no CSS.
const IG_SVG = `<svg class="ico-stroke" viewBox="0 0 24 24" stroke-width="1.5"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.4" cy="6.6" r="1"/></svg>`;

/**
 * Gera o SVG do "fio de crochê" ondulado usado como divisor decorativo
 * entre o hero e a seção de categorias, na Home.
 */
function threadDivider(color){
  const c = color || '#DDBD7C';
  let d = 'M0 11 ';
  for(let x = 0; x <= 1200; x += 30){
    d += `Q${x+15} ${x % 60 === 0 ? 2 : 20} ${x+30} 11 `;
  }
  return `<div class="thread"><svg viewBox="0 0 1200 22" preserveAspectRatio="none"><path d="${d}" stroke="${c}" stroke-width="1.4" fill="none"/></svg></div>`;
}

/**
 * Gera o grande motivo circular decorativo do hero da Home —
 * anéis concêntricos + "raios", lembrando um carretel/doily de crochê.
 */
function heroMotif(){
  let rings = '';
  for(let r = 30; r <= 290; r += 32){
    rings += `<circle cx="300" cy="300" r="${r}" stroke="#C99A3B" stroke-opacity="${r % 64 === 30 ? 0.55 : 0.28}" stroke-width="1.2" stroke-dasharray="${r % 64 === 30 ? '1 0' : '3 6'}"/>`;
  }
  let spokes = '';
  for(let i = 0; i < 24; i++){
    const a = (i / 24) * 2 * Math.PI;
    const x1 = 300 + 40 * Math.cos(a), y1 = 300 + 40 * Math.sin(a);
    const x2 = 300 + 290 * Math.cos(a), y2 = 300 + 290 * Math.sin(a);
    spokes += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#C99A3B" stroke-opacity="0.14" stroke-width="1"/>`;
  }
  return `<svg viewBox="0 0 600 600" fill="none">${spokes}${rings}<circle cx="300" cy="300" r="10" fill="#8C6821"/></svg>`;
}


/* ----------------------------------------------------------------
   5. ESTADO DA APLICAÇÃO E NAVEGAÇÃO
   STATE guarda "em que página estamos" e outras informações que
   precisam ser lembradas entre re-renderizações (produto selecionado,
   filtros do catálogo, menu mobile aberto/fechado...).

   navigate() troca de página e manda redesenhar a tela — é o nosso
   "router" (bem mais simples que um React Router, mas cumpre o papel).
---------------------------------------------------------------- */
let STATE = {
  page: 'home',            // 'home' | 'catalog' | 'product' | 'contact'
  productId: '1',          // id do produto sendo exibido na página de Produto
  catalog: {                // filtros/ordenação atuais do Catálogo
    cat: 'Todos',
    mat: 'Todos',
    tech: 'Todos',
    sort: 'Recentes',
  },
  mobileNavOpen: false,     // menu hambúrguer aberto?
  filtersOpen: false,       // painel de filtros mobile aberto?
};

/**
 * Troca de página e redesenha o site.
 * Chamada por todos os links/botões de navegação (onclick="navigate(...)").
 */
function navigate(page, opts){
  STATE.page = page;
  if(opts && opts.productId) STATE.productId = opts.productId;
  STATE.mobileNavOpen = false; // fecha o menu mobile ao trocar de página
  render();
  window.scrollTo({ top: 0, behavior: 'auto' });
}
// Exposto no escopo global porque é chamado a partir de atributos
// onclick="" gerados dinamicamente no HTML (ex.: onclick="navigate('home')").
window.navigate = navigate;


/* ----------------------------------------------------------------
   6. COMPONENTE: CABEÇALHO
   Menu fixo no topo, presente em todas as páginas.
---------------------------------------------------------------- */
function renderNav(){
  const links = [
    { label: 'Início', page: 'home' },
    { label: 'Catálogo', page: 'catalog' },
    { label: 'Contato', page: 'contact' },
  ];
  return `
  <header class="site-nav">
    <div class="wrap nav-row">
      <button class="brand" onclick="navigate('home')">Dy <em>Encantos</em></button>

      <nav class="nav-links">
        ${links.map(l => `<a class="nav-link ${STATE.page === l.page ? 'active' : ''}" href="javascript:void(0)" onclick="navigate('${l.page}')">${l.label}</a>`).join('')}
        <a class="btn btn-gold nav-cta" href="javascript:void(0)" onclick="openWhatsApp('peça personalizada','CUSTOM')">${WA_SVG}Encomendar</a>
      </nav>

      <!-- Botão "hambúrguer", só visível em telas pequenas (ver CSS) -->
      <button class="nav-toggle" onclick="STATE.mobileNavOpen = !STATE.mobileNavOpen; render()">
        <span></span><span></span><span></span>
      </button>
    </div>

    <!-- Menu suspenso mobile: abre/fecha via classe .open -->
    <div class="mobile-menu ${STATE.mobileNavOpen ? 'open' : ''}">
      ${links.map(l => `<a href="javascript:void(0)" onclick="navigate('${l.page}')">${l.label}</a>`).join('')}
      <a href="javascript:void(0)" style="margin-top:10px" class="btn btn-gold btn-block" onclick="openWhatsApp('peça personalizada','CUSTOM')">${WA_SVG}Encomendar via WhatsApp</a>
    </div>
  </header>`;
}


/* ----------------------------------------------------------------
   7. COMPONENTE: RODAPÉ
   Presente em todas as páginas, logo após o conteúdo principal.
---------------------------------------------------------------- */
function renderFooter(){
  return `
  <footer>
    <div class="wrap">
      <div class="footer-grid">
        <div>
          <p class="brand font-display">Dy Encantos</p>
          <p>Crochê artesanal feito à mão, com carinho e atenção a cada detalhe — peças sob encomenda para decorar, presentear e encantar.</p>
        </div>
        <div class="footer-col">
          <p class="heading">Navegação</p>
          <a href="javascript:void(0)" onclick="navigate('home')">Início</a>
          <a href="javascript:void(0)" onclick="navigate('catalog')">Catálogo</a>
          <a href="javascript:void(0)" onclick="navigate('contact')">Contato</a>
        </div>
        <div class="footer-col">
          <p class="heading">Contato</p>
          <p class="line">WhatsApp: (51) 9221-1145</p>
          <a href="https://www.instagram.com/dyenisilva_artesanato/" target="_blank" rel="noopener">${IG_HANDLE}</a>
          <p class="line">Brasil — envio nacional</p>
        </div>
      </div>
      <p class="copyright">© 2026 Dy Encantos. Todos os direitos reservados.</p>
    </div>
  </footer>`;
}


/* ----------------------------------------------------------------
   8. PÁGINA: HOME
   Hero + categorias + destaques (fundo escuro) + "como funciona" +
   faixa de CTA + rodapé.
---------------------------------------------------------------- */
function renderHome(){
  const featured = PRODUCTS.filter(p => p.featured).slice(0, 3);

  const cats = [
    { label: 'Decoração', desc: 'Sousplats, tapetes e flores', icon: ICONS.doily },
    { label: 'Linha Infantil', desc: 'Toucas, sapatinhos e enxoval', icon: ICONS.bearHat },
    { label: 'Amigurumi', desc: 'Bichinhos fofos sob medida', icon: ICONS.octopus },
    { label: 'Acessórios', desc: 'Chaveiros e mimos', icon: ICONS.keychain },
  ];

  return `
  <!-- HERO -->
  <section class="hero">
    <div class="hero-motif">${heroMotif()}</div>
    <div class="wrap hero-inner">
      <p class="eyebrow" style="margin-bottom:18px;">Crochê artesanal sob encomenda</p>
      <h1>Cada ponto conta<br/><i>uma história</i></h1>
      <p class="lead">Peças em crochê feitas à mão, uma a uma — para decorar sua casa, vestir seu bebê ou presentear com carinho de verdade.</p>
      <div class="hero-ctas">
        <a class="btn btn-gold" href="javascript:void(0)" onclick="navigate('catalog')">Ver catálogo</a>
        <a class="btn btn-outline" href="javascript:void(0)" onclick="openWhatsApp('peça personalizada','CUSTOM')">Solicitar orçamento</a>
      </div>
    </div>
  </section>
  ${threadDivider()}

  <!-- CATEGORIAS -->
  <section class="wrap">
    <div class="section-head">
      <h2 class="font-display">Nossas categorias</h2>
      <a class="see-all" href="javascript:void(0)" onclick="navigate('catalog')">Ver tudo</a>
    </div>
    <div class="cat-grid">
      ${cats.map(c => `
        <button class="cat-tile" onclick="navigate('catalog')">
          <div class="icon-wrap">${c.icon}</div>
          <div class="cat-label"><p class="name font-display">${c.label}</p><p class="desc">${c.desc}</p></div>
        </button>`).join('')}
    </div>
  </section>

  <!-- DESTAQUES (fundo escuro) -->
  <section class="dark-section">
    <div class="wrap">
      <p class="eyebrow">Destaques</p>
      <h2 class="section-head" style="border:none; margin-bottom:38px; display:block;">Peças em evidência</h2>
      <div class="card-grid">
        ${featured.map(p => productCard(p)).join('')}
      </div>
    </div>
  </section>

  <!-- COMO FUNCIONA (processo em 4 etapas) -->
  <section class="wrap">
    <div class="process-grid">
      <div class="process-head">
        <p class="eyebrow">Processo</p>
        <h2 class="font-display">Como funciona<br/><i style="font-style:italic; color:var(--gold-dark);">a encomenda</i></h2>
        <p>Cada peça nasce de uma conversa. Você escolhe o modelo, as cores e nos passa as medidas — eu cuido do resto com dedicação e atenção a cada ponto.</p>
        <a class="btn btn-gold" href="javascript:void(0)" onclick="openWhatsApp('peça personalizada','CUSTOM')">${WA_SVG}Iniciar conversa</a>
      </div>
      <div class="steps">
        ${[
          { n: '01', t: 'Escolha o modelo', d: 'Navegue pelo catálogo e escolha a peça desejada. Guarde a referência (ex: DY-001).' },
          { n: '02', t: 'Informe cores e medidas', d: 'Pelo WhatsApp, me conte as cores desejadas e as medidas necessárias.' },
          { n: '03', t: 'Confirmação e produção', d: 'Confirmamos o orçamento e início da confecção. Prazo médio: 4 a 12 dias úteis.' },
          { n: '04', t: 'Envio ou retirada', d: 'Envio via Correios para todo o Brasil, ou combinamos retirada local.' },
        ].map(s => `<div class="step"><span class="n">${s.n}</span><div><h4>${s.t}</h4><p>${s.d}</p></div></div>`).join('')}
      </div>
    </div>
  </section>

  <!-- FAIXA DE CTA -->
  <section class="cta-strip">
    <div class="wrap">
      <h2 class="font-display">Quer algo 100% exclusivo?</h2>
      <p>Crio designs personalizados do zero. Me conta sua ideia e vamos transformá-la em uma peça única, feita à mão especialmente para você.</p>
      <a class="btn" style="background:var(--cream); color:var(--gold-dark);" href="javascript:void(0)" onclick="navigate('contact')">Solicitar design exclusivo</a>
    </div>
  </section>

  ${renderFooter()}
  `;
}


/* ----------------------------------------------------------------
   9. COMPONENTE: CARTÃO DE PRODUTO
   Usado na Home ("Destaques"), no Catálogo e em "Peças relacionadas".

   productMedia() decide se mostra uma foto real (quando o produto
   tem o campo "photo") ou o ícone ilustrado (fallback padrão).
---------------------------------------------------------------- */
function productMedia(p){
  return p.photo
    ? `<img src="${p.photo}" alt="${p.name}"/>`
    : `<div class="icon-wrap">${ICONS[p.icon]}</div>`;
}

function productCard(p){
  return `
  <a class="p-card" href="javascript:void(0)" onclick="navigate('product', {productId:'${p.id}'})">
    <div class="p-media">
      ${productMedia(p)}
      <span class="p-badge">${p.category}</span>
      ${p.popular ? '<span class="p-badge popular">Popular</span>' : ''}
    </div>
    <p class="p-ref">${p.ref}</p>
    <p class="p-name font-display">${p.name}</p>
    <p class="p-sub">${p.days} dias úteis</p>
  </a>`;
}


/* ----------------------------------------------------------------
   10. PÁGINA: CATÁLOGO
   Filtros (categoria/material/técnica), ordenação e grade de cards.
   Os filtros ficam salvos em STATE.catalog para persistir enquanto
   o usuário navega pela página (mas resetam ao recarregar o site).
---------------------------------------------------------------- */

/** Gera o HTML dos três grupos de filtro (Categoria/Material/Técnica). */
function filterPanelHTML(){
  const groups = [
    { label: 'Categoria', values: CATEGORIES, cur: STATE.catalog.cat, key: 'cat' },
    { label: 'Material', values: MATERIALS, cur: STATE.catalog.mat, key: 'mat' },
    { label: 'Técnica', values: TECHNIQUES, cur: STATE.catalog.tech, key: 'tech' },
  ];
  return groups.map(g => `
    <div class="filter-group">
      <p class="f-label">${g.label}</p>
      ${g.values.map(v => `
        <button class="filter-opt ${g.cur === v ? 'active' : ''}" onclick="STATE.catalog.${g.key}='${v}'; render()">
          <span class="box"></span>${v}
        </button>`).join('')}
    </div>`).join('');
}

function renderCatalog(){
  const { cat, mat, tech, sort } = STATE.catalog;

  // 1) Filtra a lista de produtos de acordo com os filtros ativos
  let list = PRODUCTS.filter(p => {
    if(cat !== 'Todos' && p.category !== cat) return false;
    if(mat !== 'Todos' && p.material !== mat) return false;
    if(tech !== 'Todos' && p.technique !== tech) return false;
    return true;
  });

  // 2) Ordena a lista filtrada conforme a opção escolhida
  if(sort === 'Mais rápido') list = list.slice().sort((a, b) => a.days - b.days);
  else if(sort === 'Mais elaborado') list = list.slice().sort((a, b) => b.days - a.days);
  else if(sort === 'Populares') list = list.slice().sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
  // 'Recentes' mantém a ordem original do array PRODUCTS

  return `
  <div class="page-head"><div class="wrap">
    <p class="eyebrow" style="margin-bottom:10px;">Vitrine</p>
    <h1 class="font-display">Catálogo de peças</h1>
  </div></div>

  <div class="wrap" style="padding-top:36px; padding-bottom:80px;">
    <div class="cat-toolbar">
      <div style="display:flex; align-items:center; gap:16px;">
        <button class="filter-toggle" onclick="STATE.filtersOpen = !STATE.filtersOpen; render()">Filtros</button>
        <p class="cat-count"><b>${list.length}</b> peças encontradas</p>
      </div>
      <select class="sort-select" onchange="STATE.catalog.sort=this.value; render()">
        ${['Recentes', 'Populares', 'Mais rápido', 'Mais elaborado'].map(o => `<option ${sort === o ? 'selected' : ''}>${o}</option>`).join('')}
      </select>
    </div>

    <!-- Painel de filtros mobile (abre/fecha pelo botão "Filtros" acima) -->
    <div class="filters-mobile ${STATE.filtersOpen ? 'open' : ''}">${filterPanelHTML()}</div>

    <div class="catalog-layout">
      <!-- Painel de filtros desktop (barra lateral fixa) -->
      <aside class="filters-desktop">${filterPanelHTML()}</aside>

      <div class="cat-content">
        ${list.length === 0
          ? `<div class="empty-state"><h3 class="font-display">Nenhuma peça encontrada</h3><p>Tente outros filtros</p></div>`
          : `<div class="card-grid">${list.map(p => productCard(p)).join('')}</div>`}
      </div>
    </div>
  </div>

  ${renderFooter()}`;
}


/* ----------------------------------------------------------------
   11. PÁGINA: PRODUTO
   Detalhe de uma peça: imagem/ícone grande, seletor de cor,
   botões de encomenda, tabela de especificações, cuidados de
   lavagem, guia de medidas (se aplicável) e peças relacionadas.
---------------------------------------------------------------- */

function renderProduct(){
  const p = PRODUCTS.find(x => x.id === STATE.productId) || PRODUCTS[0];

  // Até 3 produtos da mesma categoria, para a seção "Peças relacionadas"
  const related = PRODUCTS.filter(x => x.id !== p.id && x.category === p.category).slice(0, 3);

  return `
  <!-- Trilha (breadcrumb) -->
  <div class="wrap crumb">
    <a href="javascript:void(0)" onclick="navigate('home')">Início</a><span>/</span>
    <a href="javascript:void(0)" onclick="navigate('catalog')">Catálogo</a><span>/</span>
    <span class="cur">${p.name}</span>
  </div>

  <div class="wrap product-layout">
    <!-- Coluna esquerda: imagem/ícone do produto -->
    <div class="product-media">
      ${productMedia(p)}
      <div class="product-tags">
        <span class="tag cat">${p.category}</span>
        ${p.customSizes ? '<span class="tag size">Tamanho sob medida</span>' : ''}
      </div>
    </div>

    <!-- Coluna direita: informações e ações -->
    <div>
      <p class="p-ref-lg">${p.ref}</p>
      <h1 class="p-title font-display">${p.name}</h1>
      <p class="p-desc">${p.desc}</p>

      <!-- Botões de ação -->
      <a class="btn btn-gold btn-block" style="margin-bottom:10px;" href="javascript:void(0)" onclick="openWhatsApp('${p.name}','${p.ref}')">${WA_SVG}Encomendar via WhatsApp</a>
      <a class="btn btn-outline btn-block" href="javascript:void(0)" onclick="navigate('contact')">Solicitar orçamento</a>

      <!-- Tabela de especificações técnicas -->
      <div class="spec-table">
        ${[
          { k: 'Referência', v: p.ref },
          { k: 'Material', v: p.material },
          { k: 'Técnica', v: p.technique },
          { k: 'Dimensões', v: p.dimensions },
          { k: 'Peso', v: p.weight },
          { k: 'Prazo de confecção', v: p.days + ' dias úteis' },
        ].map(r => `<div class="spec-row"><span class="k">${r.k}</span><span class="v">${r.v}</span></div>`).join('')}
      </div>

      <!-- Instruções de cuidado/lavagem -->
      <div class="care">
        <p class="title">Cuidados e lavagem</p>
        <ul>${p.care.map(c => `<li>${c}</li>`).join('')}</ul>
      </div>

      <!-- Guia de medidas: só aparece se o produto aceitar tamanho sob medida -->
      ${p.customSizes ? `
      <div class="size-guide">
        <p class="title">Guia de medidas</p>
        <p>Para garantir o caimento perfeito, envie via WhatsApp as medidas do ambiente, peça ou corpo conforme indicado na descrição do produto.</p>
      </div>` : ''}
    </div>
  </div>

  <!-- Peças relacionadas (mesma categoria) -->
  ${related.length ? `
  <div class="wrap related-wrap" style="padding-bottom:80px;">
    <h2 class="font-display">Peças relacionadas</h2>
    <div class="card-grid">${related.map(p => productCard(p)).join('')}</div>
  </div>` : `<div style="padding-bottom:40px;"></div>`}

  ${renderFooter()}`;
}


/* ----------------------------------------------------------------
   12. PÁGINA: CONTATO
   Formulário de pedido que, ao ser enviado, monta uma mensagem
   formatada e abre o WhatsApp com ela pronta para envio.
---------------------------------------------------------------- */

let CONTACT_SENT = false; // controla se mostra o formulário ou a tela de "enviado"
let CONTACT_FORM = { name: '', email: '', whatsapp: '', category: '', colors: '', sizes: '', details: '' };

/**
 * Lida com o envio do formulário de contato: monta a mensagem,
 * abre o WhatsApp e troca a tela para o estado de "Pedido enviado!".
 */
function submitContact(e){
  e.preventDefault(); // impede o recarregamento padrão da página
  const f = CONTACT_FORM;
  const msg = `*Nova Encomenda — Dy Encantos*\n\nNome: ${f.name}\nE-mail: ${f.email}\nWhatsApp: ${f.whatsapp}\nCategoria: ${f.category}\nCores: ${f.colors}\nMedidas: ${f.sizes}\n\nDetalhes:\n${f.details}`;
  window.open(waLink(msg), '_blank');
  CONTACT_SENT = true;
  render();
}
window.submitContact = submitContact;

function renderContact(){
  const f = CONTACT_FORM;
  return `
  <div class="page-head"><div class="wrap">
    <p class="eyebrow" style="margin-bottom:10px;">Atendimento</p>
    <h1 class="font-display">Central de encomendas</h1>
  </div></div>

  <div class="wrap contact-layout" style="padding:60px 0 90px;">
    <!-- Formulário -->
    <div>
      <h2 class="font-display">Formulário de pedido</h2>
      <p>Preencha o formulário e você será redirecionada para o WhatsApp com sua solicitação pré-formatada. Respondo em até 24h.</p>

      ${CONTACT_SENT ? `
        <div class="sent-box">
          <div class="emoji">🧶</div>
          <h3 class="font-display">Pedido enviado!</h3>
          <p>Você foi redirecionada ao WhatsApp. Aguarde a resposta em breve!</p>
          <button onclick="CONTACT_SENT=false; render()">Enviar outro pedido</button>
        </div>` : `
        <form onsubmit="submitContact(event)">
          <div class="form-row">
            <div class="field"><label>Nome *</label><input required value="${f.name}" oninput="CONTACT_FORM.name=this.value" placeholder="Seu nome completo"/></div>
            <div class="field"><label>E-mail *</label><input required type="email" value="${f.email}" oninput="CONTACT_FORM.email=this.value" placeholder="seu@email.com"/></div>
          </div>
          <div class="form-row">
            <div class="field"><label>WhatsApp *</label><input required value="${f.whatsapp}" oninput="CONTACT_FORM.whatsapp=this.value" placeholder="(11) 9 9999-9999"/></div>
            <div class="field"><label>Categoria</label>
              <select oninput="CONTACT_FORM.category=this.value">
                <option value="">Selecione...</option>
                ${CATEGORIES.filter(c => c !== 'Todos').map(c => `<option ${f.category === c ? 'selected' : ''}>${c}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="field"><label>Cores desejadas</label><input value="${f.colors}" oninput="CONTACT_FORM.colors=this.value" placeholder="Ex: sálvia + marfim + dourado"/></div>
          <div class="field"><label>Medidas e tamanho</label><input value="${f.sizes}" oninput="CONTACT_FORM.sizes=this.value" placeholder="Ex: Ø 35cm, RN, P/M/G..."/></div>
          <div class="field"><label>Detalhes do pedido</label><textarea rows="4" oninput="CONTACT_FORM.details=this.value" placeholder="Descreva a peça desejada, referências, urgência ou qualquer detalhe importante...">${f.details}</textarea></div>
          <button type="submit" class="btn btn-gold btn-block">${WA_SVG}Enviar via WhatsApp</button>
        </form>`}
    </div>

    <!-- Coluna de informações: canais, envio e pagamento -->
    <div>
      <h3 class="font-display" style="margin-bottom:16px;">Canais de atendimento</h3>
      <div class="channel">${WA_SVG}
        <div><p class="lab">WhatsApp</p><p class="val">+55 51 9221-1145</p><p class="sub">Seg–Sex, 9h às 18h</p></div>
      </div>
      <div class="channel">${IG_SVG}
        <div><p class="lab">Instagram</p><p class="val">${IG_HANDLE}</p><p class="sub">Novidades e peças prontas</p></div>
      </div>

      <div class="info-box" style="margin-top:26px;">
        <h3 class="font-display">Envio &amp; entrega</h3>
        ${[
          { b: 'Correios (PAC/Sedex)', d: 'Todo o Brasil' },
          { b: 'Retirada local', d: 'A combinar endereço' },
          { b: 'Entrega combinada', d: 'Consultar disponibilidade na região' },
        ].map(s => `<div class="ship-row"><span class="dot">◆</span><span><b>${s.b}</b> <span class="d">— ${s.d}</span></span></div>`).join('')}
      </div>

      <div>
        <h3 class="font-display" style="margin-bottom:10px;">Pagamento</h3>
        <div>${['Pix', 'Transferência', 'Cartão de Crédito'].map(p => `<span class="pay-chip">${p}</span>`).join('')}</div>
        <p style="font-size:12px; color:var(--taupe); margin-top:10px;">50% de entrada no início da produção, 50% antes do envio.</p>
      </div>
    </div>
  </div>

  ${renderFooter()}`;
}


/* ----------------------------------------------------------------
   13. RENDERIZAÇÃO PRINCIPAL
   Função central: olha o STATE atual, decide qual página desenhar
   e injeta o HTML resultante dentro de <div id="app">.

   Toda mudança de estado no site (trocar de página, marcar um
   filtro, escolher uma cor, abrir o menu mobile...) termina com uma
   chamada a render() para atualizar a tela.
---------------------------------------------------------------- */
function render(){
  let mainHTML = '';
  if(STATE.page === 'home') mainHTML = renderHome();
  else if(STATE.page === 'catalog') mainHTML = renderCatalog();
  else if(STATE.page === 'product') mainHTML = renderProduct();
  else if(STATE.page === 'contact') mainHTML = renderContact();

  document.getElementById('app').innerHTML = `
    ${renderNav()}
    <main>${mainHTML}</main>
  `;
}

// Primeira renderização, assim que o script carrega.
render();
