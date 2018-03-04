// Patched version of html-webpack-react-root-plugin with webpack 4 support
const defaultTagName = 'div';
const defaultTagId = 'root';
const configWarn =
  'ReactRootPlugin: Invalid configuration. Using default options.';

class ReactRootPlugin {
  constructor(options) {
    if (Object.prototype.toString.call(options) !== '[object Object]') {
      let tagId;
      if (typeof options === 'string') {
        tagId = options;
      } else if (typeof options !== 'undefined') {
        this.configWarn = configWarn;
      }
      options = {
        tagName: defaultTagName,
        tagId: tagId || defaultTagId
      };
    }
    this.tagName = options.tagName || defaultTagName;
    this.tagId = options.tagId || defaultTagId;
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      if (this.configWarn) {
        compilation.warnings.push(this.configWarn);
      }
      compilation.plugin('html-webpack-plugin-before-html-processing', data => {
        return new Promise(resolve => {
          const htmlString = data.html;
          const bodyIndex = htmlString.indexOf('</body>');
          const firstHalf = htmlString.slice(0, bodyIndex);
          const secondHalf = htmlString.slice(bodyIndex, htmlString.length);
          data.html = [
            firstHalf,
            `<${this.tagName} id="${this.tagId}"></${this.tagName}>`,
            '\n',
            secondHalf
          ].join(' ');
          resolve(data);
        });
      });
    });
  }
}

module.exports = ReactRootPlugin;
