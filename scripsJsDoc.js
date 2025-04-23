/**
 * Configurações globais do modal.
 *
 * Contém identificadores, delay de exibição, lista de URLs permitidas para renderização,
 * e estilos CSS organizados por tipo (base, animações e responsividade).
 *
 * @constant
 * @type {Object}
 * @property {string} ID - ID único do elemento modal no DOM.
 * @property {string} STYLE_ID - ID único usado para o bloco de estilos inline.
 * @property {number} DELAY - Tempo (em milissegundos) para exibir o modal após o carregamento da página.
 * @property {string[]} ALLOWED_URLS - Lista de URLs autorizadas onde o modal pode ser exibido.
 * @property {Object} STYLES - Bloco contendo os estilos CSS organizados por tipo.
 * @property {string} STYLES.BASE - Estilos visuais base do modal, incluindo estrutura e aparência.
 * @property {string} STYLES.ANIMATIONS - Animações CSS aplicadas à entrada e saída do modal.
 * @property {string} STYLES.MOBILE - Estilos CSS aplicados a dispositivos com largura máxima de 576px (mobile).
 */
const MODAL_CONFIG = {
  ID: "lcs-modal",
  STYLE_ID: "style-lcs-modal",
  DELAY: 5000,
  ALLOWED_URLS: [
    //"http://127.0.0.1:5500/index.html", // Ambiente para teste
    "https://abrasuaconta.santander.com.br/landing/conta-select",
  ],
  STYLES: {
    BASE: `
    .lcs-modal {
      align-items: center;
      background-color: #0007;
      display: flex;
      justify-content: center;
      left: 0;
      min-height: 100vh;
      padding: 48px;
      position: fixed;
      top: 0;
      width: 100%;
      will-change: transform, opacity;
      z-index: 9999999999999;
    }
    .lcs-modal__container {
      background-color: white;
      border-radius: 8px;
      box-shadow: 0 4px 8px #10184007;
      max-width: 480px;
      width: 100%;
    }
    .lcs-modal__content {
      padding: 16px 24px;
    }
    .lcs-modal__header {
      align-items: center;
      display: flex;
      gap: 8px;
      justify-content: space-between;
    }
    .lcs-modal__header--title {
      color: #282a2f;
      font-size: 21px;
    }
    .lcs-modal__body--p,
    .lcs-modal__footer--cta {
      font-size: 16px;
    }
    .lcs-modal__header--figure {
      height: 32px;
      width: 32px;
    }
    .lcs-modal__header--close,
    .lcs-modal__footer--cta {
      background-color: transparent;
      border: none;
      cursor: pointer;
      outline: none;
    }
    .lcs-modal__header--close {
      opacity: 0.6;
      transition: 0.3s ease-in-out;
    }
    .lcs-modal__header--close:hover {
      opacity: 1;
    }
    .lcs-modal__body {
      border-bottom: solid 1px #ddd;
    }
    .lcs-modal__footer {
      display: flex;
      justify-content: end;
    }
    .lcs-modal__footer--cta {
      background-color: #1a1a1c;
      border-radius: 8px;
      color: white;
      padding: 8px 16px;
      transition: 0.3s ease-in-out;
    }
    .lcs-modal__footer--cta:hover {
      background-color: #ec0000;
    }`,
    ANIMATIONS: `
    #lcs-modal.fadeIn {
      animation: fadeIn 0.4s ease-out forwards;
    }
    #lcs-modal.fadeOut {
      animation: fadeOut 0.4s ease-out forwards;
    }
    .lcs-modal__container.moveUp {
      animation: moveUp 0.4s ease-out forwards;
    }
    .lcs-modal__container.moveDown {
      animation: moveDown 0.4s ease-out forwards;
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
    @keyframes fadeOut {
      from {
        opacity: 1;
      }
      to {
        opacity: 0;
      }
    }
    @keyframes moveUp {
      from {
        transform: translateY(20px);
      }
      to {
        transform: translateY(0);
      }
    }
    @keyframes moveDown {
      from {
        transform: translateY(0);
      }
      to {
        transform: translateY(20px);
      }
    }`,
    MOBILE: `
    @media (max-width: 576px) {
      .lcs-modal {
        padding: 24px;
      }
      .lcs-modal__header--title {
        font-size: 16px;
      }
      .lcs-modal__header--figure {
        height: 24px;
        width: 24px;
      }
      .lcs-modal__body--p,
      .lcs-modal__footer--cta {
        font-size: 14px;
      }
      .lcs-modal__footer--cta {
        width: 100%;
      }
    }`,
  },
};
/**
 * Lista de tags SVG permitidas para criação de elementos SVG no DOM com a classe ElementBuilder.
 *
 * Utilizada para validar ou identificar elementos SVG ao construir nodes dinamicamente,
 * garantindo suporte seguro e correto à manipulação de SVGs.
 *
 * @constant
 * @type {string[]}
 */
