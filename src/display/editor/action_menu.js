import { noContextMenu } from "../display_utils.js";

export class ActionMenu {
  #actionMenu = null;

  #uiManager;

  constructor(uiManager) {
    this.#uiManager = uiManager;
  }

  #render() {
    const actionMenu = (this.#actionMenu = document.createElement("div"));
    actionMenu.classList.add("editToolbar", "actionMenu");
    actionMenu.id = "actionMenu";
    actionMenu.setAttribute("role", "menu");
    const signal = this.#uiManager._signal;
    actionMenu.addEventListener("contextmenu", noContextMenu, { signal });
    const span = document.createElement("span");
    span.textContent = "actionMenu";
    actionMenu.append(span);

    return actionMenu;
  }

  #getLastPoint(boxes, isLTR) {
    let lastY = 0;
    let lastX = 0;
    for (const box of boxes) {
      const y = box.y + box.height;
      if (y < lastY) {
        continue;
      }
      const x = box.x + (isLTR ? box.width : 0);
      if (y > lastY) {
        lastX = x;
        lastY = y;
        continue;
      }
      if (isLTR) {
        if (x > lastX) {
          lastX = x;
        }
      } else if (x < lastX) {
        lastX = x;
      }
    }
    return [isLTR ? 1 - lastX : lastX, lastY];
  }

  show(parent, boxes, isLTR) {
    const [x, y] = this.#getLastPoint(boxes, isLTR);
    const { style } = (this.#actionMenu ||= this.#render());
    parent.append(this.#actionMenu);
    style.insetInlineEnd = `${100 * x}%`;
    style.top = `calc(${100 * y}%)`;
  }

  hide() {
    this.#actionMenu.remove();
  }
}
