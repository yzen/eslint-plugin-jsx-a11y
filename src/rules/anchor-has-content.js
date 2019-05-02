/**
 * @fileoverview Enforce anchor elements to contain accessible content.
 * @author Lisa Ring & Niklas Holmberg
 */

// ----------------------------------------------------------------------------
// Rule Definition
// ----------------------------------------------------------------------------

import { elementType, getProp, getPropValue } from 'jsx-ast-utils';
import { arraySchema, generateObjSchema } from '../util/schemas';
import hasAccessibleChild from '../util/hasAccessibleChild';


const errorMessage = 'Anchors must have content and the content must be accessible by a screen reader.';

const schema = generateObjSchema({
  components: arraySchema,
  attributes: arraySchema,
});

module.exports = {
  meta: {
    docs: {
      url: 'https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules/anchor-has-content.md',
    },
    schema: [schema],
  },

  create: context => ({
    JSXOpeningElement: (node) => {
      const options = context.options[0] || {};
      const componentOptions = options.components || [];
      const attributeOptions = options.attributes || [];
      const typeCheck = ['a'].concat(componentOptions);
      const nodeType = elementType(node);

      // Only check anchor elements and custom types.
      if (typeCheck.indexOf(nodeType) === -1) {
        return;
      }
      if (hasAccessibleChild(node.parent)) {
        return;
      }
      if (attributeOptions.some((attribute) => {
        const value = getPropValue(getProp(node.attributes, attribute));
        return typeof value === 'string' && value.length > 0;
      })) {
        return;
      }


      context.report({
        node,
        message: errorMessage,
      });
    },
  }),
};