const SVG_TAGS = [
  "svg",
  "path",
  "circle",
  "rect",
  "line",
  "g",
  "defs",
  "use",
  "symbol",
];
/**
 * Objeto global que armazena os estados da aplicação.
 * Neste caso, é mantido o controle da posição de rolagem da página.
 *
 * @type {AppStates}
 */
const appStates = {
  /**
   * Representa o estado atual da aplicação.
   * Contém as posições de rolagem da página.
   *
   * @typedef {Object} AppStates
   * @property {Object} scrollPosition - A posição de rolagem da página.
   * @property {number} scrollPosition.top - A posição de rolagem vertical (topo) da página.
   * @property {number} scrollPosition.left - A posição de rolagem horizontal (esquerda) da página.
   */
  scrollPosition: { top: 0, left: 0 },
};
/**
 * Conjunto de validações para garantir que a estrutura do modal seja injetada corretamente e que a página esteja no contexto correto.
 *
 * Estas funções são usadas para checar se os pré-requisitos para injeção do modal foram atendidos, como:
 * - A presença do elemento `body` no DOM;
 * - A injeção do estilo e do modal;
 * - A URL da página ser permitida para exibição do modal.
 *
 * @constant
 * @type {Object}
 * @property {Function} hasBody Verifica se o elemento `body` está presente no DOM.
 * @property {Function} hasInjectedModalStyles Verifica se os estilos do modal foram injetados no documento.
 * @property {Function} hasInjectedModal Verifica se o modal já foi injetado no documento.
 * @property {Function} isCorrectPage Verifica se a página atual corresponde às URLs permitidas para exibição do modal.
 */
const validations = {
  /**
   * Verifica se o elemento `body` existe no DOM.
   * @returns {boolean} `true` se o `body` for encontrado, `false` caso contrário.
   */
  hasBody: () => !!document.querySelector("body"),
  /**
   * Verifica se os estilos do modal foram injetados no documento.
   * @returns {boolean} `true` se os estilos foram injetados, `false` caso contrário.
   */
  hasInjectedModalStyles: () =>
    !!document.getElementById(MODAL_CONFIG.STYLE_ID),
  /**
   * Verifica se o modal já foi injetado no documento.
   * @returns {boolean} `true` se o modal já estiver injetado, `false` caso contrário.
   */
  hasInjectedModal: () => !!document.getElementById(MODAL_CONFIG.ID),
  /**
   * Verifica se a URL da página está na lista de URLs permitidas para exibição do modal.
   * @returns {boolean} `true` se a URL atual for permitida, `false` caso contrário.
   */
  isCorrectPage: () =>
    MODAL_CONFIG.ALLOWED_URLS.some((url) =>
      document.location.href.includes(url)
    ),
};
/**
 * Conjunto de funções utilitárias que ajudam com a manipulação do modal, controle de scroll e integração com o data layer.
 * Estas funções são usadas para:
 * - Controle de scroll da página (habilitar/desabilitar);
 * - Manipulação de animações de classe;
 * - Validações relacionadas ao modal;
 * - Interação com o data layer para análise de dados;
 * - Remoção do modal e seus estilos.
 *
 * @constant
 * @type {Object}
 * @property {Object} scrollPosition Posição de scroll armazenada para reverter ao restaurar o scroll.
 * @property {Function} animationRemove Função para adicionar aniamação de remoção aos elementos.
 * @property {Function} disableScroll Função para desabilitar o scroll da página.
 * @property {Function} enableScroll Função para reabilitar o scroll da página.
 * @property {Function} getCompiledStyles Função que retorna todos os estilos do modal compilados em uma string.
 * @property {Function} modalValidations Função que executa as validações necessárias antes de injetar o modal.
 * @property {Function} modalPushDataLayer Função para empurrar dados para o data layer do Google Analytics.
 * @property {Function} removeModal Função para remover o modal e seus estilos do DOM.
 */
