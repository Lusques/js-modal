const MODAL_CONFIG = {
  ID: "lcs-modal",
  STYLE_ID: "style-lcs-modal",
  DELAY: 5000,
  ALLOWED_URLS: [
    //"http://127.0.0.1:5500/index.html",
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
const appStates = {
  scrollPosition: { top: 0, left: 0 },
};
const validations = {
  hasBody: () => !!document.querySelector("body"),
  hasInjectedModalStyles: () =>
    !!document.getElementById(MODAL_CONFIG.STYLE_ID),
  hasInjectedModal: () => !!document.getElementById(MODAL_CONFIG.ID),
  isCorrectPage: () =>
    MODAL_CONFIG.ALLOWED_URLS.some((url) =>
      document.location.href.includes(url)
    ),
};

const utils = {
  animationRemove: ({ initialClass = "", finalClass = "" }) => {
    const nodeList = document.querySelectorAll(`.${initialClass}`);
    if (nodeList.length < 1) return;
    nodeList.forEach((node) => {
      node.classList.replace(initialClass, finalClass);
    });
  },
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
  getCompiledStyles: () => {
    return Object.values(MODAL_CONFIG.STYLES)
      .map((style) => style.replace(/\s+/g, " ").trim())
      .join(" ");
  },
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
class ElementBuilder {
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
  setAttributes(attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      this.element.setAttribute(key, value);
    });
  }
  addClasses(classes) {
    if (Array.isArray(classes) && classes.length > 0) {
      this.element.classList.add(...classes);
    }
  }
  setText(text) {
    if (text) this.element.textContent = text;
  }
  addEvents(events) {
    Object.entries(events).forEach(([event, handler]) => {
      this.element.addEventListener(event, handler);
    });
  }
  appendChildren(children) {
    const isValidArray = Array.isArray(children) && children.length > 0;
    if (!isValidArray) return;

    children.forEach((child) => {
      const node = child instanceof ElementBuilder ? child.element : child;
      if (!(node instanceof Node)) return;
      this.element.appendChild(node);
    });
  }
  get() {
    return this.element;
  }
}
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
