const rootElementStyle = getComputedStyle(document.querySelector(":root") as HTMLElement)

export const cssColors = {
    colorBackground: rootElementStyle.getPropertyValue("--color-background"),
    colorTextMain: rootElementStyle.getPropertyValue("--color-text-main"),
    colorTextAccent: rootElementStyle.getPropertyValue("--color-text-accent"),
    colorTextTest: rootElementStyle.getPropertyValue("--color-text-test"),
    colorTextIncorrect: rootElementStyle.getPropertyValue("--color-text-incorrect"),
    colorModal: rootElementStyle.getPropertyValue("--color-modal")
}

export const cssFontSizes = {
    htmlFontSize: parseInt(rootElementStyle.getPropertyValue("--font-size-html").replace(/\D/g,'')),
    testFontSizeRatio: parseFloat(rootElementStyle.getPropertyValue("--test-size").replace(/\D\./g,'')),
    testLineHeightRatio: parseFloat(rootElementStyle.getPropertyValue("--test-line-height").replace(/\D\./g,''))
}