const utils = {
  /**
   * Remove ou substitui animações de classe.
   * @param {Object} params - Objeto contendo as classes de animação.
   * @param {string} params.initialClass - Nome da classe de animação de introdução do componente na tela.
   * @param {string} params.finalClass - Nome da classe de animação de remoção do componente na tela.
   */
  animationRemove: ({ initialClass = "", finalClass = "" }) => {
    const nodeList = document.querySelectorAll(`.${initialClass}`);
    if (nodeList.length < 1) return;
    nodeList.forEach((node) => {
      node.classList.replace(initialClass, finalClass);
    });
  },
  /**
   * Desabilita o scroll da página.
   * Armazena a posição atual do scroll para restaurá-la posteriormente.
   * Modifica o estilo do corpo da página para fixá-lo no topo.
   */
  disableScroll: () => {
    appStates.scrollPosition = {
      top: window.pageYOffset || document.documentElement.scrollTop,
      left: window.pageXOffset || document.documentElement.scrollLeft,
    };

    document.body.style.position = "fixed";
    document.body.style.overflow = "initial";
    document.body.style.top = `-${appStates.scrollPosition.top}px`;
    document.body.style.left = `-${appStates.scrollPosition.left}px`;
    document.body.style.width = "100%";
  },
  /**
   * Habilita o scroll da página e restaura a posição do scroll.
   * Restaura os estilos originais do corpo da página.
   */
  enableScroll: () => {
    document.body.style.position = "";
    document.body.style.top = "";
    document.body.style.left = "";
    document.body.style.width = "";
    document.body.style.overflow = "";

    window.scrollTo(
      appStates.scrollPosition.left,
      appStates.scrollPosition.top
    );
  },
  /**
   * Compila e retorna todos os estilos do modal em uma única string.
   * Remove espaços extras e normaliza a string de estilo.
   * @returns {string} Estilos do modal compilados.
   */
  getCompiledStyles: () => {
    return Object.values(MODAL_CONFIG.STYLES)
      .map((style) => style.replace(/\s+/g, " ").trim())
      .join(" ");
  },
  /**
   * Realiza validações antes de injetar o modal na página.
   * Verifica se o `body` existe, se o modal já foi injetado, e se a página é válida.
   * @returns {boolean} `true` se todas as validações passarem, caso contrário `false`
   * e acusa o motivo no console.
   */
  modalValidations: () => {
    if (!validations.hasBody()) {
      console.warn("Body not found!");
      return false;
    }
    if (validations.hasInjectedModal()) {
      console.warn("Modal already exists in the current context!");
      return false;
    }
    if (!validations.isCorrectPage()) {
      console.warn("divergent url");
      return false;
    }
    return true;
  },
  /**
   * Envia dados para o data layer do Google Analytics.
   * Utiliza o `window.dataLayer` para enviar informações adicionais sobre o modal.
   * O `try...catch` é utilizado para garantir que erros inesperados não interrompam a execução do código e que qualquer falha seja tratada de forma controlada.
   * @param {Object} data - Dados a serem enviados para o data layer.
   * @returns {boolean} `true` se os dados foram enviados com sucesso, caso contrário `false`.
   */
  modalPushDataLayer: (data = {}) => {
    try {
      const isDataInvalid =
        !data || typeof data !== "object" || Object.keys(data).length === 0;
      if (isDataInvalid) return false;
      if (typeof window === "undefined") return false;

      window.dataLayer = window.dataLayer || [];

      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(data);
        return true;
      }

      console.debug("GA não disponível", data);
      return false;
    } catch (error) {
      console.error(`Erro no dataLayer: ${error}`);
      return false;
    }
  },
  /**
   * Remove o modal e seus estilos do DOM.
   * Executa animações de saída antes de remover os elementos.
   */
  removeModal: () => {
    if (!validations.hasInjectedModal()) return;
    const modal = document.getElementById(MODAL_CONFIG.ID);
    const modalStyle = document.getElementById(MODAL_CONFIG.STYLE_ID);
    utils.animationRemove({
      initialClass: "fadeIn",
      finalClass: "fadeOut",
    });
    utils.animationRemove({
      initialClass: "moveDown",
      finalClass: "moveUp",
    });
    setTimeout(() => {
      try {
        modal.parentNode.removeChild(modal);
        modalStyle.parentNode.removeChild(modalStyle);
      } catch {
        return false;
      }
    }, 400);
  },
};
/**
 * Classe utilitária para criar e configurar elementos HTML ou SVG de forma modular e reutilizável.
 *
 * Permite aplicar atributos, classes, eventos, texto e filhos de forma encadeada e limpa.
 *
 * ⚠️ Por segurança, esta classe **não expõe** métodos como `setHTML` para evitar riscos de **injeção de código malicioso (XSS)**.
 */
