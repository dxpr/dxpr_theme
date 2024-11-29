/**
 * Handles "Boxed Container Max-width" settings.
 *
 * @param {object} settings - CSS variables for the theme.
 * @param {function} getInputName - Function to get input field name from a setting.
 * @param {function} setPreview - Function to set preview for a setting.
 * @param {function} fieldHandler - Function to handle field changes.
 */
function handleMaxWidthSettings(settings, getInputName, setPreview, fieldHandler) {
  Object.values(settings).forEach((setting) => {
    const inputName = getInputName(setting);
    const elements = document.querySelectorAll(`[name="${inputName}"]`);
    setPreview(inputName, elements[0] ?? null);

    elements.forEach((element) => {
      if (
        element.id === "edit-box-max-width" ||
        element.id === "edit-layout-max-width"
      ) {
        element.addEventListener("change", (event) => {
          fieldHandler(event);
        });
      } else {
        element.addEventListener("input", (event) => {
          fieldHandler(event);
        });
      }

      const customField = document.querySelector(`[name="${inputName}_custom"]`);

      if (customField) {
        customField.addEventListener("change", (event) => {
          fieldHandler(event);
        });

        customField.addEventListener("keyup", (event) => {
          fieldHandler(event);
        });
      }
    });
  });
}

module.exports = { handleMaxWidthSettings };