class ElementBuilder {
  /**
   * Cria uma nova instância de ElementBuilder com base na tag informada.
   *
   * @param {string} tag - A tag HTML ou SVG a ser criada (ex: 'div', 'svg', 'path').
   * @param {Object} [options={}] - Opções para configurar o elemento.
   * @param {Object.<string, string>} [options.attrs] - Atributos a serem aplicados no elemento (ex: id, role).
   * @param {string[]} [options.classes] - Lista de classes CSS a serem adicionadas.
   * @param {string} [options.text] - Texto a ser inserido no conteúdo do elemento.
   * @param {Object.<string, Function>} [options.events] - Eventos DOM a serem adicionados (ex: { click: () => {} }).
   * @param {Array<Element|ElementBuilder>} [options.children] - Elementos filhos a serem adicionados.
   */
  constructor(tag, options = {}) {
    const isSvg = SVG_TAGS.includes(tag);
    this.element = isSvg
      ? document.createElementNS("http://www.w3.org/2000/svg", tag)
      : document.createElement(tag);
    this.setAttributes(options.attrs || {});
    this.addClasses(options.classes || []);
    this.setText(options.text || "");
    this.addEvents(options.events || {});
    this.appendChildren(options.children || []);
  }
  /**
   * Define atributos no elemento.
   *
   * @param {Object.<string, string>} attrs - Objeto contendo os atributos e seus respectivos valores.
   */
  setAttributes(attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      this.element.setAttribute(key, value);
    });
  }
  /**
   * Adiciona uma ou mais classes CSS ao elemento.
   *
   * @param {string[]} classes - Lista de classes a serem adicionadas.
   */
  addClasses(classes) {
    if (Array.isArray(classes) && classes.length > 0) {
      this.element.classList.add(...classes);
    }
  }
  /**
   * Define o conteúdo de texto do elemento.
   *
   * @param {string} text - Texto a ser definido no elemento.
   */
  setText(text) {
    if (text) this.element.textContent = text;
  }
  /**
   * Adiciona eventos DOM ao elemento.
   *
   * @param {Object.<string, Function>} events - Objeto contendo eventos e seus respectivos handlers.
   */
  addEvents(events) {
    Object.entries(events).forEach(([event, handler]) => {
      this.element.addEventListener(event, handler);
    });
  }
  /**
   * Adiciona elementos filhos ao elemento atual.
   *
   * Aceita tanto instâncias de `ElementBuilder` quanto nós DOM nativos.
   *
   * @param {Array<Element|ElementBuilder>} children - Elementos filhos a serem adicionados.
   */
  appendChildren(children) {
    const isValidArray = Array.isArray(children) && children.length > 0;
    if (!isValidArray) return;

    children.forEach((child) => {
      const node = child instanceof ElementBuilder ? child.element : child;
      if (!(node instanceof Node)) return;
      this.element.appendChild(node);
    });
  }
  /**
   * Retorna o elemento HTML ou SVG construído.
   *
   * @returns {Element} O elemento DOM finalizado.
   */
  get() {
    return this.element;
  }
}
/**
 * Cria o cabeçalho do modal com título e botão de fechar.
 * Utiliza SVG inline seguro e evita uso de innerHTML para prevenir XSS.
 *
 * @param {Object} config - Configuração do cabeçalho.
 * @param {string} config.title - Título exibido no modal.
 * @param {Function} config.handler - Função executada ao clicar no botão de fechar.
 * @returns {ElementBuilder} Uma instância de ElementBuilder representando o cabeçalho do modal.
 */
function buildModalHeaderSection({ title, handler } = {}) {
  function createSvgPath(d) {
    return new ElementBuilder("path", {
      attrs: {
        d: d,
        stroke: "#6C6F75",
        "stroke-width": "2",
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
      },
    });
  }
  const modalHeaderTitle = new ElementBuilder("h5", {
    classes: ["lcs-modal__header--title"],
    text: title || "Insira um título",
  });
  const modalHeaderIcon = new ElementBuilder("svg", {
    attrs: {
      width: "100%",
      height: "100%",
      viewBox: "0 0 24 24",
      fill: "none",
      xmlns: "http://www.w3.org/2000/svg",
    },
    children: [createSvgPath("M18 6L6 18"), createSvgPath("M6 6L18 18")],
  });
  const modalHeaderIconContainer = new ElementBuilder("figure", {
    classes: ["lcs-modal__header--figure"],
    children: [modalHeaderIcon],
  });
  const modalHeaderCloseButton = new ElementBuilder("button", {
    attrs: {
      type: "button",
      "aria-label": "Fechar",
    },
    classes: ["lcs-modal__header--close"],
    children: [modalHeaderIconContainer],
    events: {
      click: () => {
        handler();
      },
    },
  });
  const modalHeader = new ElementBuilder("div", {
    classes: ["lcs-modal__header", "lcs-modal__content"],
    children: [modalHeaderTitle, modalHeaderCloseButton],
  });
  return modalHeader;
}
/**
 * Cria a seção de corpo do modal contendo um parágrafo com o texto fornecido.
 *
 * @param {string} [text="Insira um texto"] - Texto a ser exibido no corpo do modal.
 * @returns {ElementBuilder} Uma instância de ElementBuilder representando o corpo do modal.
 */
function buildModalBodySection(text) {
  const modalBodyP = new ElementBuilder("p", {
    classes: ["lcs-modal__body--p"],
    text: text || "Insira um texto",
  });
  const modalBody = new ElementBuilder("div", {
    classes: ["lcs-modal__body", "lcs-modal__content"],
    children: [modalBodyP],
  });
  return modalBody;
}
/**
 * Constrói a seção do rodapé do modal, incluindo um botão de CTA (Call to Action).
 *
 * @param {Object} param - O objeto contendo as propriedades para construir o rodapé.
 * @param {string} param.buttonText - O texto a ser exibido no botão (caso não fornecido, um valor padrão será usado).
 * @param {Function} param.handler - A função a ser chamada quando o botão for clicado.
 * @returns {ElementBuilder} Uma instância de ElementBuilder representando o rodapé do modal.
 */
function buildModalFooterSection({ buttonText, handler }) {
  const modalFooterCTAButton = new ElementBuilder("button", {
    attrs: {
      type: "button",
      "aria-label": "Explorar benefício",
    },
    classes: ["lcs-modal__footer--cta"],
    text: buttonText || "Informe um texto",
    events: {
      click: () => {
        handler();
      },
    },
  });
  const modalFooter = new ElementBuilder("div", {
    classes: ["lcs-modal__footer", "lcs-modal__content"],
    children: [modalFooterCTAButton],
  });
  return modalFooter;
}
/**
 * Cria o componente completo do modal, incluindo cabeçalho, corpo e rodapé.
 *
 * @param {Object} param - O objeto contendo as propriedades para construir o modal.
 * @param {string} param.title - O título a ser exibido no cabeçalho do modal.
 * @param {string} param.bodyText - O texto a ser exibido no corpo do modal.
 * @param {string} param.buttonText - O texto do botão no rodapé do modal.
 * @param {Object} param.methods - Métodos que serão usados no modal.
 * @param {Function} param.methods.onClose - A função a ser chamada ao fechar o modal.
 * @param {Function} param.methods.onClickCTA - A função a ser chamada ao clicar no botão CTA (Call to Action).
 * @returns {HTMLElement} O modal completo, representado como um elemento HTML/node.
 */
function createCompleteModalComponent({
  title,
  bodyText,
  buttonText,
  methods,
} = {}) {
  const modalHeader = buildModalHeaderSection({
    title,
    handler: methods.onClose,
  });
  const modalBody = buildModalBodySection(bodyText);
  const modalFooter = buildModalFooterSection({
    buttonText,
    handler: methods.onClickCTA,
  });
  const modalContainer = new ElementBuilder("div", {
    classes: ["lcs-modal__container", "moveDown"],
    children: [modalHeader, modalBody, modalFooter],
  });
  const modal = new ElementBuilder("div", {
    attrs: {
      id: MODAL_CONFIG.ID,
    },
    classes: ["lcs-modal", "fadeIn"],
    children: [modalContainer],
  });
  return modal.get();
}
/**
 * Injeta o estilo do modal no cabeçalho do documento, garantindo que os estilos não sejam injetados mais de uma vez.
 *
 * A função verifica se os estilos já foram injetados e, caso contrário, cria um elemento de estilo contendo os estilos compilados
 * e o adiciona ao cabeçalho da página. Se a injeção inicial falhar, a função tenta injetar os estilos novamente após um pequeno atraso.
 *
 * @returns {void}
 */
function injectStyle() {
  if (validations.hasInjectedModalStyles()) return;
  const modalStyle = new ElementBuilder("style", {
    attrs: { id: MODAL_CONFIG.STYLE_ID },
    text: utils.getCompiledStyles(),
  });
  const modalStyleNode = modalStyle.get();
  document.head.appendChild(modalStyleNode);

  setTimeout(() => {
    try {
      if (validations.hasInjectedModalStyles()) return;
      document.body.insertAdjacentElement("afterbegin", modalStyleNode);
    } catch {
      return false;
    }
  }, 100);
}
/**
 * Cria e injeta o modal completo no corpo do documento.
 *
 * A função utiliza o método `createCompleteModalComponent` para construir um modal com título, corpo e botão de CTA.
 * Depois de criar o modal, ele é inserido no final do corpo da página. A função também define as ações dos botões de
 * fechamento e de chamada para ação (CTA), que são fornecidas via métodos.
 *
 * @returns {void}
 */
function injectModal() {
  if (!utils.modalValidations()) return;
  const modal = createCompleteModalComponent({
    title: "Descubra a Conta Select",
    bodyText:
      "Tenha acesso a soluções exclusivas, atendimento diferenciado e benefícios que se adaptam ao seu estilo de vida. Faça parte da Select.",
    buttonText: "Explorar benefícios",
    methods: {
      onClose: () => {
        onClickcloseButton();
      },
      onClickCTA: () => {
        onClickCTAButton();
      },
    },
  });
  document.body.insertAdjacentElement("beforeend", modal);
}
/**
 * Injeta o modal completo na página após um atraso configurado.
 *
 * A função verifica se as validações do modal são atendidas através de `utils.modalValidations`. Se as validações passarem,
 * ela desabilita o scroll da página, injeta os estilos do modal e, finalmente, injeta o modal no corpo do documento.
 * O processo de injeção é retardado pelo tempo de delay especificado (padrão é o valor de `MODAL_CONFIG.DELAY`).
 *
 * @param {number} [delay=MODAL_CONFIG.DELAY] - O atraso em milissegundos antes de injetar o modal. O valor padrão é o atraso configurado em `MODAL_CONFIG.DELAY`.
 * @returns {void}
 */
function injectElement(delay = MODAL_CONFIG.DELAY) {
  if (!utils.modalValidations()) return;
  setTimeout(() => {
    try {
      if (!utils.modalValidations()) return;
      utils.disableScroll();
      injectStyle();
      injectModal();
    } catch (e) {
      console.error(`Erro ao injetar modal: ${e}`);
    }
  }, delay);
}
/**
 * Função chamada ao clicar no botão de fechar do modal.
 *
 * A função realiza as seguintes ações:
 * 1. Envia dados para o Data Layer do Google Analytics via `utils.modalPushDataLayer`.
 * 2. Reabilita o scroll da página com `utils.enableScroll`.
 * 3. Remove o modal da página utilizando `utils.removeModal`.
 *
 * @returns {void}
 */
function onClickcloseButton() {
  utils.modalPushDataLayer({
    event: "eventGA",
    action: "clicou",
    category: "abrasuaconta:select",
    label: "modal:fechar",
  });
  utils.enableScroll();
  utils.removeModal();
}
/**
 * Função chamada ao clicar no botão de CTA (Call to Action) do modal.
 *
 * A função realiza as seguintes ações:
 * 1. Envia dados para o Data Layer do Google Analytics via `utils.modalPushDataLayer`.
 * 2. Reabilita o scroll da página com `utils.enableScroll`.
 * 3. Remove o modal da página utilizando `utils.removeModal`.
 *
 * @returns {void}
 */
function onClickCTAButton() {
  utils.modalPushDataLayer({
    event: "eventGA",
    action: "clicou",
    category: "abrasuaconta:select",
    label: "modal:cta",
  });
  utils.enableScroll();
  utils.removeModal();
}

injectElement();
